const path = require('path');
const fs = require('fs');

async function notify(event, api) {
  const input = event.body.toLowerCase();

  // VIP Permission check
  const filePath = path.join(__dirname, '..', 'json', 'userpanel.json');
  const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const vips = items.userpanel.VIPS;
  const senderID = event.senderID;
  
  if (!vips.includes(senderID)) {
    api.sendMessage('⛔️ Access Denied. You lack the necessary permissions to utilize this command.', event.threadID);
    return;
  }

  if (input.includes('-help')) {
    const usage = "Usage: notif <message>\n\n" +
      "Description: Send a message to all bot groups.\n\n" +
      "Example: notif Hello, bots!";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  try {
    const message = event.body.slice(event.body.indexOf(' ') + 1);
    const threadList = await api.getThreadList(100, null, ["INBOX"]);
    const botAdmin = await api.getUserInfo(senderID); // Get user information

    for (const thread of threadList) {
      if (thread.isGroup) {
        const threadName = thread.name || "";
        const msg = `Notification for group ${threadName}\n\nMessage: ${message}\n\n-Admin: ${botAdmin[senderID].name}`;
        api.sendMessage(msg, thread.threadID);
      }
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while sending notifications.", event.threadID);
  }
}

module.exports = notify;
