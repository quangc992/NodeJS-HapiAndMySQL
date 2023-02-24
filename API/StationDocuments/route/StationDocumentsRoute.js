/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const Joi = require('joi');
const moment = require('moment');
const moduleName = 'StationDocuments';
const Manager = require(`../manager/${moduleName}Manager`);
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const { FILE_TYPES, DOCUMENT_STATUS, DOCUMENT_TYPES } = require('.././StationDocumentsConstants');

const insertSchema = {
  documentName: Joi.string().max(255),
  documentCode: Joi.string().max(255),
  documentType: Joi.number().integer().default(DOCUMENT_TYPES.NORMAL_DOCUMENT), // công văn, tài liệu
  issuedDate: Joi.string().max(255),
  fileUrl: Joi.string().required(),
  thumbnailUrl: Joi.string().allow(''),
  fileType: Joi.number().integer().default(FILE_TYPES.WORD), // 1 id word document
  documentStatus: Joi.number().integer().default(DOCUMENT_STATUS.IS_BEING_ISSUED), // 1 is being issued
  stationsId: Joi.number().integer(),
};

const updateSchema = {
  ...insertSchema,
  fileUrl: Joi.string(),
  isDeleted: Joi.number(),
};

const filterSchema = {
  documentType: Joi.number().integer(),
  stationsId: Joi.number().integer(),
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
  find: {
    tags: ['api', `${moduleName}`],
    description: `find ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyStaffToken },
      { method: CommonFunctions.putAllStationIdsUnderAuthotityAndRootStationId },
    ],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema).required(),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(400),
        startDate: Joi.string(),
        endDate: Joi.string(),
        searchText: Joi.string().max(255).allow(''),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler(req, res) {
      Response(req, res, 'find');
    },
  },
  findById: {
    tags: ['api', `${moduleName}`],
    description: `find ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().integer().min(1),
      }),
    },
    handler(req, res) {
      Response(req, res, 'findById');
    },
  },
  updateById: {
    tags: ['api', `${moduleName}`],
    description: `updateById ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().integer(),
        data: Joi.object(updateSchema),
      }),
    },
    handler(req, res) {
      Response(req, res, 'updateById');
    },
  },
  deleteById: {
    tags: ['api', `${moduleName}`],
    description: `deleteById ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().integer(),
      }),
    },
    handler(req, res) {
      Response(req, res, 'deleteById');
    },
  },
};
