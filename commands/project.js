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
  const projectData = {
  topic,
  createdAt: new Date().toISOString(),

  content: response.text,

  character: response.text
};

saveProject(
  topic,
  projectData
);

await bot.sendMessage(
  chatId,
  `✅ Project "${topic}" saved successfully!`
);

await sendLongMessage(
  bot,
  chatId,
  response.text
);
} catch (err) {

  console.error(err);

  await bot.sendMessage(
    chatId,
    "❌ Project Error:\n" +
    (err.message || JSON.stringify(err))
  );

}

});

};
