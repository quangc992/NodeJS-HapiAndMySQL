/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'RealEstateRaw';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const crawlerSchema = require('../model/RealEstateCrawlerModel').schema;
const rawSchema = require('../model/RealEstateRawModel').schema;

const filterRaw = Joi.object({
  realEstateTitle: Joi.string(),
  realEstatePhone: Joi.string(),
  realEstateEmail: Joi.string(),
  realEstateContacAddress: Joi.string(),
  realEstateDescription: Joi.string(),
  realEstateLandRealitySquare: Joi.number(),
  realEstateLandDefaultSquare: Joi.number(),
  realEstateLandRoadSquare: Joi.number(),
  realEstateLandRealConstructionSquare: Joi.number(),
  realEstateLandLongs: Joi.number(),
  realEstateLandWidth: Joi.number(),
  realEstateValueSalePrice: Joi.number(),
  realEstateUnitPrice: Joi.number(),
  realEstateJuridicalName: Joi.number(),
  realEstateLocationFrontStreetWidth: Joi.number(),
  realEstateLocationStreetWidth: Joi.number(),
  realEstateHouseDirection: Joi.number(),
  realEstateBalconyDirection: Joi.number(),
  realEstateDirection: Joi.number(),
  realEstateLocationHomeNumber: Joi.string(),
  realEstateHouseFurnitureList: Joi.string(),
  realEstateLandShapeName: Joi.number(),
  realEstateHouseFloors: Joi.number(),
  realEstateHouseBedRooms: Joi.number(),
  realEstateHouseToilets: Joi.number(),
  realEstateContactTypeId: Joi.number(),
});
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
      payload: Joi.array().items(crawlerSchema),
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
        id: Joi.number().min(0).required(),
        data: rawSchema,
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
        filter: filterRaw,
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
        id: Joi.number().min(0).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'findById');
    },
  },
  deleteById: {
    tags: ['api', `${moduleName}`],
    description: `delete by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'deleteById');
    },
  },
  staffApproveRealEstateRaw: {
    tags: ['api', `${moduleName}`],
    description: `Admin duyệt bài đăng từ Crawler ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdminToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'staffApproveRealEstateRaw');
    },
  },
};
