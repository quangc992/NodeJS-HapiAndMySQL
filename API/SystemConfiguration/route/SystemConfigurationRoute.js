/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 11/18/21.
 */

'use strict';
const moduleName = 'SystemConfiguration';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

module.exports = {
  find: {
    tags: ['api', `${moduleName}`],
    description: `Get List ${moduleName}`,
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
      Response(req, res, 'find');
    },
  },
  getSystemConfig: {
    tags: ['api', `${moduleName}`],
    description: `getSystemConfig ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),
      payload: Joi.object({}),
    },
    handler: function (req, res) {
      Response(req, res, 'getSystemConfig');
    },
  },

  updateConfigs: {
    tags: ['api', `${moduleName}`],
    description: `Update configs`,
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
          telegramGroupUrl: Joi.string().allow(''),
          fbMessengerUrl: Joi.string().allow(''),
          zaloUrl: Joi.string().allow(''),
          playStoreUrl: Joi.string().allow(''),
          appStoreUrl: Joi.string().allow(''),
          websiteUrl: Joi.string().allow(''),
          hotlineNumber: Joi.string().allow(''),
          address: Joi.string().allow(''),
          systemVersion: Joi.string().allow(''),
          exchangeVNDPrice: Joi.number().min(20000),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateById');
    },
  },
};
