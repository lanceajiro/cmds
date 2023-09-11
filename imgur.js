const axios = require('axios');

async function imgur(event, api) {
  const input = event.body.toLowerCase();

  if (input.includes('-help')) {
    const usage = "Usage: imgur [image URL or reply to an image]\n\n" +
      "Description: Upload an image to Imgur and get the Imgur link.\n\n" +
      "Example: imgur [image URL]\n\n" +
      "Note: You can either provide an image URL or reply to an image message to upload it to Imgur.";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  let linkanh = event.messageReply.attachments[0]?.url || input.split(" ")[1];

  if (!linkanh) {
    api.sendMessage("Please provide an image URL or reply to an image", event.threadID, event.messageID);
    return;
  }

  try {
    const res = await axios.get(`https://tanjiro-api.onrender.com/imgur?link=${encodeURIComponent(linkanh)}&api_key=tanjiro`);
    const imgurLink = res.data.result;
    api.sendMessage(`${imgurLink}`, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while processing the image. Please try again.", event.threadID, event.messageID);
  }
}

module.exports = imgur;
