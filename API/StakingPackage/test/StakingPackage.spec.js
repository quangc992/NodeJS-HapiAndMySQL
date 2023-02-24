/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
// const fs = require('fs');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
const Constant = require('../StakingPackageConstant');
chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const app = require('../../../server');

describe(`Tests StakingPackage`, () => {
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

  it('insert payment Staking Package', done => {
    let price = faker.random.number({
      min: 100,
      max: 5000,
    });

    const body = {
      stakingPackageName: faker.random.words(),
      stakingPackageDescription: faker.random.words(),
      stakingPackagePrice: price,
      stakingPeriod: 30, //30 ngay
      stakingInterestRate: 10,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StakingPackage/insert`)
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

  it('find payment Staking Package', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StakingPackage/find`)
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

  it('update payment Staking Package', done => {
    const body = {
      id: id,
      data: {
        stakingPeriod: 30,
      },
    };

    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StakingPackage/updateById`)
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

  it('get payment Staking Package by id', done => {
    const body = {
      id: id,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StakingPackage/findById`)
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

  it('delete payment Staking Package', done => {
    const body = {
      id: id,
    };

    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StakingPackage/deleteById`)
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
