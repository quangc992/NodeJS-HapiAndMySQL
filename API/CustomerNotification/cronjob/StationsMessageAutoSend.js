/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const CustomerMessageEmailProcess = require('./CustomerMessageEmailJob');
const CustomerMessageSMSProcess = require('./CustomerMessageSMSJob');

async function autoSendMessageForCustomer() {
  // console.log(`autoSendMessageForCustomer`);
  // let stationsList = await StationsResource.find({
  // }, undefined, undefined);
  // if (stationsList && stationsList.length > 0) {
  //   let promiseList = [];
  //   for (let i = 0; i < stationsList.length; i++) {
  //     const station = stationsList[i];
  //     const promiseEmail = new Promise(async (resolve, reject) => {
  //       let result = await CustomerMessageEmailProcess.sendMessageEmailToCustomer(station);
  //       resolve(result);
  //     });
  //     const promiseSMS = new Promise(async (resolve, reject) => {
  //       let result = await CustomerMessageSMSProcess.sendMessageSMSToCustomer(station);
  //       resolve(result);
  //     });
  //     promiseList.push(promiseEmail);
  //     promiseList.push(promiseSMS);
  //   }
  //   Promise.all(promiseList).then((values) => {
  //     console.log(`autoSendMessageForCustomer response ${values}`);
  //   });
  // }
}

module.exports = {
  autoSendMessageForCustomer,
};
