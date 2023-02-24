/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const Joi = require('joi');
const moduleName = 'TaskUpdateHistory';
const Manager = require(`../manager/${moduleName}Manager`);
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const { CHANGE_TYPE } = require('../TaskUpdateHistoryConstants');

const insertSchema = {
  taskId: Joi.number().integer().required(),
  updatedColumnName: Joi.string().required(),
  changeType: Joi.number().integer().default(10).valid([CHANGE_TYPE.UPDATE, CHANGE_TYPE.ADD, CHANGE_TYPE.DELETE]),
  fromValue: Joi.string(),
  toValue: Joi.string(),
};

const filterSchema = {
  taskId: insertSchema.taskId,
};

module.exports = {
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
        filter: Joi.object(filterSchema).required(),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(400),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('asc').allow(''),
        }),
      }),
    },
    handler(req, res) {
      Response(req, res, 'find');
    },
  },
};
