const axios = require('axios');
const fs = require('fs');
const request = require('request');

async function bible(event, api) {
  const input = event.body.toLowerCase();

  if (input.includes('-help')) {
    const usage = "Usage: bible\n\n" +
      "Description: Get a random Bible verse.\n\n" +
      "Example: bible\n\n" +
      "Note: This command provides a random Bible verse with an accompanying image.";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  try {
    const response = await axios.get("https://labs.bible.org/api/?passage=random&type=json");

    if (response.status === 200) {
      const verse = response.data[0];
      const message = `${verse.bookname} ${verse.chapter}:${verse.verse}\n\n${verse.text}`;
      const photoUrls = [
        "https://i.imgur.com/IEyYKzn.jpeg",
        "https://i.imgur.com/En3e5AJ.jpg",
        "https://i.imgur.com/iGSJ1SK.jpg",
        "https://i.imgur.com/7UiYEWh.jpg",
        "https://i.imgur.com/QtbGfTV.jpg",
        "https://i.ibb.co/6mr4bDj/images-12.jpg",
        "https://i.ibb.co/3rgBH19/images-11.jpg",
        "https://i.ibb.co/tps3TBD/images-8.jpg"
      ];

      const photoIndex = Math.floor(Math.random() * photoUrls.length);
      const imageUrl = photoUrls[photoIndex];
      const cacheFilePath = __dirname + '/../temp/photo.png';

      const callback = () => {
        api.sendMessage({
          body: message,
          attachment: fs.createReadStream(cacheFilePath)
        }, event.threadID, () => fs.unlinkSync(cacheFilePath), event.messageID);
      };

      request(encodeURI(imageUrl)).pipe(fs.createWriteStream(cacheFilePath)).on('close', callback);
    } else {
      handleErrorResponse(api, event);
    }
  } catch (error) {
    handleErrorResponse(api, event, error);
  }
}

function handleErrorResponse(api, event, error) {
  const errorMessage = error ? error.toString() : "Error!";
  api.sendMessage(errorMessage, event.threadID, event.messageID);
  console.log(errorMessage);
}

module.exports = bible;
