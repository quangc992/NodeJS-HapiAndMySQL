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
  mealDescription: Joi.string().allow(''),
  mealTime: Joi.string().required(),
  mealDate: Joi.string().required(),
  mealImageThumbnail: Joi.string(),
  mealImage1: Joi.string(),
  mealImage2: Joi.string(),
  mealImage3: Joi.string(),
  mealImage4: Joi.string(),
  mealImage5: Joi.string(),
  mealImage6: Joi.string(),
  mealImage7: Joi.string(),
  mealImage8: Joi.string(),
  mealImage9: Joi.string(),
  mealImage10: Joi.string(),
};

const updateSchema = {
  mealTitle: Joi.string(),
  mealDescription: Joi.string(),
  mealTime: Joi.string(),
  mealDate: Joi.string(),
  mealImageThumbnail: Joi.string(),
  mealImage1: Joi.string(),
  mealImage2: Joi.string(),
  mealImage3: Joi.string(),
  mealImage4: Joi.string(),
  mealImage5: Joi.string(),
  mealImage6: Joi.string(),
  mealImage7: Joi.string(),
  mealImage8: Joi.string(),
  mealImage9: Joi.string(),
  mealImage10: Joi.string(),
};

const filterSchema = {
  mealTime: Joi.string(),
  mealDate: Joi.string(),
};

module.exports = {
  userInsertMealRecord: {
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
      Response(req, res, 'userInsertMealRecord');
    },
  },
  userUpdateMealRecord: {
    tags: ['api', `${moduleName}`],
    description: `user update ${moduleName}`,
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
      Response(req, res, 'userUpdateMealRecord');
    },
  },
  userGetListMealRecord: {
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
      Response(req, res, 'userGetListMealRecord');
    },
  },
  userGetDetailMealRecordById: {
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
      Response(req, res, 'userGetDetailMealRecordById');
    },
  },
  // deleteById: {
  //   tags: ["api", `${moduleName}`],
  //   description: `Delete ${moduleName}`,
  //   validate: {
  //     headers: Joi.object({
  //       authorization: Joi.string(),
  //     }).unknown(),
  //     payload: Joi.object({
  //       id: Joi.number().min(0),
  //     })
  //   },
  //   handler: function (req, res) {
  //     Response(req, res, "deleteById");
  //   }
  // },
};
