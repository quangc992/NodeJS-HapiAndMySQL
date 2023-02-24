/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
const app = require('../../../server');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

describe(`Tests Statistical`, function () {
  let token = '';
  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginStaff();
      token = `Bearer ${staffData.token}`;
      resolve();
    }).then(() => done());
  });

  it('get generalReport', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Statistical/generalReport`)
      .set('Authorization', token)
      .send(body)
      .end((err, res) => {
        checkResponseStatus(res, 200);
        done();
      });
  });
});
