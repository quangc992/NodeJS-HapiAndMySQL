/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');

chai.should();
chai.use(chaiHttp);

const app = require('../../../server');

describe(`Tests StationDocuments`, function () {
  let token = '';
  let stationDocumentsId = 1;

  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginStaff();
      token = staffData.token;
      resolve();
    }).then(() => done());
  });

  it(`/StationDocuments/insert`, done => {
    const body = {
      documentName: 'Tên của tài liệu',
      documentType: 'tài liệu',
      fileType: 'docx',
      fileUrl: 'documents/tailieu.docx',
    };

    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StationDocuments/insert`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        stationDocumentsId = res.body.data[0];
        done();
      });
  });

  it('/StationDocuments/findById', done => {
    const body = {
      id: stationDocumentsId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StationDocuments/findById`)
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

  it('/StationDocuments/find', done => {
    const body = {
      filter: {},
      skip: 0,
      limit: 20,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StationDocuments/find`)
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

  it('/StationDocuments/updateById', done => {
    const body = {
      id: stationDocumentsId,
      data: {
        documentName: 'Tên tài liệu mới',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StationDocuments/updateById`)
      .send(body)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('/StationDocuments/deleteById', done => {
    const body = {
      id: stationDocumentsId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StationDocuments/deleteById`)
      .send(body)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
});
