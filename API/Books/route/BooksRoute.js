/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'Books';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const { BOOK_UPDATE_STATUS } = require('../BookConstants');
const insertSchema = {
  booksName: Joi.string(),
  booksRating: Joi.number(),
  booksCreators: Joi.string(),
  booksStatus: Joi.number(),
  booksCategories: Joi.string(),
  booksUpdateStatus: Joi.number(),
};

const updateSchema = {
  ...insertSchema,
  isDeleted: Joi.number(),
};

const filterSchema = {
  ...insertSchema,
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
        id: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'findById');
    },
  },
  bookList: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    validate: {
      payload: Joi.object({
        filter: Joi.object({
          booksUpdateStatus: Joi.number(),
          booksViewedStatus: Joi.number(),
        }),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('updatedAt'),
          value: Joi.string().default('desc'),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'bookList');
    },
  },
  searchBooks: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    validate: {
      payload: Joi.object({
        filter: Joi.object({
          booksUpdateStatus: Joi.number(),
          booksCategories: Joi.string(),
          booksName: Joi.string(),
        }),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('updatedAt'),
          value: Joi.string().default('desc'),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'searchBooks');
    },
  },
  bookDetail: {
    tags: ['api', `${moduleName}`],
    description: `get details ${moduleName}`,
    validate: {
      payload: Joi.object({
        booksUrl: Joi.string(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'bookDetail');
    },
  },
  summaryView: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    validate: {
      payload: Joi.object({
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'summaryView');
    },
  },
};
