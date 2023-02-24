/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'ProductOrder';
const primaryKeyField = 'productOrderId';
const Logger = require('../../../utils/logging');
const { PRODUCT_ORDER_STATUS, PRODUCT_ORDER_TYPE } = require('../ProductOrderConstant');

async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  console.info(`create tavle ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(primaryKeyField).primary();
          table.float('subTotal', 48).defaultTo(0); //tổng tiền vé
          table.float('total', 48).defaultTo(0); //tổng tiền đơn hàng
          table.float('fee', 48).defaultTo(0); //Phí dịch vụ
          table.integer('staffId'); //Nhân viên xử lý đơn hàng
          table.string('orderStatus').defaultTo(PRODUCT_ORDER_STATUS.NEW); // trạng thái (Đang chờ, Đang xử lý, Đã huỷ, Đã hoàn thành)
          table.float('minOrderItemQuantity', 48).defaultTo(0); // Số lượng toi thieu
          table.float('maxOrderItemQuantity', 48).defaultTo(0); // Số lượng toi da
          table.string('orderType').defaultTo(PRODUCT_ORDER_TYPE.BUY); // Đơn bán ra/ mua vào
          table.string('customerName'); // tên người mua
          table.string('customerPhone'); // số điện thoại
          table.string('customerIdentity'); // số cmnd hoặc căn cước công dân
          table.string('customerAddress'); // địa chỉ người mua
          table.string('shippingAddress'); //dia chi ship
          table.string('shippingMethod'); //cach giao hang
          table.integer('appUserId'); // người mua
          timestamps(table);
          table.index('appUserId');
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

async function find(filter, skip, limit, order) {
  filter.isDeleted = 0;
  return await Common.find(tableName, filter, skip, limit, order);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('customerName', 'like', `%${searchText}%`);
    });
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

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

async function customCount(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.count(`${primaryKeyField} as count`);
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
async function customSum(sumField, filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return queryBuilder.sum(`${sumField} as sumResult`);
}

async function summaryTotalProductOrderByChannel(productChannel, startDate, endDate) {
  const _field = 'total';
  const productOrderItemTable = 'ProductOrderItem';
  const productTable = 'Product';
  let queryBuilder = DB.from(productTable).where('productChannel', '=', productChannel);

  return new Promise((resolve, reject) => {
    try {
      queryBuilder.then(product => {
        if (product && product.length > 0) {
          queryBuilder
            .join(productOrderItemTable, `${productOrderItemTable}.productId`, '=', `${productTable}.productId`)
            .join(tableName, `${productOrderItemTable}.productOrderId`, '=', `${tableName}.productOrderId`);

          if (startDate) {
            queryBuilder.where(`${tableName}.createdAt`, '>=', startDate);
          }

          if (endDate) {
            queryBuilder.where(`${tableName}.createdAt`, '<=', endDate);
          }

          queryBuilder.sum(`${_field} as sumResult`).then(records => {
            if (records && records[0].sumResult === null) {
              resolve(undefined);
            } else {
              resolve(records);
            }
          });
        } else {
          resolve(0);
        }
      });
    } catch (e) {
      Logger.error('ResourceAccess', `DB SUM ERROR: ${tableName} ${field}: ${JSON.stringify(filter)}`);
      Logger.error('ResourceAccess', e);
      reject(undefined);
    }
  });
}

module.exports = {
  modelName: tableName,
  insert,
  find,
  count,
  updateById,
  initDB,
  deleteById,
  findById,
  customSearch,
  customCount,
  customSum,
  summaryTotalProductOrderByChannel,
};
