/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'ProductOrder';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const { PRODUCT_ORDER_TYPE } = require('../ProductOrderConstant');

const insertSchema = {
  orderItemPricePerUnit: Joi.number().min(0).required(),
  orderItemQuantity: Joi.number().min(0).required(),
  orderItemCode: Joi.string().max(255).required(),
  orderType: Joi.string().allow(PRODUCT_ORDER_TYPE.SELL, PRODUCT_ORDER_TYPE.BUY).max(255).required(),
  orderRequireMinAmount: Joi.number().min(0),
  orderRequireMaxAmount: Joi.number().min(0),
};

const orderProductItemSchema = Joi.object({
  orderItemQuantity: Joi.number().required().min(1).max(999).default(1),
  productId: Joi.number().required().min(0),
});

const userPlaceOrderSchema = {
  orderItemQuantity: Joi.number().min(0).required(),
  orderItemPrice: Joi.number().min(0).required(),
  productId: Joi.number().required().min(0),
  minOrderItemQuantity: Joi.number().default(0),
  maxOrderItemQuantity: Joi.number().default(0),
};

const updateSchema = {
  minOrderItemQuantity: Joi.number().min(0),
  maxOrderItemQuantity: Joi.number().min(0),
  orderStatus: Joi.string().max(255),
};

const filterSchema = {
  orderStatus: Joi.string().max(255),
  orderType: Joi.string().max(255),
};

const staffFilterSchema = {
  ...filterSchema,
  appUserId: Joi.number().min(0),
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
        filter: Joi.object(staffFilterSchema),
        startDate: Joi.string(),
        endDate: Joi.string(),
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

  userFindById: {
    tags: ['api', `${moduleName}`],
    description: `find by id ${moduleName}`,
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
      Response(req, res, 'userFindById');
    },
  },

  deleteById: {
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
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'deleteById');
    },
  },
  getList: {
    tags: ['api', `${moduleName}`],
    description: `getList ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        startDate: Joi.string(),
        endDate: Joi.string(),
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
      Response(req, res, 'getList');
    },
  },
  getHistoryOrder: {
    tags: ['api', `${moduleName}`],
    description: `getList ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        startDate: Joi.string(),
        endDate: Joi.string(),
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
      Response(req, res, 'getHistoryOrder');
    },
  },
  userPlaceOrder: {
    tags: ['api', `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object(userPlaceOrderSchema),
    },
    handler: function (req, res) {
      Response(req, res, 'userPlaceOrder');
    },
  },
  userPrecheckOrder: {
    tags: ['api', `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object(userPlaceOrderSchema),
    },
    handler: function (req, res) {
      Response(req, res, 'userPrecheckOrder');
    },
  },
  userPlaceSellingOrder: {
    tags: ['api', `${moduleName}`],
    description: `create sell order ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object(userPlaceOrderSchema),
    },
    handler: function (req, res) {
      Response(req, res, 'userPlaceSellingOrder');
    },
  },
  exchangeCurrencyByOrder: {
    tags: ['api', `${moduleName}`],
    description: `exchange currency ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        productOrderId: Joi.number().min(0).required(),
        amount: Joi.number().min(0).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'exchangeCurrencyByOrder');
    },
  },
};
