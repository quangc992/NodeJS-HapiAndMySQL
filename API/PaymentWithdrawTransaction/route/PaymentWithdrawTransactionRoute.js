/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'PaymentWithdrawTransaction';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const SystemStatus = require('../../Maintain/MaintainFunctions').systemStatus;
const { WALLET_TYPE } = require('../../Wallet/WalletConstant');
const { WALLET_RECORD_TYPE } = require('../../WalletRecord/WalletRecordConstant');
const { WITHDRAW_TRX_STATUS } = require('../PaymentWithdrawTransactionConstant');

const insertSchema = {
  id: Joi.number().required(),
  paymentAmount: Joi.number().required().min(0).default(1000000),
  paymentOwner: Joi.string().required().max(255),
  paymentOriginSource: Joi.string().required().max(255),
  paymentOriginName: Joi.string().required().max(255),
  walletType: Joi.string().required().default(WALLET_TYPE.POINT).max(255),
};

const updateSchema = {
  status: Joi.string(),
};

const filterSchema = {
  appUserId: Joi.number(),
  walletType: Joi.string().max(50),
  createdAt: Joi.string().max(255),
  memberLevelName: Joi.string().max(255),
  active: Joi.number(),
  paymentStatus: Joi.string().max(255),
  paymentMethodId: Joi.number(),
  paymentCategory: Joi.string().max(255),
};

const filterUser = {
  WalletId: Joi.number(),
};

module.exports = {
  insert: {
    tags: ['api', `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        ...insertSchema,
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.withdraw === false) {
        res('maintain').code(500);
        return;
      }
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
    description: `find ${moduleName}`,
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
        startDate: Joi.string(),
        endDate: Joi.string(),
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
  requestWithdrawUSDT: {
    tags: ['api', `${moduleName}`],
    description: `requestWithdraw ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        paymentAmount: Joi.number().required().min(0.00001).default(1000000),
        secondaryPassword: Joi.string().min(6),
        paymentNote: Joi.string(),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.withdraw === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'requestWithdrawUSDT');
    },
  },
  getList: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterUser),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        startDate: Joi.string(),
        endDate: Joi.string(),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getList');
    },
  },
  approveWithdrawTransaction: {
    tags: ['api', `${moduleName}`],
    description: `approveWithdrawTransaction ${moduleName}`,
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
        paymentRef: Joi.string().max(500),
        paymentNote: Joi.string().max(500),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.withdraw === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'approveWithdrawTransaction');
    },
  },
  denyWithdrawTransaction: {
    tags: ['api', `${moduleName}`],
    description: `denyWithdrawTransaction ${moduleName}`,
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
        paymentNote: Joi.string().max(500),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.withdraw === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'denyWithdrawTransaction');
    },
  },
  withdrawHistoryUSDT: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        startDate: Joi.string(),
        endDate: Joi.string(),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'withdrawHistoryUSDT');
    },
  },
  requestWithdrawBTC: {
    tags: ['api', `${moduleName}`],
    description: `requestWithdraw ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        paymentAmount: Joi.number().required().min(0.00001).default(1000000),
        secondaryPassword: Joi.string().min(6),
        paymentNote: Joi.string(),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.withdraw === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'requestWithdrawBTC');
    },
  },
  withdrawHistoryBTC: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        startDate: Joi.string(),
        endDate: Joi.string(),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'withdrawHistoryBTC');
    },
  },
  withdrawHistoryPOINT: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        startDate: Joi.string(),
        endDate: Joi.string(),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'withdrawHistoryPOINT');
    },
  },
  requestWithdraw: {
    tags: ['api', `${moduleName}`],
    description: `requestWithdraw ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        walletId: Joi.number(),
        paymentAmount: Joi.number().required().min(0.00001).default(1000000),
        paymentOwner: Joi.string().required(), //ten nguoi gui, ten tai khoan
        paymentOriginSource: Joi.string().required(), //ten ngan hang, ten mang (blockchain)
        paymentOriginName: Joi.string().required(), //so tai khoan, dia chi vi
        secondaryPassword: Joi.string().min(6),
        paymentNote: Joi.string(),
        paymentFeeAmount: Joi.number(),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.withdraw === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'requestWithdraw');
    },
  },
};
