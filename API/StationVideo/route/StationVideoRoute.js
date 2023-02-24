/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const moduleName = 'StationVideo';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const insertSchema = {
  stationsId: Joi.number().required().min(1),
  videoName: Joi.string().required().max(255),
  uploadFileName: Joi.string().required().max(255),
  uploadVideoUrl: Joi.string().required().max(500),
  uploadFileExtension: Joi.string().required().max(255),
  uploadFileSize: Joi.string().required().max(255),
  stationVideoNote: Joi.string().max(255),
};

const updateSchema = {
  videoName: Joi.string().max(255),
  uploadFileName: Joi.string().max(255),
  uploadVideoUrl: Joi.string().max(500),
  uploadFileExtension: Joi.string().max(255),
  uploadFileSize: Joi.string().max(255),
  stationVideoNote: Joi.string().max(255),
};

const filterSchema = {
  stationsId: Joi.number(),
};

module.exports = {
  insert: {
    tags: ['api', `${moduleName}`],
    description: `findById ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: insertSchema,
    },
    handler: function (req, res) {
      Response(req, res, 'insert');
    },
  },
  updateById: {
    tags: ['api', `${moduleName}`],
    description: `findById ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number(),
        data: Joi.object(updateSchema),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateById');
    },
  },
  findById: {
    tags: ['api', `${moduleName}`],
    description: `findById ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(1),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'findById');
    },
  },
  deleteById: {
    tags: ['api', `${moduleName}`],
    description: `findById ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(1),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'deleteById');
    },
  },
  find: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
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
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        startDate: Joi.string(),
        endDate: Joi.string(),
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
  uploadCameraVideo: {
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
        videoData: Joi.binary().encoding('base64'),
        videoFormat: Joi.string().default('png'),
        uploadCameraId: Joi.number().required(),
      }),
    },
    payload: {
      maxBytes: 2000 * 1024 * 1024, //100 mb
      parse: true,
    },
    handler: function (req, res) {
      Response(req, res, 'uploadCameraVideo');
    },
  },
  //this API is use for robot to insert automatically
  uploadCameraVideoMultipart: {
    tags: ['api', `${moduleName}`],
    description: `uploadCameraVideoMultipart ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    payload: {
      output: 'file',
      parse: true,
      maxBytes: 2048 * 1024 * 1024, //2 Gb
      // allow: 'multipart/form-data',
      // multipart: {
      //     output: 'data',
      // }
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
    },
    handler: function (req, res) {
      Response(req, res, 'uploadCameraVideoMultipart');
    },
  },
  exportExcelStationVideo: {
    tags: ['api', `${moduleName}`],
    description: `exportExcel ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object({ stationsId: Joi.number().min(1) }),
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
      Response(req, res, 'exportExcelStationVideo');
    },
  },
};
