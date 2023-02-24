/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'AppUsers';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const AppUsersFunctions = require('../AppUsersFunctions');
const SystemStatus = require('../../Maintain/MaintainFunctions').systemStatus;
const { USER_SEX, USER_TYPE } = require('../AppUserConstant');
const insertSchema = {
  lastName: Joi.string(),
  firstName: Joi.string(),
  username: Joi.string().alphanum().min(6).max(30).required(),
  email: Joi.string().email(),
  referUser: Joi.string().allow(''),
  password: Joi.string().required().min(6),
  secondaryPassword: Joi.string().min(6),
  phoneNumber: Joi.string(),
  birthDay: Joi.string(),
  identityNumber: Joi.string(),
  sex: Joi.number().min(USER_SEX.MALE).max(USER_SEX.FEMALE),
};
const updateSchema = {
  lastName: Joi.string(),
  firstName: Joi.string(),
  phoneNumber: Joi.string(),
  email: Joi.string().email(),
  birthDay: Joi.string(),
  active: Joi.number().min(0).max(1),
  limitWithdrawDaily: Joi.number().min(0).max(1000000000),
  memberLevelName: Joi.string(),
  twoFACode: Joi.string(),
  twoFAEnable: Joi.number().min(0).max(1),
  userAvatar: Joi.string().allow(''),
  identityNumber: Joi.string(),
  sex: Joi.number().min(USER_SEX.MALE).max(USER_SEX.FEMALE),
  firebaseToken: Joi.string(),
  telegramId: Joi.string(),
  isDeleted: Joi.number(),
  sotaikhoan: Joi.string(),
  tentaikhoan: Joi.string(),
  tennganhang: Joi.string(),
  packageExpireDate: Joi.string(),
  packageDuration: Joi.number().min(1),
};

const filterSchema = {
  active: Joi.number().min(0).max(1),
  username: Joi.string().alphanum(),
  email: Joi.string(),
  phoneNumber: Joi.string(),
  referUser: Joi.string(),
  name: Joi.string(),
  userType: Joi.number().min(1).max(2),
  isVerified: Joi.number().min(-1).max(2),
  isVerifiedEmail: Joi.number().min(-1).max(2),
  isVerifiedPhoneNumber: Joi.number().min(-1).max(2),
  memberLevelName: Joi.string(),
};

module.exports = {
  insert: {
    tags: ['api', `${moduleName}`],
    description: `register ${moduleName}`,
    validate: {
      payload: Joi.object(insertSchema),
    },
    handler: function (req, res) {
      Response(req, res, 'insert');
    },
  },
  updateById: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
        data: Joi.object(updateSchema),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateById');
    },
  },
  find: {
    tags: ['api', `${moduleName}`],
    description: `get list ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        searchText: Joi.string(),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'find');
    },
  },
  findById: {
    tags: ['api', `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'findById');
    },
  },
  loginUser: {
    tags: ['api', `${moduleName}`],
    description: `login ${moduleName}`,
    validate: {
      payload: Joi.object({
        username: Joi.string().alphanum().min(6).max(30).required(),
        password: Joi.string().required(),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.all === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'loginUser');
    },
  },
  loginByPhone: {
    tags: ['api', `${moduleName}`],
    description: `login ${moduleName}`,
    validate: {
      payload: Joi.object({
        phoneNumber: Joi.string().alphanum().min(6).max(30).required(),
        password: Joi.string().required(),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.all === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'loginByPhone');
    },
  },
  loginFacebook: {
    tags: ['api', `${moduleName}`],
    description: `login ${moduleName}`,
    validate: {
      payload: Joi.object({
        facebook_id: Joi.string().required(),
        facebook_avatar: Joi.string(),
        facebook_name: Joi.string(),
        facebook_email: Joi.string(),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.all === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'loginFacebook');
    },
  },
  loginGoogle: {
    tags: ['api', `${moduleName}`],
    description: `login ${moduleName}`,
    validate: {
      payload: Joi.object({
        google_id: Joi.string().required(),
        google_avatar: Joi.string(),
        google_name: Joi.string(),
        google_email: Joi.string(),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.all === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'loginGoogle');
    },
  },
  loginZalo: {
    tags: ['api', `${moduleName}`],
    description: `login ${moduleName}`,
    validate: {
      payload: Joi.object({
        zalo_id: Joi.string().required(),
        zalo_avatar: Joi.string(),
        zalo_name: Joi.string(),
        zalo_email: Joi.string(),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.all === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'loginZalo');
    },
  },
  loginApple: {
    tags: ['api', `${moduleName}`],
    description: `login ${moduleName}`,
    validate: {
      payload: Joi.object({
        apple_id: Joi.string().required(),
        apple_avatar: Joi.string(),
        apple_name: Joi.string(),
        apple_email: Joi.string(),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.all === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'loginApple');
    },
  },
  registerUser: {
    tags: ['api', `${moduleName}`],
    description: `register ${moduleName}`,
    validate: {
      payload: Joi.object({
        ...insertSchema,
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.all === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'registerUser');
    },
  },
  registerUserByPhone: {
    tags: ['api', `${moduleName}`],
    description: `register ${moduleName}`,
    validate: {
      payload: Joi.object({
        password: Joi.string().required().min(6),
        phoneNumber: Joi.string().required(),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.all === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'registerUserByPhone');
    },
  },
  forgotPassword: {
    tags: ['api', `${moduleName}`],
    description: `user forgot ${moduleName}`,
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.all === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'forgotPassword');
    },
  },
  forgotPasswordOTP: {
    tags: ['api', `${moduleName}`],
    description: `user forgot ${moduleName}`,
    validate: {
      payload: Joi.object({
        phoneNumber: Joi.string().required(),
        password: Joi.string().required().min(6),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.all === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'forgotPasswordOTP');
    },
  },
  verifyEmailUser: {
    tags: ['api', `${moduleName}`],
    description: `${moduleName} verify email`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({}),
    },
    handler: function (req, res) {
      if (SystemStatus.all === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'verifyEmailUser');
    },
  },

  changePasswordUser: {
    tags: ['api', `${moduleName}`],
    description: `change password ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyOwnerToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        password: Joi.string().required(),
        newPassword: Joi.string().required().min(6),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'changePasswordUser');
    },
  },
  verify2FA: {
    tags: ['api', `${moduleName}`],
    description: `change password ${moduleName}`,
    validate: {
      payload: Joi.object({
        otpCode: Joi.string().required(),
        id: Joi.number().required(),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.all === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'verify2FA');
    },
  },
  get2FACode: {
    tags: ['api', `${moduleName}`],
    description: `get QrCode for 2FA ${moduleName}`,
    validate: {
      query: {
        appUserId: Joi.number(),
      },
    },
    handler: function (req, res) {
      if (req.query.appUserId) {
        AppUsersFunctions.generate2FACode(req.query.appUserId).then(qrCode => {
          if (qrCode) {
            res.file(qrCode);
          } else {
            res('error').code(500);
          }
        });
      } else {
        res('error').code(500);
      }
    },
  },
  userUpdateInfo: {
    tags: ['api', `${moduleName}`],
    description: `${moduleName} update info`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyOwnerToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().required(),
        data: Joi.object(updateSchema),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userUpdateInfo');
    },
  },
  userGetDetailById: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName} by id`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userGetDetailById');
    },
  },
  verifyInfoUser: {
    tags: ['api', `${moduleName}`],
    description: `Verify info ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'verifyInfoUser');
    },
  },

  rejectInfoUser: {
    tags: ['api', `${moduleName}`],
    description: `reject info ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'rejectInfoUser');
    },
  },
  getUsersByMonth: {
    tags: ['api', `${moduleName}`],
    description: `Get ${moduleName}s by month`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        startDate: Joi.string().required(),
        endDate: Joi.string().required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getUsersByMonth');
    },
  },

  uploadIdentityCardBefore: {
    tags: ['api', `${moduleName}`],
    description: `upload identity card images for ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyOwnerToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().required().min(0),
        imageData: Joi.binary().encoding('base64'),
        imageFormat: Joi.string().default('png'),
      }),
    },
    payload: {
      maxBytes: 10 * 1024 * 1024, //10 mb
      // output: 'file',
      parse: true,
      // allow: 'multipart/form-data',
      // multipart: {
      //     output: 'data',
      // }
    },
    handler: function (req, res) {
      Response(req, res, 'uploadBeforeIdentityCard');
    },
  },

  uploadIdentityCardAfter: {
    tags: ['api', `${moduleName}`],
    description: `upload identity card images for ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyOwnerToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().required().min(0),
        imageData: Joi.binary().encoding('base64'),
        imageFormat: Joi.string().default('png'),
      }),
    },
    payload: {
      maxBytes: 10 * 1024 * 1024, //10 mb
      // output: 'file',
      parse: true,
      // allow: 'multipart/form-data',
      // multipart: {
      //     output: 'data',
      // }
    },
    handler: function (req, res) {
      Response(req, res, 'uploadAfterIdentityCard');
    },
  },

  submitIdentityCardImage: {
    tags: ['api', `${moduleName}`],
    description: `submit images of identity card of ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyOwnerToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'submitIdentityCardImage');
    },
  },
  uploadAvatar: {
    tags: ['api', `${moduleName}`],
    description: `upload avatar images for ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyOwnerToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().required().min(0),
        imageData: Joi.binary().encoding('base64'),
        imageFormat: Joi.string().default('png'),
      }),
    },
    payload: {
      maxBytes: 10 * 1024 * 1024, //10 mb
      parse: true,
    },
    handler: function (req, res) {
      Response(req, res, 'uploadAvatar');
    },
  },

  exportExcelFile: {
    tags: ['api', `${moduleName}`],
    description: `get list ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'exportExcel');
    },
  },

  resetPasswordBaseOnToken: {
    tags: ['api', `${moduleName}`],
    description: `change password ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        password: Joi.string().required().min(6),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'resetPasswordBaseOnUserToken');
    },
  },

  adminResetPasswordUser: {
    tags: ['api', `${moduleName}`],
    description: `user forgot ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(1).required(),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.all === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'adminResetPassword');
    },
  },

  sendMailToVerify: {
    tags: ['api', `${moduleName}`],
    description: `${moduleName} verify email`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        email: Joi.string().required().email(),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.all === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'sendMailToVerifyEmail');
    },
  },
  adminChangePasswordUser: {
    tags: ['api', `${moduleName}`],
    description: `${moduleName} adminChangePasswordUser`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(1).required(),
        password: Joi.string().required().min(6),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.all === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'adminChangePasswordUser');
    },
  },
  adminChangeSecondaryPasswordUser: {
    tags: ['api', `${moduleName}`],
    description: `${moduleName} adminChangeSecondaryPasswordUser`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(1).required(),
        password: Joi.string().required().min(6),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.all === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'adminChangeSecondaryPasswordUser');
    },
  },
};
