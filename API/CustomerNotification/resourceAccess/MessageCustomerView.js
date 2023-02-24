/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { MESSAGE_STATUS } = require('../CustomerMessageConstant');
const tableName = 'MessageCustomerView';
const rootTableName = 'MessageCustomer';
const primaryKeyField = 'messageCustomerId';

async function createRoleStaffView() {
  const CustomerMessageTable = 'CustomerMessage';

  let fields = [
    `${rootTableName}.messageCustomerId`,
    `${rootTableName}.customerId`,
    `${rootTableName}.messageId`,
    `${rootTableName}.messageSendStatus`,
    `${rootTableName}.messageNote`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.updatedAt`,
    `${rootTableName}.isHidden`,
    `${rootTableName}.isRead`,
    `${CustomerMessageTable}.customerMessageCategories`,
    `${CustomerMessageTable}.customerMessageContent`,
    `${CustomerMessageTable}.customerMessageTitle`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(CustomerMessageTable, function () {
      this.on(`${rootTableName}.messageId`, '=', `${CustomerMessageTable}.customerMessageId`);
    });

  Common.createOrReplaceView(tableName, viewDefinition);
}

async function initViews() {
  createRoleStaffView();
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  return await Common.updateById(tableName, { userId: id }, data);
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

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('customerMessageCategories', 'like', `%${searchText}%`)
        .orWhere('customerMessageContent', 'like', `%${searchText}%`)
        .orWhere('customerMessageTitle', 'like', `%${searchText}%`);
    });
  } else {
    if (filterData.customerMessageContent) {
      queryBuilder.where('customerMessageContent', 'like', `%${filterData.customerMessageContent}%`);
      delete filterData.customerMessageContent;
    }

    if (filterData.customerMessageTitle) {
      queryBuilder.where('customerMessageTitle', 'like', `%${filterData.customerMessageTitle}%`);
      delete filterData.customerMessageTitle;
    }
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  queryBuilder.where(filterData);

  queryBuilder.where({
    isDeleted: 0,
    messageSendStatus: MESSAGE_STATUS.COMPLETED,
  });

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
  initViews,
  updateAll,
  _makeQueryBuilderByFilter,
  customSearch,
  customCount,
};
