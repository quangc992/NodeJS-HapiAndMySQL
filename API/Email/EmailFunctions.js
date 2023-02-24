/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

require('dotenv').config();

const EmailClient = require('../../ThirdParty/Email/EmailClient');
const Handlebars = require('handlebars');

const templateConfirmSchedule = require('./emailTemplates/confirmSchedule');

function convertBodyFromTemplate(template, subjectParams, bodyParams) {
  const subject = Handlebars.compile(template.subject)(subjectParams);
  const bodyHtml = Handlebars.compile(template.htmlBody)(bodyParams);
  const body = Handlebars.compile(template.body)(bodyParams);
  return { subject, body, bodyHtml };
}

async function confirmScheduleViaEmail(receiver, customerScheduleData, stationsData) {
  if (customerScheduleData && stationsData) {
    let subjectParams = {};
    let bodyParams = {
      ...customerScheduleData,
      ...stationsData,
    };

    let { subject, bodyHtml } = convertBodyFromTemplate(templateConfirmSchedule, subjectParams, bodyParams);

    let sendResult = await EmailClient.sendEmail(receiver, subject, undefined, bodyHtml);
    return sendResult;
  } else {
    return undefined;
  }
}

module.exports = {
  confirmScheduleViaEmail,
};
