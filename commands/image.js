const {
  getCharacter
} = require("../utils/database");

module.exports = function (
  bot,
  ai,
  sendLongMessage
) {

bot.onText(/\/image (.+)/, async (msg, match) => {

const chatId = msg.chat.id;
const topic = match[1];

await bot.sendMessage(
chatId,
"🎨 Creating Image Prompts..."
);

try {

const savedCharacter = getCharacter(topic);

const response = await ai.models.generateContent({

model: "gemini-2.5-flash",

contents: `
Create 10 professional Pixar 3D image prompts.

Project:
${topic}

Previously Saved Character:
${savedCharacter || "Create a new consistent character."}

Return:

# Character Sheet

# Scene 1 Image Prompt

# Scene 2 Image Prompt

# Scene 3 Image Prompt

# Scene 4 Image Prompt

# Scene 5 Image Prompt

# Scene 6 Image Prompt

# Scene 7 Image Prompt

# Scene 8 Image Prompt

# Scene 9 Image Prompt

# Scene 10 Image Prompt

Requirements:
- Use the SAME character in every scene.
- Keep face, hairstyle, clothes and body identical.
- Pixar 3D animation style.
- Cinematic lighting.
- Ultra detailed.
- 8K quality.
- Professional composition.
`

});

await sendLongMessage(
  bot,
  chatId,
  response.text
);
  } catch (err) {

  console.error(err);

  await bot.sendMessage(
    chatId,
    "❌ Image Error:\n" +
    (err.message || JSON.stringify(err))
  );

}

});

};
