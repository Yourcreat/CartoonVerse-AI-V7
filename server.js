require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Telegram Bot
const bot = new TelegramBot(
  process.env.TELEGRAM_BOT_TOKEN,
  {
    polling: true,
  }
);

// Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Utils
const sendLongMessage = require("./utils/sendLongMessage");
const db = require("./utils/database");

// Commands
require("./commands/story")(bot, ai, sendLongMessage, db);
require("./commands/project")(bot, ai, sendLongMessage, db);
require("./commands/image")(bot, ai, sendLongMessage, db);
require("./commands/video")(bot, ai, sendLongMessage, db);
require("./commands/movie")(bot, ai, sendLongMessage, db);
require("./commands/title")(bot, ai, sendLongMessage);
require("./commands/thumbnail")(bot, ai, sendLongMessage);
// START
bot.onText(/\/start/, async (msg) => {

  await bot.sendMessage(
    msg.chat.id,

`🎬 CartoonVerse AI V7

Welcome!

Available Commands

/project Topic
/story Topic
/movie Topic
/image Topic
/video Topic
/title Topic
/thumbnail Topic
/help`

  );

});

// HELP
bot.onText(/\/help/, async (msg) => {

  await bot.sendMessage(

    msg.chat.id,

`📖 CartoonVerse AI V7 Help

Commands

/project Topic
Create Complete Project

/story Topic
Generate Story

/movie Topic
Generate Movie

/image Topic
Generate Image Prompts

/video Topic
Generate Video Prompts

/title Topic
Generate Titles

/thumbnail Topic
Generate Thumbnail Prompt`

  );

});
// HOME
app.get("/", (req, res) => {
  res.send("✅ CartoonVerse AI V7 Running");
});

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({
    status: "online",
    bot: "CartoonVerse AI V7",
    uptime: process.uptime(),
    time: new Date().toISOString()
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log("🚀 CartoonVerse AI V7 Started");
  console.log(`🌐 Server running on port ${PORT}`);
});
