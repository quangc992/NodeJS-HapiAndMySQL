/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const CustomerMeasureRecord_UserRoute = require('./CustomerMeasureRecord_UserRoute');

module.exports = [
  //Api CustomerSchedule
  {
    method: 'POST',
    path: '/CustomerMeasureRecord/user/getList',
    config: CustomerMeasureRecord_UserRoute.userGetListMeasureRecord,
  },
  {
    method: 'POST',
    path: '/CustomerMeasureRecord/user/getDetail',
    config: CustomerMeasureRecord_UserRoute.userGetDetailMeasureRecordById,
  },
];
