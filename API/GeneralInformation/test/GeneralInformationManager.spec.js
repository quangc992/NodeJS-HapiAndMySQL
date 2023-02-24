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

const Model = require('../resourceAccess/GeneralInformationResourceAccess');

const app = require('../../../server');

describe(`Tests ${Model.modelName}`, function () {
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
        aboutUs: 'Bất động sản hot nhất hiện nay',
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
        questionAndAnwser: 'Bất động sản nào hot nhất hiện nay?',
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
        generalRule: 'Tuân thủ các quy định của chúng tôi',
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
});
