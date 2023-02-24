/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
const fs = require('fs');
chai.should();
chai.use(chaiHttp);

const Model = require('../resourceAccess/NewsResourceAccess');

const app = require('../../../server');

describe(`Tests ${Model.modelName}`, function () {
  let id;
  let adminToken = '';
  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginStaff();
      adminToken = 'Bearer ' + staffData.token;
      resolve();
    }).then(() => done());
  });

  it('insert news', done => {
    const body = {
      newsTitle: faker.name.title(),
      shortDescription: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      introduceImage: faker.image.imageUrl(),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/News/insert`)
      .set('Authorization', adminToken)
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

  it('get list news', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/News/find`)
      .set('Authorization', adminToken)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it('Update News by id', done => {
    let content = faker.commerce.productDescription();
    for (let i = 0; i < 5; i++) {
      content += content + '\r\n';
    }
    const body = {
      id: id,
      data: {
        newsTitle: faker.name.title(),
        shortDescription: faker.commerce.productName(),
        description: content,
        introduceImage: faker.image.imageUrl(),
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/News/updateById`)
      .set('Authorization', adminToken)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('get news by id', done => {
    const body = {
      id: id,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/News/findbyid`)
      .set('Authorization', adminToken)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('user get list news', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/News/userGetListNews`)
      .set('Authorization', '')
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('user get news by id', done => {
    const body = {
      id: id,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/News/userGetNewsDetail`)
      .set('Authorization', '')
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('hide news by id', done => {
    const body = {
      id: id,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/News/hideNewsById`)
      .set('Authorization', adminToken)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('show news by id', done => {
    const body = {
      id: id,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/News/showNewsById`)
      .set('Authorization', adminToken)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Delete news by id', done => {
    const body = {
      id: id,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/News/deleteById`)
      .set('Authorization', adminToken)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Upload image for news', done => {
    fs.readFile('uploads/sampleAvatar.jpg', function read(err, data) {
      if (err) {
        return null;
      }

      var base64data = Buffer.from(data, 'binary').toString('base64');
      const body = {
        imageData: base64data,
        imageFormat: 'jpg',
      };
      chai
        .request(`0.0.0.0:${process.env.PORT}`)
        .post(`/News/uploadImage`)
        .set('Authorization', adminToken)
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
});
