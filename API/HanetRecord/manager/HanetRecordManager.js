/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const moment = require('moment');
const { isValidValue, isNotEmptyStringValue } = require('../../ApiUtils/utilFunctions');

const { getDetailCustomerInfoById } = require('../../CustomerInfo/CustomerInfoFunctions');
const { addNewCustomerVisitRecord, addNewStrangerVisitRecord } = require('../../CustomerVisitRecord/CustomerVisitRecordFunctions');

const HanetCheckinRecordModel = require('../../HanetRecord/model/HanetCheckinRecordModel');
const StationsFunctions = require('../../Stations/StationsFunctions');
const { findCustomerInfoByFaceId } = require('../HanetRecordFunctions');
const HanetRecordRescourceAccess = require('../resourceAccess/HanetRecordResourceAccess');

async function customerCheckinHook(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload;
      const stationApiKeyFromQueryURL = req.query.stationApiKey;
      const stationApiKeyFromHeader = req.headers.stationapikey;
      const stationApiKey = stationApiKeyFromHeader || stationApiKeyFromQueryURL;

      let station;

      if (stationApiKey) {
        station = await StationsFunctions.findStationByApiKey(stationApiKey);
      } else {
        station = await StationsFunctions.findStationByWebhookUrl(host);
      }

      if (!station) {
        console.error(`unauthorized customerCheckinHook ${req.query.stationApiKey}`);
        return reject('UNAUTHORIZED_CALL');
      }

      const _HanetCheckinRecord = HanetCheckinRecordModel.fromData(data);
      let addResult = await HanetRecordRescourceAccess.insert(_HanetCheckinRecord);
      if (addResult === undefined) {
        return reject('fail');
      } else {
        //If Hanet do regconize this person
        if (isNotEmptyStringValue(data.personID)) {
          let _person = await findCustomerInfoByFaceId(data.personID);
          if (_person) {
            if (isValidValue(_person.staffId)) {
              //TODO for staff later
            } else if (isValidValue(_person.appUserId)) {
              //TODO for app user later
            } else if (isValidValue(_person.customerInfoId)) {
              //Customer visit
              let _newCustomerInfo = await getDetailCustomerInfoById(_person.customerInfoId);
              await addNewCustomerVisitRecord(_newCustomerInfo, moment(data.date, 'YYYY-MM-DD HH:mm:SS').toDate(), data.detected_image_url, station);
            } else {
              //stranger visit but registered with Hanet
              // await addNewStrangerVisitRecord(data.personName, moment(data.date, 'YYYY-MM-DD HH:mm:SS').toDate(), data.detected_image_url, station)
            }
          } else {
            //stranger visit but registered with Hanet
            // await addNewStrangerVisitRecord(data.personName, moment(data.date, 'YYYY-MM-DD HH:mm:SS').toDate(), data.detected_image_url, station)
          }
        } else {
          //If Hanet do not regconize this person
          // await addNewStrangerVisitRecord(data.personName, moment(data.date, 'YYYY-MM-DD HH:mm:SS').toDate(), data.detected_image_url, station)
        }
        return resolve(addResult);
      }
    } catch (e) {
      console.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  customerCheckinHook,
};
