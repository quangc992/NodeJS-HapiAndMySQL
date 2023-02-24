/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const moment = require('moment');
const SMSMessageResourceAccess = require('./resourceAccess/SMSMessageResourceAccess');
const AppUserResource = require('../AppUsers/resourceAccess/AppUsersResourceAccess');

function _getBalance(text) {
  // check tiền khi nội dung là +121,123,213VND....
  let matchAmount = text.match(/\+\s*?[0-9,]+\s*?(VND)?/i);
  if (matchAmount && matchAmount.length > 0) {
    // thường thì biến động số dư ở trước nội dung nên cứ lấy value[0]
    return parseInt(matchAmount[0].replace(/\D*/, ''));
  }
  // check tiền khi nội dung là +121.123.213VND....
  matchAmount = text.match(/\+\s*?[0-9.]+\s*?(VND)?/i);
  if (matchAmount && matchAmount.length > 0) {
    // thường thì biến động số dư ở trước nội dung nên cứ lấy value[0]
    return parseInt(matchAmount[0].replace(/\D*/, ''));
  }
  return 0;
}

function _getDateReceived(text) {
  // 08/06/22 => 08/06/2022
  let matchDate = text.match(/\d{2}\/\d{2}\/\d{2,4}/g);
  if (matchDate && matchDate.length > 0) {
    matchDate = matchDate[0];
    if (matchDate.length === 8) {
      // 03/06/22
      matchDate = matchDate.split('/');
      matchDate[2] = '20' + matchDate[2];
      matchDate = matchDate.reverse(); // 03/06/2022
      return matchDate.join('/');
    }
    return matchDate.split('/').reverse().join('/');
  }
  return moment().format('YYYY/MM/DD');
}

function _getTimeReceived(text) {
  let matchTime = text.match(/\d{2}:\d{2}/g);
  if (matchTime && matchTime.length > 0) {
    return matchTime[0];
  }
  return moment().format('HH:mm');
}

async function handleDetectSMSMessage(content = '') {
  if (!content) {
    return undefined;
  }
  let values = {};
  content = content.replace('\n', '');
  // check số tiền
  values.smsMessageBalanceAmount = _getBalance(content);
  if (!values.smsMessageBalanceAmount) {
    return undefined;
  }
  // check user nạp tiền. ND chuyển khoản: NAPTIEN_<ID>_.....
  let matchUserNapTien = content.match(/VSTT\s*?([0-9]{10,12})/i);
  if (matchUserNapTien && matchUserNapTien.length > 0) {
    let userPhoneNumber = matchUserNapTien[0].replace('VSTT', '');
    let userData = await AppUserResource.find({
      phoneNumber: userPhoneNumber,
    });
    if (!(userData && userData.length > 0)) {
      return undefined;
    }
    values.smsMessageAppUserId = userData[0].appUserId;
  } else {
    values.smsMessageAppUserId = null;
  }
  // check thời gian nhận tin nhắn
  values.smsReceiveMessageDate = await _getDateReceived(content);
  values.smsReceiveMessageTime = await _getTimeReceived(content);
  return values;
}

async function verifySMS(smsMessage) {
  let existingSMSMessage = await SMSMessageResourceAccess.find({
    smsHash: smsMessage.smsHash,
    // smsMessageStationId: smsMessage.smsMessageStationId
  });
  if (existingSMSMessage && existingSMSMessage.length > 0) {
    throw 'EXISTING_SMS';
  }
}

module.exports = {
  handleDetectSMSMessage,
  verifySMS,
};
