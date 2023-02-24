/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

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

describe(`Tests StationServicesCategory`, function () {
  let stationServicesCategoryId;
  let staffToken = '';
  let fakeUserName = faker.name.firstName() + faker.name.lastName();
  fakeUserName = fakeUserName.replace("'", '');
  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginStaff();
      staffToken = staffData.token;
      resolve();
    }).then(() => done());
  });

  it('insert stationServicesCategory', done => {
    const body = {
      stationServicesCategoryTitle: fakeUserName,
      stationServicesCategoryContent: fakeUserName,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StationServicesCategory/insert`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        stationServicesCategoryId = res.body.data[0];
        done();
      });
  });

  it('find stationServicesCategory', done => {
    const body = {
      filter: {},
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StationServicesCategory/find`)
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

  it('updateDisplayIndexById stationServicesCategory', done => {
    const body = {
      id: stationServicesCategoryId,
      data: {
        displayIndex: 0,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StationServicesCategory/updateDisplayIndexById`)
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

  it('find by Id stationServicesCategory', done => {
    const body = {
      id: stationServicesCategoryId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StationServicesCategory/findById`)
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

  it('delete by id stationServicesCategory', done => {
    const body = {
      id: stationServicesCategoryId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StationServicesCategory/deleteById`)
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
