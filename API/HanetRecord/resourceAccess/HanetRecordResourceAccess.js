/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'HanetRecord';
const primaryKeyField = 'hanetRecordId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('action_type'); //type sẽ là"update" để xác định thao tác thêm mới/cập nhật
          table.string('aliasID'); //: là id định danh của một FaceID.
          table.string('data_type'); //: type là "log" để xác định loại dữ liệu là dữ liệu chấm công
          table.string('date'); //: Date format: YYYY-MM-DD HH:mm:ss
          table.string('detected_image_url'); //: link checkin của FaceID.
          table.string('deviceID'); //: là id của device
          table.string('deviceName'); //: là tên của device
          table.string('hash'); //: MD5 của "client_secret" + "id", dùng để verify record này là được gửi từ HANET
          table.string('id'); //: unique record ID
          table.string('keycode'); //: là token định danh của đối tác gửi cho HANET khi authen qua Oauth
          table.string('personID'); //: id định danh của một FaceID
          table.string('personName'); //: tên của FaceID
          table.string('personTitle'); //: chức danh của FaceID
          table.string('personType'); //: có các giá trị (0,1,2,3,4,5,6) trong đó giá trị (0 là Nhân viên) hoặc (1 là Khách hàng) còn (2,3,4,5 là người lạ), (6 là ảnh chụp hình từ camera).
          table.string('placeID'); //: là ID của địa điểm mà camera đang dùng
          table.string('placeName'); //: là tên địa điểm.
          table.string('mask'); //: thông tin có đeo khẩu trang hay ko (-1: không có bật tính năng kiểm tra khẩu trang, 0: không đeo khẩu trang, 2: có đeo khẩu trang)
          table.string('time'); //: Timestamp tại thời điểm camera checkin.
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index(`personID`);
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

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, skip, limit, order) {
  return await Common.count(tableName, filter, skip, limit, order);
}

async function deleteByFilter(filter) {
  return await Common.deleteById(tableName, filter);
}

async function updateById(id, data) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.updateById(tableName, dataId, data);
}

async function updateAll(data, filter) {
  return await Common.updateAll(tableName, data, filter);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  const queryBuilder = DB(tableName);
  const filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('customerFullName', 'like', `%${searchText}%`)
        .orWhere('customerEmail', 'like', `%${searchText}%`)
        .orWhere('customerPhoneNumber', 'like', `%${searchText}%`);
    });
  }

  queryBuilder.where({ isDeleted: 0 });

  queryBuilder.where(filterData);

  if (limit !== undefined) {
    queryBuilder.limit(limit);
  }

  if (skip !== undefined) {
    queryBuilder.offset(skip);
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  if (order && order.key !== '' && ['desc', 'asc'].includes(order.value)) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy('createdAt', 'desc');
  }

  return queryBuilder;
}

async function customCount(filter, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText, order);
  return await query.count(`${primaryKeyField} as count`);
}

async function customSearch(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.select();
}

function findById(id) {
  return Common.findById(tableName, primaryKeyField, id);
}
module.exports = {
  insert,
  find,
  findById,
  count,
  initDB,
  deleteByFilter,
  updateById,
  updateAll,
  customCount,
  customSearch,
};
