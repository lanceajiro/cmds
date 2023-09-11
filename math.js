const axios = require('axios');

async function math(event, api) {
  const input = event.body.toLowerCase();

  if (input.includes('-help')) {
    const usage = "Usage: math <expression>\n\n" +
      "Description: Evaluates a mathematical expression using Wolfram Alpha.\n\n" +
      "Example: math 1+1\n\n" +
      "Note: Replace '1+1' with your desired mathematical expression.";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  const args = input.split(' ').slice(1); // Remove the command name

  if (args.length === 0) {
    api.sendMessage("Please provide a mathematical expression to evaluate.", event.threadID);
    return;
  }

  const expression = args.join(' ').trim();
  const key = 'T8J8YV-H265UQ762K'; // Replace with your Wolfram Alpha API key

  const apiUrl = `http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(expression)}&output=json`;

  try {
    const response = await axios.get(apiUrl);

    if (response.status === 200) {
      const pods = response.data?.queryresult?.pods;

      if (pods) {
        let result = '';
        for (const pod of pods) {
          if (pod.primary && pod.subpods && pod.subpods.length > 0) {
            result += pod.subpods[0].plaintext + '\n';
          }
        }
        if (result !== '') {
          api.sendMessage(result, event.threadID, event.messageID);
        } else {
          api.sendMessage("No result found for the given expression.", event.threadID);
        }
      } else {
        api.sendMessage("Unable to evaluate the expression. Please provide a valid arithmetic expression.", event.threadID);
      }
    } else {
      api.sendMessage("Error: Received an unexpected response from the API.", event.threadID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while communicating with the API. Please try again later.", event.threadID);
  }
}

module.exports = math;
