/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';

const moment = require('moment');

function fromData(data) {
  let modelData = data;
  modelData.customerRecordCheckDate =
    data.customerRecordCheckDate && data.customerRecordCheckDate !== null ? moment(data.customerRecordCheckDate).format('DD/MM/YYYY') : '';
  modelData.customerRecordCheckExpiredDate =
    modelData.customerRecordCheckExpiredDate && modelData.customerRecordCheckExpiredDate !== null
      ? moment(data.customerRecordCheckExpiredDate).format('DD/MM/YYYY')
      : '';
  //TODO: get real result later
  modelData.customerRecordEmailNotifyResult = true;
  modelData.customerRecordSMSNotifyResult = true;
  return modelData;
}

module.exports = {
  fromData,
};
