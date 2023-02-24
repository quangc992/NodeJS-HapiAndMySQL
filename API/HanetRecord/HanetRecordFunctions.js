/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const HanetFaceMappingResourceAccess = require('./resourceAccess/HanetFaceMappingResourceAccess');

async function findCustomerInfoByFaceId(faceId) {
  let _customerInfoMapping = await HanetFaceMappingResourceAccess.find({
    personID: faceId,
  });
  if (_customerInfoMapping && _customerInfoMapping.length > 0) {
    return _customerInfoMapping[0];
  } else {
    return undefined;
  }
}
module.exports = {
  findCustomerInfoByFaceId,
};
