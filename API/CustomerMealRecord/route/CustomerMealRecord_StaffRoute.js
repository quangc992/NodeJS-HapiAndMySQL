/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'CustomerMealRecord';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const insertSchema = {
  mealTitle: Joi.string(),
  mealDescription: Joi.string(),
  mealTime: Joi.string().required(),
  mealDate: Joi.string().required(),
  mealImageThumbnail: Joi.string(),
  mealImages: Joi.array().items(Joi.string()),
};

const updateSchema = {
  mealTitle: Joi.string(),
  mealDescription: Joi.string(),
  mealTime: Joi.string(),
  mealDate: Joi.string(),
  mealImageThumbnail: Joi.string(),
  mealImages: Joi.array().items(Joi.string()),
};

const filterSchema = {
  appUserId: Joi.number(),
};

module.exports = {
  staffGetListMealRecordByUserId: {
    tags: ['api', `${moduleName}`],
    description: `staff get list ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object({
          appUserId: Joi.number(),
        }),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(400),
        startDate: Joi.string(),
        endDate: Joi.string(),
        searchText: Joi.string(),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'staffGetListMealRecordByUserId');
    },
  },
  staffGetDetailMealRecordById: {
    tags: ['api', `${moduleName}`],
    description: `staff find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
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
      Response(req, res, 'staffGetDetailMealRecordById');
    },
  },
};
