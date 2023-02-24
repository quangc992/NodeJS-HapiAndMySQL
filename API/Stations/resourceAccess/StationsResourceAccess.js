/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { STATION_STATUS } = require('../StationsConstants');
const tableName = 'Stations';
const primaryKeyField = 'stationsId';

function _getDefaultBookingConfig() {
  let defaultBookingConfig = [
    {
      index: 0,
      time: '07:00 - 11:30',
      limit: 4,
    },
    {
      index: 1,
      time: '13:30 - 22:00',
      limit: 4,
    },
    // {
    //   index: 2,
    //   time: "08:00 - 08:30",
    //   limit: 4
    // },
    // {
    //   index: 3,
    //   time: "08:30 - 09:00",
    //   limit: 4
    // },
    // {
    //   index: 4,
    //   time: "09:00 - 09:30",
    //   limit: 4
    // },
    // {
    //   index: 5,
    //   time: "09:30 - 10:00",
    //   limit: 4
    // },
    // {
    //   index: 6,
    //   time: "10:00 - 10:30",
    //   limit: 4
    // },
    // {
    //   index: 7,
    //   time: "10:30 - 11:00",
    //   limit: 4
    // },
    // {
    //   index: 8,
    //   time: "11:00 - 11:30",
    //   limit: 4
    // },
    // {
    //   index: 9,
    //   time: "11:30 - 12:00",
    //   limit: 4
    // },
    // {
    //   index: 10,
    //   time: "12:00 - 12:30",
    //   limit: 4
    // },
    // {
    //   index: 11,
    //   time: "12:30 - 13:00",
    //   limit: 4
    // },
    // {
    //   index: 12,
    //   time: "13:00 - 13:30",
    //   limit: 4
    // },
    // {
    //   index: 13,
    //   time: "13:30 - 14:00",
    //   limit: 4
    // },
    // {
    //   index: 14,
    //   time: "14:00 - 14:30",
    //   limit: 4
    // },
    // {
    //   index: 15,
    //   time: "14:30 - 15:00",
    //   limit: 4
    // },
    // {
    //   index: 16,
    //   time: "15:30 - 16:00",
    //   limit: 4
    // },
    // {
    //   index: 17,
    //   time: "16:00 - 16:30",
    //   limit: 4
    // },
    // {
    //   index: 18,
    //   time: "16:30 - 17:00",
    //   limit: 4
    // },
    // {
    //   index: 19,
    //   time: "17:00 - 17:30",
    //   limit: 4
    // },
    // {
    //   index: 20,
    //   time: "17:30 - 18:00",
    //   limit: 4
    // },
    // {
    //   index: 21,
    //   time: "18:00 - 18:30",
    //   limit: 4
    // },
    // {
    //   index: 22,
    //   time: "18:30 - 19:00",
    //   limit: 4
    // },
    // {
    //   index: 23,
    //   time: "19:00 - 19:30",
    //   limit: 4
    // },
    // {
    //   index: 24,
    //   time: "19:30 - 20:00",
    //   limit: 4
    // },
    // {
    //   index: 25,
    //   time: "20:00 - 20:30",
    //   limit: 4
    // },
    // {
    //   index: 26,
    //   time: "20:30 - 21:00",
    //   limit: 4
    // },
    // {
    //   index: 27,
    //   time: "21:00 - 21:30",
    //   limit: 4
    // },
    // {
    //   index: 28,
    //   time: "21:30 - 22:00",
    //   limit: 4
    // },
    // {
    //   index: 29,
    //   time: "22:00 - 22:30",
    //   limit: 4
    // },
    // {
    //   index: 30,
    //   time: "22:30 - 23:00",
    //   limit: 4
    // }
  ];
  return JSON.stringify(defaultBookingConfig);
}

async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('stationsId').primary();
          table.string('stationsName');
          table.text('stationsDescription', 'longtext');
          table.string('stationUrl').defaultTo('');
          table.string('stationWebhookUrl').defaultTo('');
          table.string('stationBookingConfig', 2000).defaultTo(_getDefaultBookingConfig());
          table.string('stationsLogo', 500).defaultTo(`https://${process.env.HOST_NAME}/uploads/avatar.png`);
          table.string('stationsLogoThumbnails', 500).defaultTo(`https://${process.env.HOST_NAME}/uploads/avatar.png`);
          table.string('stationsHotline', 500).defaultTo('999999999');
          table.string('stationsEmail').defaultTo('stationemail@gmail.com');
          table.string('stationsAddress', 500).defaultTo('1 street, VietNam');
          table.integer('stationStatus').defaultTo(STATION_STATUS.ACTIVE);
          timestamps(table);
        })
        .then(async () => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          resolve();
        });
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

async function findById(id) {
  return await Common.findById(tableName, primaryKeyField, id);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

function _makeQueryBuilderByFilter(filter, skip, limit, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = JSON.parse(JSON.stringify(filter));

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('stationsHotline', 'like', `%${searchText}%`)
        .orWhere('stationsEmail', 'like', `%${searchText}%`)
        .orWhere('stationsAddress', 'like', `%${searchText}%`)
        .orWhere('stationsName', 'like', `%${searchText}%`);
    });
  } else {
    if (filterData.stationsName) {
      queryBuilder.where('stationsName', 'like', `%${filterData.stationsName}%`);
      delete filterData.stationsName;
    }
  }

  queryBuilder.where(filterData);

  if (limit) {
    queryBuilder.limit(limit);
  }

  if (skip) {
    queryBuilder.offset(skip);
  }

  queryBuilder.where({ isDeleted: 0 });

  if (order && order.key !== '' && order.value !== '' && (order.value === 'desc' || order.value === 'asc')) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy('updatedAt', 'desc');
  }

  return queryBuilder;
}

async function customSearch(filter, skip, limit, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, searchText, order);
  return await query.select();
}

async function customCount(filter, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, searchText, order);
  return new Promise((resolve, reject) => {
    try {
      query.count(`${primaryKeyField} as count`).then(records => {
        resolve(records);
      });
    } catch (e) {
      Logger.error('ResourceAccess', `DB COUNT ERROR: ${tableName} : ${JSON.stringify(filter)} - ${JSON.stringify(order)}`);
      Logger.error('ResourceAccess', e);
      reject(undefined);
    }
  });
}
module.exports = {
  insert,
  find,
  findById,
  count,
  updateById,
  initDB,
  modelName: tableName,
  customSearch,
  customCount,
};
