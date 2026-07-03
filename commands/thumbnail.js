module.exports = function (
  bot,
  ai,
  sendLongMessage
) {

bot.onText(/\/thumbnail (.+)/, async (msg, match) => {

const chatId = msg.chat.id;
const topic = match[1];

await bot.sendMessage(
chatId,
"🖼 Creating Thumbnail Prompt..."
);

try {

const response = await ai.models.generateContent({

model: "gemini-2.5-flash",

contents: `

Create ONE professional YouTube thumbnail prompt.

Topic:
${topic}

Requirements:

- Pixar 3D
- Cinematic lighting
- Vibrant colors
- Emotional face
- High contrast
- Viral YouTube style
- Ultra detailed
- 8K quality
- Center composition
- Eye-catching
- Click-worthy

Return ONLY the thumbnail prompt.

`

});

await sendLongMessage(
bot,
chatId,
response.text
);

}

catch(err){

console.error(err);

await bot.sendMessage(
chatId,
"❌ Thumbnail Error:\n" +
(err.message || JSON.stringify(err))
);

}

});

};
