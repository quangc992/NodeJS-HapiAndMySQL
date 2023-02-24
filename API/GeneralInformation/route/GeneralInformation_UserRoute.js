/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 11/18/21.
 */

'use strict';
const moduleName = 'GeneralInformation';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

module.exports = {
  userGetAboutUs: {
    tags: ['api', `${moduleName}`],
    description: `Get List ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),
      payload: Joi.object({}),
    },
    handler: function (req, res) {
      Response(req, res, 'userGetAboutUs');
    },
  },
  userGetAppPolicy: {
    tags: ['api', `${moduleName}`],
    description: `Get List ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),
      payload: Joi.object({}),
    },
    handler: function (req, res) {
      Response(req, res, 'userGetAppPolicy');
    },
  },
  userGetGeneralRule: {
    tags: ['api', `${moduleName}`],
    description: `Get List ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),
      payload: Joi.object({}),
    },
    handler: function (req, res) {
      Response(req, res, 'userGetGeneralRule');
    },
  },
  userGetQuestionAndAnwser: {
    tags: ['api', `${moduleName}`],
    description: `Get List ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),
      payload: Joi.object({}),
    },
    handler: function (req, res) {
      Response(req, res, 'userGetQuestionAndAnwser');
    },
  },
  userViewGeneralRule: {
    tags: ['api', `${moduleName}`],
    description: `userViewGeneralRule ${moduleName}`,
    // pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty}],
    // validate: {
    //   headers: Joi.object({
    //     authorization: Joi.string().allow(''),
    //   }).unknown(),
    //   payload: Joi.object({}),
    // },
    handler: async function (req, res) {
      res(Manager.userViewGeneralRule()).code(200);
      return;
    },
  },
  userViewAppPolicy: {
    tags: ['api', `${moduleName}`],
    description: `userViewAppPolicy ${moduleName}`,
    // pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty}],
    // validate: {
    //   headers: Joi.object({
    //     authorization: Joi.string().allow(''),
    //   }).unknown(),
    //   payload: Joi.object({}),
    // },
    handler: async function (req, res) {
      res(Manager.userViewAppPolicy()).code(200);
      return;
    },
  },
};
