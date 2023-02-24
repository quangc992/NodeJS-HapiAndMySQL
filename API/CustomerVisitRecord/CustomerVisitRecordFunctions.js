/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const CustomerVisitRecordResourceAccess = require('./resourceAccess/CustomerVisitRecordResourceAccess');
const moment = require('moment');

async function _registerNewVisitRecord(visitRecordData) {
  return await CustomerVisitRecordResourceAccess.insert(visitRecordData);
}

async function addNewCustomerVisitRecord(customerInfo, visitAt, imageUrl, station) {
  const customerInfoId = customerInfo.customerInfoId;
  const newestRecords = await CustomerVisitRecordResourceAccess.find({ customerInfoId }, 0, 1, { key: 'visitedAt', value: 'desc' });

  if (newestRecords && newestRecords.length > 0) {
    const newestVisitTime = moment(newestRecords[0].visitAt);
    const currentTime = moment();

    // if(currentTime.diff(newestVisitTime, 'minute') < 3){
    //   // NOT INSERT NEW RECORD
    //   return;
    // }
  }

  let _newVisitRecord = {
    customerInfoId,
    customerVisitRecordFullname: customerInfo.customerFullName,
    customerVisitRecordEmail: customerInfo.customerEmail,
    customerVisitRecordPhoneNumber: customerInfo.customerPhoneNumber,
    customerVisitRecordImageUrl: imageUrl,
    visitedAt: visitAt,
    receiverStationsId: customerInfo.departmentId,
  };

  if (station) {
    _newVisitRecord.stationsId = station.stationsId;
  }

  return await _registerNewVisitRecord(_newVisitRecord);
}

async function addNewStrangerVisitRecord(personName, visitAt, imageUrl, station) {
  let _newVisitRecord = {
    customerVisitRecordFullname: personName,
    customerVisitRecordImageUrl: imageUrl,
    visitedAt: visitAt,
  };

  if (station) {
    _newVisitRecord.stationsId = station.stationsId;
  }

  return await _registerNewVisitRecord(_newVisitRecord);
}

module.exports = {
  addNewCustomerVisitRecord,
  addNewStrangerVisitRecord,
};
