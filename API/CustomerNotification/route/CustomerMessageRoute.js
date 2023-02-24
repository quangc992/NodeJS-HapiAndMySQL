/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'CustomerMessage';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const { MESSAGE_CATEGORY, MESSAGE_STATUS, MESSAGE_TOPIC } = require('../CustomerMessageConstant');

const insertSchema = {
  customerMessageCategories: Joi.string().default(MESSAGE_TOPIC.GENERAL),
  customerMessageContent: Joi.string(),
  customerMessageTitle: Joi.string(),
  messageSendStatus: Joi.string()
    .default(MESSAGE_STATUS.NEW)
    .allow([MESSAGE_STATUS.COMPLETED, MESSAGE_STATUS.FAILED, MESSAGE_STATUS.NEW, MESSAGE_STATUS.SENDING, MESSAGE_STATUS.CANCELED]),
  messageTimeSent: Joi.string(),
};

const filterSchema = {
  ...insertSchema,
};

const updateSchema = {
  ...insertSchema,
  isDeleted: Joi.number(),
  isHidden: Joi.number(),
};

const filterCustomerRecordSchema = {
  messageNote: Joi.string(),
  customerMessageId: Joi.number().required(),
};

const findMessagesSchema = {
  customerMessageCategories: Joi.string(),
  customerMessageContent: Joi.string(),
  customerMessageTitle: Joi.string(),
};

module.exports = {
  insert: {
    tags: ['api', `${moduleName}`],
    description: `admin create message ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdminToken }],
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
  sendsms: {
    tags: ['api', `${moduleName}`],
    description: `insert ${moduleName}`,
    validate: {
      payload: Joi.object({
        message: Joi.string(),
        phoneNumber: Joi.string(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'sendsms');
    },
  },
  updateMessageById: {
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
        customerMessageId: Joi.number().min(0),
        data: Joi.object(updateSchema),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateMessageById');
    },
  },
  getList: {
    tags: ['api', `${moduleName}`],
    description: `user get list ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyOwnerToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object({
          ...findMessagesSchema,
          customerId: Joi.number().required(),
        }),
        startDate: Joi.string(),
        endDate: Joi.string(),
        searchText: Joi.string(),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
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
  find: {
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
        filter: Joi.object(filterSchema),
        startDate: Joi.string(),
        endDate: Joi.string(),
        searchText: Joi.string(),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
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
  getDetailById: {
    tags: ['api', `${moduleName}`],
    description: `user find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyOwnerToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        messageCustomerId: Joi.number().min(0).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getDetailById');
    },
  },
  findById: {
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
      Response(req, res, 'findById');
    },
  },
  searchCustomerMessage: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    validate: {
      payload: Joi.object({
        filter: Joi.object({
          customerMessageUpdateStatus: Joi.number(),
          customerMessageCategories: Joi.string(),
          customerMessageName: Joi.string(),
        }),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('updatedAt'),
          value: Joi.string().default('desc'),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'searchCustomerMessage');
    },
  },
  summaryView: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    validate: {
      payload: Joi.object({
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'summaryView');
    },
  },
  sendMessageByFilter: {
    tags: ['api', `${moduleName}`],
    description: `admin send message by filter ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdminToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        ...filterCustomerRecordSchema,
        filter: Joi.object({
          username: Joi.string(),
          email: Joi.string(),
          phoneNumber: Joi.string(),
          name: Joi.string(),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'sendMessageByFilter');
    },
  },
  sendMessageByCustomerList: {
    tags: ['api', `${moduleName}`],
    description: `admin send message by list ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdminToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        customerRecordIdList: Joi.array().items(Joi.number()),
        ...filterCustomerRecordSchema,
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'sendMessageByCustomerList');
    },
  },
  findMessages: {
    tags: ['api', `${moduleName}`],
    description: `admin get messages ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdminToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        searchText: Joi.string(),
        startDate: Joi.string(),
        endDate: Joi.string(),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'findMessages');
    },
  },
  findMessagesSent: {
    tags: ['api', `${moduleName}`],
    description: `admin get messages sent ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdminToken }],
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
          messageSendStatus: Joi.string().allow(['', MESSAGE_STATUS.COMPLETED, MESSAGE_STATUS.FAILED]),
        }),
        startDate: Joi.string(),
        searchText: Joi.string(),
        endDate: Joi.string(),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'findMessagesSent');
    },
  },
  findDetailMessageById: {
    tags: ['api', `${moduleName}`],
    description: `admin get messages ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdminToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        customerMessageId: Joi.number().required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'findDetailMessageById');
    },
  },
  deleteMessageById: {
    tags: ['api', `${moduleName}`],
    description: `admin get messages ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdminToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        customerMessageId: Joi.number().required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'deleteMessageById');
    },
  },
};
