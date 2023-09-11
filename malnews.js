const malScraper = require('mal-scraper');

async function malnews(event, api) {
  const input = event.body.toLowerCase();

  if (input.includes('-help')) {
    const usage = "Usage: malnews\n\n" +
      "Description: Get the latest anime news from MyAnimeList.\n\n" +
      "Example: malnews\n\n" +
      "Note: This command provides the top 5 latest MAL news.";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  const nbNews = 5;

  try {
    malScraper.getNewsNoDetails(nbNews)
      .then((n) => {
        let message = "TOP 5 LATEST MAL NEWS\n\n";
        for (let i = 0; i < n.length; i++) {
          message += `『 ${i + 1} 』 ${n[i].title}\n\n`;
        }
        api.sendMessage(message, event.threadID, event.messageID);
      })
      .catch((err) => console.log(err));
  } catch (error) {
    handleErrorResponse(api, event, error);
  }
}

function handleErrorResponse(api, event, error) {
  const errorMessage = error ? error.toString() : "Error!";
  api.sendMessage(errorMessage, event.threadID, event.messageID);
  console.log(errorMessage);
}

module.exports = malnews;
