/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const Statistical = require('./StatisticalRoute');

module.exports = [
  {
    method: 'POST',
    path: '/Statistical/generalReport',
    config: Statistical.generalReport,
  },
  {
    method: 'POST',
    path: '/Statistical/summaryUserPayment',
    config: Statistical.summaryUserPayment,
  },
  {
    method: 'POST',
    path: '/Statistical/user/summaryReferUser',
    config: Statistical.userSummaryReferUser,
  },
  {
    method: 'POST',
    path: '/Statistical/user/summaryCountUserFAC',
    config: Statistical.summaryCountUserFAC,
  },
  {
    method: 'POST',
    path: '/Statistical/summaryUserReport',
    config: Statistical.summaryUserReport,
  },
  {
    method: 'POST',
    path: '/Statistical/summaryServicePackageReport',
    config: Statistical.summaryServicePackageReport,
  },
];
