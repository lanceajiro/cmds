const axios = require('axios');
const request = require('request');
const fs = require("fs");

async function foodpic(event, api) {
  const input = event.body.toLowerCase();

  if (input.includes('-help')) {
    const usage = "Usage: foodpic <Food>\n\n" +
      "Description: Search for a food image.\n\n" +
      "Example: foodpic pizza\n\n" +
      "Note: This command searches for a food image.";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  const args = input.split(' ');
  const req = args.slice(1).join(' ');

  if (!req) {
    api.sendMessage("[!] Need a food to search.", event.threadID, event.messageID);
    return;
  }

  try {
    const response = await axios.get(`https://sensui-useless-apis.codersensui.repl.co/api/tools/foodpic?query=${encodeURI(req)}`);
    const cacheFilePath = `${__dirname}/../temp/food1.jpg`;
    const callback = function () {
      api.sendMessage({
        body: `❯ Query: ${req}\n❯ Result: ${response.data.title}`,
        attachment: fs.createReadStream(cacheFilePath)
      }, event.threadID, () => fs.unlinkSync(cacheFilePath), event.messageID);
    };
    request(response.data.image).pipe(fs.createWriteStream(cacheFilePath)).on("close", callback);
  } catch (error) {
    console.error(error);
    await api.sendMessage("Sorry, I couldn't find any results for that food.", event.threadID);
  }
}

module.exports = foodpic;
