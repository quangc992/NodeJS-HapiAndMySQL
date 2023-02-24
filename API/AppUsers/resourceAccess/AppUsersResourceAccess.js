/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'AppUser';
const {
  USER_VERIFY_INFO_STATUS,
  USER_TYPE,
  USER_VERIFY_EMAIL_STATUS,
  USER_VERIFY_PHONE_NUMBER_STATUS,
  USER_MEMBER_LEVEL,
} = require('../AppUserConstant');
const primaryKeyField = 'appUserId';

//cac field nay la optional, tuy du an co the su dung hoac khong
function optionalFields(table) {
  table.integer('memberReferIdF1').nullable(); //cac field nay la optional, tuy du an co the su dung hoac khong
  table.integer('memberReferIdF2').nullable(); //cac field nay la optional, tuy du an co the su dung hoac khong
  table.integer('memberReferIdF3').nullable(); //cac field nay la optional, tuy du an co the su dung hoac khong
  table.integer('memberReferIdF4').nullable(); //cac field nay la optional, tuy du an co the su dung hoac khong
  table.integer('memberReferIdF5').nullable(); //cac field nay la optional, tuy du an co the su dung hoac khong
  table.string('sotaikhoan', 500).nullable(); //cac field nay la optional, tuy du an co the su dung hoac khong
  table.string('tentaikhoan', 500).nullable(); //cac field nay la optional, tuy du an co the su dung hoac khong
  table.string('tennganhang', 500).nullable(); //cac field nay la optional, tuy du an co the su dung hoac khong
  table.string('diachiviUSDT', 500).nullable(); //cac field nay la optional, tuy du an co the su dung hoac khong
  table.string('diachiviBTC', 500).nullable(); //cac field nay la optional, tuy du an co the su dung hoac khong
}

async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('username');
          table.string('firstName');
          table.string('lastName');
          table.string('phoneNumber');
          table.string('userHomeAddress');
          table.string('companyName');
          table.string('email');
          table.string('birthDay');
          table.integer('sex');
          table.string('password');
          table.string('secondaryPassword');
          table.string('lastActiveAt');
          table.string('twoFACode');
          table.string('twoFAQR');
          table.integer('twoFAEnable').defaultTo(0);
          table.string('userAvatar', 2000); //Image from social login may be so long (include token)
          table.string('socialInfo', 2000); //Image from social login may be so long (include token)
          table.string('identityNumber');
          table.string('imageBeforeIdentityCard'); //link hinh (ben trong he thong nen chi can 255)
          table.string('imageAfterIdentityCard'); //link hinh (ben trong he thong nen chi can 255)
          table.boolean('active').defaultTo(1);
          table.string('verifiedAt');
          table.integer('isVerified').defaultTo(USER_VERIFY_INFO_STATUS.NOT_VERIFIED);
          table.integer('isVerifiedEmail').defaultTo(USER_VERIFY_EMAIL_STATUS.NOT_VERIFIED);
          table.integer('isVerifiedPhoneNumber');
          table.integer('referUserId').nullable(); //dung de luu tru nguoi gioi thieu (khi can thiet)
          table.string('referUser').nullable(); //dung de luu username cua nguoi gioi thieu (khi can thiet)
          table.string('referCode', 15).nullable(); //dung de luu code cua nguoi gioi thieu (khi can thiet)
          table.string('memberLevelName').defaultTo(USER_MEMBER_LEVEL.LV0); //luu membership
          table.integer('appUserMembershipId'); // memberShip Id
          table.float('limitWithdrawDaily', 48, 24).defaultTo(1000000); //luu so tien toi da duoc rut (khi can thiet)
          table.string('ipAddress').nullable(); //luu IP address -> chong spam va hack
          table.string('googleId').nullable(); //luu google id - phong khi 1 user co nhieu tai khoan
          table.string('telegramId').nullable(); //luu telegram id - phong khi 1 user co nhieu tai khoan
          table.string('facebookId').nullable(); //luu facebook id - phong khi 1 user co nhieu tai khoan
          table.string('appleId').nullable(); //luu apple id - phong khi 1 user co nhieu tai khoan
          table.string('firebaseToken', 500).nullable();
          table.string('appUserNote', 500).nullable();
          table.string('activeOTPCode');
          table.string('activeOTPAt');
          optionalFields(table);
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.unique('username');
          table.unique('email');
          table.unique('phoneNumber');
          table.index('memberLevelName');
          table.index('username');
          table.index('firstName');
          table.index('lastName');
          table.index('referUserId');
          table.index('active');
          table.index('phoneNumber');
          table.index('lastActiveAt');
          table.index('referUser');
          table.index('email');
        })
        .then(() => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          seeding().then(result => {
            Logger.info(`${tableName}`, `init ${tableName}` + result);
            resolve();
          });
        });
    });
  });
}

async function initDB() {
  await createTable();
}

async function seeding() {
  return new Promise(async (resolve, reject) => {
    let initialStaff = [
      {
        lastName: 'string',
        firstName: 'string',
        username: 'string',
        email: 'string@string.com',
        password: '9d8e0483d5a71a73d4cf762d3dfdd30d5f441a85a060d3335c0c4979ff3e0530',
        phoneNumber: 'string',
      },
    ];
    DB(`${tableName}`)
      .insert(initialStaff)
      .then(result => {
        Logger.info(`${tableName}`, `seeding ${tableName}` + result);
        resolve();
      });
  });
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  if (!data || Object.keys(data).length === 0) {
    return 1;
  }
  let filter = {};
  filter[`${primaryKeyField}`] = id;
  return await Common.updateById(tableName, filter, data);
}

async function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.deleteById(tableName, dataId);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function findById(id) {
  return await Common.findById(tableName, primaryKeyField, id);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function updateAll(data, filter) {
  return await Common.updateAll(tableName, data, filter);
}

async function updateAllById(idList, data) {
  return await Common.updateAllById(tableName, primaryKeyField, idList, data);
}

async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('username', 'like', `%${searchText}%`)
        .orWhere('firstName', 'like', `%${searchText}%`)
        .orWhere('lastName', 'like', `%${searchText}%`)
        .orWhere('phoneNumber', 'like', `%${searchText}%`)
        .orWhere('email', 'like', `%${searchText}%`);
    });
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
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
async function customSearch(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.select();
}
async function customCount(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText, order);
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
async function customCountMemberShip(filter, searchText, startDate, endDate, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText, order);
  return new Promise((resolve, reject) => {
    try {
      query.where('appUserMembershipId', '>', 0);
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

function _makeQueryBuilderForReferedUser(
  appUserId,
  skip,
  limit,
  memberReferIdF1,
  memberReferIdF2,
  memberReferIdF3,
  memberReferIdF4,
  memberReferIdF5,
  startDate,
  endDate,
) {
  let queryBuilder = _makeQueryBuilderByFilter({}, skip, limit);

  if (memberReferIdF1) {
    queryBuilder.where({ memberReferIdF1: memberReferIdF1 });
  } else if (memberReferIdF2) {
    queryBuilder.where({ memberReferIdF2: memberReferIdF2 });
  } else if (memberReferIdF3) {
    queryBuilder.where({ memberReferIdF3: memberReferIdF3 });
  } else if (memberReferIdF4) {
    queryBuilder.where({ memberReferIdF4: memberReferIdF4 });
  } else if (memberReferIdF5) {
    queryBuilder.where({ memberReferIdF5: memberReferIdF5 });
  } else if (appUserId) {
    queryBuilder.where(function () {
      this.orWhere('memberReferIdF1', appUserId)
        .orWhere('memberReferIdF2', appUserId)
        .orWhere('memberReferIdF3', appUserId)
        .orWhere('memberReferIdF4', appUserId)
        .orWhere('memberReferIdF5', appUserId);
    });
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }
  return queryBuilder;
}

async function findReferedUserByUserId(appUserId, skip, limit, memberReferIdF1, memberReferIdF2, memberReferIdF3) {
  let queryBuilder = _makeQueryBuilderForReferedUser(appUserId, skip, limit, memberReferIdF1, memberReferIdF2, memberReferIdF3);
  return await queryBuilder.select();
}

async function countReferedUserByUserId(
  appUserId,
  memberReferIdF1,
  memberReferIdF2,
  memberReferIdF3,
  memberReferIdF4,
  memberReferIdF5,
  startDate,
  endDate,
) {
  let queryBuilder = _makeQueryBuilderForReferedUser(
    appUserId,
    undefined,
    undefined,
    memberReferIdF1,
    memberReferIdF2,
    memberReferIdF3,
    memberReferIdF4,
    memberReferIdF5,
    startDate,
    endDate,
  );
  return await queryBuilder.count(`${primaryKeyField} as count`);
}

module.exports = {
  insert,
  find,
  count,
  deleteById,
  updateById,
  initDB,
  updateAll,
  findById,
  customSearch,
  customCount,
  modelName: tableName,
  updateAllById,
  customCountMemberShip,
  findReferedUserByUserId,
  countReferedUserByUserId,
};
