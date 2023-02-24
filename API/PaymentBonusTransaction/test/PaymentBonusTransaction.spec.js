/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);
const expect = chai.expect;

const modelName = 'PaymentBonusTransaction';
const app = require('../../../server');

const PAYMENT_STATUS = require('../PaymentBonusTransactionConstant').BONUS_TRX_STATUS;

describe(`Tests ${modelName}`, () => {
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

  it('POST /PaymentBonusTransaction/insert', done => {
    const body = {
      appUserId: userId,
      paymentAmount: 500000,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentBonusTransaction/insert`)
      .set('Authorization', `Bearer ${staffToken}`)
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

  it('staff insert new bonus payment (to approve)', done => {
    const body = {
      appUserId: userId,
      paymentAmount: 500000,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentBonusTransaction/insert`)
      .set('Authorization', `Bearer ${staffToken}`)
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

  it('POST /PaymentBonusTransaction/approveBonusTransaction', done => {
    const body = {
      id: paymentId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentBonusTransaction/approveBonusTransaction`)
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

  it('staff insert new bonus payment (to reject)', done => {
    const body = {
      appUserId: userId,
      paymentAmount: 500000,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentBonusTransaction/insert`)
      .set('Authorization', `Bearer ${staffToken}`)
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

  it('POST /PaymentBonusTransaction/denyBonusTransaction', done => {
    const body = {
      id: paymentId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentBonusTransaction/denyBonusTransaction`)
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

  it('POST /PaymentBonusTransaction/findById', done => {
    const body = {
      id: paymentId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentBonusTransaction/findById`)
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

  it('POST /PaymentBonusTransaction/deleteById', done => {
    const body = {
      id: paymentId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentBonusTransaction/deleteById`)
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

  it('POST /PaymentBonusTransaction/find (no filter)', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentBonusTransaction/find`)
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

  it('POST /PaymentBonusTransaction/find (filter staff)', done => {
    const body = {
      filter: {
        paymentPICId: staffId,
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
      .post(`/PaymentBonusTransaction/find`)
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

  it('POST /PaymentBonusTransaction/find (filter user id)', done => {
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
      .post(`/PaymentBonusTransaction/find`)
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

  it('POST /PaymentBonusTransaction/find (filter username)', done => {
    const body = {
      filter: {
        userName: userData.userName,
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
      .post(`/PaymentBonusTransaction/find`)
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

  it('POST /PaymentBonusTransaction/find (filter email)', done => {
    const body = {
      filter: {
        email: userData.email,
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
      .post(`/PaymentBonusTransaction/find`)
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

  it('POST /PaymentBonusTransaction/find (filter phoneNumber)', done => {
    const body = {
      filter: {
        phoneNumber: userData.phoneNumber,
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
      .post(`/PaymentBonusTransaction/find`)
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

  it('POST /PaymentBonusTransaction/find (filter payment ref number)', done => {
    const body = {
      filter: {
        paymentRef: 'sample ref',
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
      .post(`/PaymentBonusTransaction/find`)
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

  it('POST /PaymentBonusTransaction/find (filter NEW payment)', done => {
    const body = {
      filter: {
        paymentStatus: PAYMENT_STATUS.NEW,
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
      .post(`/PaymentBonusTransaction/find`)
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

  it('POST /PaymentBonusTransaction/find (filter PENDING payment)', done => {
    const body = {
      filter: {
        paymentStatus: PAYMENT_STATUS.PENDING,
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
      .post(`/PaymentBonusTransaction/find`)
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

  it('POST /PaymentBonusTransaction/find (filter CANCELED payment)', done => {
    const body = {
      filter: {
        paymentStatus: PAYMENT_STATUS.CANCELED,
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
      .post(`/PaymentBonusTransaction/find`)
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

  it('POST /PaymentBonusTransaction/find (filter APPROVED payment)', done => {
    const body = {
      filter: {
        paymentStatus: PAYMENT_STATUS.COMPLETED,
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
      .post(`/PaymentBonusTransaction/find`)
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

  it('POST /PaymentBonusTransaction/find (filter WAITING payment)', done => {
    const body = {
      filter: {
        paymentStatus: PAYMENT_STATUS.WAITING,
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
      .post(`/PaymentBonusTransaction/find`)
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

  it('POST /PaymentBonusTransaction/find (filter startDate)', done => {
    const body = {
      startDate: moment().subtract(5, 'day').toDate(),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentBonusTransaction/find`)
      .set('Authorization', `Bearer ${staffToken}`)
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

  it('POST /PaymentBonusTransaction/find (filter endDate)', done => {
    const body = {
      endDate: moment().add(5, 'day').toDate(),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentBonusTransaction/find`)
      .set('Authorization', `Bearer ${staffToken}`)
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

  it('POST /PaymentBonusTransaction/user/bonusHistory (filter startDate)', done => {
    const body = {
      startDate: moment().subtract(5, 'day').toDate(),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentBonusTransaction/user/bonusHistory`)
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

  it('POST /PaymentBonusTransaction/user/bonusHistory (filter endDate)', done => {
    const body = {
      endDate: moment().add(5, 'day').toDate(),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentBonusTransaction/user/bonusHistory`)
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

  it('POST /PaymentBonusTransaction/user/bonusHistory', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentBonusTransaction/user/bonusHistory`)
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
