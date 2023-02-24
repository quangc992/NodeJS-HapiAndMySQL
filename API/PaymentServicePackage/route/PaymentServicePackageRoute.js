/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 12/06/21.
 */
'use strict';
const moduleName = 'PaymentServicePackage';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const { PACKAGE_STATUS, PACKAGE_CATEGORY, PACKAGE_TYPE } = require('../PaymentServicePackageConstant');

const insertSchema = {
  packageName: Joi.string().required(),
  packageType: Joi.string().required().allow([PACKAGE_TYPE.A1000FAC.type, PACKAGE_TYPE.A100FAC.type, PACKAGE_TYPE.A500FAC.type]),
  packageDescription: Joi.string().max(500),
  packagePrice: Joi.number().required(),
  packageDiscountPrice: Joi.string().allow(''),
  packagePerformance: Joi.number().required().min(1),
  packageCategory: Joi.string(),
  packageUnitId: Joi.number().required().min(0),
  packageDuration: Joi.number().default(360).required().min(1),
  packageStatus: Joi.number().default(PACKAGE_STATUS.NEW),
};

const filterSchema = {
  packageUnitId: Joi.number(),
  packageStatus: Joi.number(),
  packageType: Joi.string(),
  packageCategory: Joi.string(),
};

const updateSchema = {
  packageName: Joi.string(),
  packageDescription: Joi.string().max(500),
  packageType: Joi.string(),
  packagePrice: Joi.number(),
  packageDiscountPrice: Joi.number(),
  packagePerformance: Joi.number().min(1),
  packageUnitId: Joi.number().min(0),
  packageDuration: Joi.number().min(1),
  packageStatus: Joi.number(),
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
  activatePackagesByIdList: {
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
        idList: Joi.array().items(Joi.number().min(0)).required().min(1).max(20),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'activatePackagesByIdList');
    },
  },
  deactivatePackagesByIdList: {
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
        idList: Joi.array().items(Joi.number().min(0)).required().min(1).max(20),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'deactivatePackagesByIdList');
    },
  },
  rewardProfitBonusForUser: {
    tags: ['api', `${moduleName}`],
    description: `admin add reward (profitBonus) for user ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        paymentServicePackageUserId: Joi.number().min(0).required(),
        profitBonus: Joi.number().required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'rewardProfitBonusForUser');
    },
  },
  userGetListPaymentPackage: {
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
      Response(req, res, 'userGetListPaymentPackage');
    },
  },
};
