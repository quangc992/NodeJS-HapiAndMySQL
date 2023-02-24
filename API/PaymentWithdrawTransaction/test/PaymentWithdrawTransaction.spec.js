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

  it('insert PaymentWithdrawTransaction', done => {
    const body = {
      id: testUserId,
      paymentAmount: 100000,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentWithdrawTransaction/insert`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        paymentMethodId = res.body.data[0];
        done();
      });
  });

  it('find PaymentWithdrawTransaction', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentWithdrawTransaction/find`)
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
  it('find PaymentWithdrawTransaction (with filter)', done => {
    const body = {
      filter: {},
      skip: 0,
      startDate: '2021-11-30T17:00:00.000Z',
      endDate: '2021-12-31T16:59:59.999Z',
      limit: 20,
      order: { key: 'createdAt', value: 'desc' },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentWithdrawTransaction/find`)
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
  it('find PaymentWithdrawTransaction (with searchText)', done => {
    const body = { filter: {}, skip: 0, searchText: 'aaa', limit: 20, order: { key: 'createdAt', value: 'desc' } };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentWithdrawTransaction/find`)
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
  it('find PaymentWithdrawTransaction by ID', done => {
    const body = {
      id: paymentMethodId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentWithdrawTransaction/findById`)
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
