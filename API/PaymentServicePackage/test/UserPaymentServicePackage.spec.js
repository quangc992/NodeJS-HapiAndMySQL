/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
// const fs = require('fs');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
const Constant = require('../PaymentServicePackageConstant');
chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const app = require('../../../server');

async function getListPackage() {
  return new Promise((resolve, reject) => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/user/getList`)
      .set('Authorization', ``)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        resolve(res.body.data.data);
      });
  });
}

describe(`Tests UserPaymentServicePackage`, () => {
  let staffToken = '';
  let userToken = '';
  let id;
  let packageList = [];
  before(done => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      staffToken = staffData.token;
      let userData = await TestFunctions.loginUser();
      userToken = userData.token;
      packageList = await getListPackage();
      resolve();
    }).then(() => done());
  });

  async function buyPackage(packageId) {
    const body = {
      paymentServicePackageId: packageId,
    };
    return new Promise(async (resolve, reject) => {
      chai
        .request(`0.0.0.0:${process.env.PORT}`)
        .post(`/PaymentServicePackage/user/buyServicePackage`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(body)
        .end((err, res) => {
          if (err) {
            console.error(err);
          }
          checkResponseStatus(res, 200);
          id = res.body.data[0];
          resolve(id);
        });
    });
  }

  async function buyPackages(targetPackageList) {
    return new Promise(async (resolve, reject) => {
      let result = undefined;
      for (let i = 0; i < targetPackageList.length; i++) {
        const package = targetPackageList[i];
        result = await buyPackage(package.paymentServicePackageId);
      }
      resolve(result);
    });
  }

  it('POST /PaymentServicePackage/user/buyServicePackage', done => {
    buyPackages(packageList).then(resultId => {
      id = resultId;
      done();
    });
  });

  it('POST /PaymentServicePackage/user/historyServicePackage', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/user/historyServicePackage`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('POST /PaymentServicePackage/user/getUserServicePackage', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/user/getUserServicePackage`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it('POST /PaymentServicePackage/user/historyBonusServicePackage', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/user/historyBonusServicePackage`)
      .set('Authorization', `Bearer ${userToken}`)
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
