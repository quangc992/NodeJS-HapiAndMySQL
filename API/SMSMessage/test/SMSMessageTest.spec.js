/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
const messages = require('./messageTest');
const { SMS_MESSAGE_STATUS } = require('../SMSMessageConstants');
require('dotenv').config();
const crypto = require('crypto');
const moment = require('moment');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

describe(`Test Station`, () => {
  let staffToken = '';

  before(done => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      staffToken = staffData.token;
      resolve();
    }).then(() => done());
  });

  let keys = Object.keys(messages);
  for (let i = 0; i < keys.length; i++) {
    let hash = crypto.randomBytes(5).toString('hex');
    it('insert sms message ' + i, done => {
      const body = {
        smsMessageContent: messages[keys[i]],
        smsMessageNote: 'AUTO_SYNC',
        smsMessageOrigin: keys[i].split('_')[0],
        smsMessageStatus: SMS_MESSAGE_STATUS.NEW,
        smsReceiveDate: moment().format('YYYY/MM/DD'),
        smsReceiveTime: moment().format('HH:mm'),
        smsHash: hash,
      };
      chai
        .request(`0.0.0.0:${process.env.PORT}`)
        .post(`/SMSMessage/insert`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send(body)
        .end((err, res) => {
          if (err) {
            console.error(err);
          }
          checkResponseStatus(res, 200);
          msgId = res.body.data;
          done();
        });
    });
  }
});
