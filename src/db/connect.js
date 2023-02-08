const { MongoClient } = require("mongodb");

// Connection URI
const uri = process.env.MONGODB_URI;

// Create a new MongoClient
const client = new MongoClient(uri);

const dbName = "tweetlogs";
const collectionName = "tweets";

async function getNearbyLocations(coordinates, limit = 3) {
  const collection = client.db(dbName).collection(collectionName);
  const cursor = collection.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates },
        distanceField: "dist.calculated",
        maxDistance: 500000,
        includeLocs: "dist.location",
        spherical: true,
      },
    },
    {
      $limit: limit,
    },
  ]);

  const set = new Set();
  for await (const doc of cursor) {
    set.add(
      `${doc.formatted_address}\nhttps://www.google.com/maps/?q=${doc.location.coordinates[0]},${doc.location.coordinates[1]}`
    );
  }

  return Array.from(set).join("\n\n");
}

exports.getNearbyLocations = getNearbyLocations;
