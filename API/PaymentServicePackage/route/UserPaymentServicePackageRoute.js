/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 12/06/21.
 */
'use strict';
const moduleName = 'UserPaymentServicePackage';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const { PACKAGE_CATEGORY, ACTIVITY_STATUS } = require('../PaymentServicePackageConstant');
const filterSchema = {
  packageUnitId: Joi.number(),
  packageCategory: Joi.string().max(10),
  packageActivityStatus: Joi.number(),
  packageType: Joi.string(),
};
const filterSchemaServiPackeUser = {};
module.exports = {
  buyServicePackage: {
    tags: ['api', `${moduleName}`],
    description: `buyServicePackage ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        paymentServicePackageId: Joi.number().required().min(1),
        secondaryPassword: Joi.string().min(6),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'buyServicePackage');
    },
  },
  historyServicePackage: {
    tags: ['api', `${moduleName}`],
    description: `user view historyServicePackage ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
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
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'historyServicePackage');
    },
  },
  getUserServicePackage: {
    tags: ['api', `${moduleName}`],
    description: `user getUserServicePackage ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
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
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getUserServicePackage');
    },
  },
  userGetBalanceByUnitId: {
    tags: ['api', `${moduleName}`],
    description: `user view balance by unitId ${moduleName}`,
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
          walletBalanceUnitId: Joi.number().required().min(2),
        }),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userGetBalanceByUnitId');
    },
  },
  userActivateServicePackage: {
    tags: ['api', `${moduleName}`],
    description: `userActivateServicePackage ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        paymentServicePackageUserId: Joi.number().required().min(1),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userActivateServicePackage');
    },
  },
  userCollectServicePackage: {
    tags: ['api', `${moduleName}`],
    description: `userCollectServicePackage ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        paymentServicePackageUserId: Joi.number().required().min(1),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userCollectServicePackage');
    },
  },
  getListUserBuyPackage: {
    tags: ['api', `${moduleName}`],
    description: `getListUserBuyPackage ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
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
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getListUserBuyPackage');
    },
  },
  userRequestCompletedServicePackage: {
    tags: ['api', `${moduleName}`],
    description: `userCompletedServicePackage ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        paymentServicePackageUserId: Joi.number().required().min(1),
        secondaryPassword: Joi.string().min(6),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userRequestCompletedServicePackage');
    },
  },
  userAproveCompletedServicePackage: {
    tags: ['api', `${moduleName}`],
    description: `userAproveCompletedServicePackage ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        paymentServicePackageId: Joi.number().required().min(1),
        secondaryPassword: Joi.string().min(6),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userAproveCompletedServicePackage');
    },
  },
  userDenyCompletedServicePackage: {
    tags: ['api', `${moduleName}`],
    description: `userDenyCompletedServicePackage ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        paymentServicePackageId: Joi.number().required().min(1),
        secondaryPassword: Joi.string().min(6),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userDenyCompletedServicePackage');
    },
  },
  historyCompleteServicePackage: {
    tags: ['api', `${moduleName}`],
    description: `user view historyCompleteServicePackage ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchemaServiPackeUser),
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
      Response(req, res, 'historyCompleteServicePackage');
    },
  },
  historyCancelServicePackage: {
    tags: ['api', `${moduleName}`],
    description: `user view historyCancelServicePackage ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchemaServiPackeUser),
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
      Response(req, res, 'historyCancelServicePackage');
    },
  },
  historyBonusServicePackage: {
    tags: ['api', `${moduleName}`],
    description: `user view historyBonusServicePackage }`,
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
      Response(req, res, 'historyBonusServicePackage');
    },
  },
  countAllUserPackage: {
    tags: ['api', `${moduleName}`],
    description: `staff count ${moduleName}`,
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
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'countAllUserPackage');
    },
  },
  adminHistoryCancelServicePackage: {
    tags: ['api', `${moduleName}`],
    description: `admin view historyCancel ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchemaServiPackeUser),
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
      Response(req, res, 'adminHistoryCancelServicePackage');
    },
  },
  adminHistoryCompleteServicePackage: {
    tags: ['api', `${moduleName}`],
    description: `admin view adminHistoryCompleteServicePackage`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdminToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchemaServiPackeUser),
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
      Response(req, res, 'adminHistoryCompleteServicePackage');
    },
  },
  adminUpdateCompleteServicePackage: {
    tags: ['api', `${moduleName}`],
    description: `admin update adminHistoryCompleteServicePackage`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number(),
        data: Joi.object({
          packagePrice: Joi.number(),
          percentCompleted: Joi.number(),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateById');
    },
  },
  summaryReferedUser: {
    tags: ['api', `${moduleName}`],
    description: `user view refered user`,
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
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
        searchText: Joi.string(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'summaryReferedUser');
    },
  },
  getListReferralByUserId: {
    tags: ['api', `${moduleName}`],
    description: `admin view refered user of user`,
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
          appUserId: Joi.number().required(),
        }).required(),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
        searchText: Joi.string(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getListReferralByUserId');
    },
  },

  findUserBuyPackage: {
    tags: ['api', `${moduleName}`],
    description: `findUserBuyPackage ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object({
          ...filterSchema,
          appUserId: Joi.number(),
        }),
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
      Response(req, res, 'findUserBuyPackage');
    },
  },
  adminCompletePackagesById: {
    tags: ['api', `${moduleName}`],
    description: `admin complete package by id ${moduleName}`,
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
      Response(req, res, 'adminCompletePackagesById');
    },
  },
};
