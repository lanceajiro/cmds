const fs = require('fs');
const request = require('request');

async function landscape(event, api) {
  const input = event.body.toLowerCase();

  if (input.includes('-help')) {
    const usage = "Usage: landscape\n\n" +
      "Description: Get a random landscape image.\n\n" +
      "Example: landscape\n\n" +
      "Note: This command provides a random landscape image.";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  try {
    request("https://source.unsplash.com/1600x900/?landscape")
      .pipe(fs.createWriteStream(__dirname + '/../temp/photo.png'))
      .on('finish', () => {
        const message = {
          attachment: fs.createReadStream(__dirname + "/../temp/photo.png")
        };
        api.sendMessage(message, event.threadID, event.messageID);
      });
  } catch (error) {
    handleErrorResponse(api, event, error);
  }
}

function handleErrorResponse(api, event, error) {
  const errorMessage = error ? error.toString() : "Error!";
  api.sendMessage(errorMessage, event.threadID, event.messageID);
  console.log(errorMessage);
}

module.exports = landscape;
