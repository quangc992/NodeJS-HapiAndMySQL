/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const moduleName = 'StaffTask';
const moment = require('moment');
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const { STAFF_TASK_PRIORITY, STAFF_TASK_STATUS } = require('../StaffTaskConstants');

const insertSchema = {
  taskPriority: Joi.number().default(STAFF_TASK_PRIORITY.STAFF_TASK_PRIORITY_NORMAL),
  taskStatus: Joi.number().default(STAFF_TASK_STATUS.NEW),
  taskType: Joi.number(),
  taskDescription: Joi.string().max(10000).allow(''),
  taskTags: Joi.string(),
  taskTitle: Joi.string().max(250).required(),
  parentTaskId: Joi.number(),
  stationId: Joi.number(),
  taskCompletedPercentage: Joi.number().min(0).max(100),
  assignedStaffId: Joi.number(),
  taskStartDate: Joi.date(),
  taskEndDate: Joi.date(),
};

const updateSchema = {
  ...insertSchema,
  taskPriority: Joi.number(),
  taskStatus: Joi.number(),
  taskTitle: Joi.string().max(250),
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
      payload: Joi.object({
        taskData: insertSchema,
        staffList: Joi.array().items(Joi.number()),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'insert');
    },
  },

  deleteById: {
    tags: ['api', `${moduleName}`],
    description: `delete ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'deleteById');
    },
  },

  updateById: {
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
        id: Joi.number().required(),
        taskData: updateSchema,
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateById');
    },
  },

  updateStaffOnTask: {
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
        taskId: Joi.number().required(),
        staffId: Joi.number().required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateStaffOnTask');
    },
  },

  finById: {
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
        id: Joi.number().required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'findById');
    },
  },

  find: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyStaffToken },
      { method: CommonFunctions.putAllStationIdsUnderAuthotity },
    ],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: {
          taskStatus: Joi.number(),
          taskPriority: Joi.number(),
          stationId: Joi.number(),
          parentTaskId: Joi.number(),
          reportedStaffId: Joi.number(),
          assignedStaffId: Joi.number(),
        },
        searchText: Joi.string(),
        startDate: Joi.string(),
        endDate: Joi.string(),
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

  statisticalWorkProgress: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyStaffToken },
      { method: CommonFunctions.putAllStationIdsUnderAuthotity },
    ],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: {
          stationId: Joi.number(),
        },
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'statisticalWorkProgress');
    },
  },

  statisticalAmountOfWork: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyStaffToken },
      { method: CommonFunctions.putAllStationIdsUnderAuthotity },
    ],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: {
          stationId: Joi.number(),
        },
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'statisticalAmountOfWork');
    },
  },

  statisticalOutOfWork: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyStaffToken },
      { method: CommonFunctions.putAllStationIdsUnderAuthotity },
    ],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: {
          stationId: Joi.number(),
        },
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'statisticalOutOfWork');
    },
  },

  generateTask: {
    tags: ['api', `${moduleName}`],
    description: `generateTask from content ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        content: Joi.string().required().min(1).max(20000),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'generateTask');
    },
  },
};
