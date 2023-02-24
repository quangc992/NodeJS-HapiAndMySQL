/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

var QRCode = require('qrcode');
const crypto = require('crypto');

function makeQRHash(text) {
  const key = 'thisiskey';

  return crypto.createHmac('sha256', key).update(text).digest('hex');
}

async function createQRCode(code, qrColor = '') {
  return new Promise((resolve, reject) => {
    try {
      var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        quality: 0.3,
        margin: 1,
        color: {
          dark: qrColor ? qrColor : '#000000',
          light: '#FFFFFF',
        },
      };

      let encodeString = makeQRHash(code);
      let fileName = encodeString;

      let path = 'images/' + fileName + '.jpeg';

      QRCode.toFile(path, code, opts, function (err) {
        resolve(path);
      });
    } catch (e) {
      reject(undefined);
    }
  });
}

module.exports = {
  createQRCode,
};
