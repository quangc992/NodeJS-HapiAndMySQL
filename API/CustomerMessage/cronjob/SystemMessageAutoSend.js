/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
// const StationsResource = require('../../Stations/resourceAccess/StationsResourceAccess');
// const CustomerMessageEmailProcess = require('./CustomerMessageEmailJob');
// const CustomerMessageSMSProcess = require('./CustomerMessageSMSJob');
const GenerateMessageProcess = require('./GenerateCustomerMessage');

async function systemAutoGenerateMessage() {
  console.log(`systemAutoGenerateMessage`);
  let promiseList = [];

  //tao ra message cho tung customer tu group message
  const promiseGenerateMessage = new Promise(async (resolve, reject) => {
    let result = await GenerateMessageProcess.generateCustomerMessageFromGroupMessage();
    resolve(result);
  });
  promiseList.push(promiseGenerateMessage);

  // //gui message email cho tung customer
  // const promiseEmail = new Promise(async (resolve, reject) => {
  //   let result = await CustomerMessageEmailProcess.sendMessageEmailToCustomer(station);
  //   resolve(result);
  // });
  // promiseList.push(promiseEmail);

  // //gui message sms cho tung customer
  // const promiseSMS = new Promise(async (resolve, reject) => {
  //   let result = await CustomerMessageSMSProcess.sendMessageSMSToCustomer(station);
  //   resolve(result);
  // });
  // promiseList.push(promiseSMS);

  Promise.all(promiseList).then(values => {
    console.log(`systemAutoGenerateMessage response ${values}`);
  });
}

module.exports = {
  systemAutoGenerateMessage,
};
