const axios = require('axios');

async function advice(event, api) {
  const input = event.body.toLowerCase();

  if (input.includes('-help')) {
    const usage = "Usage: advice\n\n" +
      "Description: Get a random piece of advice.\n\n" +
      "Example: advice\n\n" +
      "Note: This command provides a random piece of advice.";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  try {
    const res = await axios.get('https://sensui-useless-apis.codersensui.repl.co/api/fun/advice');
    api.sendMessage(res.data.advice, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage(error.message, event.threadID, event.messageID);
  }
}

module.exports = advice;
