/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'AppUserViews';
const rootTableName = 'AppUser';
const primaryKeyField = 'appUserId';

async function createViews() {
  // const AreaDataTable = 'AreaData';
  let fields = [
    `${rootTableName}.appUserId`,
    `${rootTableName}.username`,
    `${rootTableName}.firstName`,
    `${rootTableName}.lastName`,
    `${rootTableName}.phoneNumber`,
    `${rootTableName}.email`,
    `${rootTableName}.birthDay`,
    `${rootTableName}.sex`,
    `${rootTableName}.password`,
    `${rootTableName}.lastActiveAt`,
    `${rootTableName}.twoFACode`,
    `${rootTableName}.twoFAQR`,
    `${rootTableName}.userAvatar`, //Image from social login may be so long (include token)
    `${rootTableName}.socialInfo`, //Image from social login may be so long (include token)
    `${rootTableName}.identityNumber`,
    `${rootTableName}.imageBeforeIdentityCard`, //link hinh (ben trong he thong nen chi can 255)
    `${rootTableName}.imageAfterIdentityCard`, //link hinh (ben trong he thong nen chi can 255)
    `${rootTableName}.active`,
    `${rootTableName}.verifiedAt`,
    `${rootTableName}.isVerified`,
    `${rootTableName}.isVerifiedEmail`,
    `${rootTableName}.isVerifiedPhoneNumber`,
    `${rootTableName}.referUserId`, //dung de luu tru nguoi gioi thieu (khi can thiet)
    `${rootTableName}.referUser`, //dung de luu username cua nguoi gioi thieu (khi can thiet)
    `${rootTableName}.memberLevelName`, //luu membership
    `${rootTableName}.limitWithdrawDaily`, //luu so tien toi da duoc rut (khi can thiet)
    `${rootTableName}.ipAddress`, //luu IP address -> chong spam va hack
    `${rootTableName}.googleId`, //luu google id - phong khi 1 user co nhieu tai khoan
    `${rootTableName}.telegramId`, //luu telegram id - phong khi 1 user co nhieu tai khoan
    `${rootTableName}.facebookId`, //luu facebook id - phong khi 1 user co nhieu tai khoan
    `${rootTableName}.appleId`, //luu apple id - phong khi 1 user co nhieu tai khoan
    `${rootTableName}.createdAt`,
    `${rootTableName}.isDeleted`,
    // `${rootTableName}.userType`,
    // `${rootTableName}.areaStreet`,
    // `${rootTableName}.areaProvinceId`,
    // `${rootTableName}.areaDistrictId`,
    // `${rootTableName}.areaWardId`,
    // `${rootTableName}.areaCountryId`,
    // `${rootTableName}.createdAt`,
    // DB.raw(`MONTH(${rootTableName}.createdAt) as createMonth`),
    // DB.raw(`YEAR(${rootTableName}.createdAt) as createYear`),
    // `province.AreaDataName as AreaProvinceName`,
    // `district.AreaDataName as AreaDistrictName`,
    // `ward.AreaDataName as AreaWardName`,
    // `country.AreaDataName as AreaCountryName`
  ];

  var viewDefinition = DB.select(fields).from(rootTableName);
  // .leftJoin({ province: AreaDataTable }, function () {
  //   this.on(`${rootTableName}.areaProvinceId`, '=', `province.areaDataId`);
  // })
  // .leftJoin({ district: AreaDataTable }, function () {
  //   this.on(`${rootTableName}.areaDistrictId`, '=', `district.areaDataId`);
  // })
  // .leftJoin({ ward: AreaDataTable }, function () {
  //   this.on(`${rootTableName}.areaWardId`, '=', `ward.areaDataId`);
  // })
  // .leftJoin({ country: AreaDataTable }, function () {
  //   this.on(`${rootTableName}.areaCountryId`, '=', `country.areaDataId`);
  // })
  Common.createOrReplaceView(tableName, viewDefinition);
}

async function initViews() {
  await createViews();
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  let filter = {};
  filter[`${primaryKeyField}`] = id;
  return await Common.updateById(tableName, filter, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function updateAll(data, filter) {
  return await Common.updateAll(tableName, data, filter);
}

async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
}

function _makeQueryBuilderByFilter(filter, skip, limit, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};
  if (filterData.name) {
    queryBuilder.where('firstName', 'like', `%${filterData.name}%`);
    delete filterData.name;
  }
  if (filterData.username) {
    queryBuilder.where('username', 'like', `%${filterData.username}%`);
    delete filterData.username;
  }

  if (filterData.email) {
    let index = filterData.email.indexOf('@');
    let email = filterData.email.slice(0, index);
    queryBuilder.where('email', 'like', `%${email}%`);
    delete filterData.email;
  }

  if (filterData.phoneNumber) {
    queryBuilder.where('phoneNumber', 'like', `%${filterData.phoneNumber}%`);
    delete filterData.phoneNumber;
  }
  if (filterData.active !== null && filterData.active !== undefined) {
    queryBuilder.where({
      active: filterData.active,
    });
    delete filterData.active;
  }
  queryBuilder.where(filterData);
  queryBuilder.where({ isDeleted: 0 });
  if (limit) {
    queryBuilder.limit(limit);
  }

  if (skip) {
    queryBuilder.offset(skip);
  }
  if (order && order.key !== '' && order.value !== '' && (order.value === 'desc' || order.value === 'asc')) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy('createdAt', 'desc');
  }
  return queryBuilder;
}
async function customSearch(filter, skip, limit, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, order);
  return await query.select();
}

async function customCount(filter, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, order);
  return await query.count(`${primaryKeyField} as count`);
}

async function countUserMonthByYear(filter, startDate, endDate) {
  let query = await DB(tableName)
    .select('createMonth')
    .select('createYear')
    .where(filter)
    .where('createdAt', '>=', startDate)
    .where('createdAt', '<=', endDate)
    .count(`createMonth as countCreateMonth`)
    .groupBy('createMonth')
    .groupBy('createYear')
    .orderBy('createMonth', 'desc')
    .orderBy('createYear', 'desc');
  return query;
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initViews,
  updateAll,
  customSearch,
  customCount,
  findById,
  countUserMonthByYear,
};
