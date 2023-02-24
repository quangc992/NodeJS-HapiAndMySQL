/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const chai = require('chai');
const chaiHttp = require('chai-http');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
const { WALLET_TYPE } = require('../WalletConstant');
const app = require('../../../server');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

describe(`Tests Wallet`, () => {
  let staffToken = '';
  let bodyAdjustBalance = {};
  before(done => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      staffToken = `Bearer ${staffData.token}`;
      let userData = await TestFunctions.loginUser();
      bodyAdjustBalance = {
        appUserId: userData.appUserId,
        paymentAmount: 100,
      };
      resolve();
    }).then(() => done());
  });

  it('bonus FAC', done => {
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Wallet/increaseBalance`)
      .set('Authorization', `${staffToken}`)
      .send({
        ...bodyAdjustBalance,
        walletType: WALLET_TYPE.FAC,
      })
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('decrease FAC', done => {
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Wallet/decreaseBalance`)
      .set('Authorization', `${staffToken}`)
      .send({
        ...bodyAdjustBalance,
        walletType: WALLET_TYPE.FAC,
      })
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('bonus Point', done => {
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Wallet/increaseBalance`)
      .set('Authorization', `${staffToken}`)
      .send({
        ...bodyAdjustBalance,
        walletType: WALLET_TYPE.POINT,
      })
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('decrease Point', done => {
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Wallet/decreaseBalance`)
      .set('Authorization', `${staffToken}`)
      .send({
        ...bodyAdjustBalance,
        walletType: WALLET_TYPE.FAC,
      })
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('bonus USDT', done => {
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Wallet/increaseBalance`)
      .set('Authorization', `${staffToken}`)
      .send({
        ...bodyAdjustBalance,
        walletType: WALLET_TYPE.USDT,
      })
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('decrease USDT', done => {
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Wallet/decreaseBalance`)
      .set('Authorization', `${staffToken}`)
      .send({
        ...bodyAdjustBalance,
        walletType: WALLET_TYPE.USDT,
      })
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('bonus BTC', done => {
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Wallet/increaseBalance`)
      .set('Authorization', `${staffToken}`)
      .send({
        ...bodyAdjustBalance,
        walletType: WALLET_TYPE.BTC,
      })
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
});
