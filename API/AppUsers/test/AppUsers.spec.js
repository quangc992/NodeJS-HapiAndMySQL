/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
var crypto = require('crypto');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
const { USER_SEX } = require('../AppUserConstant');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const Model = require('../resourceAccess/AppUsersResourceAccess');

const app = require('../../../server');

describe(`Tests ${Model.modelName}`, function () {
  let userToken = '';
  let adminToken = '';
  let fakeUserName = faker.name.firstName() + faker.name.lastName() + crypto.randomBytes(5).toString('hex');
  let userId;
  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginStaff();
      adminToken = staffData.token;
      let userData = await TestFunctions.loginUser();
      userToken = userData.token;
      userId = userData.appUserId;
      resolve();
    }).then(() => done());
  });

  it('Register user', done => {
    const body = {
      firstName: faker.name.firstName(),
      username: fakeUserName,
      email: faker.internet.email() + crypto.randomBytes(5).toString('hex'),
      password: '123456789',
      phoneNumber: faker.phone.phoneNumber() + crypto.randomBytes(5).toString('hex'),
      sex: USER_SEX.MALE,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/registerUser`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('User forgotPassword', done => {
    const body = {
      email: faker.internet.email(),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/forgotPassword`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('User resend email for email verification', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/verifyEmailUser`)
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

  it('Register user by phone number', done => {
    const body = {
      password: 'string',
      phoneNumber: faker.phone.phoneNumber('84#########') + crypto.randomBytes(5).toString('hex'),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/registerUserByPhone`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Login app user', done => {
    const body = {
      username: fakeUserName,
      password: '123456789',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/loginUser`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Login facebook', done => {
    const body = {
      facebook_id: faker.finance.creditCardNumber(),
      facebook_avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Facebook-icon-1.png/600px-Facebook-icon-1.png',
      facebook_name: faker.name.firstName(),
      facebook_email: faker.internet.email(),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/loginFacebook`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Login Google', done => {
    const body = {
      google_id: faker.finance.creditCardNumber(),
      google_avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png',
      google_name: faker.name.firstName(),
      google_email: faker.internet.email() + crypto.randomBytes(5).toString('hex'),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/loginGoogle`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Login Zalo', done => {
    const body = {
      zalo_id: faker.finance.creditCardNumber(),
      zalo_avatar: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Logo_zalo.png',
      zalo_name: faker.name.firstName(),
      zalo_email: faker.internet.email() + crypto.randomBytes(5).toString('hex'),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/loginZalo`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Login Apple', done => {
    const body = {
      apple_id: faker.finance.creditCardNumber(),
      apple_avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/505px-Apple_logo_black.svg.png',
      apple_name: faker.name.firstName(),
      apple_email: faker.internet.email() + crypto.randomBytes(5).toString('hex'),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/loginApple`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Get list users', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/find`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it('Get list users (with filter)', done => {
    const body = {
      filter: { active: 1 },
      skip: 0,
      limit: 20,
      order: { key: 'createdAt', value: 'desc' },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/find`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it('Get list users (with searchText)', done => {
    const body = {
      filter: { active: 1 },
      skip: 0,
      limit: 20,
      searchText: 'aaa',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/find`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it('Admin get user by id', done => {
    const body = {
      id: userId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/findById`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('User get user info by id', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/getDetailUserById`)
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

  it('User update user info by id', done => {
    const body = {
      id: userId,
      data: {
        firstName: faker.name.firstName(),
        phoneNumber: faker.phone.phoneNumber() + crypto.randomBytes(5).toString('hex'),
        birthDay: '01/03/1999',
        sex: USER_SEX.MALE,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/updateInfoUser`)
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

  it('Admin update user info by id', done => {
    const body = {
      id: userId,
      data: {
        firstName: faker.name.firstName(),
        phoneNumber: faker.phone.phoneNumber() + crypto.randomBytes(5).toString('hex'),
        birthDay: '01/03/1999',
        sex: USER_SEX.MALE,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/updateUserById`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Admin verify user info by id', done => {
    const body = {
      id: userId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/verifyInfoUser`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Admin reject user info by id', done => {
    const body = {
      id: userId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/rejectInfoUser`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  // it('Get users by month', done => {
  //   const body = {
  //     "month": 11,
  //     "year": 2021
  //   };
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/AppUsers/getUsersByMonth`)
  //     .set("Authorization", `Bearer ${adminToken}`)
  //     .send(body)
  //     .end((err, res) => {
  //       if ( err ) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       done();
  //     });
  // });

  // it('Upload user avatar', done => {
  //   fs.readFile('uploads/sampleAvatar.jpg', function read(err, data) {
  //     if (err) {
  //       return null;
  //     }

  //     var base64data = Buffer.from(data, 'binary').toString('base64');
  //     const body = {
  //       id: id,
  //       "imageData": base64data,
  //       "imageFormat": "jpg",
  //     };
  //     chai
  //       .request(`0.0.0.0:${process.env.PORT}`)
  //       .post(`/AppUsers/uploadAvatar`)
  //       .set('Authorization', `Bearer ${userToken}`)
  //       .send(body)
  //       .end((err, res) => {
  //         if ( err ) {
  //           console.error(err);
  //         }
  //         checkResponseStatus(res, 200);
  //         done();
  //       });
  //   });
  // });

  // it('Upload image before of identity card', done => {
  //   fs.readFile('uploads/sampleAvatar.jpg', function read(err, data) {
  //     if (err) {
  //       return null;
  //     }

  //     var base64data = Buffer.from(data, 'binary').toString('base64');
  //     const body = {
  //       id: id,
  //       "imageData": base64data,
  //       "imageFormat": "jpg",
  //     };
  //     chai
  //       .request(`0.0.0.0:${process.env.PORT}`)
  //       .post(`/AppUsers/uploadImageIdentityCardBefore`)
  //       .set('Authorization', `Bearer ${userToken}`)
  //       .send(body)
  //       .end((err, res) => {
  //         if ( err ) {
  //           console.error(err);
  //         }
  //         checkResponseStatus(res, 200);
  //         done();
  //       });
  //   });
  // });

  // it('Upload image after of identity card', done => {
  //   fs.readFile('uploads/sampleAvatar.jpg', function read(err, data) {
  //     if (err) {
  //       return null;
  //     }

  //     var base64data = Buffer.from(data, 'binary').toString('base64');
  //     const body = {
  //       id: id,
  //       "imageData": base64data,
  //       "imageFormat": "jpg",
  //     };
  //     chai
  //       .request(`0.0.0.0:${process.env.PORT}`)
  //       .post(`/AppUsers/uploadImageIdentityCardAfter`)
  //       .set('Authorization', `Bearer ${userToken}`)
  //       .send(body)
  //       .end((err, res) => {
  //         if ( err ) {
  //           console.error(err);
  //         }
  //         checkResponseStatus(res, 200);
  //         done();
  //       });
  //   });
  // });

  it('submit request to admin verify identity card', done => {
    const body = {
      id: userId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/submitImageIdentityCard`)
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

  // it('Export list users to excel file', done => {
  //   const body = {};
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/AppUsers/exportExcel`)
  //     .set("Authorization", `Bearer ${adminToken}`)
  //     .send(body)
  //     .end((err, res) => {
  //       if ( err ) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       done();
  //     });
  // });

  it('Reset password base on user userToken', done => {
    const body = {
      password: 'string',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/userResetPassword`)
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

  it('Admin send email to user to reset password base on user userToken', done => {
    const body = {
      id: userId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/adminResetPasswordUser`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Send email to verify email', done => {
    const body = {
      email: faker.internet.email(),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/sendMailToVerifyEmail`)
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
