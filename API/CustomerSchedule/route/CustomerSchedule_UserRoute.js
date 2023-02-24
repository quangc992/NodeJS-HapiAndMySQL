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
  stationsId: Joi.number().min(0),
  agencyId: Joi.number().min(0),
  stationServicesId: Joi.number(),
  scheduleRefId: Joi.number(),
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
  agencyId: Joi.number(),
};

module.exports = {
  userInsertSchedule: {
    tags: ['api', `${moduleName}`],
    description: `user insert ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        ...insertSchema,
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userInsertSchedule');
    },
  },
  userCancelSchedule: {
    tags: ['api', `${moduleName}`],
    description: `user cancel ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        customerScheduleId: Joi.number().min(0).required(),
        customerScheduleNote: Joi.string().allow(''),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userCancelSchedule');
    },
  },
  userGetListSchedule: {
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
      Response(req, res, 'userGetListSchedule');
    },
  },
  userGetDetailSchedule: {
    tags: ['api', `${moduleName}`],
    description: `user get detail ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
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
      Response(req, res, 'userGetDetailSchedule');
    },
  },
};
