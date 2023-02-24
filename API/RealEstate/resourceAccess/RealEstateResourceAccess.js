/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const knex = require('knex');
const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'RealEstate';
const primaryKeyField = 'realEstateId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          //thông tin bài đăng
          table.string('realEstateTitle'); // Tiêu đề
          table.text('realEstateDescription', 2000); // Mô tả
          table.integer('appUserId'); // id user người đăng
          table.integer('staffId');
          table.integer('approveStatus').defaultTo(0); //trạng thái bài đăng 0 - chưa duyệt/ 1-đã duyệt/ -1 từ chối
          table.integer('approvePIC').nullable(); // id của staff duyệt
          table.string('approveDate').nullable(); // ngày duyệt
          table.integer('realEstateCategoryId'); //thể loại bài đăng (Nhà phố / đất / chung cư)
          table.integer('realEstateSubCategoryId'); //thể loại con của loại bài đăng (Nhà mặt tiền / nhà hẻm / căn hộ cao cấp .v.v.)
          table.integer('realEstatePostTypeId'); // kiểu bài đăng(Mua bán- cho thuê-dự án)
          table.timestamp('activedDate').defaultTo(DB.fn.now());

          //Thông tin liên hệ
          table.string('realEstatePhone'); // SDT
          table.string('realEstateEmail').nullable(); //Email
          table.string('realEstateContacAddress'); // địa chỉ liên hệ
          table.integer('realEstateContactTypeId'); //id (loại liên hệ (chủ nhà/Môi giới) )
          //Thông tin về vị trí BDS
          table.integer('realEstateLocationFrontStreetWidth').nullable(); //Đường trước nhà
          table.integer('realEstateLocationStreetWidth').nullable(); // chiều rộng đường
          table.string('realEstateLocationHomeNumber').nullable(); //số nhà
          table.integer('realEstateLocationHomeNumberStatus').defaultTo(0); //ẩn hiện số nhà(0/1)
          table.integer('realEstateDirection'); // hướng BDS
          table.integer('areaCountryId'); // id Quốc gia
          table.integer('areaProvinceId'); // tĩnh thành phố
          table.integer('areaDistrictId'); // Quận- Huyện
          table.integer('areaWardId'); // Phường- Xã
          table.integer('areaStreetId').nullable(); // Đường
          table.decimal('lat', 30, 20).nullable();
          table.decimal('lng', 30, 20).nullable();

          //Thông tin về đất của BDS
          table.integer('realEstateLandRealitySquare').nullable(); //Diện tích thực tế
          table.integer('realEstateLandDefaultSquare').nullable(); // Diện tích công nhận
          table.integer('realEstateLandRoadSquare').nullable(); // Diện tích lộ giới
          table.integer('realEstateLandUseSquare').nullable(); // Diện tích sử dụng
          table.integer('realEstateLandRealConstructionSquare').nullable(); // Diện tích xây dựng
          table.integer('realEstateLandLongs').nullable(); // chiều dài
          table.integer('realEstateLandWidth').nullable(); // chiều rộng
          table.integer('realEstateLandShapeName').nullable(); // id (hình dạng BDS)

          //Thông tin về nhà trên BDS
          table.integer('realEstateHouseDirection').nullable(); //id(hướng nhà)
          table.integer('realEstateBalconyDirection').nullable(); //id(hướng ban công)
          table.string('realEstateHouseFurnitureList').nullable(); // danh sách nội thất đi kèm
          table.integer('realEstateHouseFurniture').nullable(); //id(tình trạng nội thất)
          table.integer('realEstateHouseFloors').nullable(); // số tầng nhà
          table.integer('realEstateHouseBedRooms').nullable(); // số phòng ngủ
          table.integer('realEstateHouseToilets').nullable(); // số phòng tolet
          table.integer('realEstateHouseKitchen').nullable(); // số phòng bếp
          table.integer('realEstateHouseLivingRoom').nullable(); // số khách

          //Thông tin về giá
          table.double('realEstateValueSalePrice'); // Giá BDS
          table.double('realEstateUnitPrice'); //Giá m2
          table.double('realEstatePlanRentPrice'); //Giá cho thuê
          table.double('realEstatedeposits').nullable(); //Tiền Đặt cọc

          //Thông tin pháp lý
          table.integer('realEstateJuridicalName').nullable(); // id (loại giấy tờ)

          //Thông tin khác của BDS
          table.string('realEstateImage').nullable(); // hình ảnh BDS
          table.string('realEstateVideo').nullable(); // Video của BDS
          table.string('realEstateCommonPlace', 1000).nullable(); // danh sách địa điểm xung quanh BDS
          table.string('realEstateUtil').nullable(); // danh sách tiện ích của BDS

          //Thông tin dự án liên quan
          table.integer('realEstateProjectId').nullable(); //id dự án
          table.string('apartmentCode').nullable(); // Mã Căn hộ
          table.string('apartmentBlockCode').nullable(); // Mã block căn hộ
          table.integer('apartmentCodeStatus').nullable(); // ẩn hiện mã căn hộ(0/1)
          table.boolean('apartmentCornerPosition').defaultTo(0); // căn hộ nằm ở góc hay không (Không: 0/ Có: 1)

          //thông tin khác
          table.boolean('agencyStatus').defaultTo(0); // cho phép môi giới hay không
          table.boolean('agency').defaultTo(0); // Mua giới- chủ nhà(0-1)
          table.float('agencyPercent').nullable(); // Phần trăm môi giới
          //Thông tin về thống kê
          table.integer('realEstateViews').defaultTo(0);
          table.integer('realEstateClick').defaultTo(0);

          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index('realEstateTitle');
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

async function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.deleteById(tableName, dataId);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

function _makeQueryBuilderByFilter(filter, filterClause, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};
  let filterDataClause = filterClause ? JSON.parse(JSON.stringify(filterClause)) : {};
  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('realEstatePhone', 'like', `%${searchText}%`).orWhere('realEstateEmail', 'like', `%${searchText}%`);
    });
  }
  if (filterDataClause.startLandRealitySquare) {
    queryBuilder.where('realEstateLandRealitySquare', '>=', filterDataClause.startLandRealitySquare);
  }

  if (filterDataClause.endLandRealitySquare) {
    queryBuilder.where('realEstateLandRealitySquare', '<=', filterDataClause.endLandRealitySquare);
  }
  if (filterDataClause.startValueSalePrice) {
    queryBuilder.where('realEstateValueSalePrice', '>=', filterDataClause.startValueSalePrice);
  }

  if (filterDataClause.endValueSalePrice) {
    queryBuilder.where('realEstateValueSalePrice', '<=', filterDataClause.endValueSalePrice);
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

async function customSearch(filter, filterClause, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, filterClause, skip, limit, startDate, endDate, searchText, order);
  return await query.select();
}

async function customCount(filter, filterClause, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, filterClause, undefined, undefined, startDate, endDate, searchText, order);
  return await query.count(`${primaryKeyField} as count`);
}

async function updateFollowCount(booksId) {
  let filter = {};
  filter[primaryKeyField] = booksId;
  return await DB(tableName).where(filter).increment('followCount', 1);
}

async function updateSearchCount(booksId) {
  let filter = {};
  filter[primaryKeyField] = booksId;
  return await DB(tableName).where(filter).increment('searchCount', 1);
}

async function addViewCount(booksId) {
  let filter = {};
  filter[primaryKeyField] = booksId;

  await DB(tableName).where(filter).increment('booksTotalViewed', 1);
  await DB(tableName).where(filter).increment('dayViewed', 1);
  await DB(tableName).where(filter).increment('monthViewed', 1);
  await DB(tableName).where(filter).increment('weekViewed', 1);

  return 1;
}

async function resetDayViewedCount() {
  return await DB(tableName).update({ dayViewed: 0 });
}

async function resetMonthViewedCount() {
  return await DB(tableName).update({ monthViewed: 0 });
}

async function resetWeekViewedCount() {
  return await DB(tableName).update({ weekViewed: 0 });
}

function _makeQueryFindPrice(filter, startDate, endDate) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};
  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }
  queryBuilder.where(filterData);
  queryBuilder.where({ isDeleted: 0 });

  return queryBuilder;
}

async function findMaxPriceGroupByRealitySquare(filter, startDate, endDate) {
  let query = _makeQueryFindPrice(filter, startDate, endDate);
  return await query.select('realEstateLandRealitySquare').max(`realEstateValueSalePrice as maxValue`).groupBy('realEstateLandRealitySquare');
}

async function findMinPriceGroupByRealitySquare(filter, startDate, endDate) {
  let query = _makeQueryFindPrice(filter, startDate, endDate);
  return await query.select('realEstateLandRealitySquare').min(`realEstateValueSalePrice as minValue`).groupBy('realEstateLandRealitySquare');
}

async function calculateAvgPrice(filter, startDate, endDate) {
  let query = _makeQueryFindPrice(filter, startDate, endDate);
  return await query.select().avg(`realEstateValueSalePrice as avgPrice`).avg(`realEstateLandRealitySquare as avgS`);
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
  resetWeekViewedCount,
  resetMonthViewedCount,
  resetDayViewedCount,
  updateFollowCount,
  updateSearchCount,
  addViewCount,
  deleteById,
  findMaxPriceGroupByRealitySquare,
  findMinPriceGroupByRealitySquare,
  calculateAvgPrice,
};
