/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 11/18/21.
 */

'use strict';
const moduleName = 'SystemConfigurations';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

module.exports = {
  find: {
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
      payload: Joi.object({}),
    },
    handler: function (req, res) {
      Response(req, res, 'find');
    },
  },
  updateConfigs: {
    tags: ['api', `${moduleName}`],
    description: `Update configs`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        data: Joi.object({
          telegramGroupUrl: Joi.string(),
          fbMessengerUrl: Joi.string(),
          zaloUrl: Joi.string(),
          playStoreUrl: Joi.string(),
          appStoreUrl: Joi.string(),
          instagramUrl: Joi.string(),
          facebookUrl: Joi.string(),
          twitterUrl: Joi.string(),
          youtubeUrl: Joi.string(),
          websiteUrl: Joi.string(),
          hotlineNumber: Joi.string(),
          address: Joi.string(),
          systemVersion: Joi.string(),
          exchangeVNDPrice: Joi.number(),
          bannerImage1: Joi.string(),
          bannerImage2: Joi.string(),
          bannerImage3: Joi.string(),
          bannerImage4: Joi.string(),
          bannerImage5: Joi.string(),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateById');
    },
  },

  userGetDetail: {
    tags: ['api', `${moduleName}`],
    description: `userGetDetail ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),
      payload: Joi.object({}),
    },
    handler: function (req, res) {
      Response(req, res, 'userGetDetail');
    },
  },
};
