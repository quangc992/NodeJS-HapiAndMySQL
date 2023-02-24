/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';

const moment = require('moment');

function fromData(data) {
  let modelData = data;

  modelData.createdAt = moment(data.createdAt).local();
  modelData.updatedAt = moment(data.updatedAt).local();

  return modelData;
}

module.exports = {
  fromData,
};
