const axios = require('axios');
const { Readable } = require('stream');

async function meme(event, api) {
  const input = event.body.toLowerCase();

  if (input.includes('-help')) {
    const usage = "Usage: meme\n\n" +
      "Description: Get a random meme.\n\n" +
      "Example: meme\n\n" +
      "Note: This command fetches a random meme.";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  try {
    const response = await axios.get('https://tanjiro-api.onrender.com/meme?&api_key=tanjiro', {
      responseType: 'stream',
    });

    api.sendMessage({
      attachment: response.data,
    }, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage("Error fetching memes.", event.threadID, event.messageID);
  }
}

module.exports = meme;
