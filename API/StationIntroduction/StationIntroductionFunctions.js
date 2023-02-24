/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const StationIntroductionResourceAccess = require('./resourceAccess/StationIntroductionResourceAccess');
const StationsResourceAccess = require('../Stations/resourceAccess/StationsResourceAccess');

const FUNC_FAILED = undefined;
async function updateStationIntro(stationId, data) {
  let station = await StationsResourceAccess.findById(stationId);
  if (station === undefined) {
    return FUNC_FAILED;
  }

  let existingStationIntroData = await StationIntroductionResourceAccess.findById(stationId);

  if (existingStationIntroData) {
    //if intro already existed
    let updateResult = await StationIntroductionResourceAccess.updateById(stationId, data);
    if (updateResult === undefined) {
      return FUNC_FAILED;
    }
  } else {
    //insert new intro if it is not existed
    let newIntroData = data;
    newIntroData.stationsId = stationId;

    let insertResult = await StationIntroductionResourceAccess.insert(data);
    if (insertResult === undefined) {
      return FUNC_FAILED;
    }
  }
  return 'ok';
}

async function getStationIntroByUrl(stationUrl) {
  //lookup station by using url
  let station = await StationsResourceAccess.find(
    {
      stationUrl: stationUrl,
    },
    0,
    1,
  );
  if (station === undefined || station.length < 1) {
    return FUNC_FAILED;
  }

  station = station[0];

  //find intro by station id
  let stationId = station.stationsId;
  let existingStationIntroData = await StationIntroductionResourceAccess.findById(stationId);

  if (existingStationIntroData) {
    return existingStationIntroData;
  } else {
    return FUNC_FAILED;
  }
}

module.exports = {
  updateStationIntro,
  getStationIntroByUrl,
};
