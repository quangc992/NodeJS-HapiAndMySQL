/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';

const excelFunction = require('../../ThirdParty/Excel/excelFunction');
const moment = require('moment');

async function exportStationVideoToExcel(records, filepath, station) {
  let count = 0;
  const workSheetName = 'Danh sách video trạm';
  const dataRows = [];
  //worksheet title
  const workSheetTitle = [
    `Trung tâm đăng kiểm`,
    '', //break 1 columns
    '', //break 1 columns
    'Danh sách video trạm',
  ];
  dataRows.push(workSheetTitle);

  const stationCode = station ? `Mã: ${station.stationsName}` : '';

  const workSheetInfo = [
    `${stationCode}`,
    '', //break 1 columns
    '', //break 1 columns
  ];
  dataRows.push(workSheetInfo);
  dataRows.push(['']); //break 1 rows

  //table headers
  const workSheetColumnNames = [
    'Số TT',
    'Trạm đăng kiểm',
    'Tên video',
    'Người upload',
    'Upload filename',
    'Định dạng file',
    'Kích cở file',
    'Note',
    'Ngày tạo video',
  ];
  dataRows.push(workSheetColumnNames);
  //Table data
  for (let record of records) {
    count += 1;
    let createdAt = moment(record.createdAt).format('MM/DD/YYYY HH:mm:ss ');
    let data = [
      count,
      record.stationsName,
      record.videoName,
      record.uploaderName,
      record.uploadFileName,
      record.uploadVideoUrl,
      record.uploadFileExtension,
      record.uploadFileSize,
      record.stationVideoNote,
      createdAt,
    ];
    dataRows.push(data);
  }
  excelFunction.exportExcelOldFormat(dataRows, workSheetName, filepath);
  return 'OK';
}

module.exports = {
  exportStationVideoToExcel,
};
