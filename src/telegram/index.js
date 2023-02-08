const TelegramBot = require("node-telegram-bot-api");
const { getNearbyLocations } = require("../db/connect");

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.onText(/getLocation/, (msg) => {
  const opts = {
    reply_markup: JSON.stringify({
      keyboard: [[{ text: "Location", request_location: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    }),
  };

  bot.sendMessage(msg.chat.id, "Contact and Location request", opts);
});

bot.on("location", async (msg) => {
  const data = await getNearbyLocations([
    msg.location.latitude,
    msg.location.longitude,
  ]);

  bot.sendMessage(
    msg.chat.id,
    data || "Yakınınızda Twitter üzerinden enkaz bulunamadı."
  );
});

bot.on("polling_error", console.log);
