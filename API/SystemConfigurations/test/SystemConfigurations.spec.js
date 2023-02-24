/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
// const fs = require('fs');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const app = require('../../../server');

describe(`Tests SystemConfigurations`, () => {
  let token = '';
  before(done => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      token = staffData.token;
      resolve();
    }).then(() => done());
  });

  it('find system configuration', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/SystemConfigurations/find`)
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

  it('user/getDetail system configuration', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/SystemConfigurations/user/getDetail`)
      .set('Authorization', ``)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Update system version', done => {
    const body = {
      data: {
        systemVersion: '1.0.0',
      },
    };

    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/SystemConfigurations/updateConfigs`)
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

  it('Update infomation', done => {
    const body = {
      data: {
        address: '567 TPHCM VietNam',
        hotlineNumber: '123456789',
      },
    };

    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/SystemConfigurations/updateConfigs`)
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

  it('Update image banner', done => {
    const body = {
      data: {
        bannerImage1: `https://${process.env.HOST_NAME}/uploads/sample_banner.png`,
        bannerImage2: `https://${process.env.HOST_NAME}/uploads/sample_banner.png`,
        bannerImage3: `https://${process.env.HOST_NAME}/uploads/sample_banner.png`,
      },
    };

    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/SystemConfigurations/updateConfigs`)
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
