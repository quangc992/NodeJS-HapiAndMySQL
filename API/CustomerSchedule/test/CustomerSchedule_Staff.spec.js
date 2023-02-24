/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

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
  let agencyToken = '';
  before(done => {
    new Promise(async function (resolve, reject) {
      let agencyData = await TestFunctions.loginAgency();
      agencyToken = agencyData.token;
      resolve();
    }).then(() => done());
  });

  ////Customer Schedule
  it('Staff Add CustomerSchedule', done => {
    const body = {
      customerIdentity: faker.name.findName(),
      customerPhone: randomstring.generate({ length: 11, charset: 'numeric' }),
      customerName: faker.name.firstName() + faker.name.lastName(),
      customerEmail: faker.internet.email(),
      customerScheduleDate: faker.date.past(),
      customerScheduleTime: '07:30',
      stationsId: 1,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerSchedule/staff/insertSchedule`)
      .set('Authorization', `Bearer ${agencyToken}`)
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

  it('Staff find by Id CustomerSchedule', done => {
    const body = {
      customerScheduleId: Scheduleid,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerSchedule/staff/getDetail`)
      .set('Authorization', `Bearer ${agencyToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Staff find all CustomerSchedule (no filter)', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerSchedule/staff/getList`)
      .set('Authorization', `Bearer ${agencyToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Staff find all CustomerSchedule by filter', done => {
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
      .post(`/CustomerSchedule/staff/getList`)
      .set('Authorization', `Bearer ${agencyToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Staff find all CustomerSchedule (filter by time)', done => {
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
      .post(`/CustomerSchedule/staff/getList`)
      .set('Authorization', `Bearer ${agencyToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Staff find all CustomerSchedule (filter by date)', done => {
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
      .post(`/CustomerSchedule/staff/getList`)
      .set('Authorization', `Bearer ${agencyToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Staff cancel by id CustomerSchedule', done => {
    const body = {
      customerScheduleId: Scheduleid,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerSchedule/staff/cancelSchedule`)
      .set('Authorization', `Bearer ${agencyToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Staff accept by id CustomerSchedule', done => {
    const body = {
      customerScheduleId: Scheduleid,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerSchedule/staff/acceptSchedule`)
      .set('Authorization', `Bearer ${agencyToken}`)
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
