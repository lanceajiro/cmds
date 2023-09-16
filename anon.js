const path = require('path');
const fs = require('fs');

async function anon(event, api) {
  const filePath = path.join(__dirname, '..', 'json', 'userpanel.json');
  const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const vips = items.userpanel.VIPS;
  const senderID = event.senderID;

  // Permission check
  if (!vips.includes(senderID)) {
    api.sendMessage('⛔️ Access Denied. You lack the necessary permissions to utilize this command.', event.threadID);
    return;
  }

  const input = event.body; // Remove .toLowerCase() to preserve capitalization
  const inputParts = input.split(' ');

  if (input.includes('-help')) {
    const usage = "Usage: anon [UID/ThreadID] [message]\n\n" +
      "Description: Sends an anonymous message to the specified user or group using their UID or ThreadID.\n\n" +
      "Example: anon 123456789 Hello, this is anonymous!\n\n" +
      "Note: Replace [UID/ThreadID] with the recipient's UID or ThreadID.";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  if (inputParts.length < 3) {
    await api.sendMessage("⚠️ Usage: anon [UID/ThreadID] [message]", event.threadID, event.messageID);
    return;
  }

  const recipient = inputParts[1]; // The UID or Thread ID
  const message = inputParts.slice(2).join(' '); // The message to send

  try {
    await api.sendMessage(message, recipient);
    await api.sendMessage("✉️ Message sent anonymously.", event.threadID, event.messageID);
  } catch (err) {
    console.error(err);
    await api.sendMessage("⚠️ Failed to send the anonymous message.", event.threadID, event.messageID);
  }
}

module.exports = anon;
