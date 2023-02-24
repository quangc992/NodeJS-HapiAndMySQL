/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');

chai.should();
chai.use(chaiHttp);

const app = require('../../../server');

describe(`Tests CustomerVisitRecord`, function () {
  let token = '';
  let customerVisitRecordId = 1;

  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginStaff();
      token = staffData.token;
      resolve();
    }).then(() => done());
  });

  it(`/CustomerVisitRecord/insert`, done => {
    const body = {
      customerVisitRecordFullname: faker.name.findName(),
      customerVisitRecordNote: faker.lorem.word(),
      customerVisitRecordEmail: faker.internet.email(),
    };

    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerVisitRecord/insert`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        customerVisitRecordId = res.body.data[0];
        done();
      });
  });

  it('/CustomerVisitRecord/findById', done => {
    const body = {
      id: customerVisitRecordId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerVisitRecord/findById`)
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

  it('/CustomerVisitRecord/find', done => {
    const body = {
      filter: {},
      skip: 0,
      limit: 20,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerVisitRecord/find`)
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

  it('/CustomerVisitRecord/updateById', done => {
    const body = {
      id: customerVisitRecordId,
      data: {
        customerVisitRecordFullname: faker.name.findName(),
        customerVisitRecordEmail: faker.internet.email(),
        customerVisitRecordPhoneNumber: '0123123123',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerVisitRecord/updateById`)
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

  it('/CustomerVisitRecord/deleteById', done => {
    const body = {
      id: customerVisitRecordId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerVisitRecord/deleteById`)
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
});
