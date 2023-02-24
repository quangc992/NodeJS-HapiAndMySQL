/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const modelName = 'GeneralInformation';

const app = require('../../../server');

describe(`Tests ${modelName}`, function () {
  let userToken = '';
  before(done => {
    new Promise(async function (resolve, reject) {
      let userdata = await TestFunctions.loginUser();
      userToken = userdata.token;
      resolve();
    }).then(() => done());
  });

  it('user getAboutUs', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/GeneralInformation/user/getAboutUs`)
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
  it('user getAboutUs ( no token )', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/GeneralInformation/user/getAboutUs`)
      // .set("Authorization", `Bearer ${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it('user getAppPolicy', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/GeneralInformation/user/getAppPolicy`)
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
  it('user getAppPolicy ( no token )', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/GeneralInformation/user/getAppPolicy`)
      // .set("Authorization", `Bearer ${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('user getGeneralRule', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/GeneralInformation/user/getGeneralRule`)
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
  it('user getGeneralRule ( no token )', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/GeneralInformation/user/getGeneralRule`)
      // .set("Authorization", `Bearer ${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('user getQuestionAndAnwser', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/GeneralInformation/user/getQuestionAndAnwser`)
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
  it('user getQuestionAndAnwser ( no token )', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/GeneralInformation/user/getQuestionAndAnwser`)
      // .set("Authorization", `Bearer ${userToken}`)
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
