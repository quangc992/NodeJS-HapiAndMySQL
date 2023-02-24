/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const ProductOrderResourceAccess = require('../ProductOrder/resourceAccess/ProductOrderResourceAccess');
const ProductOrderUserViews = require('../ProductOrder/resourceAccess/ProductOrderUserViews');
const ProductOrderItemResourceAccess = require('../ProductOrderItem/resourceAccess/ProductOrderItemResourceAccess');
const WalletResourceAccess = require('../Wallet/resourceAccess/WalletResourceAccess');
const ProductResourceAccess = require('../Product/resourceAccess/ProductResourceAccess');
const ProductOrderItemsView = require('../ProductOrderItem/resourceAccess/ProductOrderItemsView');
const ProductImageResourceAccess = require('../ProductImage/resourceAccess/ProductImageResourceAccess');
const WalletRecordFunctions = require('../WalletRecord/WalletRecordFunction');
const Logger = require('../../utils/logging');
const { WALLET_TYPE } = require('../Wallet/WalletConstant');
const { PLACE_ORDER_ERROR, PRODUCT_ORDER_STATUS, PRODUCT_ORDER_TYPE } = require('./ProductOrderConstant');
const WalletBalanceUnitView = require('../Wallet/resourceAccess/WalletBalanceUnitView');

async function retrieveAllUserWallets(user) {
  const userWallet = await WalletResourceAccess.find({ appUserId: user.appUserId });

  if (!userWallet || userWallet.length < 1) {
    Logger.error(`invalid wallet for user ${user.appUserId}`);
    return undefined;
  }

  let rewardWallet; // ví hoa hồng
  let bonusWallet; // ví khuyến mãi
  let pointWallet; // vi tiền chính của user

  for (const _wallet of userWallet) {
    if (_wallet.walletType === WALLET_TYPE.REWARD) {
      rewardWallet = _wallet;
      continue;
    }

    if (_wallet.walletType === WALLET_TYPE.BONUS) {
      bonusWallet = _wallet;
      continue;
    }

    if (_wallet.walletType === WALLET_TYPE.POINT) {
      pointWallet = _wallet;
      continue;
    }
    continue;
  }

  if (!rewardWallet || !bonusWallet || !pointWallet) {
    Logger.error(PLACE_ORDER_ERROR.INVALID_WALLET);
    return PLACE_ORDER_ERROR.INVALID_WALLET;
  }
  return {
    rewardWallet,
    pointWallet,
    bonusWallet,
  };
}

async function _calculateOrderInqueries(orderData) {
  let _orderProductItems = orderData.orderProductItems;
  let _subTotal = 0;
  let _total = 0;
  let _fee = 0;

  for (let i = 0; i < _orderProductItems.length; i++) {
    // let _productItem = await ProductResourceAccess.findById(_orderProductItems[i].productId);
    // if (!_productItem) {
    // console.error(`_calculateOrderInqueries failed, can not find product id ${_orderProductItems[i].productId}`);
    // return undefined;
    // }
    let orderItem = _orderProductItems[i];
    _subTotal += orderItem.orderItemPrice * orderItem.orderItemQuantity;
    // _orderProductItems[i].orderItemPrice = _productItem.productPrice;
    // _orderProductItems[i].stockQuantity = _productItem.stockQuantity;
  }
  const PURCHASE_FEE_PERCENTAGE = 5; //5% phi giao dich
  _fee = (_subTotal * PURCHASE_FEE_PERCENTAGE) / 100;
  _total = _subTotal + _fee;
  return {
    total: _total,
    fee: _fee,
    subTotal: _subTotal,
    // orderProductItems: _orderProductItems,
  };
}

async function verifyOrderData(orderData) {
  let orderProductItems = orderData.orderProductItems;

  //kiểm tra đơn hàng, tránh đặt trùng mã sản phẩm
  const productIds = orderProductItems.map(_orderProductItem => _orderProductItem.productId);
  const uniqueProductId = [...new Set(productIds)];

  if (uniqueProductId && productIds && uniqueProductId.length !== productIds.length) {
    Logger.error(PLACE_ORDER_ERROR.MUST_UNIQUE_TICKET_ID);
    throw PLACE_ORDER_ERROR.MUST_UNIQUE_TICKET_ID;
  }

  //tính toán tiền đơn hàng
  const orderInquery = await _calculateOrderInqueries(orderData);
  if (!orderInquery) {
    Logger.error(PLACE_ORDER_ERROR.SOMETHING_NOT_RIGHT);
    throw PLACE_ORDER_ERROR.SOMETHING_NOT_RIGHT;
  }

  return orderInquery;
}

async function storeOrderItemToDb(orderId, orderItem) {
  let __newOrderItemId = await ProductOrderItemResourceAccess.insert({
    orderItemPrice: orderItem.orderItemPrice,
    orderItemQuantity: orderItem.orderItemQuantity,
    productId: orderItem.productId,
    productOrderId: orderId,
  });
  //attach Product image for each order item
  const ProductImageResource = require('../ProductImage/resourceAccess/ProductImageResourceAccess');
  const { PRODUCT_IMAGE_STATUS } = require('../ProductImage/ProductImageConstant');
  let _validImages = await ProductImageResource.find({
    productId: orderItem.productId,
    productOrderId: null,
  });

  if (_validImages && _validImages.length > 0) {
    _validImages.forEach(async productImage => {
      await ProductImageResource.updateById(productImage.productImageId, {
        productOrderId: orderId,
        productOrderItemId: __newOrderItemId,
        productImageStatus: PRODUCT_IMAGE_STATUS.COMPLETED,
      });
    });
  }

  return __newOrderItemId;
}

async function placeNewOrder(user, orderData) {
  // tinh tong tien don hang
  let { subTotal, total, fee } = await verifyOrderData({
    orderProductItems: [orderData],
  });

  //tao du lieu don hang moi
  const _newOrderData = {
    subTotal: subTotal,
    customerName: user.firstName,
    customerPhone: user.phoneNumber,
    customerIdentity: user.identityNumber,
    appUserId: user.appUserId,
    orderStatus: PRODUCT_ORDER_STATUS.NEW,
    orderType: PRODUCT_ORDER_TYPE.BUY,
    total: total,
    fee: fee,
    maxOrderItemQuantity: orderData.maxOrderItemQuantity,
    minOrderItemQuantity: orderData.minOrderItemQuantity,
  };

  //thực thi thanh toán và tạo đơn hàng
  let placeOrderResult = await ProductOrderResourceAccess.insert(_newOrderData);

  if (!(placeOrderResult && placeOrderResult.length > 0)) {
    console.error(`Place order error`);
    console.error(JSON.stringify(orderData));
    console.error(JSON.stringify(_newOrderData));
    console.error(placeOrderResult);
    return undefined;
  }
  await storeOrderItemToDb(placeOrderResult[0], orderData);
  return placeOrderResult[0];
}

function verifyTransactionAmount(userAmount, productOrderItem) {
  // check if user request amount > orderItemQuantity - orderItemDeliveredQuantity
  // if (userAmount >= productOrderItem.orderItemQuantity - productOrderItem.orderItemDeliveredQuantity) {
  //   throw PLACE_ORDER_ERROR.PRODUCT_OUT_OF_STOCK;
  // }
  // check if amount between max and min
  if (!(userAmount <= productOrderItem.maxOrderItemQuantity && userAmount >= productOrderItem.minOrderItemQuantity)) {
    throw PLACE_ORDER_ERROR.EXCEED_LIMIT_ORDER_QUANTITY;
  }

  return true;
}

async function createSellingOrder(user, orderData) {
  let product = await ProductResourceAccess.findById(orderData.productId);
  if (!product) {
    console.error('product not found');
    return undefined;
  }

  let userWallet = await WalletBalanceUnitView.find({
    walletBalanceUnitCode: product.productCode,
    appUserId: user.appUserId,
  });
  if (!(userWallet && userWallet.length > 0)) {
    console.error('wallet balance unit not found');
    return undefined;
  }

  userWallet = userWallet[0];
  let decreasementRes = await WalletResourceAccess.decrementBalance(userWallet.walletId, orderData.orderItemQuantity);
  if (!decreasementRes) {
    console.error('decreasement balance error');
    return undefined;
  }

  let { subTotal, total, fee } = await verifyOrderData({
    orderProductItems: [orderData],
  });

  //tao du lieu don hang moi
  const _newOrderData = {
    subTotal: subTotal,
    customerName: user.firstName,
    customerPhone: user.phoneNumber,
    customerIdentity: user.identityNumber,
    appUserId: user.appUserId,
    orderStatus: PRODUCT_ORDER_STATUS.NEW,
    orderType: PRODUCT_ORDER_TYPE.SELL,
    total: total,
    fee: fee,
  };

  //thực thi thanh toán và tạo đơn hàng
  let placeOrderResult = await ProductOrderResourceAccess.insert(_newOrderData);

  if (!(placeOrderResult && placeOrderResult.length > 0)) {
    console.error(`Place order error`);
    console.error(JSON.stringify(orderData));
    console.error(JSON.stringify(_newOrderData));
    console.error(placeOrderResult);
    return undefined;
  }
  await storeOrderItemToDb(placeOrderResult[0], orderData);
  return placeOrderResult[0];
}

async function getProductOrderList(filter, skip, limit, startDate, endDate, searchText, order) {
  const productOrders = await ProductOrderUserViews.customSearch(filter, skip, limit, startDate, endDate, searchText, order);

  for (const _productOrder of productOrders) {
    let productOrderId = _productOrder.productOrderId;

    let _productImages = await ProductImageResourceAccess.customSearch({
      productOrderId: productOrderId,
    });
    let listProductImages = [];
    if (_productImages) {
      _productImages.forEach(productImage => listProductImages.push(productImage.productImageUrl));
    }
    _productOrder.productImage = listProductImages;

    const productOrderItems = await ProductOrderItemsView.customSearch({
      productOrderId: productOrderId,
    });
    _productOrder.productOrderItems = productOrderItems;
  }

  return productOrders;
}

async function getOrderDetail(filter) {
  const productOrder = await ProductOrderUserViews.customSearch(filter);

  if (!productOrder[0] || !productOrder) {
    return undefined;
  }

  let _productOrderItems = await ProductOrderItemsView.customSearch({
    productOrderId: filter.productOrderId,
  });

  const ProductImage = require('../ProductImage/resourceAccess/ProductImageResourceAccess');
  for (let i = 0; i < _productOrderItems.length; i++) {
    const _item = _productOrderItems[i];
    let _productImage = await ProductImage.customSearch({
      productOrderItemId: _item.productOrderItemId,
    });
    if (_productImage) {
      _productOrderItems[i].productImages = _productImage;
    }
  }
  productOrder[0].productOrderItems = _productOrderItems;
  return productOrder;
}

module.exports = {
  placeNewOrder,
  verifyOrderData,
  getOrderDetail,
  getProductOrderList,
  createSellingOrder,
  verifyTransactionAmount,
};
