async function sendLongMessage(bot, chatId, text) {

  const MAX = 4000;

  if (!text) return;

  for (let i = 0; i < text.length; i += MAX) {

    await bot.sendMessage(
      chatId,
      text.substring(i, i + MAX)
    );

  }

}

module.exports = sendLongMessage;
