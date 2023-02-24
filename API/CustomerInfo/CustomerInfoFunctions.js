/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */

const { registerPersonByUrl, updateByFaceUrlByPersonID } = require('../../ThirdParty/HanetAI/HanetAIClient');
const { isNotEmptyStringValue, isValidValue } = require('../ApiUtils/utilFunctions');
const CustomerInfoResourceAccess = require('./resourceAccess/CustomerInfoResourceAccess');
const HanetFaceMappingResourceAccess = require('../HanetRecord/resourceAccess/HanetFaceMappingResourceAccess');
const StationsResourceAccess = require('../Stations/resourceAccess/StationsResourceAccess');

async function updateFaceIdForCustomerInfoById(customerInfoId) {
  let customerInfo = await CustomerInfoResourceAccess.findById(customerInfoId);

  if (process.env.HANET_CAMERA_ENABLE && customerInfo && isNotEmptyStringValue(customerInfo.customerAvatarUrl)) {
    let _existingFaceId = await HanetFaceMappingResourceAccess.find({
      customerInfoId: customerInfoId,
    });
    if (_existingFaceId && _existingFaceId.length > 0 && _existingFaceId[0].personID) {
      //cap nhat face cu
      _existingFaceId = _existingFaceId[0];
      await updateByFaceUrlByPersonID(customerInfo.customerAvatarUrl, _existingFaceId.personID);
    } else {
      //dang ky face moi
      const CUSTOMER_TYPE = '1';
      let _newPersonId = await registerPersonByUrl(
        customerInfo.customerAvatarUrl,
        customerInfo.customerFullName,
        `CUSTOMER_${customerInfoId}`,
        CUSTOMER_TYPE,
      );
      if (_newPersonId) {
        await HanetFaceMappingResourceAccess.insert({
          personID: _newPersonId,
          customerInfoId: customerInfoId,
        });
      }
    }
  }
}
async function registerNewCustomerInfo(newCustomerInfo) {
  let _registerResult = await CustomerInfoResourceAccess.insert(newCustomerInfo);
  if (_registerResult) {
    let _customerInfoId = _registerResult[0];
    await updateFaceIdForCustomerInfoById(_customerInfoId);
  }
  return _registerResult;
}

async function getDetailCustomerInfoById(customerInfoId) {
  let _detail = await CustomerInfoResourceAccess.findById(customerInfoId);

  if (isValidValue(_detail.departmentId)) {
    let _station = await StationsResourceAccess.findById(_detail.departmentId);
    if (_station) {
      _detail.station = _station;
    }
  }

  return _detail;
}

module.exports = {
  getDetailCustomerInfoById,
  registerNewCustomerInfo,
  updateFaceIdForCustomerInfoById,
};
