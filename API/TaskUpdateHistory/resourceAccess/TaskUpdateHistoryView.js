/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { DB } = require('../../../config/database');
const tableName = 'TaskUpdateHistoryView';
const rootTableName = 'TaskUpdateHistory';
const primaryKeyField = 'taskUpdateHistoryId';

async function createStationView() {
  const StaffTableName = 'Staff';

  const fields = [
    `${rootTableName}.taskUpdateHistoryId`,
    `${rootTableName}.createdByStaffId`,
    `${rootTableName}.taskId`,
    `${rootTableName}.updatedColumnName`,
    `${rootTableName}.changeType`,
    `${rootTableName}.fromValue`,
    `${rootTableName}.toValue`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.updatedAt`,
    `${rootTableName}.isDeleted`,

    `${StaffTableName}.firstName as createdByStaffName`,
    `${StaffTableName}.userAvatar as createdByStaffAvatar`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(StaffTableName, function () {
      this.on(`${rootTableName}.createdByStaffId`, '=', `${StaffTableName}.staffId`);
    });

  await Common.createOrReplaceView(tableName, viewDefinition);
}

function initViews() {
  createStationView();
}

function find(filter, skip, limit, order) {
  return Common.find(tableName, filter, skip, limit, order);
}

function count(filter, order) {
  return Common.count(tableName, primaryKeyField, filter, order);
}

module.exports = {
  initViews,
  find,
  count,
};
