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

describe(`Tests BetRecords`, () => {
  let staffToken = '';
  let userToken = '';
  let id;
  before(done => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      staffToken = staffData.token;
      let userData = await TestFunctions.loginUser();
      userToken = userData.token;
      resolve();
    }).then(() => done());
  });

  it('find payment service package', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/find`)
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

  it('user get payment service package', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/user/getList`)
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
