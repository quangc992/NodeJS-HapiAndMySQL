/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const ProductCategoryResource = require('./resourceAccess/StationProductsCategoryResourceAccess');

async function initNewCategoriesForStation(station) {
  let categories = ['Tin nổi bật', 'Tin tức trong ngành', 'Tin tức xã hội', 'Khoa học và kỹ thuật', 'Chuyên mục tư vấn'];

  let _arrayData = [];
  const _MAX_VIEW = 1000;
  const _MIN_VIEW = 100;
  for (let i = 0; i < categories.length; i++) {
    const categoryName = categories[i];
    _arrayData.push({
      stationProductsCategoryTitle: categoryName,
      stationProductsCategoryContent: categoryName,
      displayIndex: i,
      totalViewed: Math.floor(Math.random() * (_MAX_VIEW - _MIN_VIEW + 1) + _MIN_VIEW),
      dayViewed: Math.floor(Math.random() * (_MAX_VIEW - _MIN_VIEW + 1) + _MIN_VIEW),
      monthViewed: Math.floor(Math.random() * (_MAX_VIEW - _MIN_VIEW + 1) + _MIN_VIEW),
      weekViewed: Math.floor(Math.random() * (_MAX_VIEW - _MIN_VIEW + 1) + _MIN_VIEW),
      searchCount: Math.floor(Math.random() * (_MAX_VIEW - _MIN_VIEW + 1) + _MIN_VIEW),
      followCount: Math.floor(Math.random() * (_MAX_VIEW - _MIN_VIEW + 1) + _MIN_VIEW),
      stationsId: station.stationsId,
    });
  }
  let initResult = await ProductCategoryResource.insert(_arrayData);
  return initResult;
}

async function updateCategoriesIndex(categoryId, categoryIndex, station) {
  let filter = {};
  if (station) {
    filter.stationsId = station.stationsId;
  }

  let categoryList = await ProductCategoryResource.customSearch(filter, 0, 100);

  if (categoryList && categoryList.length > 0) {
    //update displayIndex for all other categories
    for (let i = 0; i < categoryList.length; i++) {
      const _category = categoryList[i];
      if (_category.displayIndex >= categoryIndex) {
        await ProductCategoryResource.increaseDisplayIndex(_category.stationProductsCategoryId);
      }
    }

    //move selecting category into desired displayIndex
    let updatedResult = await ProductCategoryResource.updateById(categoryId, {
      displayIndex: categoryIndex,
    });

    return updatedResult;
  } else {
    return undefined;
  }
}

module.exports = {
  initNewCategoriesForStation,
  updateCategoriesIndex,
};
