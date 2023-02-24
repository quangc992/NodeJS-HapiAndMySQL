/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

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

describe(`Tests PlayGameExchange`, () => {
  let staffToken = '';
  let paymentMethodId = '';
  let userToken = '';
  let testUserId;
  let testPlayerId;
  let transactionId;
  let playerToken;
  let testDepositPaymentId;
  before(done => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      staffToken = `Bearer ${staffData.token}`;
      let userData = await TestFunctions.loginUser();
      testUserId = userData.appUserId;
      userToken = `Bearer ${userData.token}`;
      let playerData = await TestFunctions.loginUser('player', 'player');
      playerToken = `Bearer ${playerData.token}`;
      testPlayerId = playerData.appUserId;
      resolve();
    }).then(() => done());
  });

  it('user (agency - no refer username) request new PaymentExchangeTransaction', done => {
    const body = {
      paymentAmount: 1,
      walletBalanceUnitId: 2, //always available
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/user/requestExchange`)
      .set('Authorization', `${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        transactionId = res.body.data[0];
        done();
      });
  });

  it('staff approveExchangeTransaction', done => {
    const body = {
      id: transactionId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/approveExchangeTransaction`)
      .set('Authorization', `${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('user (agency - no refer username) request new PaymentExchangeTransaction', done => {
    const body = {
      paymentAmount: 1,
      walletBalanceUnitId: 2, //always available
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/user/requestExchange`)
      .set('Authorization', `${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        transactionId = res.body.data[0];
        done();
      });
  });

  it('staff denyExchangeTransaction', done => {
    const body = {
      id: transactionId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/denyExchangeTransaction`)
      .set('Authorization', `${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('staff insert new deposit payment (to approve)', done => {
    const body = {
      appUserId: testPlayerId,
      paymentAmount: 500000,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentDepositTransaction/insert`)
      .set('Authorization', `${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        testDepositPaymentId = res.body.data[0];
        done();
      });
  });

  it('staff approve deposit payment manually', done => {
    const body = {
      id: testDepositPaymentId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentDepositTransaction/approveDepositTransaction`)
      .set('Authorization', `${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('player buy package', done => {
    const body = {
      paymentServicePackageId: 1,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/user/buyServicePackage`)
      .set('Authorization', `${playerToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('player (normal user - have refer username) request new PaymentExchangeTransaction', done => {
    const body = {
      paymentAmount: 1,
      walletBalanceUnitId: 2, //always available
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/user/requestExchange`)
      .set('Authorization', `${playerToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        transactionId = res.body.data[0];
        done();
      });
  });

  it('user accept PaymentExchangeTransaction', done => {
    const body = {
      id: transactionId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/user/acceptExchangeRequest`)
      .set('Authorization', `${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        transactionId = res.body.data[0];
        done();
      });
  });

  it('player (normal user - have refer username) request new PaymentExchangeTransaction', done => {
    const body = {
      paymentAmount: 1,
      walletBalanceUnitId: 2, //always available
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/user/requestExchange`)
      .set('Authorization', `${playerToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        transactionId = res.body.data[0];
        done();
      });
  });

  it('user deny PaymentExchangeTransaction', done => {
    const body = {
      id: transactionId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/user/denyExchangeRequest`)
      .set('Authorization', `${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        transactionId = res.body.data[0];
        done();
      });
  });

  it('user get list PaymentExchangeTransaction', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/user/exchangeHistory`)
      .set('Authorization', `${playerToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('user get list request PaymentExchangeTransaction', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/user/viewExchangeRequests`)
      .set('Authorization', `${userToken}`)
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
