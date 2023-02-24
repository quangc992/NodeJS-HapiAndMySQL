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

describe(`Tests PaymentServicePackage`, () => {
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

  it('insert payment service package', done => {
    let price = faker.random.number({
      min: 100000,
      max: 500000,
    });
    let discountPrice = price - (price * faker.random.number(20)) / 100;
    const body = {
      packageName: faker.random.words(),
      packagePrice: price,
      packageDiscountPrice: discountPrice + '',
      packagePerformance: faker.random.number({
        min: 1,
        max: 10,
      }),
      packageUnitId: 1,
      packageStatus: Constant.PACKAGE_STATUS.NEW,
      packageDuration: faker.random.number({
        min: 1,
        max: 20,
      }),
      packageType: Constant.PACKAGE_TYPE.A1000FAC.type,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/insert`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        id = res.body.data[0];
        done();
      });
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

  it('update payment service package', done => {
    const body = {
      id: id,
      data: {
        packageStatus: Constant.PACKAGE_STATUS.HOT,
      },
    };

    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/updateById`)
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

  it('get payment service package by id', done => {
    const body = {
      id: id,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/findById`)
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
  it('user get payment service package (no token)', done => {
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
        done();
      });
  });
  it('delete payment service package', done => {
    const body = {
      id: id,
    };

    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/deleteById`)
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
