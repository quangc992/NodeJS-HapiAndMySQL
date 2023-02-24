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

const Model = require('../resourceAccess/RealEstateProjectStatusResourceAccess');

const app = require('../../../server');

describe(`Tests ${Model.modelName}`, function () {
  let id;
  let token = '';
  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginStaff();
      token = staffData.token;
      resolve();
    }).then(() => done());
  });

  it('insert real estate project status', done => {
    const body = {
      projectStatusName: 'Đang thi công',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProjectStatus/insert`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        id = res.body.data[0];
        done();
      });
  });

  it('get list all real estate project status', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProjectStatus/find`)
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

  it('Delete real estate project status by id', done => {
    const body = {
      id: id,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProjectStatus/deleteById`)
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

  it('Update real estate project status by id', done => {
    const body = {
      id: id,
      data: {
        projectStatusName: 'Đã xây xong',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProjectStatus/updateById`)
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

  it('get real estate project status by id', done => {
    const body = {
      id: id,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProjectStatus/findbyid`)
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
