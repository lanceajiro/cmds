const axios = require('axios');
const fs = require('fs'); // Import the fs module
const path = require('path'); // Import the path module

async function tiktok(event, api) {
  const input = event.body.toLowerCase();

  if (input.includes('-help')) {
    const usage = "Usage: tiktok <search text>\n\n" +
      "Description: Search for TikTok videos and display the first result.\n\n" +
      "Example: tiktok dancing\n\n" +
      "Note: This command searches for TikTok videos and shows the first result.";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  try {
    const searchQuery = input.replace('tiktok', '').trim();
    if (!searchQuery) {
      api.sendMessage("Usage: tiktok <search text>", event.threadID);
      return;
    }

    api.sendMessage("Searching, please wait...", event.threadID);

    const response = await axios.get(`https://tiktok-search-api.lanceajiro.repl.co/tiktok?search=${encodeURIComponent(searchQuery)}`);
    const videos = response.data.data.videos;

    if (!videos || videos.length === 0) {
      api.sendMessage("No videos found for the given search query.", event.threadID);
      return;
    }

    const videoData = videos[0];
    const videoUrl = videoData.play;

    const message = `𝐓𝐢𝐤𝐭𝐨𝐤 𝐫𝐞𝐬𝐮𝐥𝐭:\n\n𝐏𝐨𝐬𝐭 𝐛𝐲: ${videoData.author.nickname}\n𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞: ${videoData.author.unique_id}\n\n𝐓𝐢𝐭𝐥𝐞: ${videoData.title}`;

    const filePath = path.join(__dirname, '..', 'temp', 'tiktok.mp4'); // Fix the path
    const writer = fs.createWriteStream(filePath);

    const videoResponse = await axios({
      method: 'get',
      url: videoUrl,
      responseType: 'stream'
    });

    videoResponse.data.pipe(writer);

    writer.on('finish', () => {
      api.sendMessage(
        { body: message, attachment: fs.createReadStream(filePath) },
        event.threadID,
        () => fs.unlinkSync(filePath)
      );
    });
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage("An error occurred while processing the request.", event.threadID);
  }
}

module.exports = tiktok;
