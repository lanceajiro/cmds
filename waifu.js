const axios = require('axios');
const fs = require('fs');
const request = require('request');

const cacheDirectory = `${__dirname}/../temp/`;

async function waifu(event, api) {
  const input = event.body.toLowerCase();

  if (input.includes('-help')) {
    const usage = "Usage: waifu [category]\n\n" +
      "Description: Sends a random waifu image or an image of the specified category.\n\n" +
      "Example: waifu\nExample with category: waifu awoo\n\n" +
      "Note: Available categories: waifu, neko, shinobu, megumin, bully, cuddle, cry, hug, awoo, kiss, lick, pat, smug, bonk, yeet, blush, smile, wave, highfive, handhold, nom, bite, glomp, slap, kill, kick, happy, wink, poke, dance, cringe.";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  const args = input.split(' ');
  const category = args[1] ? args[1].toLowerCase() : "waifu";
  const validCategories = ["waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry", "hug", "awoo", "kiss", "lick", "pat", "smug", "bonk", "yeet", "blush", "smile", "wave", "highfive", "handhold", "nom", "bite", "glomp", "slap", "kill", "kick", "happy", "wink", "poke", "dance", "cringe"];

  if (!validCategories.includes(category)) {
    api.sendMessage(`Invalid category. Available categories: ${validCategories.join(", ")}`, event.threadID, event.messageID);
    return;
  }

  const url = `https://api.waifu.pics/sfw/${category}`;

  try {
    const response = await axios.get(url);
    const imageUrl = response.data.url;
    const cacheFilePath = cacheDirectory + `waifu.png`;

    const callback = () => {
      api.sendMessage({
        body: `Here's your ${category}:\n${imageUrl}`,
        attachment: fs.createReadStream(cacheFilePath)
      }, event.threadID, () => fs.unlinkSync(cacheFilePath), event.messageID);
    };

    if (fs.existsSync(cacheFilePath)) {
      // If the image already exists in the cache, send it from the cache.
      callback();
    } else {
      // If the image doesn't exist in the cache, download it and save it to the cache.
      request(encodeURI(imageUrl)).pipe(fs.createWriteStream(cacheFilePath)).on('close', callback);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("Oops, something went wrong :(", event.threadID, event.messageID);
  }
}

module.exports = waifu;
