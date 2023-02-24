/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
// const ExcelFunctions = require('../../../ThirdParty/Excel/ExcelFunction');
// const BooksResource = require('../../Books/resourceAccess/BooksResourceAccess');
const Logger = require('../../../utils/logging');

async function downloadBookReport(req, res) {
  try {
    let filter = req.payload.filter;
    let booksCount = await BooksResource.count(filter);

    if (booksCount) {
      booksCount = booksCount[0].count;
    }

    const MAX_PER_BATCH = 100;
    let batchCount = 1;
    if (booksCount > MAX_PER_BATCH) {
      batchCount = parseInt(booksCount / MAX_PER_BATCH);
      if (batchCount * MAX_PER_BATCH < booksCount) {
        batchCount++;
      }
    }

    let reportData = [];
    for (let i = 0; i < batchCount; i++) {
      const bookData = await BooksResource.find(filter, batchCount * i, MAX_PER_BATCH);
      if (bookData && bookData.length > 0) {
        reportData = reportData.concat(bookData);
      }
    }

    let reportName = `BookReport_${new Date() - 1}`;
    let excelFileName = await ExcelFunctions.renderExcelFile(reportName, reportData);
    let downloadUrl = process.env.HOST_NAME + '/downloads/' + excelFileName;
    return downloadUrl;
  } catch (e) {
    Logger.error(__filename, e);
    return 'failed';
  }
}

module.exports = {
  downloadBookReport,
};
