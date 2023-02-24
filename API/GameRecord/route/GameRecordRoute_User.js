/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'GameRecord';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const filterSchema = {
  gameRecordType: Joi.string().required().max(255),
  gameRecordSection: Joi.string().max(255),
};

module.exports = {
  getList: {
    tags: ['api', `${moduleName}`],
    description: `getList ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema).required(),
        startDate: Joi.string(),
        endDate: Joi.string(),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userGetListGameRecord');
    },
  },
  userGetCurrentGameRecord: {
    tags: ['api', `${moduleName}`],
    description: `getList ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        gameRecordType: Joi.string().required().max(255),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userGetCurrentGameRecord');
    },
  },
  userGetLatestGameRecord: {
    tags: ['api', `${moduleName}`],
    description: `getList ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        gameRecordType: Joi.string().required().max(255),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userGetLatestGameRecord');
    },
  },
};
