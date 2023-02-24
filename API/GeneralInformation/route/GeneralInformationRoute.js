/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 11/18/21.
 */

'use strict';
const moduleName = 'GeneralInformation';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

module.exports = {
  find: {
    tags: ['api', `${moduleName}`],
    description: `Get List ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),
      payload: Joi.object({}),
    },
    handler: function (req, res) {
      Response(req, res, 'find');
    },
  },
  updateAboutUs: {
    tags: ['api', `${moduleName}`],
    description: `Update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        data: Joi.object({
          aboutUs: Joi.string(),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateById');
    },
  },
  updateQuestionAndAnwser: {
    tags: ['api', `${moduleName}`],
    description: `Update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        data: Joi.object({
          questionAndAnwser: Joi.string(),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateById');
    },
  },
  updateGeneralRule: {
    tags: ['api', `${moduleName}`],
    description: `Update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        data: Joi.object({
          generalRule: Joi.string(),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateById');
    },
  },
  updateAppPolicy: {
    tags: ['api', `${moduleName}`],
    description: `Update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        data: Joi.object({
          appPolicy: Joi.string(),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateById');
    },
  },
};
