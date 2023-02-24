/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const StationIntroFunction = require('../StationIntroductionFunctions');
const Logger = require('../../../utils/logging');

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    let stationId = req.payload.id;
    let stationIntroductionData = req.payload.data;
    let result = await StationIntroFunction.updateStationIntro(stationId, stationIntroductionData);
    if (result) {
      resolve(result);
    } else {
      reject('failed');
    }
  });
}

async function getStationIntroductionDetail(req) {
  return new Promise(async (resolve, reject) => {
    let stationUrl = req.payload.stationUrl;
    let result = await StationIntroFunction.getStationIntroByUrl(stationUrl);
    if (result) {
      resolve(result);
    } else {
      reject('failed');
    }
  });
}

module.exports = {
  getStationIntroductionDetail,
  updateById,
};
