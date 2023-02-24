/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const { MESSAGE_CATEGORY } = require('../CustomerMessageConstant');

const app = require('../../../server');

describe(`Tests GroupCustomerMessage`, function () {
  let messageId;
  let staffToken = '';
  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginStaff();
      staffToken = staffData.token;
      done();
      resolve();
    });
  });

  it('POST /GroupCustomerMessage/insert', done => {
    const body = {
      groupCustomerMessageContent: 'Chào mừng bạn đến với hệ thống',
      groupCustomerMessageTitle: 'Tin nhắn chào mừng',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/GroupCustomerMessage/insert`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it('POST /GroupCustomerMessage/find', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/GroupCustomerMessage/find`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        if (res.body.data && res.body.data.data.length > 0) {
          messageId = res.body.data.data[0].groupCustomerMessageId;
        }
        done();
      });
  });
  it('POST /GroupCustomerMessage/findById', done => {
    const body = {
      id: messageId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/GroupCustomerMessage/findById`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
});
