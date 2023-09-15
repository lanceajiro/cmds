const axios = require('axios');
const { Readable } = require('stream');

async function qr(event, api) {
  const input = event.body.toLowerCase();
  const inputArray = input.split(' ').slice(1);

  if (inputArray.length < 1) {
    api.sendMessage("You must add text to your command, so I can convert it to a QR code.\nEg: -qr This message is now encoded as a QR code", event.threadID, event.messageID);
    return;
  }

  const userText = inputArray.join(' ').split(' ').join('%20');
  const qrGenerator = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${userText}`;

  try {
    const response = await axios.get(qrGenerator, { responseType: 'stream' });

    api.sendMessage({
      attachment: response.data,
    }, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage('An error occurred while generating the QR code.', event.threadID, event.messageID);
  }
}

module.exports = qr;
