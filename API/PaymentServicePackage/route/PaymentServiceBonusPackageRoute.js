/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 12/06/21.
 */
'use strict';
const moduleName = 'PaymentServiceBonusPackage';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const { CLAIMABLE_STATUS } = require('../PaymentServicePackageConstant');

const filterSchema = {
  packageUnitId: Joi.number(),
  packageStatus: Joi.number(),
  bonusPackageExpireDate: Joi.string().max(255),
  bonusPackageClaimable: Joi.number().allow([CLAIMABLE_STATUS.ENABLE, CLAIMABLE_STATUS.DISABLE, CLAIMABLE_STATUS.CLAIMED]),
  firstName: Joi.string().max(255),
  lastName: Joi.string().max(255),
  username: Joi.string().max(255),
  email: Joi.string().max(255),
  memberLevelName: Joi.string().max(255),
  phoneNumber: Joi.string().max(25),
};

const updateSchema = {
  appUserId: Joi.number(),
  bonusPackageId: Joi.number(),
  bonusPackageExpireDate: Joi.string().max(255),
  bonusPackageClaimedDate: Joi.string().max(255),
  bonusPackageClaimable: Joi.number().allow([CLAIMABLE_STATUS.ENABLE, CLAIMABLE_STATUS.DISABLE, CLAIMABLE_STATUS.CLAIMED]),
  bonusPackageDescription: Joi.string().max(255),
};

module.exports = {
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
  deleteById: {
    tags: ['api', `${moduleName}`],
    description: `delete ${moduleName} by id`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'deleteById');
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
  userGetListPaymentBonusPackage: {
    tags: ['api', `${moduleName}`],
    description: `user get list ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userGetListPaymentBonusPackage');
    },
  },
  userClaimBonusPackage: {
    tags: ['api', `${moduleName}`],
    description: `user get list ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),
      payload: Joi.object({
        userBonusPackageId: Joi.number().default(0).min(0),
        secondaryPassword: Joi.string().min(6),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userClaimBonusPackage');
    },
  },
  staffSendBonusPackage: {
    tags: ['api', `${moduleName}`],
    description: `staff send ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),
      payload: Joi.object({
        paymentServicePackageId: Joi.number().default(0).min(0).required(),
        bonusPackageDescription: Joi.string().required(),
        appUserId: Joi.number().required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'staffSendBonusPackage');
    },
  },
};
