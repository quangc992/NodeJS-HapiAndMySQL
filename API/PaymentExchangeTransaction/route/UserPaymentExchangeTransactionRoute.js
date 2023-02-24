/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'UserPaymentExchangeTransaction';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const SystemStatus = require('../../Maintain/MaintainFunctions').systemStatus;

module.exports = {
  userRequestExchange: {
    tags: ['api', `${moduleName}`],
    description: `userRequestExchange ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        paymentAmount: Joi.number().required().min(0).default(1),
        walletBalanceUnitId: Joi.number().required().min(2).default(2),
        secondaryPassword: Joi.string().min(6),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.exchange === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'userRequestExchange');
    },
  },
  userExchangeFACHistory: {
    tags: ['api', `${moduleName}`],
    description: `userExchangeHistory ${moduleName}`,
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
      Response(req, res, 'userExchangeFACHistory');
    },
  },
  userExchangePOINTHistory: {
    tags: ['api', `${moduleName}`],
    description: `userExchangeHistory ${moduleName}`,
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
      Response(req, res, 'userExchangePOINTHistory');
    },
  },
  userReceiveHistory: {
    tags: ['api', `${moduleName}`],
    description: `userReceiveHistory ${moduleName}`,
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
      Response(req, res, 'userReceiveHistory');
    },
  },
  userAcceptExchangeRequest: {
    tags: ['api', `${moduleName}`],
    description: `userAcceptExchangeRequest ${moduleName}`,
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
      if (SystemStatus.exchange === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'userAcceptExchangeRequest');
    },
  },
  userDenyExchangeRequest: {
    tags: ['api', `${moduleName}`],
    description: `userDenyExchangeRequest ${moduleName}`,
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
      if (SystemStatus.exchange === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'userDenyExchangeRequest');
    },
  },
  userCancelExchangeRequest: {
    tags: ['api', `${moduleName}`],
    description: `userCancelExchangeRequest ${moduleName}`,
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
      if (SystemStatus.exchange === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'userCancelExchangeRequest');
    },
  },
  userViewExchangeRequests: {
    tags: ['api', `${moduleName}`],
    description: `userViewExchangeRequests ${moduleName}`,
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
      if (SystemStatus.exchange === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'userViewExchangeRequests');
    },
  },
  userExchangeFAC: {
    tags: ['api', `${moduleName}`],
    description: `userExchangeFAC ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        paymentAmount: Joi.number().required().min(0).default(1),
        secondaryPassword: Joi.string().min(6),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.exchange === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'userExchangeFAC');
    },
  },
  userExchangePOINT: {
    tags: ['api', `${moduleName}`],
    description: `userExchangePOINT ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        paymentAmount: Joi.number().required().min(0).default(1),
        secondaryPassword: Joi.string().min(6),
      }),
    },
    handler: function (req, res) {
      if (SystemStatus.exchange === false) {
        res('maintain').code(500);
        return;
      }
      Response(req, res, 'userExchangePOINT');
    },
  },
  requestBonusExchangePoint: {
    tags: ['api', `${moduleName}`],
    description: `userRequestWithdrawBonus ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        paymentAmount: Joi.number().required().min(0).max(1000000000),
        walletId: Joi.number(), // id vi tien bonus
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'requestBonusExchangePoint');
    },
  },
};
