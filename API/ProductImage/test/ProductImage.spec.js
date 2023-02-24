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

describe(`Tests Product`, () => {
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

  it('insert Product', done => {
    const body = {
      productName: 'ATM / Bank',
      productIdentityNumber: faker.company.companyName(),
      productReferName: faker.name.firstName(),
      productReceiverName: faker.name.firstName(),
      productType: 1,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Product/insert`)
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

  it('find payment method', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Product/find`)
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

  it('update payment method', done => {
    const body = {
      id: id,
      data: {
        productReferName: faker.name.firstName(),
      },
    };

    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Product/updateById`)
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

  it('get payment method by id', done => {
    const body = {
      id: id,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Product/findById`)
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

  it('user get payment method', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Product/user/getList`)
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

  it('user get payment method (no token)', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Product/user/getList`)
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

  it('delete payment method', done => {
    const body = {
      id: id,
    };

    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Product/deleteById`)
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
