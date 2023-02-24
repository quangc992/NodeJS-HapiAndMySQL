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

describe(`Tests WalletBalanceUnit`, () => {
  let staffToken = '';
  let paymentMethodId = '';
  let userToken = '';
  before(done => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      staffToken = staffData.token;
      resolve();
    }).then(() => done());
  });

  it('insert WalletBalanceUnit', done => {
    const body = {
      walletBalanceUnitCode: faker.random.alpha(6),
      walletBalanceUnitDisplayName: faker.company.companyName(),
      originalPrice: 100,
      userSellPrice: 80,
      agencySellPrice: 100,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/WalletBalanceUnit/insert`)
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
  it('search WalletBalanceUnit', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/WalletBalanceUnit/find`)
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
  it('find WalletBalanceUnit', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/WalletBalanceUnit/find`)
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

  it('update WalletBalanceUnit', done => {
    const body = {
      id: paymentMethodId,
      data: {
        walletBalanceUnitDisplayName: faker.company.companyName(),
      },
    };

    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/WalletBalanceUnit/updateById`)
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

  it('delete WalletBalanceUnit', done => {
    const body = {
      id: paymentMethodId,
    };

    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/WalletBalanceUnit/deleteById`)
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

  it('user get list WalletBalanceUnit', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/WalletBalanceUnit/user/getList`)
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
  it('user get list WalletBalanceUnit (no-token)', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/WalletBalanceUnit/user/getList`)
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
  it('search WalletBalanceUnit', done => {
    const body = {
      searchText: 'Coin',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/WalletBalanceUnit/user/getList`)
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
});
