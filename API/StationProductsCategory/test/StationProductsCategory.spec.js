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

describe(`Tests StationProductsCategory`, function () {
  let stationProductsCategoryId;
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

  it('insert stationProductsCategory', done => {
    const body = {
      stationProductsCategoryTitle: fakeUserName,
      stationProductsCategoryContent: fakeUserName,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StationProductsCategory/insert`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        stationProductsCategoryId = res.body.data[0];
        done();
      });
  });

  it('find stationProductsCategory', done => {
    const body = {
      filter: {},
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StationProductsCategory/find`)
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

  it('updateDisplayIndexById stationProductsCategory', done => {
    const body = {
      id: stationProductsCategoryId,
      data: {
        displayIndex: 0,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StationProductsCategory/updateDisplayIndexById`)
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

  it('find by Id stationProductsCategory', done => {
    const body = {
      id: stationProductsCategoryId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StationProductsCategory/findById`)
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

  it('delete by id stationProductsCategory', done => {
    const body = {
      id: stationProductsCategoryId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StationProductsCategory/deleteById`)
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
