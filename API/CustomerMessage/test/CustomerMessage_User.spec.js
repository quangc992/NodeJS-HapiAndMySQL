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
  let userToken = '';
  before(done => {
    new Promise(async function (resolve, reject) {
      let userData = await TestFunctions.loginUser();
      userToken = userData.token;
      done();
      resolve();
    });
  });

  it('/CustomerMessage/user/getListNotification', done => {
    const body = {
      filter: {},
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerMessage/user/getListNotification`)
      .set('Authorization', `Bearer ${userToken}`)
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
  it('/CustomerMessage/user/getDetailMessage', done => {
    const body = {
      id: messageId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerMessage/user/getDetailMessage`)
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
  it('/CustomerMessage/user/getUnreadNotificationCount', done => {
    const body = {
      filter: {},
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerMessage/user/getUnreadNotificationCount`)
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
  it('/CustomerMessage/user/readAllNotification', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerMessage/user/readAllNotification`)
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
  it('/CustomerMessage/user/readNotification', done => {
    const body = {
      id: messageId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerMessage/user/readNotification`)
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
  // it('/CustomerMessage/user/deleteAllNotification', done => {
  //   const body = {};
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/CustomerMessage/user/deleteAllNotification`)
  //     .set("Authorization", `Bearer ${userToken}`)
  //     .send(body)
  //     .end((err, res) => {
  //       if (err) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       done();
  //     });
  // });
  // it('/CustomerMessage/user/deleteNotification', done => {
  //   const body = {
  //     "id": messageId
  //   };
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/CustomerMessage/user/deleteNotification`)
  //     .set("Authorization", `Bearer ${userToken}`)
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
