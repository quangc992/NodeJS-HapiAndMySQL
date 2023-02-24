/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const ProductResourceAccess = require('../resourceAccess/ProductResourceAccess');
const Logger = require('../../../utils/logging');
const ProductImageResourceAccess = require('../../ProductImage/resourceAccess/ProductImageResourceAccess');
// const NFTFunctions = require('../../../ThirdParty/Blockchain/NFT/NFTFunctions');

const { ERROR } = require('../../Common/CommonConstant');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let productData = req.payload;
      let staffId = req.currentUser.staffId;
      let productImages = productData.productImages ? productData.productImages : undefined;
      delete productData.productImages;
      // let nftId = await NFTFunctions.mint(productData.productTxHash);
      productData.productCode = productData.productCode.toUpperCase();
      let result = await ProductResourceAccess.insert({
        ...productData,
        staffId,
      });

      if (result) {
        if (productImages) {
          for (let imageUrl of productImages) {
            let productId = result[0];
            let productImage = {
              productImage: imageUrl,
              productId: productId,
            };
            await ProductImageResourceAccess.insert(productImage);
          }
        }
        resolve(result);
      } else {
        console.error(`error product can not insert: ${ERROR}`);
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

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let productId = req.payload.id;
      let productData = req.payload.data;

      let productImages = productData.productImages ? productData.productImages : undefined;
      delete productData.productImages;

      let product = await ProductResourceAccess.findById(productId);
      if (product) {
        let listImageProduct = await ProductImageResourceAccess.find({ productId: productId });
        if (productImages && productImages.length > 0) {
          // xoa hinh cua product
          if (listImageProduct && listImageProduct.length > 0) {
            for (let productImage of listImageProduct) {
              await ProductImageResourceAccess.deleteById(productImage.productImageId);
            }
          }
          // insert hinh moi
          for (let imageUrl of productImages) {
            let productImage = {
              productImage: imageUrl,
              productId: productId,
            };
            await ProductImageResourceAccess.insert(productImage);
          }
        }

        if (productData.productTitle) {
          productData.productName = productData.productTitle;
        }
        productData.updatedAt = new Date();
        let result = await ProductResourceAccess.updateById(productId, productData);
        if (result) {
          // update lai imageName neu co cap nhat productTitle
          if (productData.productTitle) {
            if (listImageProduct && listImageProduct.length > 0) {
              for (let productImage of listImageProduct) {
                await ProductImageResourceAccess.updateById(productImage.productImageId, {
                  productImageName: productData.productTitle,
                });
              }
            }
          }
          resolve(result);
        } else {
          console.error(`Cannot update Product id ${productId}`);
          reject('failed');
        }
      } else {
        console.error(`Cannot find Product id ${productId}`);
        reject('can not find Product');
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
        let product = result[0];
        let _productImages = await ProductImageResourceAccess.find({
          productId: productId,
        });
        if (_productImages) {
          product.productImages = _productImages;
        }
        resolve(product);
      } else {
        console.error(`error product findById with id ${productId}: ${ERROR}`);
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
      console.error(`error product deleteById with id ${id}: ${ERROR}`);
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

        products = await Promise.all(
          products.map(async product => {
            let listProductImages = [];
            let _productImages = await ProductImageResourceAccess.find({
              productId: product.productId,
            });
            if (_productImages && _productImages.length > 0) {
              _productImages.forEach(productImage => listProductImages.push(productImage.productImage));
            }
            product.productImages = listProductImages;
            return product;
          }),
        );
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
