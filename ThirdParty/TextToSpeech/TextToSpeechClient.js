/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');

const client = new textToSpeech.TextToSpeechClient();
async function makeSpeechFile(speechString, fileName) {
  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const ssml = '<speak>Hello there.</speak>';
  let outputFile = `uploads/voices/default.mp3`;
  if (fileName) {
    outputFile = `${fileName}`;
  }

  if (outputFile.indexOf('.mp3') < 0) {
    outputFile = outputFile + '.mp3';
  }

  const request = {
    input: { text: `${speechString}` },
    voice: { languageCode: 'vi-VN', ssmlGender: 'FEMALE' },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 1.19,
    },
  };
  const [response] = await client.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(outputFile, response.audioContent, 'binary');
  console.log(`Audio content written to file: ${outputFile}`);
  return outputFile;
}

async function remakeAllAlphabets() {
  for (let i = 0; i < 100; i++) {
    await makeSpeechFile(i.toString(), `uploads/voices/alphabets/${i}.mp3`);
  }
  let alphabets = 'ABCDEFGHIJKLMNOPQRSTUVZXWY';
  alphabets = alphabets.split('');
  for (let i = 0; i < alphabets.length; i++) {
    await makeSpeechFile(alphabets[i], `uploads/voices/alphabets/${alphabets[i]}.mp3`);
  }
}

module.exports = {
  makeSpeechFile,
  remakeAllAlphabets,
};
