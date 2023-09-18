const axios = require("axios");
const fs = require("fs-extra");

const cacheDirectory = `${__dirname}/../temp/`;

async function cdp(event, api) {
  const input = event.body.toLowerCase();

  if (input.includes('-help')) {
    const usage = "Usage: cdp\n\n" +
      "Description: Get a couple display picture (DP).\n\n" +
      "Example: cdp\n\n" +
      "Note: This command provides a random couple DP.";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  const apiEndpoints = [
    "https://milanbhandari.imageapi.repl.co/dp?apikey=xyzmilan",
    "https://tanjiro-api.onrender.com/cdp?api_key=tanjiro",
    "https://erdwpe-api.herokuapp.com/api/randomgambar/couplepp"
  ];

  try {
    // Choose a random API endpoint from the array
    const randomEndpoint = apiEndpoints[Math.floor(Math.random() * apiEndpoints.length)];
    
    const response = await axios.get(randomEndpoint);
    const maleImg = await axios.get(response.data.male, { responseType: "arraybuffer" });
    fs.writeFileSync(cacheDirectory + "img1.png", Buffer.from(maleImg.data, "utf-8"));
    const femaleImg = await axios.get(response.data.female, { responseType: "arraybuffer" });
    fs.writeFileSync(cacheDirectory + "img2.png", Buffer.from(femaleImg.data, "utf-8"));

    const msg = "Here is your couple DP";
    const allImages = [
      fs.createReadStream(cacheDirectory + "img1.png"),
      fs.createReadStream(cacheDirectory + "img2.png")
    ];

    api.sendMessage({
      body: msg,
      attachment: allImages
    }, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
  }
}

module.exports = cdp;
