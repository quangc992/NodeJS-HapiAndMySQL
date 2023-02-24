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

describe(`Tests PaymentExchangeTransaction`, () => {
  let staffToken = '';
  let userToken = '';
  let testUserId;
  before(done => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      staffToken = `Bearer ${staffData.token}`;
      let userData = await TestFunctions.loginUser();
      testUserId = userData.appUserId;
      userToken = `Bearer ${userData.token}`;
      resolve();
    }).then(() => done());
  });

  it('find PaymentExchangeTransaction', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/find`)
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
  it('find PaymentExchangeTransaction (with filter)', done => {
    const body = {
      filter: {},
      skip: 0,
      startDate: '2021-11-30T17:00:00.000Z',
      endDate: '2021-12-31T16:59:59.999Z',
      limit: 20,
      order: { key: 'createdAt', value: 'desc' },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/find`)
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
  it('find PaymentExchangeTransaction (with searchText)', done => {
    const body = { filter: {}, skip: 0, searchText: 'aaa', limit: 20, order: { key: 'createdAt', value: 'desc' } };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/find`)
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

  // it('POST /PaymentExchangeTransaction/exchangeHistory', done => {
  //   const body = {
  //   };
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/PaymentExchangeTransaction/exchangeHistory`)
  //     .set("Authorization", `${userToken}`)
  //     .send(body)
  //     .end((err, res) => {
  //       if (err) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       done();
  //     });
  // });

  // it('POST /PaymentExchangeTransaction/receiveHistory', done => {
  //   const body = {
  //   };
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/PaymentExchangeTransaction/receiveHistory`)
  //     .set("Authorization", `${userToken}`)
  //     .send(body)
  //     .end((err, res) => {
  //       if (err) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       done();
  //     });
  // });

  // it('user (agency - no refer username) request new PaymentExchangeTransaction', done => {
  //   const body = {
  //     paymentAmount: 1,
  //     walletBalanceUnitId: 2 //always available
  //   };
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/PaymentExchangeTransaction/user/requestExchange`)
  //     .set("Authorization", `${userToken}`)
  //     .send(body)
  //     .end((err, res) => {
  //       if (err) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       transactionId = res.body.data[0];
  //       done();
  //     });
  // });

  it('user request new PaymentExchangeTransaction POINT', done => {
    const body = {
      paymentAmount: 1,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/user/ExchangePOINT`)
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
  it('user request new PaymentExchangeTransaction FAC', done => {
    const body = {
      paymentAmount: 1,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentExchangeTransaction/user/ExchangeFAC`)
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

  // it('POST /PaymentExchangeTransaction/viewExchangeRequests', done => {
  //   const body = {
  //   };
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/PaymentExchangeTransaction/viewExchangeRequests`)
  //     .set("Authorization", `${userToken}`)
  //     .send(body)
  //     .end((err, res) => {
  //       if (err) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       approveTransactionId = res.body.data.data[0].paymentExchangeTransactionId;
  //       denyTransactionId = res.body.data.data[1].paymentExchangeTransactionId;
  //       done();
  //     });
  // });

  // it('POST /PaymentExchangeTransaction/approveExchangeTransaction', done => {
  //   const body = {
  //     id: approveTransactionId,
  //   };
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/PaymentExchangeTransaction/approveExchangeTransaction`)
  //     .set("Authorization", `${staffToken}`)
  //     .send(body)
  //     .end((err, res) => {
  //       if (err) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       done();
  //     });
  // });

  // it('POST /PaymentExchangeTransaction/denyExchangeTransaction', done => {
  //   const body = {
  //     id: denyTransactionId,
  //   };
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/PaymentExchangeTransaction/denyExchangeTransaction`)
  //     .set("Authorization", `${staffToken}`)
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
