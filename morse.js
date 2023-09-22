async function morse(event, api) {
  const input = event.body.toLowerCase();

  if (input.includes('-help')) {
    const usage = "Usage: morse [text]\n\n" +
      "Description: Converts the provided text into Morse code or decodes Morse code into text.\n\n" +
      "Example (encode): morse hello\nExample (decode): morse -decode .... . .-.. .-.. ---";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  const morseCodeMap = {
    'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.',
    'f': '..-.', 'g': '--.', 'h': '....', 'i': '..', 'j': '.---',
    'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---',
    'p': '.--.', 'q': '--.-', 'r': '.-.', 's': '...', 't': '-',
    'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-', 'y': '-.--',
    'z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', ' ': '/'
  };

  if (input.includes('-decode')) {
    const morseCodeToConvert = input.split("-decode")[1].trim().split(' ');

    const decodeMorse = (morseCode) => {
      return morseCode
        .map(code => {
          const character = Object.keys(morseCodeMap).find(key => morseCodeMap[key] === code);
          return character ? character.toUpperCase() : code; // Use the map or keep non-Morse characters
        })
        .join(''); // Join Morse code characters to form text
    };

    try {
      const decodedText = decodeMorse(morseCodeToConvert);
      await api.sendMessage(`${decodedText}`, event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
      await api.sendMessage("⚠️ Failed to decode Morse code.", event.threadID, event.messageID);
    }
  } else {
    const textToConvert = input.split("morse")[1].trim();

    const convertToMorse = (text) => {
      return text
        .split('')
        .map(char => morseCodeMap[char] || char) // Use the map or keep non-alphanumeric characters
        .join(' '); // Add space between Morse code characters
    };

    try {
      const morseText = convertToMorse(textToConvert);
      await api.sendMessage(`${morseText}`, event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
      await api.sendMessage("⚠️ Failed to convert text to Morse code.", event.threadID, event.messageID);
    }
  }
}

module.exports = morse;
