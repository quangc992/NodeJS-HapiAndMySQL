/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moment = require('moment');
const CustomerRecordResourceAccess = require('../resourceAccess/CustomerRecordResourceAccess');
const Logger = require('../../../utils/logging');
const CustomerFuntion = require('../CustomerRecordFunctions');
const CustomerRecordModel = require('../model/CustomerRecordModel');
const excelFunction = require('../../../ThirdParty/Excel/ExcelFunction');
const UploadFunctions = require('../../Upload/UploadFunctions');
const StationResource = require('../../Stations/resourceAccess/StationsResourceAccess');
const { CHECKING_STATUS } = require('../CustomerRecordConstants');

function _checkCustomerRecordDate(customerRecordData, autoFill = true) {
  let current = new Date();
  //Add default values for checkDate = today
  if (customerRecordData.customerRecordCheckDate === undefined) {
    customerRecordData.customerRecordCheckDate = moment().toDate();
  } else {
    let checkDate = moment(customerRecordData.customerRecordCheckDate, 'DD/MM/YYYY').toDate();
    checkDate.setHours(current.getHours());
    checkDate.setMinutes(current.getMinutes());
    customerRecordData.customerRecordCheckDate = checkDate;
  }

  //Add default value for check duration = 12 months
  if (customerRecordData.customerRecordCheckDuration === undefined) {
    if (autoFill) {
      customerRecordData.customerRecordCheckDuration = 12;
    }
  }

  //Add default value for expired date = check date + check duration
  if (customerRecordData.customerRecordCheckExpiredDate === undefined) {
    if (autoFill) {
      customerRecordData.customerRecordCheckExpiredDate = moment().add(customerRecordData.customerRecordCheckDuration, 'M').toDate();
    }
  } else {
    let checkExpiredDate = moment(customerRecordData.customerRecordCheckExpiredDate, 'DD/MM/YYYY').toDate();
    checkExpiredDate.setHours(current.getHours());
    checkExpiredDate.setMinutes(current.getMinutes());
    customerRecordData.customerRecordCheckExpiredDate = checkExpiredDate;
  }

  return customerRecordData;
}
async function _addNewCustomerRecord(customerRecordData) {
  let customerRecordPlatenumber = customerRecordData.customerRecordPlatenumber;

  //check and validate date of record is having right format
  //do not auto fill if field is missing
  const NO_AUTO_FILL = false;
  _checkCustomerRecordDate(customerRecordData, NO_AUTO_FILL);

  //Fill customer data based on history data
  let resultPlate = await CustomerRecordResourceAccess.find({
    customerRecordPlatenumber: customerRecordPlatenumber,
  });
  if (resultPlate !== undefined && resultPlate.length > 0) {
    if (customerRecordData.customerRecordFullName === undefined) {
      customerRecordData.customerRecordFullName = resultPlate[0].customerRecordFullName;
    }
    if (customerRecordData.customerRecordPhone === undefined) {
      customerRecordData.customerRecordPhone = resultPlate[0].customerRecordPhone;
    }
    if (customerRecordData.customerRecordEmail === undefined) {
      customerRecordData.customerRecordEmail = resultPlate[0].customerRecordEmail;
    }

    //mark if this customer comeback
    customerRecordData.returnNumberCount = resultPlate.length;
  }

  let result = await CustomerRecordResourceAccess.insert(customerRecordData);
  if (result) {
    //get inserted data
    let newRecord = await CustomerRecordResourceAccess.find({
      customerRecordId: result[0],
    });

    //notify to realtime data
    if (newRecord && newRecord.length > 0) {
      await CustomerFuntion.notifyCustomerStatusAdded(newRecord[0]);
    }
    return result;
  }

  return undefined;
}

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerRecordData = req.payload;
      let addResult = await _addNewCustomerRecord(customerRecordData);
      if (addResult) {
        resolve(addResult);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;

      if (filter && req.currentUser.stationsId !== undefined) {
        filter.customerStationId = req.currentUser.stationsId;
      }
      let customerRecord = await CustomerRecordResourceAccess.customSearchByExpiredDate(filter, skip, limit, startDate, endDate, searchText, order);
      for (let i = 0; i < customerRecord.length; i++) {
        customerRecord[i] = CustomerRecordModel.fromData(customerRecord[i]);
      }
      let customerRecordCount = await CustomerRecordResourceAccess.customCountByExpiredDate(filter, startDate, endDate, searchText, order);
      if (customerRecord && customerRecordCount) {
        resolve({ data: customerRecord, total: customerRecordCount });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findToday(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;

      if (filter && req.currentUser.stationsId !== undefined) {
        filter.customerStationId = req.currentUser.stationsId;
      }
      filter.customerRecordCheckStatus = CHECKING_STATUS.NEW;
      let customerRecord = await CustomerRecordResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      for (let i = 0; i < customerRecord.length; i++) {
        customerRecord[i] = CustomerRecordModel.fromData(customerRecord[i]);
      }
      let customerRecordCount = await CustomerRecordResourceAccess.customCount(filter, startDate, endDate, searchText, order);
      if (customerRecord && customerRecordCount) {
        resolve({ data: customerRecord, total: customerRecordCount });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerRecordId = req.payload.id;
      let customerRecordData = req.payload.data;

      //check and validate date of record is having right format
      //do not auto fill if field is missing
      const NO_AUTO_FILL = false;
      _checkCustomerRecordDate(customerRecordData, NO_AUTO_FILL);

      //if user update record info manually, then we note it
      if (
        customerRecordData.customerRecordFullName ||
        customerRecordData.customerRecordEmail ||
        customerRecordData.customerRecordPhone ||
        customerRecordData.customerRecordPlatenumber ||
        customerRecordData.customerRecordPlateColor
      ) {
        customerRecordData.customerRecordModifyDate = new Date();
      }

      let result = await CustomerFuntion.updateCustomerRecordById(customerRecordId, customerRecordData);
      if (result) {
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerRecordId = req.payload.id;
      let result = await CustomerRecordResourceAccess.findById(customerRecordId);

      if (result) {
        result = CustomerRecordModel.fromData(result);
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerRecordId = req.payload.id;

      let oldRecord = await CustomerRecordResourceAccess.findById(customerRecordId);
      if (oldRecord === undefined) {
        reject('invalid record');
        return;
      }

      let result = await CustomerRecordResourceAccess.deleteById(customerRecordId);
      if (result) {
        await CustomerFuntion.notifyCustomerStatusDeleted(oldRecord);
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function _exportRecordToExcel(records, filepath) {
  let count = 0;
  const workSheetColumnNames = ['STT', 'Họ & Tên', 'BSX', 'SDT', 'Email', 'Ngày kiêm định'];

  const workSheetName = 'Danh sách khách hàng';
  const data = [];
  records.forEach(record => {
    var newDate = moment(record.customerRecordCheckDate, 'DD-MM-YYYY');
    var newDateFormat = newDate.format('DD/MM/YYYY');
    count += 1;
    data.push([
      count,
      record.customerRecordFullName,
      record.customerRecordPlatenumber,
      record.customerRecordPhone,
      record.customerRecordEmail,
      newDateFormat,
    ]);
  });
  excelFunction.exportExcel(data, workSheetColumnNames, workSheetName, filepath);
  return data;
}

async function exportCustomerRecord(req) {
  let fileName = 'DSKH_' + new Date().toJSON().slice(0, 10) + '_' + Math.random().toString(36).substring(2, 15) + '.xlsx';
  //Tên File : DSKH_2021-10-12_nv5xj2uqzgf.xlsx
  const filepath = 'uploads/exportExcel/' + fileName;
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;
      let skip = undefined;
      let limit = undefined;
      let order = undefined;
      //only export for current station, do not export data of other station
      if (filter && req.currentUser.stationsId !== undefined) {
        filter.customerStationId = req.currentUser.stationsId;
      }
      let customerRecord = await CustomerRecordResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      let newData = await _exportRecordToExcel(customerRecord, filepath);
      if (newData) {
        let newExcelUrl = 'https://' + process.env.HOST_NAME + '/' + filepath;
        resolve(newExcelUrl);
      } else {
        reject('failse');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function importCustomerRecord(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let fileData = req.payload.file;
      let fileFormat = req.payload.fileFormat;
      let stationsId = req.currentUser.stationsId;
      if (!fileData) {
        reject('do not have book data');
        return;
      }
      var originaldata = Buffer.from(fileData, 'base64');
      let newExcel = await UploadFunctions.uploadExcel(originaldata, fileFormat);
      if (newExcel) {
        let path = 'uploads/importExcel/' + newExcel;
        let excelData = await excelFunction.importExcel(path);

        if (excelData === undefined) {
          reject('failed to import');
        } else {
          //notify to front-end
          //front-end will use this counter to display user waiting message
          if (excelData.length > 1000) {
            //!! IMPORTANT: do not return function here
            //if there are more than 1000 record, we will response before function done
            resolve({
              importSuccess: 'importSuccess',
              importTotalWaiting: excelData.length,
            });
          }

          //if it is less than 1000 records, let user wait until it finishes
          let needToImportRecords = await CustomerFuntion.convertExcelDataToCustomerRecord(excelData, stationsId);
          if (needToImportRecords === undefined) {
            reject('failed to convert excel to customer model');
            return;
          }

          let importSuccessCount = 0;
          for (var i = 0; i < needToImportRecords.length; i++) {
            let addResult = await _addNewCustomerRecord(needToImportRecords[i]);
            if (addResult) {
              importSuccessCount++;
            }
          }

          //if data is bigger than 1000 record, API will response before import,
          //then no need to respon here
          if (excelData.length < 1000) {
            resolve({
              importSuccess: importSuccessCount,
              importTotal: needToImportRecords.length,
            });
          }
        }
      } else {
        reject('failed to upload');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

//BEWARE !! This API is use for robot
async function robotInsert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let payload = req.payload;
      var hostname = req.headers.host;
      let station = await StationResource.find({ stationUrl: hostname }, 0, 1);
      if (station === undefined || station.length < 1) {
        console.log(`can not find station by Url ${hostname} for robotInsert`);
        station = await StationResource.find({ stationWebhookUrl: hostname }, 0, 1);
        if (station === undefined || station.length < 1) {
          console.log(`can not find station by WebhookUrl ${hostname} for robotInsert`);
          reject('failed');
          return;
        }
      }
      station = station[0];

      const fs = require('fs');
      let today = new Date();
      let dirName = `uploads/media/plate/${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
      if (payload.image === undefined && payload.image.path === undefined) {
        console.error('payload do not have image');
        reject('failed');
      }
      fs.readFile(payload.image.path, (err, data) => {
        if (err) {
          console.error('writeFile error');
          console.error(err);
          reject('failed');
        }

        // check if upload directory exists
        if (fs.existsSync(`uploads/media/plate`) === false) {
          fs.mkdirSync(`uploads/media/plate`);
        }

        // check if directory exists
        if (fs.existsSync(dirName) === false) {
          fs.mkdirSync(dirName);
        }

        var path = require('path');
        let newFileName = `station_${station.stationsId}_at_${moment().format('YYYYMMDDhhmmss')}${path.extname(payload.image.filename)}`;

        //write file to storage
        fs.writeFile(`${dirName}/${newFileName}`, data, async writeErr => {
          if (writeErr) {
            console.error('writeFile error');
            console.error(writeErr);
            reject('failed');
          }

          let customerRecordPlateColor = 'white';
          if (payload.color === 'T') {
            customerRecordPlateColor = 'white';
          } else if (payload.color === 'V') {
            customerRecordPlateColor = 'yellow';
          } else if (payload.color === 'X') {
            customerRecordPlateColor = 'blue';
          }

          let newCustomerRecordData = {
            customerRecordPlatenumber: payload.bsx,
            customerRecordPlateImageUrl: `https://${process.env.HOST_NAME}/${dirName}/${newFileName}`,
            customerRecordPlateColor: customerRecordPlateColor,
          };
          if (station) {
            newCustomerRecordData.customerStationId = station.stationsId;
          }
          if (newCustomerRecordData.customerRecordCheckDuration === undefined) {
            newCustomerRecordData.customerRecordCheckDuration = null;
          }
          let addResult = await _addNewCustomerRecord(newCustomerRecordData);
          if (addResult) {
            resolve(addResult);
          } else {
            reject('failed');
          }

          resolve('ok');
        });
      });
      // resolve("ok");
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  deleteById,
  exportCustomerRecord,
  importCustomerRecord,
  robotInsert,
  findToday,
};
