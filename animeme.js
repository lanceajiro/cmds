const request = require('request');
const fs = require('fs-extra');
const axios = require('axios');
const cacheDirectory = `${__dirname}/../temp/`;

async function animeme(event, api) {
  const input = event.body.toLowerCase();

  if (input.includes('-help')) {
    const usage = "Usage: animeme\n\n" +
      "Description: Get a random anime meme from Reddit.\n\n" +
      "Example: animeme\n\n" +
      "Note: This command fetches a random anime meme from Reddit.";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  try {
    const response = await axios.get('https://www.reddit.com/r/anime_irl+animemes+Animemes+Memes_Of_The_Dank+awwnime/top.json?sort=top&t=week&limit=100');
    const posts = response.data.data.children;
    const post = posts[Math.floor(Math.random() * posts.length)].data;

    const title = post.title;
    const imageUrl = post.url;
    const cacheFilePath = cacheDirectory + 'animeme.png';

    const callback = () => {
      api.sendMessage({
        body: `${title}`,
        attachment: fs.createReadStream(cacheFilePath)
      }, event.threadID, () => fs.unlinkSync(cacheFilePath), event.messageID);
    };

    request(encodeURI(imageUrl)).pipe(fs.createWriteStream(cacheFilePath)).on('close', callback);
  } catch (error) {
    console.error(error);
    await api.sendMessage('Error occurred while fetching an anime meme!', event.threadID);
  }
}

module.exports = animeme;
