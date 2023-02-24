/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const HanetRecordRoute = require('./HanetRecordRoute');

module.exports = [{ method: 'POST', path: '/HanetRecord/customerCheckinHook', config: HanetRecordRoute.customerCheckinHook }];
