/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'CommonPlace';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const { COMMON_PLACE_TYPE } = require('../CommonPlaceConstant');

const insertCommonPlace = {
  commonPlaceName: Joi.string(),
  lat: Joi.number(),
  lng: Joi.number(),
  areaProvinceId: Joi.number(),
  areaDistrictId: Joi.number(),
  areaWardId: Joi.number(),
  commonPlaceType: Joi.string().allow(Object.keys(COMMON_PLACE_TYPE)),
};

const filterCommonPlace = {
  ...insertCommonPlace,
  isHidden: Joi.number(),
  commonPlaceType: Joi.string().allow(Object.keys(COMMON_PLACE_TYPE)),
};

const updateCommonPlace = {
  ...filterCommonPlace,
  isDeleted: Joi.number(),
  commonPlaceType: Joi.string().allow(Object.keys(COMMON_PLACE_TYPE)),
};

module.exports = {
  insert: {
    tags: ['api', `${moduleName}`],
    description: `staff insert common place - ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        ...insertCommonPlace,
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'insert');
    },
  },
  find: {
    tags: ['api', `${moduleName}`],
    description: `staff get common place - ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterCommonPlace),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
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
  updateById: {
    tags: ['api', `${moduleName}`],
    description: `staff update common place - ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        commonPlaceId: Joi.number(),
        data: Joi.object({
          ...updateCommonPlace,
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateById');
    },
  },
  deleteById: {
    tags: ['api', `${moduleName}`],
    description: `staff delete common place - ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        commonPlaceId: Joi.number().required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'deleteById');
    },
  },
};
