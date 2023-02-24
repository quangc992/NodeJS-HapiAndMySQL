/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'CustomerSchedule';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const insertSchema = {
  customerIdentity: Joi.string(),
  customerPhone: Joi.string().alphanum(),
  customerName: Joi.string().required(),
  customerEmail: Joi.string().email(),
  customerScheduleDate: Joi.string().required().default('2022/01/01'),
  customerScheduleTime: Joi.string().required().default('07:30'),
  customerScheduleNote: Joi.string().allow(''),
  stationsId: Joi.number(),
  appUserId: Joi.number(),
  agencyId: Joi.number(),
  stationProductsId: Joi.number(),
  stationServicesId: Joi.number(),
};

const updateSchema = {
  customerIdentity: Joi.string(),
  customerPhone: Joi.string().alphanum(),
  customerName: Joi.string(),
  customerEmail: Joi.string().email(),
  customerScheduleDate: Joi.string(),
  customerScheduleTime: Joi.string(),
  customerScheduleNote: Joi.string().allow(''),
  customerScheduleStatus: Joi.string(),
  customerScheduleAddress: Joi.string(),
  stationsId: Joi.number(),
  appUserId: Joi.number(),
  agencyId: Joi.number(),
  stationProductsId: Joi.number(),
  stationServicesId: Joi.number(),
};

const filterSchema = {
  customerIdentity: Joi.string(),
  customerPhone: Joi.string().alphanum(),
  customerName: Joi.string(),
  customerEmail: Joi.string(),
  customerScheduleDate: Joi.string(),
  customerScheduleTime: Joi.string(),
  customerScheduleStatus: Joi.string(),
  stationsId: Joi.number(),
  appUserId: Joi.number(),
  agencyId: Joi.number(),
  stationProductsId: Joi.number(),
  stationServicesId: Joi.number(),
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
        customerScheduleId: Joi.number().min(0),
        data: Joi.object(updateSchema),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateById');
    },
  },
  find: {
    tags: ['api', `${moduleName}`],
    description: `List ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        searchText: Joi.string(),
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
        customerScheduleId: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'findById');
    },
  },
  deleteById: {
    tags: ['api', `${moduleName}`],
    description: `Delete ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        customerScheduleId: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'deleteById');
    },
  },
  adminCancelSchedule: {
    tags: ['api', `${moduleName}`],
    description: `admin cancel ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        customerScheduleId: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'adminCancelSchedule');
    },
  },
};
