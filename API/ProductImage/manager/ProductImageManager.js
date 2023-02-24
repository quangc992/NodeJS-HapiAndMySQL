/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const ProductResourceAccess = require('../resourceAccess/ProductImageResourceAccess');
const Logger = require('../../../utils/logging');
const { PLACE_ORDER_ERROR } = require('../ProductImageConstant');
const { ERROR } = require('../../Common/CommonConstant');
async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let productData = req.payload;
      let staffId = req.currentUser.staffId;
      let result = await ProductResourceAccess.insert({
        ...productData,
        staffId,
      });
      if (result) {
        resolve(result);
      } else {
        console.error(`error product image can not insert: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let searchText = req.payload.searchText;

      if (filter === undefined) {
        filter = {};
      }
      let products = await ProductResourceAccess.customSearch(filter, skip, limit, undefined, undefined, searchText, order);
      if (products) {
        let productsCount = await ProductResourceAccess.customCount(filter, undefined, undefined, undefined, undefined, undefined, order);
        resolve({ data: products, total: productsCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let productId = req.payload.id;
      let productData = req.payload.data;
      let result = await ProductResourceAccess.updateById(productId, productData);
      if (result) {
        resolve(result);
      } else {
        console.error(`error product image updateById with productId ${productId}: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let productId = req.payload.id;
      let result = await ProductResourceAccess.find({ productId: productId });

      if (result && result.length > 0) {
        const product = result[0];
        resolve(product);
      } else {
        console.error(`error product image findById with productId ${productId}: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}
async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let result = await ProductResourceAccess.deleteById(id);
      if (result) {
        resolve(result);
      }
      console.error(`error product image deleteById with id ${id}: ${ERROR}`);
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function getList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let searchText = req.payload.searchText;
      if (filter === undefined) {
        filter = {};
      }
      let products = await ProductResourceAccess.customSearch(filter, skip, limit, undefined, undefined, searchText, order);

      if (products && products.length > 0) {
        let productsCount = await ProductResourceAccess.customCount(filter, undefined, undefined, undefined, undefined, undefined, order);

        resolve({ data: products, total: productsCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  deleteById,
  getList,
};
