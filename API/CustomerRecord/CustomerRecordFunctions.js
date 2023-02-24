/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moment = require('moment');

// const TextToSpeechFunctions = require('../../ThirdParty/TextToSpeech/TextToSpeechFunctions');
const StationsResource = require('../Stations/resourceAccess/StationsResourceAccess');
const CustomerRecordResourceAccess = require('./resourceAccess/CustomerRecordResourceAccess');
const CustomerRecordModel = require('./model/CustomerRecordModel');
const StationsResourceAccess = require('../Stations/resourceAccess/StationsResourceAccess');
const Logger = require('../../utils/logging');
const { CHECKING_STATUS } = require('./CustomerRecordConstants');

async function convertExcelDataToCustomerRecord(excelData, stationsId) {
  let dataStation = await StationsResourceAccess.findById(stationsId);
  if (dataStation === undefined) {
    Logger.error(`can not convertExcelDataToCustomerRecord for station ${stationsId} invalid`);
    return undefined;
  }

  //every imported record were done in the past,
  //when import old records, we will update process to last step
  let lastStepIndex = 0;
  try {
    let dataStationNew = JSON.parse(dataStation.stationCheckingConfig);
    lastStepIndex = dataStationNew[dataStationNew.length - 1].stepIndex;
  } catch (error) {
    Logger.error(`can not convertExcelDataToCustomerRecord - Station ${stationsId} can not parse stationCheckingConfig`);
  }

  //get index of last step
  let customerRecordState = lastStepIndex;

  //convert to Array CustomerRecord
  let arrData = [];
  for (let dataCounter = 0; dataCounter < excelData.length; dataCounter++) {
    const record = excelData[dataCounter];

    //find existing record
    let existedRecord = await CustomerRecordResourceAccess.customSearchByExpiredDate(
      {
        customerRecordPlatenumber: record.customerRecordPlatenumber,
        customerStationId: stationsId,
      },
      0,
      1,
      record.customerRecordCheckExpiredDate,
      record.customerRecordCheckExpiredDate,
    );

    //skip record if duplicated
    if (existedRecord && existedRecord.length > 0) {
      continue;
    }

    let _customerRecordData = {
      customerRecordFullName: record.customerRecordFullName,
      customerRecordPhone: record.customerRecordPhone,
      customerRecordPlatenumber: record.customerRecordPlatenumber,
      customerRecordEmail: record.customerRecordEmail,
      customerStationId: stationsId,
      customerRecordCheckDuration: null, //prevent DB crash
      customerRecordCheckDate: null, //prevent DB crash
      customerRecordCheckExpiredDate: moment(record.customerRecordCheckExpiredDate, 'DD/MM/YYYY').add(1, 'h').toDate(),
      customerRecordState: customerRecordState,
      customerRecordCheckStatus: CHECKING_STATUS.COMPLETED, //Auto complete all old record when import
    };

    arrData.push(_customerRecordData);
  }

  return arrData;
}

async function _retriveVoicesUrlByState(stationsId, state) {
  let stationConfigs = await StationsResource.find({ stationsId: stationsId });
  if (stationConfigs && stationConfigs.length > 0) {
    stationConfigs = stationConfigs[0];
    if (stationConfigs.stationCheckingConfig) {
      try {
        let configsStates = JSON.parse(stationConfigs.stationCheckingConfig);
        if (configsStates.length > 0) {
          for (let i = 0; i < configsStates.length; i++) {
            const stateObj = configsStates[i];
            if (stateObj.stepIndex === state) {
              return stateObj.stepVoiceUrl;
            }
          }
        } else {
          //Can not find config
          console.error(`can not find stationCheckingConfig for stationsId ${stationsId}`);
        }
      } catch (error) {
        //Config has error
        console.error(error);
        console.error(`stationCheckingConfig error for stationsId ${stationsId}`);
      }
    }
  } else {
    //Can not find config
    console.error(`Can not find config for stationsId ${stationsId}`);
  }

  return undefined;
}

async function notifyCustomerStatusChanged(updatedCustomerRecord) {
  let plateSpeeches = await TextToSpeechFunctions.getPlateSpeechUrls(updatedCustomerRecord.customerRecordPlatenumber);
  let processSpeech = await _retriveVoicesUrlByState(updatedCustomerRecord.customerStationId, updatedCustomerRecord.customerRecordState);
  //if state do not have voice Url, then we do not need to speech plate number
  if (processSpeech === undefined || processSpeech.trim() === '') {
    plateSpeeches = [];
  }

  MQTTFunctions.publishJson(`RECORD_UPDATE_${updatedCustomerRecord.customerStationId}`, {
    when: new Date(),
    ...CustomerRecordModel.fromData(updatedCustomerRecord),
    plateSpeeches: plateSpeeches,
    processSpeech: processSpeech ? processSpeech : '',
  });
}

async function notifyCustomerStatusAdded(newCustomerRecord) {
  let plateSpeeches = await TextToSpeechFunctions.getPlateSpeechUrls(newCustomerRecord.customerRecordPlatenumber);
  let processSpeech = await _retriveVoicesUrlByState(newCustomerRecord.customerStationId, newCustomerRecord.customerRecordState);
  //if state do not have voice Url, then we do not need to speech plate number
  if (processSpeech === undefined || processSpeech.trim() === '') {
    plateSpeeches = [];
  }
  MQTTFunctions.publishJson(`RECORD_ADD_${newCustomerRecord.customerStationId}`, {
    when: new Date(),
    ...CustomerRecordModel.fromData(newCustomerRecord),
    plateSpeeches: plateSpeeches,
    processSpeech: processSpeech ? processSpeech : '',
  });
}

async function notifyCustomerStatusDeleted(newCustomerRecord) {
  let plateSpeeches = await TextToSpeechFunctions.getPlateSpeechUrls(newCustomerRecord.customerRecordPlatenumber);
  let processSpeech = await _retriveVoicesUrlByState(newCustomerRecord.customerStationId, newCustomerRecord.customerRecordState);
  //if state do not have voice Url, then we do not need to speech plate number
  if (processSpeech === undefined || processSpeech.trim() === '') {
    plateSpeeches = [];
  }
  MQTTFunctions.publishJson(`RECORD_DELETE_${newCustomerRecord.customerStationId}`, {
    when: new Date(),
    ...CustomerRecordModel.fromData(newCustomerRecord),
    plateSpeeches: plateSpeeches,
    processSpeech: processSpeech ? processSpeech : '',
  });
}

async function updateCustomerRecordById(customerRecordId, customerRecordData) {
  let oldRecord = await CustomerRecordResourceAccess.findById(customerRecordId);
  if (oldRecord === undefined) {
    console.error(`can not updateCustomerRecordById ${customerRecordId} because record is undefined`);
    return undefined;
  }

  //if update process state, then record time of changing state
  if (customerRecordData.customerRecordState !== undefined) {
    //update process check date to NOW
    customerRecordData.customerRecordProcessCheckDate = new Date();

    let recordStation = await StationsResource.findById(oldRecord.customerStationId);
    if (recordStation === undefined) {
      console.error(`can not updateCustomerRecordById ${customerRecordId} because station ${oldRecord.customerStationId} is undefined`);
      return undefined;
    }

    //check config and update to new step duration
    let checkConfig = JSON.parse(recordStation.stationCheckingConfig);
    try {
      checkConfig = JSON.parse(recordStation.stationCheckingConfig);
    } catch (error) {
      console.error(error);
    }

    //invalid config then we show error
    if (checkConfig === undefined) {
      console.error(
        `can not updateCustomerRecordById ${customerRecordId} because checkConfig of station ${oldRecord.customerStationId} is undefined`,
      );
      return undefined;
    }

    let validConfig = false;
    for (let i = 0; i < checkConfig.length; i++) {
      const stepConfig = checkConfig[i];
      if (stepConfig.stepIndex === customerRecordData.customerRecordState) {
        validConfig = true;
        customerRecordData.customerRecordCheckStepDuration = stepConfig.stepDuration;
      }
    }

    //invalid config then we show error
    if (validConfig === false) {
      console.error(`can not updateCustomerRecordById ${customerRecordId} because config ${customerRecordData.customerRecordState} is undefined`);
      return undefined;
    }
  }

  let result = await CustomerRecordResourceAccess.updateById(customerRecordId, customerRecordData);

  if (result) {
    if (customerRecordData.customerRecordState !== undefined) {
      let updatedRecord = await CustomerRecordResourceAccess.findById(customerRecordId);
      await notifyCustomerStatusChanged(updatedRecord);
    }
    return result;
  }
  return undefined;
}
module.exports = {
  convertExcelDataToCustomerRecord,
  notifyCustomerStatusChanged,
  notifyCustomerStatusAdded,
  notifyCustomerStatusDeleted,
  updateCustomerRecordById,
};
