/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';

const Joi = require('joi');

//this is output for client
const schema = Joi.object({
  customerMessageCategories: Joi.string().required(),
  updatedAt: Joi.string().required(),
  customerMessageId: Joi.number(),
  customerMessageContent: Joi.string(),
  customerRecordPhone: Joi.string(),
  customerStationId: Joi.number(),
  customerMessageStatus: Joi.number(),
});

function fromData(data) {
  let modelData = {
    customerMessageCategories: data.customerCategories,
    updatedAt: new Date(data.customerMessageUpdatedAt).toISOString(),
    customerMessageContent: data.customerMessageContent,
    customerMessageId: data.customerMessageId,
    customerMessageStatus: data.customerMessageStatus,
    customerStationId: data.customerStationId,
  };
  return schema.validate(modelData);
}

module.exports = {
  fromData,
};
