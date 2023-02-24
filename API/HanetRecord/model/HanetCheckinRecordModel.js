/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

function fromData(data) {
  return {
    action_type: data.action_type,
    aliasID: data.aliasID,
    data_type: data.data_type,
    date: data.date,
    detected_image_url: data.detected_image_url,
    deviceID: data.deviceID,
    deviceName: data.deviceName,
    hash: data.hash,
    id: data.id,
    keycode: data.keycode,
    personID: data.personID,
    personName: data.personName,
    personTitle: data.personTitle,
    personType: data.personType,
    placeID: data.placeID,
    placeName: data.placeName,
    mask: data.mask,
    time: data.time,
  };
}

module.exports = {
  fromData,
};
