/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const { loginStaff } = require('../../Common/test/CommonTestFunctions');

const { checkResponseStatus } = require('../../Common/test/Common');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const Model = require('../resourceAccess/RealEstateUtilitiesResourceAccess');

const app = require('../../../server');

describe(`Tests ${Model.modelName}`, function () {
  let token = '';
  let id = 0;

  before(done => {
    new Promise(async function (resolve, reject) {
      resolve();
    }).then(() => done());
  });

  it('Login Staff', done => {
    loginStaff().then(result => {
      if (result && Object.keys(result).length > 0) {
        token = `Bearer ${result.token}`;
        done();
      }
    });
  });

  it('Insert utilities Success', done => {
    const body = {
      realEstateUtilitiesName: 'string',
      realEstateCategoryId: 1,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateUtil/insertRealEstateUtil`)
      .set('Authorization', token)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        if (res && res.body && res.body.statusCode === 200) {
          id = res.body.data[0];
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Delete utilities Success', done => {
    const body = {
      realEstateUtilitiesId: id,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateUtil/deleteRealEstateUtilById`)
      .set('Authorization', token)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Update utilities Success', done => {
    const body = {
      realEstateUtilitiesId: id,
      data: {
        realEstateUtilitiesName: 'string',
        realEstateCategoryId: 2,
        isDeleted: 1,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateUtil/updateRealEstateUtilById`)
      .set('Authorization', token)
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
