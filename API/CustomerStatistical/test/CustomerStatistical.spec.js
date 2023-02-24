/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const app = require('../../../server');

describe(`Tests customer Statistical `, function () {
  let token = '';
  let staffToken = '';
  before(done => {
    new Promise(async function (resolve, reject) {
      let userData = await TestFunctions.loginUser();
      token = userData.token;
      let staffData = await TestFunctions.loginStaff();
      staffToken = staffData.token;
      resolve();
    }).then(() => done());
  });
  it(`Report`, done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerStatistical/report`)
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

  it(`Report by startDate and EndDate`, done => {
    const body = {
      startDate: '2021-10-20T23:43:53.000Z',
      endDate: '2021-10-23T23:43:53.000Z',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerStatistical/report`)
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

  it(`Report by startDate`, done => {
    const body = {
      startDate: '2021-10-20T23:43:53.000Z',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerStatistical/report`)
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

  it(`Report by endDate`, done => {
    const body = {
      endDate: '2021-10-20T23:43:53.000Z',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerStatistical/report`)
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

  it(`Report by Date failse format`, done => {
    const body = {
      startDate: '2021',
      endDate: '2021',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerStatistical/report`)
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

  it(`Report by startDate > endDate`, done => {
    const body = {
      startDate: '2022-10-20T23:43:53.000Z',
      endDate: '2021-10-23T23:43:53.000Z',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerStatistical/report`)
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

  it(`Report by startDate ký tự đặt biệt`, done => {
    const body = {
      startDate: "' or '1=1--",
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerStatistical/report`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 500);
        done();
      });
  });
  it(`Report by Date failse is format`, done => {
    const body = {
      startDate: 'asdb',
      endDate: 'asgdgk',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerStatistical/report`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 500);
        done();
      });
  });

  it(`Report by Date failse is format`, done => {
    const body = {
      startDate: 'asdb',
      endDate: 'asgdgk',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerStatistical/report`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 500);
        done();
      });
  });

  it(`Report by Date failse is format year`, done => {
    const body = {
      startDate: '20/10/200006',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerStatistical/report`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 500);
        done();
      });
  });

  it(`Report all station by startDate and EndDate`, done => {
    const body = {
      startDate: '2021-10-20T23:43:53.000Z',
      endDate: '2021-10-23T23:43:53.000Z',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerStatistical/reportAllStation`)
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
