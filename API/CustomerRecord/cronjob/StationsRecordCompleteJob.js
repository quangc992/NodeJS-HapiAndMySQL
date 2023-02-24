/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const CustomerAutoCheckFunction = require('./StationsRecordAutoCheck');

async function autoComplete() {
  await CustomerAutoCheckFunction.autoCompleteProcessForAllStation();
  process.exit();
}
autoComplete();
module.exports = {
  autoComplete,
};
