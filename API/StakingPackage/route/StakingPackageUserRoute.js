/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'StakingPackage';
const Manager = require(`../manager/StakingPackageUserManager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const filterSchema = {
  stakingActivityStatus: Joi.number(),
  appUserId: Joi.number(),
};

module.exports = {
  userRequestStaking: {
    tags: ['api', `${moduleName}`],
    description: `user Request Staking ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        stakingId: Joi.number(),
        secondaryPassword: Joi.string().min(6).allow([null, '']),
        stackingAmount: Joi.number(),
        stakingName: Joi.string(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userRequestStaking');
    },
  },
  getUserStakingHistory: {
    tags: ['api', `${moduleName}`],
    description: `UserHistory${moduleName}`,
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
        skip: Joi.number().default(0),
        limit: Joi.number().default(10).max(20),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getUserStakingHistory');
    },
  },
  find: {
    tags: ['api', `${moduleName}`],
    description: `getList ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        skip: Joi.number().default(0),
        limit: Joi.number().default(10).max(20),
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
};
