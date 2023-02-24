/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'user strict';
const moment = require('moment');
const CustomerVisitRecordResourceAccess = require('../resourceAccess/CustomerVisitRecordResourceAccess');
const CustomerVisitRecordView = require('../resourceAccess/CustomerVisitRecordView');
const CustomerVisitRecordFunctions = require('../CustomerVisitRecordFunctions');
const { RECORD_ERRORS, CUSTOMER_VISIT_STATUS } = require('../CustomerVisitRecordConstants');
const { UNKNOWN_ERROR } = require('../../Common/CommonConstant');
const { registerNewCustomerInfo } = require('../../CustomerInfo/CustomerInfoFunctions');

const _tableName = 'CustomerVisitRecord';

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerVisitRecordData = req.payload || {};
      if (customerVisitRecordData.visitedAt === null || customerVisitRecordData.visitedAt === '') {
        delete customerVisitRecordData.visitedAt;
      }
      if (customerVisitRecordData.leaveAt === null || customerVisitRecordData.leaveAt === '') {
        delete customerVisitRecordData.leaveAt;
      }

      const { staffId } = req.currentUser;

      customerVisitRecordData.createdByStaffId = staffId;

      //dang ky khach hang vang lai
      let _newCustomerInfo = {
        customerFullName: customerVisitRecordData.customerVisitRecordFullname,
        customerAvatarUrl: customerVisitRecordData.customerVisitRecordImageUrl,
        departmentId: customerVisitRecordData.receiverStationsId,
        customerCompanyName: customerVisitRecordData.customerVisitRecordCompanyName,
        note: customerVisitRecordData.customerVisitRecordNote,
      };

      let _newCustomerInfoId = await registerNewCustomerInfo(_newCustomerInfo);
      if (_newCustomerInfoId) {
        customerVisitRecordData.customerInfoId = _newCustomerInfoId;
      }

      //luu thong tin vieng tham cua kh
      const result = await CustomerVisitRecordResourceAccess.insert(customerVisitRecordData);
      if (result) {
        return resolve(result);
      } else {
        return reject(UNKNOWN_ERROR);
      }
    } catch (e) {
      console.log(e);
      _createErrorResponse(`error ${_tableName} insert failed`, reject, UNKNOWN_ERROR);
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const { filter, skip, limit, startDate, endDate, order, searchText } = req.payload;

      const customerVisitRecordCount = await CustomerVisitRecordResourceAccess.customCount(filter, startDate, endDate, searchText, order);

      if (customerVisitRecordCount) {
        let customerVisitRecords = await CustomerVisitRecordView.customSearch(filter, skip, limit, startDate, endDate, searchText, order);

        if (customerVisitRecords) {
          _overwriteStaffName(customerVisitRecords);
          return resolve({ data: customerVisitRecords, total: customerVisitRecordCount });
        } else {
          return _createErrorResponse(`cannot find customerVisitRecord !`, reject, UNKNOWN_ERROR);
        }
      } else {
        return resolve({ data: [], total: 0 });
      }
    } catch (e) {
      _createErrorResponse(`error ${_tableName} select failed ${e}`, reject, UNKNOWN_ERROR);
    }
  });
}

function _overwriteStaffName(customerVisitRecords) {
  customerVisitRecords.forEach(record => {
    if (record.receiverId && record.receiverId > 0) {
      record.staffName = record.receiverName || record.staffName;
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const customerVisitRecordId = req.payload.id;
      const result = await CustomerVisitRecordView.findById(customerVisitRecordId);

      if (result) {
        _overwriteStaffName([result]);
        return resolve(result);
      } else {
        return _createErrorResponse(`cannot find customerVisitRecord with id ${customerVisitRecordId}`, reject, RECORD_ERRORS.RECORD_NOT_FOUND);
      }
    } catch (e) {
      _createErrorResponse(`error ${_tableName} select by id failed ${e}`, reject, UNKNOWN_ERROR);
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const customerVisitRecordId = req.payload.id;

      const oldRecord = await CustomerVisitRecordResourceAccess.findById(customerVisitRecordId);

      if (!oldRecord) {
        return _createErrorResponse(`error delete CustomerVisitRecord table by id  ${customerVisitRecordId}`, reject, RECORD_ERRORS.INVALID_RECORD);
      } else {
        const result = await CustomerVisitRecordResourceAccess.deleteById(customerVisitRecordId);
        if (result === 1) {
          return resolve(result);
        } else {
          return reject(UNKNOWN_ERROR);
        }
      }
    } catch (e) {
      _createErrorResponse(`error ${_tableName} delete by id failed ${e}`, reject, UNKNOWN_ERROR);
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const customerVisitRecordId = req.payload.id;
      const updateData = req.payload.data || {};
      const { staffId } = req.currentUser;
      const customerVisitRecordStatus = updateData.customerVisitRecordStatus;

      updateData.proccessedByStaffId = staffId;

      if (customerVisitRecordStatus === CUSTOMER_VISIT_STATUS.CONFIRM) {
        updateData.approvedAt = moment().toDate();
        updateData.approvedByStaffId = staffId;
      }

      const targetRecord = await CustomerVisitRecordResourceAccess.findById(customerVisitRecordId);

      if (targetRecord) {
        const result = await CustomerVisitRecordResourceAccess.updateById(customerVisitRecordId, updateData);
        if (result && result !== 0) {
          return resolve(result);
        } else {
          return _createErrorResponse(`update customerVisitRecord by id ${customerVisitRecordId} failure !`, reject, UNKNOWN_ERROR);
        }
      } else {
        return _createErrorResponse(`cannot find customerVisitRecord with id ${customerVisitRecordId}`, reject, RECORD_ERRORS.RECORD_NOT_FOUND);
      }
    } catch (e) {
      _createErrorResponse(`error ${_tableName} update by id failed ${e}!`, reject, UNKNOWN_ERROR);
    }
  });
}

function _createErrorResponse(errorMessage, reject, rejectErrorMessage) {
  console.error(errorMessage);
  reject(rejectErrorMessage);
}

module.exports = { insert, find, findById, deleteById, updateById };
