/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
const { MESSAGE_STATUS, MESSAGE_CATEGORY, MESSAGE_TOPIC } = require('../CustomerMessageConstant');
chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const Model = require('../resourceAccess/CustomerMessageResourceAccess');

const app = require('../../../server');

describe(`Tests ${Model.modelName}`, function () {
  let messageId;
  let token = '';
  let listUser = [];
  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginStaff();
      token = staffData.token;
      resolve();
    }).then(() => done());
  });

  it('admin insert message', done => {
    const body = {
      customerMessageCategories: MESSAGE_TOPIC.GENERAL,
      customerMessageContent: faker.name.firstName() + faker.name.lastName(),
      customerMessageTitle: faker.name.firstName(),
      messageSendStatus: MESSAGE_STATUS.NEW,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerMessage/insertMessage`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        if (res && res.body && res.body.statusCode === 200) {
          messageId = res.body.data[0];
        }
        done();
      });
  });

  it('get list users', done => {
    const body = {
      filter: {},
      skip: 0,
      limit: 20,
      order: {
        key: 'createdAt',
        value: 'desc',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/getListUser`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        if (res && res.body && res.body.statusCode === 200) {
          const data = res.body.data;
          for (let i = 0; i < data.length; i++) {
            listUser.push(data[i].appUserId);
          }
        }
        done();
      });
  });

  if (listUser.length > 0) {
    it('send message to list', done => {
      const body = {
        customerRecordIdList: listUser,
        messageNote: 'string',
        customerMessageId: messageId,
      };
      chai
        .request(`0.0.0.0:${process.env.PORT}`)
        .post(`/CustomerMessage/sendMessageByCustomerList`)
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
  }

  it('send message by filter', done => {
    const body = {
      messageNote: 'THIS IS UNIT TEST',
      customerMessageId: messageId,
      filter: {
        name: 'Lu',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerMessage/sendMessageByFilter`)
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

  // it('delete message', done => {
  //   const  body = {
  //     "customerMessageId": messageId
  //   };
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/CustomerMessage/deleteMessageById`)
  //     .set("Authorization", `Bearer ${token}`)
  //     .send(body)
  //     .end((err, res) => {
  //       if ( err ) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       done();
  //     });
  // });

  it('update message ', done => {
    const body = {
      customerMessageId: messageId,
      data: {
        customerMessageContent: 'striasdasdasdng',
        customerMessageTitle: 'strinasd',
        isDeleted: 0,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/CustomerMessage/updateMessageById`)
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
});
