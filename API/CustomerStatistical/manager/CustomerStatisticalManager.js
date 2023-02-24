/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const Logger = require('../../../utils/logging');
const CustomerStatisticalFunction = require('../CustomerStatisticalFunctions');
const formatDate = require('../../ApiUtils/utilFunctions');

const { MESSAGE_CATEGORY, MESSAGE_STATUS } = require('../../CustomerMessage/CustomerMessageConstant');

async function customerReportByStation(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;

      //REPORT TOTAL MESSAGE
      let totalMessageFilter = {
        customerStationId: req.currentUser.stationsId,
      };
      let totalMessageCount = await CustomerStatisticalFunction.countMessagebyDate(totalMessageFilter, startDate, endDate);

      //REPORT TOTAL EMAIL MESSAGE BY STATUS
      let filterEmailMessage = {
        customerStationId: req.currentUser.stationsId,
        customerMessageCategories: MESSAGE_CATEGORY.EMAIL,
      };
      let totalEmailMessageByStatus = await CustomerStatisticalFunction.countMessagebyDateDistinctStatus(filterEmailMessage, startDate, endDate);

      // REPORT TOTAL EMAIL MESSAGE
      filterEmailMessage = {
        customerStationId: req.currentUser.stationsId,
        customerMessageCategories: MESSAGE_CATEGORY.EMAIL,
      };
      let totalEmailMessage = await CustomerStatisticalFunction.countMessagebyDate(filterEmailMessage, startDate, endDate);

      //REPORT TOTAL SMS MESSAGE BY STATUS
      let filterSMSMessage = {
        customerStationId: req.currentUser.stationsId,
        customerMessageCategories: MESSAGE_CATEGORY.SMS,
      };
      let totalSMSMessageByStatus = await CustomerStatisticalFunction.countMessagebyDateDistinctStatus(filterSMSMessage, startDate, endDate);

      // REPORT TOTAL SMS MESSAGE
      filterSMSMessage = {
        customerStationId: req.currentUser.stationsId,
        customerMessageCategories: MESSAGE_CATEGORY.SMS,
      };
      let totalSMSMessage = await CustomerStatisticalFunction.countMessagebyDate(filterSMSMessage, startDate, endDate);

      //REPORT TOTAL ZNS MESSAGE BY STATUS
      let filterZNSMessage = {
        customerStationId: req.currentUser.stationsId,
        customerMessageCategories: MESSAGE_CATEGORY.ZNS,
      };
      let totalZNSMessageByStatus = await CustomerStatisticalFunction.countMessagebyDateDistinctStatus(filterZNSMessage, startDate, endDate);

      // REPORT TOTAL ZNS MESSAGE
      filterZNSMessage = {
        customerStationId: req.currentUser.stationsId,
        customerMessageCategories: MESSAGE_CATEGORY.ZNS,
      };
      let totalZNSMessage = await CustomerStatisticalFunction.countMessagebyDate(filterZNSMessage, startDate, endDate);

      //TOTAL RECORD
      let startDateRecord = req.payload.startDate;
      let endDateRecord = req.payload.endDate;
      let filterRecord = {
        customerStationId: req.currentUser.stationsId,
      };
      if (startDateRecord) {
        startDateRecord = formatDate.FormatDate(startDateRecord);
      }
      if (endDateRecord) {
        endDateRecord = formatDate.FormatDate(endDateRecord);
      }
      let resultRecord = await CustomerStatisticalFunction.countRecordbyDate(filterRecord, startDateRecord, endDateRecord);

      //TOTAL RETURN RECORD
      let filterRecordReturn = {
        customerStationId: req.currentUser.stationsId,
        returnNumberCount: 1,
      };
      let resultRecordReturn = await CustomerStatisticalFunction.countRecordbyDate(filterRecordReturn, startDateRecord, endDateRecord);

      //MONEY SPENT
      let emailSpentAmount = totalEmailMessage * 100;
      let smsSpentAmount = totalEmailMessage * 1000;
      let znsSpentAmount = totalZNSMessage * 1000;
      let totalSpentAmount = emailSpentAmount + smsSpentAmount;

      if (totalMessageCount === undefined || resultRecord === undefined || resultRecordReturn === undefined) {
        reject('failed');
      } else {
        resolve({
          countCustomerRecord: resultRecord,
          countCustomerMassage: totalMessageCount,
          totalMessageCount: totalMessageCount,
          totalEmailMessage: totalEmailMessage,
          totalEmailMessageByStatus: totalEmailMessageByStatus,
          totalSMSMessageByStatus: totalSMSMessageByStatus,
          totalSMSMessage: totalSMSMessage,
          totalZNSMessageByStatus: totalZNSMessageByStatus,
          totalZNSMessage: totalZNSMessage,
          countCustomerRecordReturn: resultRecordReturn,
          TotalMoney: totalSpentAmount,
          totalSpentAmount: totalSpentAmount,
          smsSpentAmount: smsSpentAmount,
          emailSpentAmount: emailSpentAmount,
          znsSpentAmount: znsSpentAmount,
        });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function reportAllStation(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;

      //REPORT TOTAL MESSAGE
      let totalMessageFilter = {};
      let totalMessageCount = await CustomerStatisticalFunction.countMessagebyDate(totalMessageFilter, startDate, endDate);

      //REPORT TOTAL EMAIL MESSAGE BY STATUS
      let filterEmailMessage = {
        customerMessageCategories: MESSAGE_CATEGORY.EMAIL,
      };
      let totalEmailMessageByStatus = await CustomerStatisticalFunction.countMessagebyDateDistinctStatus(filterEmailMessage, startDate, endDate);

      // REPORT TOTAL EMAIL MESSAGE
      filterEmailMessage = {
        customerMessageCategories: MESSAGE_CATEGORY.EMAIL,
      };
      let totalEmailMessage = await CustomerStatisticalFunction.countMessagebyDate(filterEmailMessage, startDate, endDate);

      //REPORT TOTAL SMS MESSAGE BY STATUS
      let filterSMSMessage = {
        customerMessageCategories: MESSAGE_CATEGORY.SMS,
      };
      let totalSMSMessageByStatus = await CustomerStatisticalFunction.countMessagebyDateDistinctStatus(filterSMSMessage, startDate, endDate);

      // REPORT TOTAL SMS MESSAGE
      filterSMSMessage = {
        customerMessageCategories: MESSAGE_CATEGORY.SMS,
      };
      let totalSMSMessage = await CustomerStatisticalFunction.countMessagebyDate(filterSMSMessage, startDate, endDate);

      //REPORT TOTAL ZNS MESSAGE BY STATUS
      let filterZNSMessage = {
        customerMessageCategories: MESSAGE_CATEGORY.ZNS,
      };
      let totalZNSMessageByStatus = await CustomerStatisticalFunction.countMessagebyDateDistinctStatus(filterZNSMessage, startDate, endDate);

      // REPORT TOTAL ZNS MESSAGE
      filterZNSMessage = {
        customerMessageCategories: MESSAGE_CATEGORY.ZNS,
      };
      let totalZNSMessage = await CustomerStatisticalFunction.countMessagebyDate(filterZNSMessage, startDate, endDate);

      //TOTAL RECORD
      let startDateRecord = req.payload.startDate;
      let endDateRecord = req.payload.endDate;
      if (startDateRecord) {
        startDateRecord = formatDate.FormatDate(startDateRecord);
      }
      if (endDateRecord) {
        endDateRecord = formatDate.FormatDate(endDateRecord);
      }

      let filterRecord = {};
      let resultRecord = await CustomerStatisticalFunction.countRecordbyDate(filterRecord, startDateRecord, endDateRecord);

      //TOTAL RETURN RECORD
      let filterRecordReturn = {
        returnNumberCount: 1,
      };
      let resultRecordReturn = await CustomerStatisticalFunction.countRecordbyDate(filterRecordReturn, startDateRecord, endDateRecord);

      //MONEY SPENT
      let emailSpentAmount = totalEmailMessage * 100;
      let smsSpentAmount = totalEmailMessage * 1000;
      let znsSpentAmount = totalZNSMessage * 1000;
      let totalSpentAmount = emailSpentAmount + smsSpentAmount;

      if (totalMessageCount === undefined || resultRecord === undefined || resultRecordReturn === undefined) {
        reject('failed');
      } else {
        resolve({
          countCustomerRecord: resultRecord,
          countCustomerMassage: totalMessageCount,
          totalMessageCount: totalMessageCount,
          totalEmailMessage: totalEmailMessage,
          totalEmailMessageByStatus: totalEmailMessageByStatus,
          totalSMSMessageByStatus: totalSMSMessageByStatus,
          totalSMSMessage: totalSMSMessage,
          totalZNSMessageByStatus: totalZNSMessageByStatus,
          totalZNSMessage: totalZNSMessage,
          countCustomerRecordReturn: resultRecordReturn,
          TotalMoney: totalSpentAmount,
          totalSpentAmount: totalSpentAmount,
          smsSpentAmount: smsSpentAmount,
          emailSpentAmount: emailSpentAmount,
          znsSpentAmount: znsSpentAmount,
        });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  customerReportByStation,
  reportAllStation,
};
