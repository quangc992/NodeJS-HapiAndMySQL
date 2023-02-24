/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);
const expect = chai.expect;

const Model = require('../resourceAccess/PaymentDepositTransactionResourceAccess');

const PAYMENT_STATUS = require('../PaymentDepositTransactionConstant').DEPOSIT_TRX_STATUS;

describe(`Tests ${Model.modelName}`, () => {
  let staffToken = '';
  let userToken = '';
  let paymentId = '';
  let userData = {};
  let userId = 0;
  let staffId = 0;

  before(done => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      userData = await TestFunctions.loginUser();
      staffToken = staffData.token;
      staffId = staffData.staffId;
      userToken = userData.token;
      userId = userData.appUserId;
      userData = userData;
      resolve();
    }).then(() => done());
  });
  it('user request new deposit payment (to approve)', done => {
    const body = {
      paymentAmount: 500000,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${Model.modelName}/user/requestDeposit`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        paymentId = res.body.data[0];
        done();
      });
  });
  it('find list of deposit payment (filter user id)', done => {
    const body = {
      filter: {
        appUserId: userId,
      },
      skip: 0,
      limit: 20,
      order: {
        key: 'createdAt',
        value: 'desc',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${Model.modelName}/find`)
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
  it('user get list of deposit payment by startDate', done => {
    const body = {
      startDate: moment().subtract(5, 'day').toDate(),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${Model.modelName}/user/depositHistory`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        //bảo đảm phải có lịch sử (vì các case ở trên đã tạo ra cho user này)
        expect(res.body.data.length).to.not.equal(0);
        done();
      });
  });

  it('user get list of deposit payment by endDate', done => {
    const body = {
      endDate: moment().add(5, 'day').toDate(),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${Model.modelName}/user/depositHistory`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        //bảo đảm phải có lịch sử (vì các case ở trên đã tạo ra cho user này)
        expect(res.body.data.length).to.not.equal(0);
        done();
      });
  });

  it('user get list of deposit payment', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${Model.modelName}/user/depositHistory`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        //bảo đảm phải có lịch sử (vì các case ở trên đã tạo ra cho user này)
        expect(res.body.data.length).to.not.equal(0);
        done();
      });
  });
});
