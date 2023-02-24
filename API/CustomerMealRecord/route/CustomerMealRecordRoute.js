/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'CustomerRecord';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

// { method: 'POST', path: '/CustomerMealRecord/user/insert', config: CustomerMealRecordRoute.userInsertMealRecord },
// { method: 'POST', path: '/CustomerMealRecord/user/getList', config: CustomerMealRecordRoute.userGetListMealRecord },
// { method: 'POST', path: '/CustomerMealRecord/user/getDetail', config: CustomerMealRecordRoute.userGetDetailMealRecordById },

// { method: 'POST', path: '/CustomerMealRecord/staff/getUserMealList', config: CustomerMealRecordRoute.staffGetListMealRecord },
// { method: 'POST', path: '/CustomerMealRecord/staff/getUserMealDetail', config: CustomerMealRecordRoute.staffGetDetailMealRecordById },
const insertSchema = {
  mealTitle: Joi.string(),
  mealDescription: Joi.string(),
  mealTime: Joi.string().required(),
  mealDate: Joi.string().required(),
  mealImageThumbnail: string(),
  mealImages: Joi.array().items(Joi.string()),
};

const updateSchema = {
  mealTitle: Joi.string(),
  mealDescription: Joi.string(),
  mealTime: Joi.string(),
  mealDate: Joi.string(),
  mealImageThumbnail: string(),
  mealImages: Joi.array().items(Joi.string()),
};

const filterSchema = {
  mealTime: Joi.string(),
  mealDate: Joi.string(),
};

module.exports = {
  insert: {
    tags: ['api', `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
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
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
        data: Joi.object(updateSchema),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateById');
    },
  },
  find: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
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
      Response(req, res, 'find');
    },
  },
  findById: {
    tags: ['api', `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
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
      Response(req, res, 'findById');
    },
  },
  deleteById: {
    tags: ['api', `${moduleName}`],
    description: `Delete ${moduleName}`,
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'deleteById');
    },
  },
};
