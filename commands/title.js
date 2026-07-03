module.exports = function (
  bot,
  ai,
  sendLongMessage
) {

bot.onText(/\/title (.+)/, async (msg, match) => {

const chatId = msg.chat.id;
const topic = match[1];

await bot.sendMessage(
chatId,
"📝 Creating Viral YouTube Titles..."
);

try {

const response = await ai.models.generateContent({

model: "gemini-2.5-flash",

contents: `
Generate 20 HIGH-CTR YouTube titles.

Topic:
${topic}

Requirements:

- Extremely clickable
- Viral style
- Emotional
- Curiosity driven
- SEO optimized
- Maximum 60 characters
- Number each title

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
"❌ Title Error:\n" +
(err.message || JSON.stringify(err))
);

}

});

};
