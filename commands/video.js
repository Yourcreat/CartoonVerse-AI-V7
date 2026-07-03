const {
  getCharacter
} = require("../utils/database");

module.exports = function (
  bot,
  ai,
  sendLongMessage
) {

bot.onText(/\/video (.+)/, async (msg, match) => {

const chatId = msg.chat.id;
const topic = match[1];

await bot.sendMessage(
chatId,
"🎥 Creating Cinematic Video Prompts..."
);

try {

const savedCharacter = getCharacter(topic);

const response = await ai.models.generateContent({

model: "gemini-2.5-flash",

contents: `
Create 10 professional cinematic video prompts.

Project:
${topic}

Previously Saved Character:
${savedCharacter || "Create a new consistent character."}

Return exactly:

# Scene 1 Video Prompt

# Scene 2 Video Prompt

# Scene 3 Video Prompt

# Scene 4 Video Prompt

# Scene 5 Video Prompt

# Scene 6 Video Prompt

# Scene 7 Video Prompt

# Scene 8 Video Prompt

# Scene 9 Video Prompt

# Scene 10 Video Prompt

Requirements:

- Use the SAME character in every scene.
- Keep the same face, hairstyle, clothes and body.
- Pixar 3D animation style.
- Cinematic camera movement.
- Dynamic motion.
- Realistic animation timing.
- Professional lighting.
- Emotional expressions.
- Background continuity.
- Ready for:
  • Veo 3
  • Kling AI
  • Seedance
  • Hailuo AI
  • LTX Studio

Each scene should be around 8 seconds.

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
    "❌ Video Error:\n" +
    (err.message || JSON.stringify(err))
  );

}

});

};
