require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenAI } = require("@google/genai");

const sendLongMessage = require("./utils/sendLongMessage");

const app = express();

const bot = new TelegramBot(
process.env.TELEGRAM_BOT_TOKEN,
{
polling: true
}
);

const ai = new GoogleGenAI({
apiKey: process.env.GEMINI_API_KEY
});
require("./commands/story")(bot, ai, sendLongMessage);

require("./commands/project")(bot, ai, sendLongMessage);

require("./commands/image")(bot, ai, sendLongMessage);

require("./commands/video")(bot, ai, sendLongMessage);

require("./commands/movie")(bot, ai, sendLongMessage);

require("./commands/title")(bot, ai, sendLongMessage);

require("./commands/thumbnail")(bot, ai, sendLongMessage);
bot.onText(/\/start/, async (msg)=>{

await bot.sendMessage(
msg.chat.id,

`🎬 CartoonVerse AI V7

Commands

/project
/story
/movie
/image
/video
/title
/thumbnail

Version 7 Running 🚀`

);

});

app.get("/", (req,res)=>{
res.send("CartoonVerse AI V7 Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{

console.log("🚀 CartoonVerse AI V7 Started");

});
