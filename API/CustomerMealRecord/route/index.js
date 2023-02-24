/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const CustomerMealRecord_UserRoute = require('./CustomerMealRecord_UserRoute');
const CustomerMealRecord_StaffRoute = require('./CustomerMealRecord_StaffRoute');
module.exports = [
  //Api CustomerSchedule
  {
    method: 'POST',
    path: '/CustomerMealRecord/user/insertMealRecord',
    config: CustomerMealRecord_UserRoute.userInsertMealRecord,
  },
  {
    method: 'POST',
    path: '/CustomerMealRecord/user/updateMealRecord',
    config: CustomerMealRecord_UserRoute.userUpdateMealRecord,
  },
  {
    method: 'POST',
    path: '/CustomerMealRecord/user/getList',
    config: CustomerMealRecord_UserRoute.userGetListMealRecord,
  },
  {
    method: 'POST',
    path: '/CustomerMealRecord/user/getDetail',
    config: CustomerMealRecord_UserRoute.userGetDetailMealRecordById,
  },

  {
    method: 'POST',
    path: '/CustomerMealRecord/staff/getUserMealListByUserId',
    config: CustomerMealRecord_StaffRoute.staffGetListMealRecordByUserId,
  },
  {
    method: 'POST',
    path: '/CustomerMealRecord/staff/getUserMealDetail',
    config: CustomerMealRecord_StaffRoute.staffGetDetailMealRecordById,
  },
];
