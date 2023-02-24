/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
const Model = require('../resourceAccess/RealEstateReportResourceAccess');

const app = require('../../../server');
const { modelName } = require('../resourceAccess/RealEstateReportResourceAccess');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

describe(`Tests ${Model.modelName}`, function () {
  let realEstateReportId;
  let staffToken = '';
  let userToken = '';
  let fakeUserName = faker.name.firstName() + faker.name.lastName();
  fakeUserName = fakeUserName.replace("'", '');
  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginStaff();
      staffToken = staffData.token;
      let userData = await TestFunctions.loginUser();
      userToken = userData.token;
      resolve();
    }).then(() => done());
  });

  it(`report problem for ${modelName} (need token)`, done => {
    const body = {
      reportTitle: 'A New problem was reported',
      reportcontent: 'A New problem was reported for this real estate. Please check content for more detail',
      reportEmail: faker.internet.email(),
      reportPhoneNumber: faker.phone.phoneNumber(),
      realEstateId: 1,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/reportPostProblem`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        realEstateReportId = res.body.data[0];

        done();
      });
  });

  it(`report problem for ${modelName} (only use phone number)`, done => {
    const body = {
      reportTitle: 'A New problem was reported',
      reportcontent: 'A New problem was reported for this real estate. Please check content for more detail',
      reportPhoneNumber: faker.phone.phoneNumber(),
      realEstateId: 1,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/reportPostProblem`)
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

  it(`find ${modelName}`, done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
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
  it(`findById ${modelName}`, done => {
    const body = {
      id: realEstateReportId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/findById`)
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

  it(`update by id ${modelName}`, done => {
    const body = {
      id: realEstateReportId,
      data: {
        reportTitle: 'A reported problem was updated',
        reportcontent: 'A reported problem was updated for this real estate. Please check content for more detail',
        realEstateId: 1,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/updateById`)
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

  it(`delete by id ${modelName}`, done => {
    const body = {
      id: realEstateReportId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/deleteById`)
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
