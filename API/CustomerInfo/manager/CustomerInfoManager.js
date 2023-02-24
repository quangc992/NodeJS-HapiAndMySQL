/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const { registerNewCustomerInfo, getDetailCustomerInfoById, updateFaceIdForCustomerInfoById } = require('../CustomerInfoFunctions');
const { UNKNOWN_ERROR, POPULAR_ERROR } = require('../../Common/CommonConstant');
const CustomerInfoRescourceAccess = require('../resourceAccess/CustomerInfoResourceAccess');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload.customerData;
      let _customerVisitRecordId = undefined;
      if (data.customerVisitRecordId) {
        _customerVisitRecordId = data.customerVisitRecordId;
        delete data.customerVisitRecordId;
      }
      let addResult = await registerNewCustomerInfo(data);
      if (addResult === undefined) {
        return reject(POPULAR_ERROR.INSERT_FAILED);
      } else {
        //neu KH chua duoc dang ky
        if (_customerVisitRecordId) {
          CustomerVisitRecordResourceAccess = require('../../CustomerVisitRecord/resourceAccess/CustomerVisitRecordResourceAccess');
          await CustomerVisitRecordResourceAccess.updateById(_customerVisitRecordId, {
            customerInfoId: addResult[0],
          });
        }
        return resolve(addResult);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;
      let customerCount = await CustomerInfoRescourceAccess.customCount(filter, startDate, endDate, searchText, order);
      if (customerCount !== undefined) {
        let custommerList = await CustomerInfoRescourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
        return resolve({ data: custommerList, total: customerCount[0].count });
      } else {
        return reject('failed');
      }
    } catch (e) {
      console.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customer = await getDetailCustomerInfoById(req.payload.id);
      if (customer !== undefined) {
        return resolve(customer);
      } else {
        return reject(UNKNOWN_ERROR);
      }
    } catch (e) {
      console.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload.customerData;
      //xoa data du thua (phong truong hop front-end truyen du)
      if (data.customerVisitRecordId) {
        delete data.customerVisitRecordId;
      }
      let updateResult = await CustomerInfoRescourceAccess.updateById(req.payload.id, data);
      if (updateResult !== undefined) {
        await updateFaceIdForCustomerInfoById(req.payload.id);
        return resolve(updateResult);
      } else {
        return reject(UNKNOWN_ERROR);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let deleteResult = await CustomerInfoRescourceAccess.updateById(req.payload.id, { isDeleted: 1 });
      if (deleteResult) {
        return resolve(deleteResult);
      }
      return reject(UNKNOWN_ERROR);
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  insert,
  find,
  findById,
  updateById,
  deleteById,
};
