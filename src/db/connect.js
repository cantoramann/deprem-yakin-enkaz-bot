const { MongoClient } = require("mongodb");

// Connection URI
const uri = process.env.MONGODB_URI;

// Create a new MongoClient
const client = new MongoClient(uri);

const dbName = "tweetlogs";
const collectionName = "tweets";

async function getNearbyLocations(coordinates) {
  try {
    const collection = client.db(dbName).collection(collectionName);
    const data = await collection
      .aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates },
            distanceField: "dist.calculated",
            maxDistance: 100000,
            includeLocs: "dist.location",
            spherical: true,
          },
        },
        {
          $limit: 5,
        },
      ])
      .toArray();

    const set = new Set();
    let c = 1;
    data.forEach((doc) => {
      {
        const proximity = "";
        set.add(
          `${c}.\Mesaj: ${doc.raw.full_text}\n\nLink: https://www.google.com/maps/?q=${doc.location.coordinates[0]},${doc.location.coordinates[1]}`
        );
        c++;
      }
    });
    return set.size
      ? Array.from(set).join("\n\n")
      : "Yakınınızda Twitter üzerinden enkaz bulunamadı.";
  } catch (e) {
    console.log(e.message);
    return "Bir hata oluştu.";
  }
}

exports.getNearbyLocations = getNearbyLocations;
