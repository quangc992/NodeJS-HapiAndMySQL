/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const ScheduleResourceAccess = require('./resourceAccess/CustomerScheduleResourceAccess');
const Logger = require('../../utils/logging');

async function insertSchedule(scheduledata) {
  Logger.info('NewSchedule', JSON.stringify(scheduledata));
  try {
    let result = await ScheduleResourceAccess.insert(scheduledata);
    return result;
  } catch (e) {
    Logger.error('new Schedule', e);
    return undefined;
  }
}

module.exports = {
  insertSchedule,
};
