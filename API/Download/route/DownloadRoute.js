/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'Download';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const bookFilterSchema = {
  booksName: Joi.string(),
  booksRating: Joi.number(),
  booksCreators: Joi.string(),
  booksStatus: Joi.number(),
  booksCategories: Joi.string(),
  booksUpdateStatus: Joi.number(),
};

module.exports = {
  downloadBookReport: {
    tags: ['api', `${moduleName}`],
    description: `${moduleName} download media`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(bookFilterSchema),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'downloadBookReport');
    },
  },
};
