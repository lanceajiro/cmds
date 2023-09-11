const axios = require('axios');
const Scraper = require('mal-scraper');
const request = require('request');
const fs = require('fs');
const path = require('path');

async function mal(event, api) {
  const input = event.body.toLowerCase();

  if (input.startsWith('-help')) {
    const usage = `
      Usage: mal [name of anime]
      Description: Search for an anime on MyAnimeList.
      Example: mal Attack on Titan
      Note: This command provides information about the searched anime.`;
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  const query = input.substring(4).trim(); // Adjust substring to 4
  const Replaced = query.replace(/ /g, " ");

  api.sendMessage(`🔎Searching for "${Replaced}"...`, event.threadID, event.messageID); // Fix "Searching for" message

  try {
    const Anime = await Scraper.getInfoFromName(Replaced);
    const getURL = Anime.picture;
    const ext = path.extname(getURL).substring(1);

    if (!Anime.genres[0] || Anime.genres[0] === null) Anime.genres[0] = "None";

    const title = Anime.title;
    const japTitle = Anime.japaneseTitle;
    const type = Anime.type;
    const status = Anime.status;
    const premiered = Anime.premiered;
    const broadcast = Anime.broadcast;
    const aired = Anime.aired;
    const producers = Anime.producers;
    const studios = Anime.studios;
    const source = Anime.source;
    const episodes = Anime.episodes;
    const duration = Anime.duration;
    const genres = Anime.genres.join(", ");
    const popularity = Anime.popularity;
    const ranked = Anime.ranked;
    const score = Anime.score;
    const rating = Anime.rating;
    const synopsis = Anime.synopsis;
    const url = Anime.url;

    const cacheFilePath = path.join(__dirname, '..', 'temp', `mal.${ext}`);

    const callback = function () {
      api.sendMessage({
        body: `📺 Title: ${title}\n🇯🇵 Japanese Title: ${japTitle}\n📋 Type: ${type}\n📡 Status: ${status}\n📅 Premiered: ${premiered}\n📺 Broadcast: ${broadcast}\n📆 Aired: ${aired}\n🎬 Producers: ${producers}\n🏢 Studios: ${studios}\n📖 Source: ${source}\n🎞️ Episodes: ${episodes}\n⏳ Duration: ${duration}\n🎭 Genres: ${genres}\n🌟 Popularity: ${popularity}\n🎖️ Ranked: ${ranked}\n🔢 Score: ${score}\n📝 Rating: ${rating}\n\n📜 Synopsis: \n${synopsis}\n\n🌐 Link: ${url}`,
        attachment: fs.createReadStream(cacheFilePath)
      }, event.threadID, () => fs.unlinkSync(cacheFilePath), event.messageID);
    };

    request(getURL).pipe(fs.createWriteStream(cacheFilePath)).on("close", callback);
  } catch (error) {
    handleErrorResponse(api, event, error);
  }
}

function handleErrorResponse(api, event, error) {
  const errorMessage = error ? error.toString() : "Error!";
  api.sendMessage(errorMessage, event.threadID, event.messageID);
  console.error(errorMessage);
}

module.exports = mal;
  
