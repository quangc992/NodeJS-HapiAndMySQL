/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { STATUS } = require('../SystemConfigurationConstant');
const tableName = 'SystemConfigurations';
const primaryKeyField = 'systemConfigurationsId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.double('exchangeRateCoin'); // tỉ lệ quy đổi xu (VND > XU)
          table.string('telegramGroupUrl').defaultTo('https://telegram.com'); // link group telegram
          table.string('fbMessengerUrl').defaultTo('https://messenger.com'); // link messenger FB
          table.string('zaloUrl').defaultTo('https://zalo.com'); //link zalo OA
          table.string('playStoreUrl').defaultTo('https://play.google.com/'); //link play store
          table.string('appStoreUrl').defaultTo('https://apps.apple.com/'); //link app store
          table.string('instagramUrl').defaultTo('https://instagram.com'); //link instagram
          table.string('facebookUrl').defaultTo('https://facebook.com'); // link fan page facebook
          table.string('twitterUrl').defaultTo('https://twitter.com'); // link fan page twitter
          table.string('youtubeUrl').defaultTo('https://youtube.com'); // link channel youtube
          table.string('websiteUrl').defaultTo('https://google.com'); // website chinh
          table.string('hotlineNumber').defaultTo('123456789'); //hotline
          table.string('supportEmail').defaultTo('supportEmail@gmail.com'); //hotline
          table.string('address').defaultTo('123 Ho Chi Minh, VietNam'); //dia chi cong ty
          table.string('systemVersion').defaultTo('1.0.0'); //version he thong
          table.float('exchangeVNDPrice', 48, 24).defaultTo(0.001); //gia quy doi USD - VND
          table.string('bannerImage1').defaultTo(`https://${process.env.HOST_NAME}/uploads/sample_banner.png`);
          table.string('bannerImage2').defaultTo(`https://${process.env.HOST_NAME}/uploads/sample_banner.png`);
          table.string('bannerImage3').defaultTo(`https://${process.env.HOST_NAME}/uploads/sample_banner.png`);
          table.string('bannerImage4').defaultTo(`https://${process.env.HOST_NAME}/uploads/sample_banner.png`);
          table.string('bannerImage5').defaultTo(`https://${process.env.HOST_NAME}/uploads/sample_banner.png`);
          timestamps(table);
          table.index(`${primaryKeyField}`);
        })
        .then(async () => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          seeding().then(() => {
            resolve();
          });
        });
    });
  });
}

async function seeding() {
  let projectStatus = [
    {
      systemVersion: '1.0.0',
      exchangeRateCoin: 1000,
      bannerImage1: `https://${process.env.HOST_NAME}/uploads/sample_banner.png`,
      bannerImage2: `https://${process.env.HOST_NAME}/uploads/sample_banner.png`,
      bannerImage3: `https://${process.env.HOST_NAME}/uploads/sample_banner.png`,
    },
  ];
  return new Promise(async (resolve, reject) => {
    DB(`${tableName}`)
      .insert(projectStatus)
      .then(result => {
        Logger.info(`${tableName}`, `seeding ${tableName}` + result);
        resolve();
      });
  });
}

async function initDB() {
  await createTable();
}

async function updateById(id, data) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.updateById(tableName, dataId, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

module.exports = {
  find,
  updateById,
  initDB,
};
