/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const excelFunction = require('../../ThirdParty/Excel/excelFunction');
const moment = require('moment');

async function exportAppUserRecordToExcel(records, filepath, station) {
  let count = 0;
  const workSheetName = 'Danh sách chấm công';
  const dataRows = [];
  //worksheet title
  const workSheetTitle = [
    '', //break 1 columns
    '', //break 1 columns
    'Danh sách chấm công',
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
  const workSheetColumnNames = ['Số TT', 'Tên đăng kiểm viên', 'Tên trạm', 'Bắt đầu', 'Kết thúc'];
  dataRows.push(workSheetColumnNames);
  //Table data
  for (let record of records) {
    count += 1;
    let startWork = moment(record.startWork).format('h:mm:ss MM/DD/YYYY');
    let finishWork = moment(record.finishWork).format('h:mm:ss MM/DD/YYYY');
    let data = [count, record.firstName, record.stationsName, startWork, finishWork];
    dataRows.push(data);
  }
  excelFunction.exportExcelOldFormat(dataRows, workSheetName, filepath);
  return 'OK';
}

module.exports = {
  exportAppUserRecordToExcel,
};
