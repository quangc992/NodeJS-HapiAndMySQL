/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const ProductOrderItemResourceAccess = require('../resourceAccess/ProductOrderItemResourceAccess');
const Logger = require('../../../utils/logging');
const { ERROR } = require('../../Common/CommonConstant');
const ProductOrderResourceAccess = require('../../ProductOrder/resourceAccess/ProductOrderResourceAccess');
async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let productOrderItemData = req.payload;
      let result = await ProductOrderItemResourceAccess.insert(productOrderItemData);
      if (result) {
        resolve(result);
      } else {
        console.error(`error product Order Item can not insert: ${ERROR}`);
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

      if (filter === undefined) {
        filter = {};
      }
      let productOrderItems = await ProductOrderItemResourceAccess.find(filter, skip, limit, order);
      let productOrderItemsCount = await ProductOrderItemResourceAccess.count(filter, order);
      if (productOrderItems && productOrderItemsCount) {
        resolve({ data: productOrderItems, total: productOrderItemsCount[0].count });
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
      let productOrderItemId = req.payload.id;
      let productOrderItemData = req.payload.data;

      if (productOrderItemData.minOrderItemQuantity) {
        let _orderItem = await ProductOrderItemResourceAccess.findById(productOrderItemId);
        let _order = await ProductOrderResourceAccess.findById(_orderItem.productOrderId);
        await ProductOrderResourceAccess.updateById(_order.productOrderId, {
          minOrderItemQuantity: productOrderItemData.minOrderItemQuantity,
        });
        delete productOrderItemData.minOrderItemQuantity;
      }

      if (productOrderItemData.maxOrderItemQuantity) {
        let _orderItem = await ProductOrderItemResourceAccess.findById(productOrderItemId);
        let _order = await ProductOrderResourceAccess.findById(_orderItem.productOrderId);
        await ProductOrderResourceAccess.updateById(_order.productOrderId, {
          maxOrderItemQuantity: productOrderItemData.maxOrderItemQuantity,
        });
        delete productOrderItemData.maxOrderItemQuantity;
      }

      if (Object.keys(productOrderItemData).length > 0) {
        let result = await ProductOrderItemResourceAccess.updateById(productOrderItemId, productOrderItemData);
        if (result !== undefined) {
          resolve(result);
        } else {
          console.error(`error product Order Item updateById with productOrderItemId ${productOrderItemId}: ${ERROR}`);
          reject('failed');
        }
      } else {
        resolve('success');
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
      let productOrderItemId = req.payload.id;
      let result = await ProductOrderItemResourceAccess.find({ productOrderItemId: productOrderItemId });
      if (result && result.length > 0) {
        resolve(result[0]);
      } else {
        console.error(`error product Order Item findById with productOrderItemId ${productOrderItemId}: ${ERROR}`);
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
      let result = await ProductOrderItemResourceAccess.deleteById(id);
      if (result) {
        resolve(result);
      }
      console.error(`error product Order Item deleteById with id ${id}: ${ERROR}`);
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

      if (filter === undefined) {
        filter = {};
      }
      let productOrderItems = await ProductOrderItemResourceAccess.find(filter, skip, limit, order);

      if (productOrderItems && productOrderItems.length > 0) {
        let productOrderItemsCount = await ProductOrderItemResourceAccess.count(filter, order);

        resolve({ data: productOrderItems, total: productOrderItemsCount[0].count });
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
