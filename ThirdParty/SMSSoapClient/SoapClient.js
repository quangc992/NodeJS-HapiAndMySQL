/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

var soap = require('strong-soap').soap;

async function initClient(wdslURL) {
  return new Promise((resolve, reject) => {
    var options = {};
    let smsUrlRequest = process.env.SMS_API_URL || 'http://ams.tinnhanthuonghieu.vn:8009/bulkapi?wsdl';
    if (wdslURL) {
      smsUrlRequest = wdslURL;
    }

    soap.createClient(smsUrlRequest, options, function (err, client) {
      resolve(client);
    });
  });
}

module.exports = {
  initClient,
};
