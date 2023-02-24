/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const moduleName = 'CustomerInfo';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const insertSchema = {
  customerAvatarUrl: Joi.string().max(250).allow(['', null]),
  customerFullName: Joi.string().max(250).allow(['', null]),
  customerEmail: Joi.string().email().max(250).allow(['', null]),
  customerPhoneNumber: Joi.string().max(250).allow(['', null]),
  customerClassification: Joi.number().default(1),
  customerAddress: Joi.string().max(250).allow(['', null]),
  customerIdCard: Joi.string().max(250),
  customerGender: Joi.number(),
  customerDistrict: Joi.string().max(250).allow(['', null]),
  customerProvince: Joi.string().max(250).allow(['', null]),
  customerCompanyName: Joi.string().max(250).allow(['', null]),
  customerCompanyAddress: Joi.string().max(250).allow(['', null]),
  departmentId: Joi.number().integer(),
  // customerTarget: Joi.string().max(250).allow(['', null]),
  customerAttachmentUrl1: Joi.string().max(250).allow(['', null]),
  customerAttachmentUrl2: Joi.string().max(250).allow(['', null]),
  customerAttachmentUrl3: Joi.string().max(250).allow(['', null]),
  customerAttachmentUrl4: Joi.string().max(250).allow(['', null]),
  customerAttachmentUrl5: Joi.string().max(250).allow(['', null]),
  departmentId: Joi.number().min(0).max(9999).allow([null]),
  note: Joi.string().max(1000).allow(['', null]),
  customerVisitRecordId: Joi.number().min(0).max(9999).allow([null]),
};

const updateSchema = {
  ...insertSchema,
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
        customerData: Joi.object(insertSchema),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'insert');
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
        filter: {
          departmentId: Joi.number(),
          customerClassification: Joi.number(),
        },
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

  findById: {
    tags: ['api', `${moduleName}`],
    description: `findById ${moduleName}`,
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
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'findById');
    },
  },

  updateById: {
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
        id: Joi.number(),
        customerData: Joi.object(updateSchema),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateById');
    },
  },

  deleteById: {
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
        id: Joi.number(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'deleteById');
    },
  },
};
