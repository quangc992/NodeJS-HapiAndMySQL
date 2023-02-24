/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const CustomerRecordResourceAccess = require('../CustomerRecord/resourceAccess/CustomerRecordResourceAccess');
const CustomerMessageResourceAccess = require('../CustomerMessage/resourceAccess/CustomerMessageResourceAccess');

async function countRecordbyDate(filter, startDate, endDate) {
  return await CustomerRecordResourceAccess.customCount(filter, startDate, endDate, undefined, undefined);
}
async function countMessagebyDate(filter, startDate, endDate) {
  return await CustomerMessageResourceAccess.customCount(filter, startDate, endDate, undefined, undefined);
}
async function countMessagebyDateDistinctStatus(filter, startDate, endDate) {
  return await CustomerMessageResourceAccess.customCountDistinct(`customerMessageStatus`, filter, startDate, endDate, undefined, undefined);
}
module.exports = {
  countRecordbyDate,
  countMessagebyDate,
  countMessagebyDateDistinctStatus,
};
