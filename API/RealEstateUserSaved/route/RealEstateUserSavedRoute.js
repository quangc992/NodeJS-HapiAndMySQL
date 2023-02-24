/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'RealEstateUserSaved';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const insertSchema = {
  realEstateId: Joi.number(),
};

const updateSchema = {
  ...insertSchema,
  isHidden: Joi.number(),
};

const filterSchema = {
  ...insertSchema,
  isHidden: Joi.number(),
};

const filterSchemaGetList = {
  realEstateTitle: Joi.string(),
  realEstatePhone: Joi.string(),
  realEstateEmail: Joi.string(),
  realEstateDescription: Joi.string(),
  realEstateLandLongs: Joi.number(),
  realEstateLandWidth: Joi.number(),
  realEstateUnitPrice: Joi.string(),
  realEstateJuridicalName: Joi.string(),
  realEstateLocationStreetWidth: Joi.number(),
  realEstateLocationFrontStreetWidth: Joi.number(),
  realEstateHouseDirection: Joi.string(),
  realEstateHouseFurnitureList: Joi.string(),
  realEstateHouseFloors: Joi.number(),
  realEstateHouseBedRooms: Joi.number(),
  realEstateHouseToilets: Joi.number(),
  realEstateContactTypeId: Joi.number(),
  realEstateProjectId: Joi.number(),
  staffId: Joi.number(),
  realEstateCategoryId: Joi.number(),
  realEstateSubCategoryId: Joi.number(),
  realEstatePostTypeId: Joi.number(),
  areaCountryName: Joi.string(),
  areaProvinceName: Joi.string(),
  areaDistrictName: Joi.string(),
  areaStreetId: Joi.number(),
  areaWardName: Joi.string(),
  areaStreetName: Joi.string(),
  lat: Joi.number(),
  lng: Joi.number(),
  AreaCountryDataKey: Joi.string(),
  AreaWardDataKey: Joi.string(),
  AreaDistrictDataKey: Joi.string(),
  AreaProvinceDataKey: Joi.string(),
  realEstateJuridicalId: Joi.number(),
  realEstateFurnitureId: Joi.number(),
  derectionHouseKey: Joi.string(),
  derectionBalconyKey: Joi.string(),
  derectionRealEstateKey: Joi.string(),
  apartmentCode: Joi.string(),
  apartmentCodeStatus: Joi.number(),
  statusId: Joi.number(),
  agencyId: Joi.number(),
  derectionHouseKey: Joi.number(),
  areaCountryId: Joi.number(),
  areaProvinceId: Joi.number(),
  areaDistrictId: Joi.number(),
  areaWardId: Joi.number(),
  approveStatus: Joi.number(),
  realEstateJuridicalId: Joi.number(),
  AreaStreetId: Joi.number(),
  appUserId: Joi.number(),
  agencyPercent: Joi.number(),
  agency: Joi.number(),
  isHidden: Joi.number(),
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
  deleteById: {
    tags: ['api', `${moduleName}`],
    description: `delete by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyOwnerToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        realEstateId: Joi.number().min(0).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'deleteById');
    },
  },
  getList: {
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
        filter: Joi.object(filterSchemaGetList),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getList');
    },
  },
};
