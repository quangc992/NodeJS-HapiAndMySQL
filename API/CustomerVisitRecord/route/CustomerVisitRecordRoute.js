/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const Joi = require('joi');
const moment = require('moment');
const moduleName = 'CustomerVisitRecord';
const Manager = require(`../manager/${moduleName}Manager`);
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const insertSchema = {
  customerVisitRecordFullname: Joi.string().max(255),
  customerVisitRecordCompanyName: Joi.string().max(255),
  customerVisitRecordIdentity: Joi.string().allow([null, '']),
  receiverStationsId: Joi.number().integer().allow([null]),
  receiverId: Joi.number().integer().allow([null]),
  staffName: Joi.string().allow([null, '']),
  visitedAt: Joi.date().allow([null]),
  leaveAt: Joi.date().allow([null]),
  customerVisitRecordStatus: Joi.number().integer(),
  customerVisitRecordPurpose: Joi.string().allow([null, '']),
  customerVisitRecordNote: Joi.string().allow([null, '']),
  customerVisitRecordImageUrl: Joi.string().allow([null, '']),
};

const updateSchema = {
  ...insertSchema,
  leaveAt: Joi.date().example(moment().format()).allow([null]),
  customerVisitRecordStatus: Joi.number().integer(),
};

const filterSchema = {
  receiverStationsId: Joi.number().integer(),
  receiverId: Joi.number().integer(),
  customerInfoId: Joi.number().integer(),
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
        limit: Joi.number().default(20).max(400),
        startDate: Joi.string(),
        endDate: Joi.string(),
        searchText: Joi.string().max(255).allow(''),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler(req, res) {
      Response(req, res, 'find');
    },
  },
  findById: {
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
        id: Joi.number().integer().min(1),
      }),
    },
    handler(req, res) {
      Response(req, res, 'findById');
    },
  },
  updateById: {
    tags: ['api', `${moduleName}`],
    description: `updateById ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().integer().required(),
        data: Joi.object(updateSchema),
      }),
    },
    handler(req, res) {
      Response(req, res, 'updateById');
    },
  },
  deleteById: {
    tags: ['api', `${moduleName}`],
    description: `deleteById ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().integer(),
      }),
    },
    handler(req, res) {
      Response(req, res, 'deleteById');
    },
  },
};
