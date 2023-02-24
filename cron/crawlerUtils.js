/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

var wget = require('node-wget');
const fs = require('fs');

const Logger = require('../utils/logging');

async function downloadImage(imageUrl) {
  return new Promise((resolve, reject) => {
    wget(
      {
        url: imageUrl,
        dest: 'images/', // destination path or path with filenname, default is ./
        timeout: 2000, // duration to wait for request fulfillment in milliseconds, default is 2 seconds
      },
      function (error, res) {
        if (error) {
          Logger.error('downloadImage', error);
          resolve(undefined);
        } else {
          resolve(res.filepath);
        }
      },
    );
  });
}
async function getImageData(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, function read(err, data) {
      if (err) {
        return null;
      }
      resolve(data);
    });
  });
}

function extractChapterData(data) {
  let chapterData = data.split(':');
  let tenChuong = '';
  if (chapterData.length > 1) {
    tenChuong = chapterData[1].trim();
  }
  let soChuong = chapterData[0].replace('Chương', '').trim();
  return {
    ten_chuong: tenChuong,
    so_chuong: soChuong,
  };
}
module.exports = {
  downloadImage,
  getImageData,
  extractChapterData,
};
