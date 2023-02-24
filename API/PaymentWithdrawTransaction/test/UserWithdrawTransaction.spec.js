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
describe(`Tests PaymentWithdrawTransaction`, () => {
  let staffToken = '';
  let paymentMethodId = '';
  let userToken = '';
  let testUserId;
  before(done => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      staffToken = staffData.token;
      let userData = await TestFunctions.loginUser();
      testUserId = userData.appUserId;
      userToken = `Bearer ${userData.token}`;
      resolve();
    }).then(() => done());
  });
  it('User PaymentWithdrawUSDT', done => {
    const body = {
      paymentAmount: 10,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentWithdrawTransaction/user/requestWithdrawUSDT`)
      .set('Authorization', `${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it('User PaymentWithdrawBTC', done => {
    const body = {
      paymentAmount: 10,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentWithdrawTransaction/user/requestWithdrawBTC`)
      .set('Authorization', `${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it('User views history PaymentWithdrawUSDT', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentWithdrawTransaction/user/withdrawHistoryUSDT`)
      .set('Authorization', `${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it('User views history PaymentWithdrawBTC', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentWithdrawTransaction/user/withdrawHistoryBTC`)
      .set('Authorization', `${userToken}`)
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
