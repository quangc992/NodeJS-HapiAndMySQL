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
  let userToken = '';
  let gameId;
  before(done => {
    new Promise(async (resolve, reject) => {
      let userData = await TestFunctions.loginUser();
      userToken = userData.token;
      resolve();
    }).then(() => done());
  });

  it('POST /GameRecord/user/getList', done => {
    const body = {
      filter: {},
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/GameRecord/user/getList`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        if (res.body.data && res.body.data.data.length > 0) {
          gameId = res.body.data.data[0].gameRecordId;
        }
        done();
      });
  });

  it('/BetRecords/user/placeRecord', done => {
    const body = {
      betRecordAmountIn: 100000,
      sectionName: '1-1',
      gameRecordId: gameId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/BetRecords/user/placeRecord`)
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

  it('/BetRecords/user/placeFakeRecord', done => {
    const body = {
      betRecordAmountIn: 100000,
      sectionName: '1-1',
      gameRecordId: gameId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/BetRecords/user/placeFakeRecord`)
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

  it('/BetRecords/user/getList', done => {
    const body = {
      filter: {},
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/BetRecords/user/getList`)
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
