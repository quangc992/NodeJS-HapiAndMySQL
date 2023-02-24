/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const Logger = require('../../../utils/logging');
const errorCodes = {
  405: {
    statusCode: 405,
    error: 'Method Not Allowed',
    message: 'An invalid operation occurred',
  },
  500: {
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An internal server error occurred',
  },
  505: {
    statusCode: 505,
    error: 'Unauthorized',
    message: 'An internal server unauthorized',
  },
  200: { statusCode: 200, error: null, message: 'Success', data: {} },
};

module.exports = {
  errorCodes,
  setup: function (manager) {
    return function (request, reply, method) {
      manager[method](request)
        .then(data => {
          let responseData = errorCodes[200];
          if (data !== undefined) {
            responseData.data = data;
            reply(responseData).code(200);
          } else {
            reply(errorCodes[500]).code(500);
          }
        })
        .catch(data => {
          Logger.error(data);
          let error = errorCodes[500];
          error.error = data;
          reply(error).code(500);
        });
    };
  },
};
