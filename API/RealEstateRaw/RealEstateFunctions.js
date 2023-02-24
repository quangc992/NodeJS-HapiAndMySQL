/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const RealEstateResourceAccess = require('./resourceAccess/RealEstateRawResourceAccess');
const Axios = require('axios').default;
const fs = require('fs');
const UploadResourceAccess = require('../Upload/resourceAccess/UploadResourceAccess');
const RealEstateImageResourceAccess = require('../RealEstateImage/resourceAccess/RealEstateImageResourceAccess');
const { MESSAGE_TYPE } = require('../CustomerMessage/CustomerMessageConstant');
const CustomerMessageResourceAccess = require('../CustomerMessage/resourceAccess/CustomerMessageResourceAccess');
const { sendMessageByCustomerList } = require('../CustomerMessage/manager/CustomerMessageManager');
const CommonPlaceResourceAccess = require('../CommonPlace/resourceAccess/CommonPlaceResourceAccess');
const convertMonth = require('../ApiUtils/utilFunctions');
const RealEstateCategory = require('../RealEstateCategory/resourceAccess/RealEstateCategoryResourceAccess');

module.exports = {};
