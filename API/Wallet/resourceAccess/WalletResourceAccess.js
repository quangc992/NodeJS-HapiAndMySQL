/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'Wallet';
const primaryKeyField = 'walletId';
const { WALLET_TYPE, BALANCE_UNIT } = require('../WalletConstant');
const Logger = require('../../../utils/logging');

async function createTable() {
  console.info(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('walletId').primary();
          table.integer('appUserId');
          table.string('walletType').defaultTo(WALLET_TYPE.USDT);
          table.float('balance', 48, 24).defaultTo(0);
          table.string('balanceUnit').defaultTo(BALANCE_UNIT.VND);
          table.integer('walletBalanceUnitId').defaultTo(0);
          table.string('lastDepositAt');
          table.string('walletAddress'); //use for crypto wallet
          table.string('walletPrivatekey'); //use for crypto wallet
          table.string('walletNote');
          timestamps(table);
          table.index('walletId');
          table.index('appUserId');
          table.index('walletType');
          table.index('balance');
          table.index('balanceUnit');
          table.index('walletBalanceUnitId');
          table.index('lastDepositAt');
          table.index('walletAddress');
          table.index('walletPrivatekey');
          table.index('walletNote');
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
  let _data = [
    {
      appUserId: 1,
      walletType: WALLET_TYPE.USDT,
      balance: 1000000,
      balanceUnit: `USDT`,
      walletBalanceUnitId: 3,
    },
    {
      appUserId: 1,
      walletType: WALLET_TYPE.FAC,
      balance: 1000000,
      balanceUnit: `FAC`,
      walletBalanceUnitId: 1,
    },
    {
      appUserId: 1,
      walletType: WALLET_TYPE.POINT,
      balance: 1000000,
      balanceUnit: `FAC`,
      walletBalanceUnitId: 1,
    },
    {
      appUserId: 1,
      walletType: WALLET_TYPE.BTC,
      balance: 1000000,
      balanceUnit: `BTC`,
      walletBalanceUnitId: 2,
    },
    {
      appUserId: 2,
      walletType: WALLET_TYPE.USDT,
      balance: 1000000,
      balanceUnit: `USDT`,
      walletBalanceUnitId: 3,
    },
    {
      appUserId: 2,
      walletType: WALLET_TYPE.FAC,
      balance: 1000000,
      balanceUnit: `FAC`,
      walletBalanceUnitId: 1,
    },
    {
      appUserId: 2,
      walletType: WALLET_TYPE.POINT,
      balance: 1000000,
      balanceUnit: `FAC`,
      walletBalanceUnitId: 1,
    },
    {
      appUserId: 2,
      walletType: WALLET_TYPE.BTC,
      balance: 1000000,
      balanceUnit: `BTC`,
      walletBalanceUnitId: 2,
    },
  ];
  return new Promise(async (resolve, reject) => {
    DB(`${tableName}`)
      .insert(_data)
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

async function incrementBalance(id, amount) {
  return await Common.incrementFloat(tableName, primaryKeyField, id, 'balance', amount);
}

async function updateBalanceTransaction(walletsDataList) {
  try {
    await DB.transaction(async trx => {
      for (let i = 0; i < walletsDataList.length; i++) {
        let walletData = walletsDataList[i];

        await trx(tableName).where({ walletId: walletData.walletId }).update({ balance: walletData.balance });
      }
    });
    return 'ok';
  } catch (error) {
    console.error(`error WalletBalanceUnit updateBalanceTransaction: ${ERROR}`);
    return undefined;
  }
}

async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
}

async function decrementBalance(id, amount) {
  return await Common.decrementFloat(tableName, primaryKeyField, id, 'balance', amount);
}

async function findWalletByUserId(appUserId, walletType) {
  let _filter = {
    appUserId: appUserId,
  };
  if (walletType) {
    _filter.walletType = walletType;
  }
  return await Common.find(tableName, _filter, 0, 1, undefined);
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
  findWalletByUserId,
};
