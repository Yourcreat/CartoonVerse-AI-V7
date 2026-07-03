require("dotenv").config();

const fs = require("fs");
const path = require("path");
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenAI } = require("@google/genai");

// =======================
// EXPRESS
// =======================

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// =======================
// TELEGRAM
// =======================

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

// =======================
// GEMINI
// =======================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =======================
// SEND LONG MESSAGE
// =======================

async function sendLongMessage(chatId, text) {
  const MAX = 4000;

  for (let i = 0; i < text.length; i += MAX) {
    await bot.sendMessage(chatId, text.substring(i, i + MAX));
  }
}

console.log("✅ CartoonVerse AI V7 - Part 1 Loaded");
