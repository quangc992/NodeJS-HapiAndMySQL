/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 11/15/21.
 */
'use strict';
const moduleName = 'RealEstateProject';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const insertSchema = {
  realEstateProjectTitle: Joi.string().required(),
  projectTypeId: Joi.number().required(),
  introduceImage: Joi.string().required(),
  countryId: Joi.number().required(),
  provinceId: Joi.number().required(),
  districtId: Joi.number().required(),
  wardId: Joi.number().required(),
  street: Joi.string().required(),
  description: Joi.string(),
  legalStatus: Joi.string().required(),
  constructionUnit: Joi.string(),
  managerUnit: Joi.string(),
  designUnit: Joi.string(),
  listFacilityIds: Joi.string(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  numberOfBuilding: Joi.number(),
  numberOfApartment: Joi.number(),
  buildingDensity: Joi.number(),
  realEstateProjectOwner: Joi.number().required(),
  status: Joi.number().required().min(0),
  progress: Joi.number().required().min(0),
  statusNote: Joi.string(),
};

const updateSchema = {
  ...insertSchema,
};

const filterSchema = {
  realEstateProjectTitle: Joi.string(),
  projectTypeId: Joi.number(),
  countryId: Joi.number(),
  provinceId: Joi.number(),
  districtId: Joi.number(),
  wardId: Joi.number(),
  status: Joi.number().min(0),
  progress: Joi.number().min(0),
};

const statusFilter = {
  status: Joi.number().min(0),
  progress: Joi.number().min(0),
};

module.exports = {
  insert: {
    tags: ['api', `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
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
  getListRealEstateProject: {
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
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        startDate: Joi.string(),
        endDate: Joi.string(),
        searchText: Joi.string(),
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

  getRealEstateProjectById: {
    tags: ['api', `${moduleName}`],
    description: `find by id ${moduleName}`,
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
      Response(req, res, 'findById');
    },
  },
  uploadImage: {
    tags: ['api', `${moduleName}`],
    description: `upload image for ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().required().min(0),
        imageData: Joi.binary().encoding('base64'),
        imageFormat: Joi.string().default('png'),
      }),
    },
    payload: {
      maxBytes: 10 * 1024 * 1024, //10 mb
      parse: true,
    },
    handler: function (req, res) {
      Response(req, res, 'uploadImage');
    },
  },
};
