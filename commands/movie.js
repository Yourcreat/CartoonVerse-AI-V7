const {
  getCharacter
} = require("../utils/database");

module.exports = function (
  bot,
  ai,
  sendLongMessage
) {

bot.onText(/\/movie (.+)/, async (msg, match) => {

const chatId = msg.chat.id;
const topic = match[1];

await bot.sendMessage(
chatId,
"🎬 Creating Movie Package..."
);

try {

const savedCharacter = getCharacter(topic);

const response = await ai.models.generateContent({

model: "gemini-2.5-flash",

contents: `
Create a complete cinematic YouTube animated movie.

Topic:
${topic}

Previously Saved Character:
${savedCharacter || "Create a new consistent character."}

Return exactly:

# Movie Title

# Main Character

# Character Description

# Story Summary

# Scene 1
- Narration
- Dialogue
- Camera Direction
- Character Action
- Background
- Emotion

# Scene 2
- Narration
- Dialogue
- Camera Direction
- Character Action
- Background
- Emotion

Continue the same format until:

# Scene 10

Requirements:

- Use the SAME main character in every scene.
- Keep the face, hairstyle, clothes and body identical.
- Pixar 3D animation style.
- Strong story continuity.
- Cinematic storytelling.
- Emotional dialogue.
- Camera movements.
- Background continuity.
- Professional movie quality.
- Ready for AI image and AI video generation.

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
    "❌ Movie Error:\n" +
    (err.message || JSON.stringify(err))
  );

}

});

};
