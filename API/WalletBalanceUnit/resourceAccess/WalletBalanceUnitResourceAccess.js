/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'WalletBalanceUnit';
const primaryKeyField = 'walletBalanceUnitId';

async function createTable() {
  console.log(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('walletBalanceUnitId').primary();
          table.string('walletBalanceUnitCode').defaultTo('');
          table.string('walletBalanceUnitDisplayName').defaultTo('');
          table.string('walletBalanceUnitAvatar', 500).defaultTo('');
          table.float('convertPrice', 48, 24).defaultTo(0);
          table.float('originalPrice', 48, 24).defaultTo(0);
          table.float('userSellPrice', 48, 24).defaultTo(0);
          table.float('agencySellPrice', 48, 24).defaultTo(0);
          timestamps(table);
        })
        .then(() => {
          console.log(`${tableName} table created done`);
          seeding().then(result => {
            console.log(`${tableName} table seeding done`);
            resolve();
          });
        });
    });
  });
}

async function seeding() {
  let listUnit = [
    {
      walletBalanceUnitCode: 'USD',
      walletBalanceUnitAvatar: `https://${process.env.HOST_NAME}/uploads/sampleIcon.png`,
      walletBalanceUnitDisplayName: 'USD',
      convertPrice: 1,
      originalPrice: 1,
      userSellPrice: 1,
      agencySellPrice: 1,
      isDeleted: 1,
    },
    {
      walletBalanceUnitCode: 'BTC',
      walletBalanceUnitAvatar: `https://${process.env.HOST_NAME}/uploads/sampleIcon.png`,
      walletBalanceUnitDisplayName: 'Bitcoin',
      convertPrice: 50000,
      originalPrice: 50000,
      userSellPrice: 40000,
      agencySellPrice: 50000,
    },
    {
      walletBalanceUnitCode: 'ETH',
      walletBalanceUnitAvatar: `https://${process.env.HOST_NAME}/uploads/sampleIcon.png`,
      walletBalanceUnitDisplayName: 'ETH Coin',
      convertPrice: 4000,
      originalPrice: 4000,
      userSellPrice: 3000,
      agencySellPrice: 4000,
    },
    {
      walletBalanceUnitCode: 'ARC',
      walletBalanceUnitAvatar: `https://${process.env.HOST_NAME}/uploads/sampleIcon.png`,
      walletBalanceUnitDisplayName: 'ARC Coin',
      convertPrice: 3,
      originalPrice: 3,
      userSellPrice: 2,
      agencySellPrice: 3,
    },
  ];
  await DB(tableName).insert(listUnit);
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

async function incrementBalance(id, amount) {
  return await Common.incrementFloat(tableName, primaryKeyField, id, 'balance', amount);
}

async function updateBalanceTransaction(walletBalanceUnitsDataList) {
  try {
    await DB.transaction(async trx => {
      for (let i = 0; i < walletBalanceUnitsDataList.length; i++) {
        let walletBalanceUnitData = walletBalanceUnitsDataList[i];

        await trx(tableName)
          .where({
            walletBalanceUnitId: walletBalanceUnitData.walletBalanceUnitId,
          })
          .update({ balance: walletBalanceUnitData.balance });
      }
    });
    return 'ok';
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
}
async function decrementBalance(id, amount) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.decrementFloat(tableName, primaryKeyField, id, 'balance', amount);
}

async function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.deleteById(tableName, dataId);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  if (filter === undefined) {
    filter = {};
  }
  let filterData = JSON.parse(JSON.stringify(filter));

  if (searchText) {
    queryBuilder.where('walletBalanceUnitCode', 'like', `%${searchText}%`);
    queryBuilder.where('walletBalanceUnitDisplayName', 'like', `%${searchText}%`);
  } else {
    if (filterData.walletBalanceUnitDisplayName) {
      queryBuilder.where('walletBalanceUnitDisplayName', 'like', `%${filterData.walletBalanceUnitDisplayName}%`);
      delete filterData.walletBalanceUnitDisplayName;
    }

    if (filterData.walletBalanceUnitCode) {
      queryBuilder.where('walletBalanceUnitCode', 'like', `%${filterData.walletBalanceUnitCode}%`);
      delete filterData.walletBalanceUnitCode;
    }
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  queryBuilder.where({ isDeleted: 0 });
  queryBuilder.where(filterData);

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

async function customSearch(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.select();
}

async function customCount(filter, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText, order);
  return await query.count(`${primaryKeyField} as count`);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  updateBalanceTransaction,
  incrementBalance,
  findById,
  decrementBalance,
  deleteById,
  customSearch,
  customCount,
};
