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
  let token = '';
  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginStaff();
      token = staffData.token;
      resolve();
    }).then(() => done());
  });

  it('get data', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/GeneralInformation/find`)
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

  it('Update information about us', done => {
    const body = {
      data: {
        aboutUs: '<h1>Giới thiệu về chúng tôi<h1>',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/GeneralInformation/updateAboutUs`)
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

  it('Update question and anwser', done => {
    const body = {
      data: {
        questionAndAnwser: '<h1>Các câu hỏi thường gặp<h1>',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/GeneralInformation/updateQuestionAndAnwser`)
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

  it('Update general rule', done => {
    const body = {
      data: {
        generalRule: '<h1>Quy định chung<h1>',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/GeneralInformation/updateGeneralRule`)
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

  it('Update app policy', done => {
    const body = {
      data: {
        appPolicy: '<h1>Điều khoản sử dụng<h1>',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/GeneralInformation/updateAppPolicy`)
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
