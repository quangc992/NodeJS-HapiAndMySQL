/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 12/30/21.
 */

'use strict';
const NewsResourceAccess = require('../resourceAccess/NewsResourceAccess');
const Logger = require('../../../utils/logging');
const UploadFunction = require('../../Upload/UploadFunctions');
const folderUpload = 'news/';

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload;
      let result = await NewsResourceAccess.insert(data);
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let searchText = req.payload.searchText;

      let data = await NewsResourceAccess.customSearch(skip, limit, searchText);
      let dataCount = await NewsResourceAccess.customCount(searchText);
      if (data && dataCount) {
        resolve({ data: data, total: dataCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let data = await NewsResourceAccess.findById(id);
      let otherNews = await NewsResourceAccess.customSearch(0, 20);
      for (let i = 0; i < otherNews.length; i++) {
        let item = otherNews[i];
        if (item.newsId == data.newsId) {
          otherNews.splice(i, 1);
          i = otherNews.length;
        }
      }
      if (data) {
        resolve({ data: data, otherNews: otherNews });
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let data = req.payload.data;
      let result = await NewsResourceAccess.updateById(id, data);
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let result = await NewsResourceAccess.deleteById(id);
      if (result) {
        resolve(result);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

/**
 * Upload image introduce for news
 */
async function uploadImage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const imageData = req.payload.imageData;
      const imageFormat = req.payload.imageFormat;
      if (!imageData) {
        reject('Do not have image data');
        return;
      }
      var originaldata = Buffer.from(imageData, 'base64');
      let image = await UploadFunction.uploadMediaFile(originaldata, imageFormat, folderUpload);
      if (image) {
        resolve(image);
      } else {
        reject('failed to upload');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
async function hideNewsById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let result = await NewsResourceAccess.updateById(id, { isHidden: 1 });
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
async function showNewsById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let result = await NewsResourceAccess.updateById(id, { isHidden: 0 });
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  insert,
  find,
  findById,
  updateById,
  deleteById,
  uploadImage,
  hideNewsById,
  showNewsById,
};
