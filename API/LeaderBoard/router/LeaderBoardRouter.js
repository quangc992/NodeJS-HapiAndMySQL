/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const moduleName = 'LeaderBoard';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const insertSchema = {
  totalPlayScore: Joi.number().required(),
  totalReferScore: Joi.number().required(),
  appUserId: Joi.number().required(),
};
const filterSchema = {
  appUserId: Joi.number(),
  totalScore: Joi.number(),
  ranking: Joi.number(),
};
module.exports = {
  // insert: {
  //   tags: ["api", `${moduleName}`],
  //   description: `insert ${moduleName}`,
  //   pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
  //   auth: {
  //     strategy: 'jwt',
  //   },
  //   validate: {
  //     headers: Joi.object({
  //       authorization: Joi.string(),
  //     }).unknown(),
  //     payload: Joi.object(insertSchema)
  //   },
  //   handler: function (req, res) {
  //     Response(req, res, "insert");
  //   }
  // },
  userGetTopRank: {
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
      payload: Joi.object({}),
    },
    handler: function (req, res) {
      Response(req, res, 'userGetTopRank');
    },
  },
  updateRanKing: {
    tags: ['api', `${moduleName}`],
    description: `update ranking`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdminToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        appUserId: Joi.number(),
        ranking: Joi.number(),
        totalScore: Joi.number(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateRanKingById');
    },
  },
  find: {
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
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('ranking').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'find');
    },
  },
};
