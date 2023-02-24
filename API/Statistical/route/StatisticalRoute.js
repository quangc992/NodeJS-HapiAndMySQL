/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const moduleName = 'Statistical';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const areaFilterSchema = {
  areaCountryId: Joi.number().min(0),
  areaProvinceId: Joi.number().min(0),
  areaDistrictId: Joi.number().min(0),
};

module.exports = {
  generalReport: {
    tags: ['api', `${moduleName}`],
    description: `statistical general report ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        startDate: Joi.string().default(new Date().toISOString()),
        endDate: Joi.string().default(new Date().toISOString()),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'generalReport');
    },
  },
  summaryUserPayment: {
    tags: ['api', `${moduleName}`],
    description: `summaryUserPayment ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        appUserId: Joi.number().required().min(1),
        startDate: Joi.string().default(new Date().toISOString()),
        endDate: Joi.string().default(new Date().toISOString()),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'summaryUserPayment');
    },
  },
  userSummaryReferUser: {
    tags: ['api', `${moduleName}`],
    description: `userSummaryReferUser`,
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
        limit: Joi.number().default(5).max(20),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userSummaryReferUser');
    },
  },
  summaryCountUserFAC: {
    tags: ['api', `${moduleName}`],
    description: `summaryFAC ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        startDate: Joi.string().default(new Date().toISOString()),
        endDate: Joi.string().default(new Date().toISOString()),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'summaryCountUserFAC');
    },
  },
  summaryUserReport: {
    tags: ['api', `${moduleName}`],
    description: `statistical general report ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({}),
    },
    handler: function (req, res) {
      Response(req, res, 'summaryUserReport');
    },
  },
  summaryServicePackageReport: {
    tags: ['api', `${moduleName}`],
    description: `statistical general report ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({}),
    },
    handler: function (req, res) {
      Response(req, res, 'summaryServicePackageReport');
    },
  },
};
