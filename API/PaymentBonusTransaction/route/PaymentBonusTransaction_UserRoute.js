/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'PaymentBonusTransaction';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const { BONUS_TRX_STATUS } = require('../PaymentBonusTransactionConstant');

module.exports = {
  userGetBonusHistory: {
    tags: ['api', `${moduleName}`],
    description: `user get list ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object({
          paymentStatus: Joi.string().allow([BONUS_TRX_STATUS.NEW, BONUS_TRX_STATUS.COMPLETED, BONUS_TRX_STATUS.CANCELED]),
          paymentMethodId: Joi.number().min(0),
        }),
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
      Response(req, res, 'userGetBonusHistory');
    },
  },
  userSummaryBonusByStatus: {
    tags: ['api', `${moduleName}`],
    description: `user get list ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        startDate: Joi.string(),
        endDate: Joi.string(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userSummaryBonusByStatus');
    },
  },
  userRequestWithdrawBonus: {
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
        paymentOwner: Joi.string().required(), //ten nguoi gui, ten tai khoan
        paymentOriginSource: Joi.string().required(), //ten ngan hang, ten mang (blockchain)
        paymentOriginName: Joi.string().required(), //so tai khoan, dia chi vi
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userRequestWithdrawBonus');
    },
  },
  userRequestExchangePoint: {
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
      Response(req, res, 'userRequestExchangePoint');
    },
  },
};
