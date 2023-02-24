/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'CustomerRecord';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const insertSchema = {
  customerRecordFullName: Joi.string(),
  customerRecordPhone: Joi.string(),
  customerRecordPlatenumber: Joi.string().alphanum().required(),
  customerRecordState: Joi.number().default(0),
  customerRecordEmail: Joi.string().email(),
  customerRecordPlateColor: Joi.string(),
  customerRecordPlateImageUrl: Joi.string(),
  customerStationId: Joi.number().required(),
  customerRecordCheckDate: Joi.string().required(),
  customerRecordCheckExpiredDate: Joi.string(),
  customerRecordCheckDuration: Joi.number().default(null).min(1).max(99),
};

const updateSchema = {
  customerRecordFullName: Joi.string(),
  customerRecordPhone: Joi.string(),
  customerRecordPlatenumber: Joi.string().alphanum(),
  customerRecordState: Joi.number(),
  customerRecordEmail: Joi.string().email(),
  customerRecordPlateImageUrl: Joi.string(),
  customerRecordPlateColor: Joi.string(),
  customerRecordCheckDate: Joi.string(),
  customerRecordCheckExpiredDate: Joi.string(),
  customerRecordCheckDuration: Joi.number().min(1).max(99),
  isDeleted: Joi.number(),
};

const filterSchema = {
  customerRecordFullName: Joi.string(),
  customerRecordPhone: Joi.string(),
  customerRecordPlatenumber: Joi.string().alphanum(),
  customerRecordState: Joi.number(),
  customerRecordEmail: Joi.string().email(),
  customerRecordPlateImageUrl: Joi.string(),
  customerRecordCheckDate: Joi.string(),
  customerRecordCheckExpiredDate: Joi.string(),
  customerRecordCheckDuration: Joi.number().min(1).max(99),
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
        id: Joi.number().min(0),
        data: Joi.object(updateSchema),
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
      Response(req, res, 'find');
    },
  },
  findToday: {
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
      Response(req, res, 'findToday');
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
        id: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'findById');
    },
  },
  deleteById: {
    tags: ['api', `${moduleName}`],
    description: `Delete ${moduleName}`,
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'deleteById');
    },
  },
  exportExcelCustomerRecord: {
    tags: ['api', `${moduleName}`],
    description: `exportExcel ${moduleName}`,
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
      Response(req, res, 'exportCustomerRecord');
    },
  },
  importCustomerRecord: {
    tags: ['api', `${moduleName}`],
    description: `${moduleName} import customerRecord`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        file: Joi.binary().encoding('base64'),
        fileFormat: Joi.string().valid(['xlsx', 'xls', 'csv']).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'importCustomerRecord');
    },
  },
  //this API is use for robot to insert automatically
  robotInsert: {
    tags: ['api', `${moduleName}`],
    description: `robot insert ${moduleName}`,
    payload: {
      output: 'file',
      parse: true,
      // allow: 'multipart/form-data',
      // multipart: {
      //     output: 'data',
      // }
    },
    validate: {},
    handler: function (req, res) {
      Response(req, res, 'robotInsert');
    },
  },
};
