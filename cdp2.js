const axios = require('axios');
const fs = require('fs-extra');

async function cdp2(event, api) {
  if (event.body.toLowerCase().includes('-help')) {
    const usage = "Usage: cdp2\n\n" +
      "Description: Get a random couple display picture (DP).\n\n" +
      "Example: cdp2\n\n" +
      "Note: This command provides a random couple DP.";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  try {
    const res = await axios.get("https://api.zahwazein.xyz/randomanime/couples?apikey=zenzkey_4f308b315814");
    const { male, female } = res.data.result;

    const imgs1 = await axios.get(male, {
      responseType: "arraybuffer",
    });

    fs.writeFileSync(__dirname + "/../temp/image.png", Buffer.from(imgs1.data, "utf-8"));

    const imgs2 = await axios.get(female, {
      responseType: "arraybuffer",
    });

    fs.writeFileSync(__dirname + "/../temp/image2.png", Buffer.from(imgs2.data, "utf-8"));

    const allImages = [
      fs.createReadStream(__dirname + "/../temp/image.png"),
      fs.createReadStream(__dirname + "/../temp/image2.png"),
    ];

    const msg = "Here is your couple DP";

    api.sendMessage({
      body: msg,
      attachment: allImages,
    }, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while fetching the couple DP. Please try again.", event.threadID, event.messageID);
  }
}

module.exports = cdp2;
                                  
