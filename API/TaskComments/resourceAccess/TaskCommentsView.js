/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { DB } = require('../../../config/database');
const tableName = 'TaskCommentsView';
const rootTableName = 'TaskComments';
const primaryKeyField = 'taskCommentsId';

async function createStationView() {
  const StaffTableName = 'Staff';
  const fields = [
    `${rootTableName}.taskCommentsId`,
    `${rootTableName}.content`,
    `${rootTableName}.taskId`,
    `${rootTableName}.staffId`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.updatedAt`,
    `${rootTableName}.isDeleted`,

    `${StaffTableName}.firstName as staffName`,
    `${StaffTableName}.userAvatar as staffAvatar`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(StaffTableName, function () {
      this.on(`${rootTableName}.staffId`, '=', `${StaffTableName}.staffId`);
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
