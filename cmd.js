const fs = require('fs').promises;
const path = require('path');
const moment = require('moment-timezone');

async function fetchUserFirstName(api, senderID) {
  return new Promise((resolve, reject) => {
    api.getUserInfo([senderID], (err, userInfo) => {
      if (err) {
        reject(err);
      } else {
        const senderName = userInfo[senderID]?.firstName || 'User';
        resolve(senderName);
      }
    });
  });
}

async function readCommandFiles(cmdFolderPath) {
  try {
    const files = await fs.readdir(cmdFolderPath);
    return files
      .filter(file => path.extname(file).toLowerCase() === '.js')
      .map(file => path.parse(file).name);
  } catch (err) {
    console.error('Error reading directory:', err);
    return [];
  }
}

async function cmd(event, api) {
  const cmdFolderPath = path.join(__dirname, '.');
  const userMessage = event.body.toLowerCase().trim();
  let showAll = false;

  if (userMessage.includes('-all')) {
    showAll = true; // Removed "let" to fix variable shadowing
    const commandList = await readCommandFiles(cmdFolderPath);
    const senderName = await fetchUserFirstName(api, event.senderID);

    const allCommandsOutput = [
      `${senderName}, here's the list of all commands`,
      '',
      ...commandList.map(cmd => `⦿ ${cmd.charAt(0).toUpperCase() + cmd.slice(1)}`),
      '',
      `Total Commands: ${commandList.length}`,
      'Showing all commands',
      '',
      'To see the command information, type commandname -help',
    ];
    api.sendMessage(allCommandsOutput.join('\n'), event.threadID);

    return; // Exit the function early to prevent default list execution
  }

  // If not -all, continue with the default list generation
  const senderName = await fetchUserFirstName(api, event.senderID);
  const commandList = await readCommandFiles(cmdFolderPath);

  const perPage = 20;
  const totalPages = Math.ceil(commandList.length / perPage);

  let page = parseInt(event.body && event.body.toLowerCase().trim().split(' ')[1]) || 1;
  page = Math.max(1, Math.min(page, totalPages));

  const startIndex = (page - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, commandList.length);

  const commandsToShow = commandList.slice(startIndex, endIndex);

  const formattedDate = moment().tz('Asia/Manila').format('DD/MM/YY, hh:mm:ss A');

  // Generate a random response
  const randomResponses = ['Hi', 'Konnichiwa', 'Hello'];
  const randomGreeting = randomResponses[Math.floor(Math.random() * randomResponses.length)];

  const output = [
    `${randomGreeting} ${senderName}, here's the list of commands`,
    '',

    ...commandsToShow.map(cmd => `⦿ ${cmd.charAt(0).toUpperCase() + cmd.slice(1)}`),
    '',
    `Page ${page}/${totalPages}`,
    `Total Commands: ${commandList.length}`,
    '',
    'To see the command information, type commandname -help',
  ];

  api.sendMessage(output.join('\n'), event.threadID);
}

module.exports = cmd;
