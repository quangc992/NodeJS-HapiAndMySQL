/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const UtilFunction = require('../../ApiUtils/utilFunctions');
const tableName = 'BooksCategory';
const primaryKeyField = 'booksCategoryId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('booksCategoryId').primary();
          table.string('booksCategoryName');
          table.string('booksCategoryCode').unique();
          timestamps(table);
          table.index('booksCategoryId');
          table.index('booksCategoryCode');
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
  let categories = [
    'Action',
    'Drama',
    'Fantasy',
    'Manhua',
    'Truyện Màu',
    'Comedy',
    'Manhwa',
    'Adventure',
    'Supernatural',
    'Mystery',
    'Xuyên Không',
    'Historical',
    'Romance',
    'Shoujo',
    'Đam Mỹ',
    'Manga',
    'School Life',
    'Seinen',
    'Slice Of Life',
    'Chuyển Sinh',
    'Shounen',
    'Gender Bender',
    'Cổ Đại',
    'Martial Arts',
    'Harem',
    'Horror',
    'Comic',
    'Soft Yaoi',
    'Yaoi',
    'Sci-Fi',
    'Webtoon',
    'Mature',
    'Josei',
    'Psychological',
    'Tragedy',
    'Sports',
    'Shoujo Ai',
    'Trinh Thám',
    'Soft Yuri',
    'Yuri',
    'Doujinshi',
    'Mecha',
    'Anime',
    'Tạp Chí Truyện Tranh',
    'One Shot',
    'Thiếu Nhi',
    'Cooking',
    'Live Action',
    'Việt Nam',
    'Shounen Ai',
    'Truyện Scan',
  ];

  let booksCategories = [];
  for (let i = 0; i < categories.length; i++) {
    const categoryName = categories[i];
    const categoryCode = UtilFunction.nonAccentVietnamese(categoryName).replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-');
    booksCategories.push({
      booksCategoryName: categoryName,
      booksCategoryCode: categoryCode,
    });
  }
  return new Promise(async (resolve, reject) => {
    DB(`${tableName}`)
      .insert(booksCategories)
      .then(result => {
        Logger.info(`${tableName}`, `seeding ${tableName}` + result);
        resolve();
      });
  });
}
async function initDB() {
  await createTable();
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.updateById(tableName, dataId, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
};
