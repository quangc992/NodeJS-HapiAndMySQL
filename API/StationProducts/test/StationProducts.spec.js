/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
const modelName = 'StationProducts';

const app = require('../../../server');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

describe(`Tests ${modelName}`, function () {
  let stationProductsId;
  let staffToken = '';
  let userToken = '';
  let fakeUserName = faker.name.firstName() + faker.name.lastName();
  fakeUserName = fakeUserName.replace("'", '');
  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginStaff();
      staffToken = staffData.token;
      let userData = await TestFunctions.loginUser();
      userToken = userData.token;
      resolve();
    }).then(() => done());
  });

  it(`insert ${modelName}`, done => {
    let body = {
      stationProductsTitle: 'Sốt salad từ chanh, dầu olive, mật ong',
      stationProductsContent: `Công thức cơ bản này vốn thay thế cho những loại dầu dấm chua ngọt làm sẵn trên thị trường. Khi trộn đều nước cốt chanh, mật ong và dầu olive ta thu được hỗn hợp có mùi thơm dịu nhẹ, chua chua ăn với salad rất ngon.
      \r\nCách làm: Khuấy đều 1 thìa canh dầu olive + 2 thìa nước cốt chanh + 1 thìa cà phê mật ong với nhau rồi rưới đều lên salad.
      \r\nVới thực đơn giảm cân 2000 calo/ngày, mỗi phần salad trung bình chỉ có 500 – 600 calo (đã bao gồm rau củ, protein và một ít chất béo tốt cho cơ thể). Thế nên ăn salad nhiều bữa trong ngày cũng không lo vượt quá chỉ tiêu của kế hoạch giảm cân.
      \r\nKhuyên dùng: Buổi sáng hằng ngày.`,
      productAttribute1: '15',
      productAttribute2: '1',
      productAttribute3: '365',
      stationProductsAvatar: `https://${process.env.HOST_NAME}/uploads/sample_product_avatar.png`,
      stationProductsCategory: '1',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/insert`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        stationProductsId = res.body.data[0];
        done();
      });
  });

  it(`find ${modelName}`, done => {
    const body = {
      filter: {},
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`findById ${modelName}`, done => {
    const body = {
      id: stationProductsId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/findById`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`updateById ${modelName}`, done => {
    const body = {
      id: stationProductsId,
      data: {
        stationProductsTitle: 'Test Product',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/updateById`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`deleteById ${modelName}`, done => {
    const body = {
      id: stationProductsId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/deleteById`)
      .set('Authorization', `Bearer ${staffToken}`)
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
