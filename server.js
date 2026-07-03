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
// =======================
// START COMMAND
// =======================

bot.onText(/\/start/, async (msg) => {

  await bot.sendMessage(
    msg.chat.id,
`🎬 CartoonVerse AI V7

Welcome!

Available Commands

/project Topic
/story Topic
/movie Topic
/image ProjectName
/video ProjectName
/open ProjectName
/list
/delete ProjectName
/title Topic
/thumbnail Topic
/help`
  );

});

// =======================
// HELP
// =======================

bot.onText(/\/help/, async (msg) => {

  await bot.sendMessage(
    msg.chat.id,
`📖 CartoonVerse AI V7

/project Football Hero
Creates & saves a complete project

/story Football Hero
Creates only the story

/movie Football Hero
Creates a 10-scene movie

/image Football Hero
Creates image prompts using saved character memory

/video Football Hero
Creates video prompts

/open Football Hero
Open saved project

/list
Show all saved projects

/delete Football Hero
Delete a project

/title Football Hero
Generate YouTube titles

/thumbnail Football Hero
Generate thumbnail prompt`
  );

});

// =======================
// PROJECT
// =======================

bot.onText(/\/project (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const topic = match[1];

  await bot.sendMessage(
    chatId,
    "🚀 Creating Complete Project...\n\nThis may take 20–60 seconds..."
  );

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are a professional Pixar movie writer.

Create one complete YouTube animation project.

TOPIC:
${topic}

Return exactly in this format:

# TITLE

# CHARACTER SHEET

Include:
- Name
- Age
- Gender
- Hair
- Eyes
- Face
- Body
- Clothes
- Shoes
- Personality

# STORY

# IMAGE PROMPTS

Scene 1
Scene 2
Scene 3
Scene 4
Scene 5
Scene 6
Scene 7
Scene 8
Scene 9
Scene 10

# VIDEO PROMPTS

Scene 1
Scene 2
Scene 3
Scene 4
Scene 5
Scene 6
Scene 7
Scene 8
Scene 9
Scene 10

# MOVIE SCRIPT

Scene 1
Scene 2
Scene 3
Scene 4
Scene 5
Scene 6
Scene 7
Scene 8
Scene 9
Scene 10

Everything must use the SAME character consistently.
`
    });

    const projectText = response.text;
        // =======================
    // Extract Character Sheet
    // =======================

    let characterSheet = "";

    const characterMatch = projectText.match(
      /# CHARACTER SHEET([\s\S]*?)# STORY/i
    );

    if (characterMatch) {
      characterSheet = characterMatch[1].trim();
    }

    // =======================
    // Save Project
    // =======================

    const projectData = {
      topic,
      createdAt: new Date().toISOString(),
      character: characterSheet,
      content: projectText
    };

    saveProject(topic, projectData);

    await bot.sendMessage(
      chatId,
      `✅ Project "${topic}" saved successfully!`
    );

    await sendLongMessage(chatId, projectText);

  } catch (err) {

    console.error(err);

    await bot.sendMessage(
      chatId,
      "❌ Project Error:\n" +
      (err.message || JSON.stringify(err))
    );

  }

});
