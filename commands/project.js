const {
  saveProject
} = require("../utils/database");

module.exports = function (
  bot,
  ai,
  sendLongMessage
) {

bot.onText(/\/project (.+)/, async (msg, match) => {

const chatId = msg.chat.id;
const topic = match[1];

await bot.sendMessage(
chatId,
"🚀 Creating Project..."
);

try {

const response = await ai.models.generateContent({

model: "gemini-2.5-flash",

contents: `
Create a complete YouTube cartoon project.

Topic:
${topic}

Return:

# STORY

# CHARACTER SHEET

# IMAGE PROMPTS

# VIDEO PROMPTS

# MOVIE SCRIPT
`
});
