/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const chai = require('chai');
const chaiHttp = require('chai-http');
const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
const Constant = require('../StakingPackageConstant');
chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);
const app = require('../../../server');

describe(`Tests staking`, () => {
  let staffToken = '';
  let userToken = '';
  let id;
  before(done => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      staffToken = staffData.token;
      let userData = await TestFunctions.loginUser();
      userToken = userData.token;
      resolve();
    }).then(() => done());
  });

  it('POST /StakingPackage/user/getList', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StakingPackage/user/getList`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        id = res.body.data.data[0].stakingPackageId;
        done();
      });
  });

  it('POST /StakingPackage/user/requestStaking', done => {
    const body = {
      stakingId: id,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StakingPackage/user/requestStaking`)
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

  it('POST /StakingPackage/user/historyStaking', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/StakingPackage/user/historyStaking`)
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
});
