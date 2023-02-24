/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const { loginStaff } = require('../../Common/test/CommonTestFunctions');

const { checkResponseStatus } = require('../../Common/test/Common');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const Model = require('../resourceAccess/StaffResourceAccess');

const app = require('../../../server');

describe(`Tests ${Model.modelName}`, function () {
  let staffToken = '';
  let staffId;
  before(done => {
    new Promise(async function (resolve, reject) {
      resolve();
    }).then(() => done());
  });

  it('Login Staff', done => {
    loginStaff().then(result => {
      if (result && Object.keys(result).length > 0) {
        staffToken = `Bearer ${result.token}`;
        done();
      }
    });
  });

  it('Register Staff Success', done => {
    const body = {
      lastName: faker.name.lastName(),
      firstName: faker.name.firstName(),
      username: faker.name.firstName() + faker.name.lastName(),
      email: faker.internet.email() + Math.random(),
      password: 'string',
      phoneNumber: 'string',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Staff/registerStaff`)
      .send(body)
      .end((err, res) => {
        checkResponseStatus(res, 200);
        staffId = res.body.data[0];
        done();
      });
  });

  it('Register Staff Error', done => {
    const body = {
      lastName: faker.name.lastName(),
      firstName: faker.name.firstName(),
      username: faker.name.firstName() + faker.name.lastName(),
      email: faker.internet.email(),
      password: 'string',
      phoneNumber: 'string',
      staffRoleId: 3,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Staff/registerStaff`)
      .set('Authorization', staffToken)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 400);
        done();
      });
  });

  it('Insert Staff Error', done => {
    const body = {
      lastName: faker.name.lastName(),
      firstName: faker.name.firstName(),
      username: faker.name.firstName() + faker.name.lastName(),
      email: faker.internet.email(),
      password: 'string',
      phoneNumber: 'string',
      staffRoleId: 1,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Staff/insertStaff`)
      .set('Authorization', staffToken)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 500);
        done();
      });
  });
  it('Insert Staff Success', done => {
    const body = {
      lastName: faker.name.lastName(),
      firstName: faker.name.firstName(),
      username: faker.name.firstName() + faker.name.lastName(),
      email: faker.internet.email() + Math.random(),
      password: 'string',
      phoneNumber: 'string',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Staff/insertStaff`)
      .set('Authorization', staffToken)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it('Update Staff Success', done => {
    const body = {
      id: staffId,
      data: {
        lastName: faker.name.firstName(),
        firstName: faker.name.lastName(),
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Staff/updateStaffById`)
      .set('Authorization', staffToken)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Delete Staff Success', done => {
    const body = {
      id: staffId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Staff/deleteStaffById`)
      .set('Authorization', staffToken)
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
