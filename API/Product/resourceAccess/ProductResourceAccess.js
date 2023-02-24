/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'Product';
const primaryKeyField = 'productId';
const Logger = require('../../../utils/logging');
const { PRODUCT_STATUS, PRODUCT_TOKEN_TYPE } = require('../ProductConstant');

async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  console.info(`create table ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(primaryKeyField).primary();
          table.string('productName'); // tên
          table.string('productCode');
          // table.string('productTxHash').notNullable(); // txHash mà đã tạo ra NFT
          // table.integer('productBlockchainId').notNullable(); // Id trong blockchain
          table.string('productTitle').defaultTo('');
          table.string('productCategory').defaultTo(''); // phân loại
          table.string('productChannel').defaultTo(''); //  bộ sưu tập
          table.float('productPrice', 20, 5).defaultTo(0); //Giá BNB (Giá hiện tại của NFT này trên sàn)
          table.text('productDescription'); // Mô tả
          table.string('productCreator'); // Tác giả
          table.text('productShortDescription');
          table.string('productTokenType').defaultTo(PRODUCT_TOKEN_TYPE.ERC721); // Loại token (ERC721 / ERC1155)
          table.string('productOwner'); // Địa chỉ ví sở hữu hiện tại
          table.string('productStatus').defaultTo(PRODUCT_STATUS.NEW); //Trạng thái
          table.string('productThumbnail', 500); // Hình ảnh thumbnail của sản phẩm
          table.string('productUrl').nullable(); // Link sản phẩm
          table.integer('staffId'); // Nhân viên nhập
          table.integer('quantity').defaultTo(1); //Số lượng nhập
          table.integer('stockQuantity').defaultTo(1); //Số lượng tồn kho
          timestamps(table);
          table.index('staffId');
          table.index('productChannel');
          table.index('productName');
          table.index('productTitle');
          table.index('productStatus');
          table.unique('productCode');
          // table.unique('productTxHash');
          // table.unique('productBlockchainId');
        })
        .then(async () => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          // seeding().then(() => {
          resolve();
          // });
        });
    });
  });
}

async function seeding() {
  let seedingData = [
    {
      productName: 'XPAY #99999',
      productChannel: 'XPAY',
      productPrice: 134.79,
      productCreator: 'johnIsland',
      productDescription: 'By decentraweb DecentraWeb is a decentralized implementation of the DNS base layer protocol on the Ethereum Blockchain.',
    },
    {
      productName: 'Maxon #3713',
      productChannel: 'Maxon',
      productPrice: 3.089,
      productCreator: 'ixaM_HTE',
      productDescription: 'A handcrafted collection of 10,000 characters developed by artist DirtyRobot.',
    },
  ];
  return new Promise(async (resolve, reject) => {
    DB(`${tableName}`)
      .insert(seedingData)
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
      this.orWhere('productName', 'like', `%${searchText}%`)
        .orWhere('productTitle', 'like', `%${searchText}%`)
        .orWhere('productChannel', 'like', `%${searchText}%`)
        .orWhere('productType', 'like', `%${searchText}%`)
        .orWhere('productStatus', 'like', `%${searchText}%`);
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
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
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

async function find(filter, skip, limit, order) {
  filter.isDeleted = 0;
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

module.exports = {
  insert,
  find,
  findById,
  count,
  updateById,
  initDB,
  deleteById,
  customSearch,
  customCount,
};
