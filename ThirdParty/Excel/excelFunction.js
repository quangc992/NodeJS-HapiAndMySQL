/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
const xlsx = require('xlsx');
const path = require('path');
const moment = require('moment');
('use strict');

const exportExcel = (data, workSheetColumnNames, workSheetName, fileName) => {
  const workBook = xlsx.utils.book_new();
  let _exportingData = [];

  let _headerRow = [];
  for (let i = 0; i < workSheetColumnNames.length; i++) {
    _headerRow.push(workSheetColumnNames[i].label);
  }
  _exportingData.push(_headerRow);

  for (let i = 0; i < data.length; i++) {
    let _row = [];

    for (let j = 0; j < workSheetColumnNames.length; j++) {
      console.log(workSheetColumnNames[j]);
      _row.push(data[i][workSheetColumnNames[j].key]);
    }
    _exportingData.push(_row);
  }

  const workSheet = xlsx.utils.aoa_to_sheet(_exportingData);
  xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
  const _filePath = `uploads/exportExcel/${fileName}`;
  xlsx.writeFile(workBook, path.resolve(_filePath));
  return _filePath;
};

async function importExcel(filePath) {
  var workBook = xlsx.readFile(filePath);
  var workSheet = workBook.Sheets[workBook.SheetNames[0]];
  var data = xlsx.utils.sheet_to_json(workSheet);
  var name;
  var bxs;
  var sdt;
  var email;
  var fullData = [];
  for (let index = 2; index < data.length + 2; index++) {
    if (workSheet[`B${index}`] === undefined || workSheet[`C${index}`] === undefined || workSheet[`D${index}`] === undefined) {
      continue; //neu row bi loi thi bo qua, khong can import
    } else {
      bxs = workSheet[`B${index}`].v;
      sdt = workSheet[`C${index}`].v;
      customerRecordCheckExpiredDate = workSheet[`D${index}`].v;
    }
    if (workSheet[`E${index}`] === undefined) {
      name = '';
    } else {
      name = workSheet[`E${index}`].v;
    }
    if (workSheet[`F${index}`] === undefined) {
      email = '';
    } else {
      email = workSheet[`F${index}`].v;
    }
    fullData.push({
      customerRecordFullName: name,
      customerRecordPlatenumber: bxs,
      customerRecordPhone: sdt.toString(),
      customerRecordEmail: email,
      customerRecordCheckExpiredDate: customerRecordCheckExpiredDate,
    });
  }
  return fullData;
}

module.exports = {
  exportExcel,
  importExcel,
};
