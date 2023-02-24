/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const chai = require('chai');
const chaiHttp = require('chai-http');
const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
require('dotenv').config();
chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const Model = require('../resourceAccess/ProductOrderResourceAccess');
const { WALLET_TYPE } = require('../../Wallet/WalletConstant');

describe(`Tests ${Model.modelName}`, function () {
  const STOCK_CODE = 'USDT';
  let userToken = '',
    userId = 0,
    staffToken = '';
  let productId, productOrderId;
  let requestExchangeId;

  function checkExistingProduct() {
    return new Promise(resolve => {
      const body = {
        filter: {
          productCode: STOCK_CODE,
        },
      };
      chai
        .request(`0.0.0.0:${process.env.PORT}`)
        .post(`/Product/find`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send(body)
        .end((err, res) => {
          if (err) {
            console.error(err);
            resolve(undefined);
            return;
          }
          resolve(res.body.data.data[0].productId);
        });
    });
  }

  before(done => {
    new Promise(async function (resolve, reject) {
      let userData = await TestFunctions.loginUserEmail();
      userToken = userData.token;
      userId = userData.appUserId;
      let staffData = await TestFunctions.loginStaff();
      staffToken = staffData.token;
      productId = await checkExistingProduct();
      resolve();
    }).then(() => done());
  });

  it('Create product', done => {
    if (!productId) {
      const body = {
        productName: STOCK_CODE,
        productCode: STOCK_CODE,
        productDescription: STOCK_CODE,
        productShortDescription: STOCK_CODE,
      };
      chai
        .request(`0.0.0.0:${process.env.PORT}`)
        .post(`/Product/insert`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send(body)
        .end((err, res) => {
          if (err) {
            console.error(err);
          }
          checkResponseStatus(res, 200);
          productId = res.body.data[0];
          done();
        });
    } else {
      done();
    }
  });

  it('Increasing balance for user', done => {
    const body = {
      appUserId: userId,
      paymentAmount: 4000,
      walletType: WALLET_TYPE.USDT,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Wallet/increaseBalance`)
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

  it('Create buy order', done => {
    const body = {
      orderItemQuantity: 100,
      orderItemPrice: 38.33,
      productId: productId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/ProductOrder/user/userPlaceOrder`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        productOrderId = res.body.data;
        done();
      });
  });

  // it('Exchange currency by order', done => {
  //   const body = {
  //     productOrderId: productOrderId,
  //     amount: 100
  //   };
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/ProductOrder/user/exchangeCurrencyByOrder`)
  //     .set('Authorization', `Bearer ${userToken}`)
  //     .send(body)
  //     .end((err, res) => {
  //       if (err) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       requestExchangeId = res.body.data[0];
  //       done();
  //     });
  // });

  // it('Accept request exchange currency', done => {
  //   const body = {
  //     id: requestExchangeId
  //   };
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/PaymentExchangeTransaction/user/acceptExchangeRequest`)
  //     .set('Authorization', `Bearer ${userToken}`)
  //     .send(body)
  //     .end((err, res) => {
  //       if (err) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       done();
  //     });
  // });
});
