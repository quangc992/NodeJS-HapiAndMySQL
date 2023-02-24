/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const TaskUpdateHistory = require('./TaskUpdateHistoryRoute');

module.exports = [{ method: 'POST', path: '/TaskUpdateHistory/find', config: TaskUpdateHistory.find }];
