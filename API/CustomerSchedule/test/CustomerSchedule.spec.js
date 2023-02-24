/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const randomstring = require('randomstring');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const Model = require('../resourceAccess/CustomerScheduleResourceAccess');

const app = require('../../../server');

describe(`Tests ${Model.modelName}`, function () {
  let Scheduleid;
  let staffToken = '';
  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginStaff();
      staffToken = staffData.token;
      resolve();
    }).then(() => done());
  });

  ////Admin Customer Schedule
  it('Add CustomerSchedule', done => {
    const body = {
      customerIdentity: faker.name.findName(),
      customerPhone: randomstring.generate({ length: 11, charset: 'numeric' }),
      customerName: faker.name.firstName() + faker.name.lastName(),
      customerEmail: faker.internet.email(),
      customerScheduleDate: faker.date.past(),
      customerScheduleTime: '07:30',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerSchedule/insert`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        Scheduleid = res.body.data[0];
        done();
      });
  });

  it('Delete CustomerSchedule', done => {
    const body = {
      customerScheduleId: Scheduleid,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerSchedule/deleteById`)
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

  it('find by Id CustomerSchedule', done => {
    const body = {
      customerScheduleId: Scheduleid,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerSchedule/findById`)
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

  it('find all CustomerSchedule (no filter)', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerSchedule/find`)
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

  it('find all CustomerSchedule by filter', done => {
    const body = {
      filter: {
        customerPhone: randomstring.generate({
          length: 11,
          charset: 'numeric',
        }),
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerSchedule/find`)
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

  it('search CustomerSchedule', done => {
    const body = {
      searchText: 'string',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerSchedule/find`)
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

  it('find all CustomerSchedule (filter by time)', done => {
    const body = {
      filter: {
        customerScheduleTime: '07:30',
      },
      skip: 0,
      limit: 20,
      order: {
        key: 'createdAt',
        value: 'desc',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerSchedule/find`)
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

  it('find all CustomerSchedule (filter by date)', done => {
    const body = {
      filter: {
        customerScheduleDate: faker.date.past(),
      },
      skip: 0,
      limit: 20,
      order: {
        key: 'createdAt',
        value: 'desc',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerSchedule/find`)
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

  it('update by id CustomerSchedule', done => {
    const body = {
      customerScheduleId: Scheduleid,
      data: {
        customerIdentity: faker.name.findName(),
        customerPhone: randomstring.generate({
          length: 11,
          charset: 'numeric',
        }),
        customerName: faker.name.firstName() + faker.name.lastName(),
        customerEmail: faker.internet.email(),
        customerScheduleDate: faker.date.past(),
        customerScheduleTime: '07:30',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerSchedule/updateById`)
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
