/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
// const fs = require('fs');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const app = require('../../../server');

describe(`Tests PaymentExchangeTransaction`, () => {
  let staffToken = '';
  let paymentMethodId = '';
  let userToken = '';
  let testUserId;
  let transactionId;
  before(done => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      staffToken = `Bearer ${staffData.token}`;
      let userData = await TestFunctions.loginUser();
      testUserId = userData.appUserId;
      userToken = `Bearer ${userData.token}`;
      resolve();
    }).then(() => done());
  });

  it('user change FAC => USDT', done => {
    const body = {
      paymentAmount: 1,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/user/ExchangeFAC`)
      .set('Authorization', `${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        transactionId = res.body.data[0];
        done();
      });
  });

  it('user change POINT => FAC', done => {
    const body = {
      paymentAmount: 1,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/user/ExchangePOINT`)
      .set('Authorization', `${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        transactionId = res.body.data[0];
        done();
      });
  });
  it('user views history FAC', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/user/userExchangeFACHistory`)
      .set('Authorization', `${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        transactionId = res.body.data[0];
        done();
      });
  });
  it('user views history POINT', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/user/userExchangePOINTHistory`)
      .set('Authorization', `${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        transactionId = res.body.data[0];
        done();
      });
  });
});
