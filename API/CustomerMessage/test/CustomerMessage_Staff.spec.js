/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const modelName = 'CustomerMessage';

const app = require('../../../server');

describe(`Tests ${modelName}`, function () {
  let messageId = 0;
  let agencyToken = '';
  before(done => {
    new Promise(async function (resolve, reject) {
      let agencyData = await TestFunctions.loginAgency();
      agencyToken = agencyData.token;
      done();
      resolve();
    });
  });

  it('/CustomerMessage/staff/getListNotification', done => {
    const body = {
      filter: {},
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerMessage/staff/getListNotification`)
      .set('Authorization', `Bearer ${agencyToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        if (res.body.data && res.body.data.data.length > 0) {
          messageId = res.body.data.data[0].customerMessageId;
        }

        done();
      });
  });
  it('/CustomerMessage/staff/getDetailMessage', done => {
    const body = {
      id: messageId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerMessage/staff/getDetailMessage`)
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
  it('/CustomerMessage/staff/getUnreadNotificationCount', done => {
    const body = {
      filter: {},
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerMessage/staff/getUnreadNotificationCount`)
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
  it('/CustomerMessage/staff/readAllNotification', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerMessage/staff/readAllNotification`)
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
  it('/CustomerMessage/staff/readNotification', done => {
    const body = {
      id: messageId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerMessage/staff/readNotification`)
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
  // it('/CustomerMessage/staff/deleteAllNotification', done => {
  //   const body = {};
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/CustomerMessage/staff/deleteAllNotification`)
  //     .set("Authorization", `Bearer ${agencyToken}`)
  //     .send(body)
  //     .end((err, res) => {
  //       if (err) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       done();
  //     });
  // });
  // it('/CustomerMessage/staff/deleteNotification', done => {
  //   const body = {
  //     "id": messageId
  //   };
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/CustomerMessage/staff/deleteNotification`)
  //     .set("Authorization", `Bearer ${agencyToken}`)
  //     .send(body)
  //     .end((err, res) => {
  //       if (err) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       done();
  //     });
  // });
});
