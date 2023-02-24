/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const PostTypeResource = require('./resourceAccess/RealEstatePostTypeResourceAccess');
const Logger = require('../../utils/logging');

async function findPostTypeByName(name) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {
        realEstatePostTypeName: name,
      };

      let postTypes = await PostTypeResource.find(filter, 0, 1);
      if (postTypes && postTypes.length > 0) {
        resolve(postTypes[0]);
      } else {
        Logger.warn(__filename, `findPostTypeByName failed with ${name}`);
        resolve(undefined);
      }
    } catch (e) {
      Logger.warn(__filename, `can not findPostTypeByName ${name}`);
      resolve(undefined);
    }
  });
}

module.exports = {
  findPostTypeByName,
};
