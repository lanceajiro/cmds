async function randomst(event, api) {
  const input = event.body.toLowerCase();

  if (input.includes('-help')) {
    const usage = "Usage: randomst\n\n" +
      "Description: Sends a random sticker.\n\n" +
      "Example: randomst\n\n" +
      "Note: This command sends a random sticker from a predefined list.";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  let data = [
    "526214684778630",
    "526220108111421",
    "526220308111401",
    "526220484778050",
    "526220691444696",
    "526220814778017",
    "526220978111334",
    "526221104777988",
    "526221318111300",
    "526221564777942",
    "526221711444594",
    "526221971444568",
    "2041011389459668", "2041011569459650", "2041011726126301", "2041011836126290", "2041011952792945", "2041012109459596", "2041012262792914", "2041012406126233", "2041012539459553", "2041012692792871", "2041014432792697", "2041014739459333", "2041015016125972", "2041015182792622", "2041015329459274", "2041015422792598", "2041015576125916", "2041017422792398", "2041020049458802", "2041020599458747", "2041021119458695", "2041021609458646", "2041022029458604", "2041022286125245"
  ];
  
  const sticker = data[Math.floor(Math.random() * data.length)];
  
  api.sendMessage({ sticker: sticker }, event.threadID);
}

module.exports = randomst;
