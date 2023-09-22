async function binary(event, api) {
  const input = event.body.toLowerCase();

  if (input.includes('-help')) {
    const usage = "Usage: binary [text]\n\n" +
      "Description: Converts the provided text into binary or decodes binary into text.\n\n" +
      "Example (encode): binary hello\nExample (decode): binary -decode 01101000 01100101 01101100 01101100 01101111";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  if (input.includes('-decode')) {
    const binaryCodeToConvert = input.split("-decode")[1].trim().split(' ');

    const decodeBinary = (binaryCode) => {
      return binaryCode
        .map(code => String.fromCharCode(parseInt(code, 2))) // Convert binary to character
        .join(''); // Join characters to form text
    };

    try {
      const decodedText = decodeBinary(binaryCodeToConvert);
      await api.sendMessage(`${decodedText}`, event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
      await api.sendMessage("⚠️ Failed to decode binary code.", event.threadID, event.messageID);
    }
  } else {
    const textToConvert = input.split("binary")[1].trim();

    const convertToBinary = (text) => {
      return text
        .split('')
        .map(char => char.charCodeAt(0).toString(2)) // Convert each character to binary
        .join(' '); // Add space between binary digits
    };

    try {
      const binaryText = convertToBinary(textToConvert);
      await api.sendMessage(`${binaryText}`, event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
      await api.sendMessage("⚠️ Failed to convert text to binary.", event.threadID, event.messageID);
    }
  }
}

module.exports = binary;
