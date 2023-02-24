/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const RealEstateCategoryResource = require('./resourceAccess/RealEstateCategoryResourceAccess');
const Logger = require('../../utils/logging');

async function findCategoryByName(name) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {
        realEstateCategoryName: name,
      };

      let categories = await RealEstateCategoryResource.find(filter, 0, 1);
      if (categories && categories.length > 0) {
        resolve(categories[0]);
      } else {
        Logger.warn(__filename, `findCategoryIdByName failed with ${name}`);
        resolve(undefined);
      }
    } catch (e) {
      Logger.warn(__filename, `can not findCategoryIdByName ${name}`);
      resolve(undefined);
    }
  });
}

module.exports = {
  findCategoryByName,
};
