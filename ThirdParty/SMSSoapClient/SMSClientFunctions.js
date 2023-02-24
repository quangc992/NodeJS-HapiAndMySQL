/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

const SoapClient = require('./SoapClient');

const SMS_USER = process.env.SMS_USER || 'smsuser';
const SMS_PASSWORD = process.env.SMS_PASSWORD || 'smspass';
const SMS_CPCODE = process.env.SMS_CPCODE || 'smscpcode';
const SMS_SERVICEID = process.env.SMS_SERVICEID || 'smsserviceid';

SoapClient.initClient().then(client => {
  smsClient = client;
});

async function checkBalance() {
  var method = smsClient['checkBalance'];
  return new Promise((resolve, reject) => {
    var requestArgs = {
      User: SMS_USER,
      Password: SMS_PASSWORD,
      CPCode: SMS_CPCODE,
    };
    method(requestArgs, function (err, result, envelope, soapHeader) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function sendSMS(message, phoneNumber) {
  var method = smsClient['wsCpMt2'];
  return new Promise((resolve, reject) => {
    const SMS_COMMANDCODE = 'bulksms';
    const SMS_CONTENTTYPE = 0;
    var requestArgs = {
      User: SMS_USER,
      Password: SMS_PASSWORD,
      CPCode: SMS_CPCODE,
      RequestID: 1,
      UserID: phoneNumber,
      ReceiverID: phoneNumber,
      ServiceID: SMS_SERVICEID,
      CommandCode: SMS_COMMANDCODE,
      Content: message,
      ContentType: SMS_CONTENTTYPE,
    };
    console.log(requestArgs);
    method(requestArgs, function (err, result, envelope, soapHeader) {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  });
}

module.exports = {
  checkBalance,
  sendSMS,
};
