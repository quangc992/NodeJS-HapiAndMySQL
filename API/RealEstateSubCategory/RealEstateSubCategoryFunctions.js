/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const SubCategoryResource = require('./resourceAccess/RealEstateSubCategoryResourceAccess');
const Logger = require('../../utils/logging');

async function findSubCategoryByName(name, categoryId) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {
        realEstateSubCategoryName: name,
      };

      if (categoryId) {
        filter.realEstateCategoryId = categoryId;
      }

      let subCategories = await SubCategoryResource.find(filter, 0, 1);
      if (subCategories && subCategories.length > 0) {
        resolve(subCategories[0]);
      } else {
        Logger.warn(__filename, `findSubCategoryByName failed with ${name}`);
        resolve(undefined);
      }
    } catch (e) {
      Logger.warn(__filename, `can not findSubCategoryByName ${name}`);
      resolve(undefined);
    }
  });
}

module.exports = {
  findSubCategoryByName,
};
