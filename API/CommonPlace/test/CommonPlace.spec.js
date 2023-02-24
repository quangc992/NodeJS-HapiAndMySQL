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

const Model = require('../resourceAccess/CommonPlaceResourceAccess');

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

  it('Insert place Success', done => {
    const body = {
      commonPlaceName: faker.name.firstName(),
      lat: Math.round(Math.random() * 999),
      lng: Math.round(Math.random() * 999),
      commonPlaceType: 'PARK',
      areaProvinceId: 2,
      areaDistrictId: 3,
      areaWardId: 5,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateUtil/insertCommonPlace`)
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

  it('Update Place Success', done => {
    const body = {
      commonPlaceId: id,
      data: {
        isDeleted: 1,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateUtil/updateCommonPlaceById`)
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

  it('Delete Place Success', done => {
    const body = {
      commonPlaceId: id,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateUtil/deleteCommonPlaceById`)
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
