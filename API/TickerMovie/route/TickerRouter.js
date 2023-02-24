'use strict';

const Joi = require('joi');

const moduleName = 'TickerMovie';
const Manager = require(`../manager/${moduleName}Manager`);
const CommonFunctions = require('../../Common/CommonFunctions');
const Response = require('../../Common/route/response').setup(Manager);

const insertSchema = {
  ShowtimeId : Joi.string(),
  SeatNumber: Joi.number(),
  Price: Joi.number(),
  CustomerName: Joi.string(),
  PaymentMethod: Joi.string(),
};

const getByIdSchema = {
  TickerMovieId : Joi.number().default(1),
};


const deleteByIdSchema = {
  TickerMovieId : Joi.number().default(1),
};

const updateSchema = {
  TickerMovieId: Joi.number().default(1),
  ShowtimeId : Joi.string().default('edit-string'),
  SeatNumber: Joi.number().default(100),
  Price: Joi.number().default(10000),
  CustomerName: Joi.string().default('edit-string'),
  PaymentMethod: Joi.string().default('VND'),
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
  findAll: {
    tags: ['api', `${moduleName}`],
    description: `findAll ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
    },
    handler: function (req, res) {
      Response(req, res, 'findAll');
    },
  },
  findById: {
    tags: ['api', `${moduleName}`],
    description: `findAll ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object(getByIdSchema),
    },
    handler: function (req, res) {
      Response(req, res, 'findById');
    },
  },
  updateById: {
    tags: ['api', `${moduleName}`],
    description: `findAll ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object(updateSchema),
    },
    handler: function (req, res) {
      Response(req, res, 'updateById');
    },
  },
  deleteById: {
    tags: ['api', `${moduleName}`],
    description: `findAll ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object(deleteByIdSchema),
    },
    handler: function (req, res) {
      Response(req, res, 'deleteById');
    },
  },
};
