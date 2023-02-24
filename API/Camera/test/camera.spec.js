/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
require('dotenv').config();
const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
const Model = require('../resourceAccess/CameraResourceAccess');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

describe(`Tests ${Model.modelName}`, function () {
  let token = '';
  let cameraId;

  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginStaff();
      token = staffData.token;
      resolve();
    }).then(() => done());
  });

  it(`Insert ${Model.modelName}`, done => {
    const body = {
      cameraModel: faker.name.lastName(),
      cameraSeriesNumber: faker.name.lastName(),
      cameraProtocol: 'HTTP',
      cameraStatus: 1,
      cameraWebhookUrl: 'http://ababababab.aba',
      cameraInOut: 'Check in',
      cameraIP: '103.146.22.18',
      cameraPort: '3000',
      cameraPath: '/camera-test',
      cameraUserName: 'abababab',
      cameraPassword: 'asdasaasd',
      cameraStationsId: 1,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Camera/insert`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        cameraId = res.body.data[0];
        done();
      });
  });

  it(`findById ${Model.modelName}`, done => {
    const body = {
      id: cameraId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Camera/findById`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`find ${Model.modelName}`, done => {
    const body = {
      filter: {},
      skip: 0,
      limit: 20,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Camera/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`updateById ${Model.modelName}`, done => {
    const body = {
      id: cameraId,
      data: {
        cameraPassword: 'Automation test updated',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Camera/updateById`)
      .send(body)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`delete ${Model.modelName}`, done => {
    const body = {
      id: cameraId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Camera/deleteById`)
      .set('Authorization', `Bearer ${token}`)
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
