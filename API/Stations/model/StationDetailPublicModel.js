/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
//This model is use to display info of Stations in public.
//BEWARE !! DO NOT SEND INFO THAT RELATED TO SYSTEM INSIDE MODEL
const Joi = require('joi');

const schema = Joi.object({
  stationsName: Joi.string().required(),
  stationsDescription: Joi.string(),
  stationUrl: Joi.string().allow(''),
  stationsLogo: Joi.string().allow(''),
  stationsHotline: Joi.string().allow(''),
  stationsAddress: Joi.string().allow(''),
  stationsEmail: Joi.string().allow(''),
  stationsColorset: Joi.string().allow(''),
  stationBookingConfig: Joi.array().items({
    index: Joi.number(),
    time: Joi.string(),
    limit: Joi.number(),
  }),
});

function fromData(data) {
  let modelData = {
    stationsName: data.stationsName,
    stationsDescription: data.stationsDescription,
    stationUrl: data.stationUrl,
    stationsLogo: data.stationsLogo,
    stationsColorset: data.stationsColorset,
    stationsHotline: data.stationsEmail === null ? '' : data.stationsHotline,
    stationsAddress: data.stationsAddress === null ? '' : data.stationsAddress,
    stationsEmail: data.stationsEmail === null ? '' : data.stationsEmail,
    stationBookingConfig: data.stationBookingConfig === '' ? {} : JSON.parse(data.stationBookingConfig),
    stationsEnableAd: data.stationsEnableAd,
  };

  let outputModel = schema.validate(modelData);
  if (outputModel.error === undefined || outputModel.error === null || outputModel.error === '') {
    return outputModel.value;
  } else {
    console.error(outputModel.error);
    return undefined;
  }
}

module.exports = {
  fromData,
};
