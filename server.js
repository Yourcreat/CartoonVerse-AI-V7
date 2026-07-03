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
// =======================
// PROJECT DATABASE
// =======================

const PROJECT_FOLDER = path.join(__dirname, "data", "projects");

if (!fs.existsSync(PROJECT_FOLDER)) {
  fs.mkdirSync(PROJECT_FOLDER, { recursive: true });
}

function saveProject(projectName, data) {
  const file = path.join(PROJECT_FOLDER, `${projectName}.json`);

  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2)
  );
}

function loadProject(projectName) {
  const file = path.join(PROJECT_FOLDER, `${projectName}.json`);

  if (!fs.existsSync(file)) return null;

  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function deleteProject(projectName) {
  const file = path.join(PROJECT_FOLDER, `${projectName}.json`);

  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    return true;
  }

  return false;
}

function listProjects() {
  return fs.readdirSync(PROJECT_FOLDER)
    .filter(file => file.endsWith(".json"))
    .map(file => file.replace(".json", ""));
}

// =======================
// CHARACTER MEMORY
// =======================

function getCharacter(projectName) {

  const project = loadProject(projectName);

  if (!project) return null;

  return project.character || null;

}
