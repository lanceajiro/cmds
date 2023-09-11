const axios = require('axios');

async function facts(event, api) {
  const input = event.body.toLowerCase();

  if (input.includes('-help')) {
    const usage = "Usage: facts\n\n" +
      "Description: Get random facts.\n\n" +
      "Example: facts\n\n" +
      "Note: This command provides a random fact.";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  try {
    const apiUrl = 'https://tanjiro-api.onrender.com/facts?&api_key=tanjiro';
    const res = await axios.get(apiUrl);
    const fact = res.data.data;

    api.sendMessage(`${fact}`, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while fetching the fact. Please try again.", event.threadID, event.messageID);
  }
}

module.exports = facts;
