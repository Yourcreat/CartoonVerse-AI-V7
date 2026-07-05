module.exports = function (bot, ai, sendLongMessage) {

  bot.onText(/\/story (.+)/, async (msg, match) => {

    const chatId = msg.chat.id;
    const topic = match[1];

    await bot.sendMessage(chatId, "⏳ Creating Story...");

    try {

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
Write a professional cinematic story.

Topic:
${topic}

Requirements:
- Powerful Title
- Hook
- Story
- Ending
- Moral

Length:
800-1000 words.

Language:
English.
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
        "❌ Story Error:\n" + (err.message || JSON.stringify(err))
      );

    }

  });

};
