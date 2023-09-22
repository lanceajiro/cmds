async function binary(event, api) {
  const input = event.body.toLowerCase();

  if (input.includes('-help')) {
    const usage = "Usage: binary [text]\n\n" +
      "Description: Converts the provided text into binary.\n\n" +
      "Example: binary lance";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  const apiKey = "tanjiro"; // API key for the service
  const textToConvert = input.split("binary")[1].trim();

  let response;
  try {
    response = await fetch(`https://tanjiro-api.onrender.com/binary?text=${textToConvert}&api_key=${apiKey}`);
  } catch (err) {
    // Handle the fetch error here
    api.sendMessage("⚠️ Failed to fetch data.", event.threadID, event.messageID);
    return;
  }

  const jsonResponse = await response.json();

  if (jsonResponse.type === "success" && jsonResponse.result) {
    const binaryText = jsonResponse.result;
    await api.sendMessage(`${binaryText}`, event.threadID, event.messageID);
  } else {
    // Handle the API response error here
    api.sendMessage("⚠️ Failed to convert text to binary.", event.threadID, event.messageID);
  }
}

module.exports = binary;
