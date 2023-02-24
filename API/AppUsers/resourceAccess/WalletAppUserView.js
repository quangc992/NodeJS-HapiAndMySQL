/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'WalletUserView';
const rootTableName = 'AppUser';
const primaryKeyField = 'appUserId';

async function createWalletUserView() {
  const WalletTableName = 'Wallet';
  let fields = [
    `${rootTableName}.appUserId`,
    `${rootTableName}.username`,
    `${rootTableName}.firstName`,
    `${rootTableName}.lastName`,
    `${rootTableName}.email`,
    `${rootTableName}.companyName`,
    `${rootTableName}.referUserId`,
    `${rootTableName}.referUser`,
    `${rootTableName}.password`,
    `${rootTableName}.memberLevelName`,
    `${rootTableName}.active`,
    `${rootTableName}.limitWithdrawDaily`,
    `${rootTableName}.ipAddress`,
    `${rootTableName}.phoneNumber`,
    `${rootTableName}.lastActiveAt`,
    `${rootTableName}.twoFACode`,
    `${rootTableName}.userAvatar`,
    `${rootTableName}.googleId`,
    `${rootTableName}.telegramId`,
    `${rootTableName}.facebookId`,
    `${rootTableName}.appleId`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.appUserNote`,

    `${rootTableName}.diachiviUSDT`, // su dung tam
    `${rootTableName}.diachiviBTC`, //su dung tam

    `${WalletTableName}.walletType`,
    `${WalletTableName}.balance`,
    `${WalletTableName}.balanceUnit`,
    `${WalletTableName}.lastDepositAt`,
    `${WalletTableName}.walletAddress`,
    `${WalletTableName}.walletPrivatekey`,
    `${WalletTableName}.walletNote`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(WalletTableName, function () {
      this.on(`${rootTableName}.appUserId`, '=', `${WalletTableName}.appUserId`);
    });

  Common.createOrReplaceView(tableName, viewDefinition);
}

async function initViews() {
  createWalletUserView();
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  return await Common.updateById(tableName, { appUserId: id }, data);
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

module.exports = {
  insert,
  find,
  count,
  updateById,
  initViews,
  updateAll,
};
