/* Copyright (c) 2020-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';

const Winston = require('winston');
const AppConfig = require('../config/app');

const loggingTransports = [
  new Winston.transports.Console({
    level: AppConfig.logging.console.level,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    colorize: true,
  }),
];
Winston.Logger({
  transports: loggingTransports,
  exitOnError: false,
});
module.exports = Winston;
