/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'DataFilter';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const filterAreaDataSchema = {
  areaDataName: Joi.string(),
  areaParentId: Joi.number().default(1).required(),
};

const filterRealEstateSchema = {
  realEstatePostTypeId: Joi.number().default(1).required(),
};

module.exports = {
  getAreaData: {
    tags: ['api', `${moduleName}`],
    description: `user get area data - ${moduleName}`,
    validate: {
      payload: Joi.object({
        ...filterAreaDataSchema,
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getAreaData');
    },
  },
  getDataFilterRealEstate: {
    tags: ['api', `${moduleName}`],
    description: `user get direction, category, type data - ${moduleName}`,
    validate: {
      payload: Joi.object({
        ...filterRealEstateSchema,
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getDataFilterRealEstate');
    },
  },
  getRealEstateUtil: {
    tags: ['api', `${moduleName}`],
    description: `user get realestate util data - ${moduleName}`,
    validate: {
      payload: Joi.object({
        realEstateCategoryId: Joi.number().required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getRealEstateUtil');
    },
  },
};
