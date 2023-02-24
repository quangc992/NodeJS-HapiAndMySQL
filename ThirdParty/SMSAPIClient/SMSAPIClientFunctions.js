/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

const moment = require('moment');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const SMS_API_URL = process.env.SMS_API_URL || 'https://sms.com';
const SMS_API_USERNAME = process.env.SMS_API_USERNAME || 'smsuser';
const SMS_API_PASSWORD = process.env.SMS_API_PASSWORD || 'smspassword';
const SMS_API_BRAND = process.env.SMS_API_BRAND || 'smsbrand';

async function checkSMS(smsId) {
  let body = {
    username: SMS_API_USERNAME,
    password: SMS_API_PASSWORD,
    brandname: SMS_API_BRAND,
    textmsg: 'Hello',
    sendtime: '20190219105500',
    isunicode: 0,
    listmsisdn: '84391222xxx;84351222xxx',
  };
  return new Promise((resolve, reject) => {
    chai
      .request(SMS_API_URL)
      .post(`/AppUsers/registerUser`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        token = 'Bearer ' + res.body.data.token;
        done();
      });
  });
}

async function sendSMS(message, phoneNumberList, customClient) {
  // username String Tên đăng nhập hệ thống Có phân biệt chữ hoa chữ thường
  // password String Mật khẩu đăng nhập
  // brandname String Tên Brandname Có phân biệt chữ hoa chữ thường
  // textmsg String Nội dung tin nhắn
  // sendtime String Thời gian gửi tin Theo format yyyyMMddHHmmss
  // isunicode Number Tin nhắn Unicode (0: nếu là tin nhắn không dấu, 8: nếu là tin nhắn unicode)
  // listmsisdn String Danh sách số điện thoại
  // nhận SMS Format bắt đầu là 84 hoặc 0. Nếu bắt đầu 0, hệ thống sẽ tự động đổi thành 84 trước khi xử lý dữ liệu. Danh sách SDT cách nhau bởi dấu
  // chấm phẩy “;” và không có khoảng trắng
  let sendTime = moment().format('YYYYMMDDhhmmss');

  let _smsApiUrl = SMS_API_URL;
  let _smsAuth = {
    username: SMS_API_USERNAME,
    password: SMS_API_PASSWORD,
    brandname: SMS_API_BRAND,
  };

  if (customClient) {
    _smsAuth = {
      username: customClient.smsApiUsername,
      password: customClient.smsApiPassword,
      brandname: customClient.smsAPIBrand,
    };
    _smsApiUrl = customClient.smsApiUrl;
  }

  let body = {
    ..._smsAuth,
    textmsg: message,
    sendtime: sendTime,
    isunicode: 0,
    listmsisdn: phoneNumberList.join(';'),
  };
  console.log(body);
  return new Promise((resolve, reject) => {
    chai
      .request(_smsApiUrl)
      .post(`/sendsms`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        if (res) {
          try {
            let result = JSON.parse(res.text);
            console.info(`sendSMS ${phoneNumberList.join(';')}`);
            console.info(`${res.text}`);
            if (result.code !== 0) {
              console.info(`sendSMS error code !== 0`);
              resolve(undefined);
            } else {
              resolve(result.transactionid);
            }
          } catch (error) {
            console.error('============ERROR==========');
            console.error(res.text);
            resolve(undefined);
          }
        } else {
          console.info(`request sendSMS error`);
          resolve(undefined);
        }
      });
  });
}

async function createClient(smsApiUrl, smsApiUsername, smsApiPassword, smsAPIBrand) {
  const invalidClient = undefined;
  if (smsApiUrl === undefined || smsApiUrl === null || smsApiUrl.trim() === '') {
    console.error(`invalid smsApiUrl ${smsApiUrl}`);
    return invalidClient;
  }

  if (smsApiUsername === undefined || smsApiUsername === null || smsApiUsername.trim() === '') {
    console.error(`invalid smsApiUsername ${smsApiUsername}`);
    return invalidClient;
  }

  if (smsApiPassword === undefined || smsApiPassword === null || smsApiPassword.trim() === '') {
    console.error(`invalid smsApiPassword ${smsApiPassword}`);
    return invalidClient;
  }

  if (smsAPIBrand === undefined || smsAPIBrand === null || smsAPIBrand.trim() === '') {
    console.error(`invalid smsAPIBrand ${smsAPIBrand}`);
    return invalidClient;
  }

  const newClient = {
    smsApiUrl: smsApiUrl,
    smsApiUsername: smsApiUsername,
    smsApiPassword: smsApiPassword,
    smsAPIBrand: smsAPIBrand,
  };
  return newClient;
}
module.exports = {
  sendSMS,
  createClient,
};
