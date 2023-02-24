/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 12/31/21.
 */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'AppUserMembership';
const primaryKeyField = 'appUsermembershipId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('appUserMembershipTitle');
          table.string('appUserMembershipDescription', 500);
          table.string('appUserMembershipImage');
          table.integer('appUserMembershipInvitationRequired');
          table.integer('appUserMembershipAssetRequired');
          table.integer('appUserMembershipAssetF1Required');
          table.integer('appUserMembershipBonusRate');
          table.string('appUserMembershipBonusPrizeName');
          table.integer('appUserMembershipBonusPrizeType');
          table.integer('appUserMembershipBonusPrize');
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index('appUserMembershipInvitationRequired');
          table.index('appUserMembershipAssetRequired');
          table.index('appUserMembershipAssetF1Required');
        })
        .then(async () => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          seeding().then(() => {
            resolve();
          });
        });
    });
  });
}

async function seeding() {
  let projectStatus = [
    {
      appUserMembershipTitle: 'Thành Viên',
      appUserMembershipInvitationRequired: 0,
      appUserMembershipDescription: 'day la thanh vien',
      appUserMembershipAssetRequired: 100,
      appUserMembershipAssetF1Required: 0,
    },
    {
      appUserMembershipTitle: 'Hộ Kinh Doanh',
      appUserMembershipInvitationRequired: 100,
      appUserMembershipDescription: 'day la thanh vien',
      appUserMembershipAssetRequired: 1000,
      appUserMembershipAssetF1Required: 5000,
    },
    {
      appUserMembershipTitle: 'Công Ty',
      appUserMembershipInvitationRequired: 500,
      appUserMembershipDescription: 'day la thanh vien',
      appUserMembershipAssetRequired: 3000,
      appUserMembershipAssetF1Required: 10000,
    },
    {
      appUserMembershipTitle: 'Doanh Nghiệp',
      appUserMembershipInvitationRequired: 1000,
      appUserMembershipDescription: 'day la thanh vien',
      appUserMembershipAssetRequired: 10000,
      appUserMembershipAssetF1Required: 30000,
    },
    {
      appUserMembershipTitle: 'Tập Đoàn',
      appUserMembershipInvitationRequired: 1000,
      appUserMembershipAssetRequired: 30000,
      appUserMembershipDescription: 'day la thanh vien',
      appUserMembershipAssetF1Required: 100000,
    },
  ];
  return new Promise(async (resolve, reject) => {
    DB(`${tableName}`)
      .insert(projectStatus)
      .then(result => {
        Logger.info(`${tableName}`, `seeding ${tableName}` + result);
        resolve();
      });
  });
}

async function initDB() {
  await createTable();
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.updateById(tableName, dataId, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}
async function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.deleteById(tableName, dataId);
}
async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
}

function _makeQueryBuilderByFilter(filter, skip, limit, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (filterData.appUserMembershipTitle) {
    queryBuilder.where('appUserMembershipTitle', 'like', `%${filterData.appUserMembershipTitle}%`);
    delete filterData.appUserMembershipTitle;
  }

  if (filterData.appUserMembershipDescription) {
    queryBuilder.where('appUserMembershipDescription', 'like', `%${filterData.appUserMembershipDescription}%`);
    delete filterData.appUserMembershipDescription;
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
module.exports = {
  insert,
  find,
  count,
  updateById,
  deleteById,
  findById,
  initDB,
  customSearch,
  customCount,
};
