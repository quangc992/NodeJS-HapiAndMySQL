/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moduleName = 'RealEstate';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const insertSchema = {
  realEstateTitle: Joi.string().required(),
  realEstatePhone: Joi.string().required(),
  realEstateEmail: Joi.string(),
  realEstateContacAddress: Joi.string(),
  realEstateDescription: Joi.string().required(),
  realEstateLandRealitySquare: Joi.number().required(),
  realEstateLandDefaultSquare: Joi.number(),
  realEstateLandRoadSquare: Joi.number(),
  realEstateLandRealConstructionSquare: Joi.number(),
  realEstateLandLongs: Joi.number(),
  realEstateLandWidth: Joi.number(),
  realEstateValueSalePrice: Joi.number(),
  realEstateUnitPrice: Joi.number(),
  realEstateJuridicalName: Joi.number(),
  realEstateLocationFrontStreetWidth: Joi.number(),
  realEstateLocationStreetWidth: Joi.number(),
  realEstateHouseDirection: Joi.number(),
  realEstateBalconyDirection: Joi.number(),
  realEstateDirection: Joi.number(),
  realEstateLocationHomeNumber: Joi.string(),
  realEstateHouseFurnitureList: Joi.string(),
  realEstateLandShapeName: Joi.number(),
  realEstateHouseFloors: Joi.number(),
  realEstateHouseBedRooms: Joi.number(),
  realEstateHouseToilets: Joi.number(),
  realEstateContactTypeId: Joi.number(),
  realEstateProjectId: Joi.number(),
  staffId: Joi.number(),
  realEstateCategoryId: Joi.number(),
  realEstateSubCategoryId: Joi.number(),
  realEstatePostTypeId: Joi.number(),
  areaCountryId: Joi.number().required(),
  areaProvinceId: Joi.number().required(),
  areaDistrictId: Joi.number().required(),
  areaWardId: Joi.number().required(),
  areaStreetId: Joi.number(),
  lat: Joi.number(),
  lng: Joi.number(),
  apartmentCode: Joi.string(),
  apartmentCodeStatus: Joi.number(),
  realEstateHouseKitchen: Joi.number(),
  realEstateHouseLivingRoom: Joi.number(),
  apartmentBlockCode: Joi.string(),
  apartmentCornerPosition: Joi.number(),
  agencyStatus: Joi.number(),
  agency: Joi.number(),
  realEstateHouseFurniture: Joi.number(),
  realEstateVideo: Joi.string(),
  realEstatePlanRentPrice: Joi.number(),
  realEstateUtil: Joi.string().allow(['']),
  realEstatedeposits: Joi.number(),
  realEstateLocationHomeNumberStatus: Joi.number(),
  agencyPercent: Joi.number(),
  realEstateLandUseSquare: Joi.number(),
};

const updateSchema = {
  isHidden: Joi.number(),
  realEstateTitle: Joi.string(),
  realEstatePhone: Joi.string(),
  realEstateEmail: Joi.string(),
  realEstateContacAddress: Joi.string(),
  realEstateDescription: Joi.string(),
  realEstateLandRealitySquare: Joi.number(),
  realEstateLandDefaultSquare: Joi.number(),
  realEstateLandRoadSquare: Joi.number(),
  realEstateLandRealConstructionSquare: Joi.number(),
  realEstateLandLongs: Joi.number(),
  realEstateLandWidth: Joi.number(),
  realEstateValueSalePrice: Joi.number(),
  realEstateUnitPrice: Joi.number(),
  realEstateJuridicalName: Joi.number(),
  realEstateLocationFrontStreetWidth: Joi.number(),
  realEstateLocationStreetWidth: Joi.number(),
  realEstateHouseDirection: Joi.number(),
  realEstateBalconyDirection: Joi.number(),
  realEstateDirection: Joi.number(),
  realEstateLocationHomeNumber: Joi.string(),
  realEstateHouseFurnitureList: Joi.string(),
  realEstateLandShapeName: Joi.number(),
  realEstateHouseFloors: Joi.number(),
  realEstateHouseBedRooms: Joi.number(),
  realEstateHouseToilets: Joi.number(),
  realEstateContactTypeId: Joi.number(),
  realEstateProjectId: Joi.number(),
  staffId: Joi.number(),
  realEstateCategoryId: Joi.number(),
  realEstateSubCategoryId: Joi.number(),
  realEstatePostTypeId: Joi.number(),
  areaCountryId: Joi.number(),
  areaProvinceId: Joi.number(),
  areaDistrictId: Joi.number(),
  areaWardId: Joi.number(),
  areaStreetId: Joi.number(),
  lat: Joi.number(),
  lng: Joi.number(),
  apartmentCode: Joi.string(),
  apartmentCodeStatus: Joi.number(),
  realEstateHouseKitchen: Joi.number(),
  realEstateHouseLivingRoom: Joi.number(),
  apartmentBlockCode: Joi.string(),
  apartmentCornerPosition: Joi.number(),
  agencyStatus: Joi.number(),
  agency: Joi.number(),
  realEstateHouseFurniture: Joi.number(),
  realEstateVideo: Joi.string(),
  realEstatePlanRentPrice: Joi.number(),
  realEstateUtil: Joi.string().allow(['']),
  realEstatedeposits: Joi.number(),
  realEstateLocationHomeNumberStatus: Joi.number(),
  agencyPercent: Joi.number(),
  realEstateLandUseSquare: Joi.number(),
  isHidden: Joi.number(),
};

const filterSchema = {
  realEstateTitle: Joi.string(),
  realEstatePhone: Joi.string(),
  realEstateEmail: Joi.string(),
  realEstateDescription: Joi.string(),
  realEstateLandLongs: Joi.number(),
  realEstateLandWidth: Joi.number(),
  realEstateUnitPrice: Joi.string(),
  realEstateJuridicalName: Joi.string(),
  realEstateJuridicalCode: Joi.number(),
  realEstateLocationStreetWidth: Joi.number(),
  realEstateLocationFrontStreetWidth: Joi.number(),
  realEstateHouseDirection: Joi.string(),
  realEstateHouseFurnitureList: Joi.string(),
  realEstateHouseFloors: Joi.number(),
  realEstateHouseBedRooms: Joi.number(),
  realEstateHouseToilets: Joi.number(),
  realEstateContactTypeId: Joi.number(),
  realEstateProjectId: Joi.number(),
  staffId: Joi.number(),
  realEstateCategoryId: Joi.number(),
  realEstateSubCategoryId: Joi.number(),
  realEstatePostTypeId: Joi.number(),
  areaCountryId: Joi.number(),
  areaProvinceId: Joi.number(),
  areaDistrictId: Joi.number(),
  areaWardId: Joi.number(),
  areaStreetId: Joi.number(),
  lat: Joi.number(),
  lng: Joi.number(),
  appUserId: Joi.number(),
  approveStatus: Joi.number(),
  agencyPercent: Joi.number(),
  agency: Joi.number(),
  realEstateLandUseSquare: Joi.number(),
  isHidden: Joi.number(),
};
const filterSchemaView = {
  realEstateTitle: Joi.string(),
  realEstatePhone: Joi.string(),
  realEstateEmail: Joi.string(),
  realEstateDescription: Joi.string(),
  realEstateLandLongs: Joi.number(),
  realEstateLandWidth: Joi.number(),
  realEstateUnitPrice: Joi.string(),
  realEstateJuridicalName: Joi.string(),
  realEstateLocationStreetWidth: Joi.number(),
  realEstateLocationFrontStreetWidth: Joi.number(),
  realEstateHouseDirection: Joi.string(),
  realEstateHouseFurnitureList: Joi.string(),
  realEstateHouseFloors: Joi.number(),
  realEstateHouseBedRooms: Joi.number(),
  realEstateHouseToilets: Joi.number(),
  realEstateContactTypeId: Joi.number(),
  realEstateProjectId: Joi.number(),
  staffId: Joi.number(),
  realEstateCategoryId: Joi.number(),
  realEstateSubCategoryId: Joi.number(),
  realEstatePostTypeId: Joi.number(),
  areaCountryName: Joi.string(),
  areaProvinceName: Joi.string(),
  areaDistrictName: Joi.string(),
  areaStreetId: Joi.number(),
  areaWardName: Joi.string(),
  areaStreetName: Joi.string(),
  lat: Joi.number(),
  lng: Joi.number(),
  AreaCountryDataKey: Joi.string(),
  AreaWardDataKey: Joi.string(),
  AreaDistrictDataKey: Joi.string(),
  AreaProvinceDataKey: Joi.string(),
  realEstateJuridicalId: Joi.number(),
  realEstateFurnitureId: Joi.number(),
  derectionHouseKey: Joi.string(),
  derectionBalconyKey: Joi.string(),
  derectionRealEstateKey: Joi.string(),
  apartmentCode: Joi.string(),
  apartmentCodeStatus: Joi.number(),
  statusId: Joi.number(),
  agencyId: Joi.number(),
  derectionHouseKey: Joi.number(),
  areaCountryId: Joi.number(),
  areaProvinceId: Joi.number(),
  areaDistrictId: Joi.number(),
  areaWardId: Joi.number(),
  approveStatus: Joi.number(),
  realEstateJuridicalId: Joi.number(),
  AreaStreetId: Joi.number(),
  appUserId: Joi.number(),
  agencyPercent: Joi.number(),
  agency: Joi.number(),
  realEstateLandUseSquare: Joi.number(),
  isHidden: Joi.number(),
};
module.exports = {
  insert: {
    tags: ['api', `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        data: Joi.object(insertSchema),
        imagesLink: Joi.array().required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'insert');
    },
  },
  updateById: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0).required(),
        data: Joi.object(updateSchema),
        imagesLink: Joi.array(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'updateById');
    },
  },
  find: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        filterClause: Joi.object({
          startLandRealitySquare: Joi.number(),
          endLandRealitySquare: Joi.number(),
          startValueSalePrice: Joi.number(),
          endValueSalePrice: Joi.number(),
        }),
        startDate: Joi.string(),
        endDate: Joi.string(),
        searchText: Joi.string(),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'find');
    },
  },
  findById: {
    tags: ['api', `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'findById');
    },
  },

  getDetail: {
    tags: ['api', `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getDetail');
    },
  },
  deleteById: {
    tags: ['api', `${moduleName}`],
    description: `delete by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'deleteById');
    },
  },
  summaryView: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    validate: {
      payload: Joi.object({
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'summaryView');
    },
  },
  getList: {
    tags: ['api', `${moduleName}`],
    description: `getList ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),

      payload: Joi.object({
        filter: Joi.object(filterSchemaView),
        filterClause: Joi.object({
          startLandRealitySquare: Joi.number(),
          endLandRealitySquare: Joi.number(),
          startValueSalePrice: Joi.number(),
          endValueSalePrice: Joi.number(),
        }),
        startDate: Joi.string(),
        endDate: Joi.string(),
        searchText: Joi.string(),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('activedDate').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getList');
    },
  },
  hiddenById: {
    tags: ['api', `${moduleName}`],
    description: `hidden by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0).required(),
        isHidden: Joi.number().valid([0, 1]).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'hiddenById');
    },
  },
  filterCategory: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object({
          realEstateCategoryId: Joi.number(),
        }),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('activedDate').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getList');
    },
  },
  filterProject: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object({
          realEstateProjectId: Joi.number(),
        }),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('activedDate').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getList');
    },
  },
  filterUser: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object({
          appUserId: Joi.number(),
        }),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('activedDate').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getList');
    },
  },
  getListByLocation: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('activedDate').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getListByLocation');
    },
  },
  getListByPrice: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),
      payload: Joi.object({
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getListByPrice');
    },
  },
  getListByRating: {
    tags: ['api', `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),
      payload: Joi.object({
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getListByRating');
    },
  },

  getListByUser: {
    tags: ['api', `${moduleName}`],
    description: `danh sách bài viết user đã đăng`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchemaView),
        filterClause: Joi.object({
          startLandRealitySquare: Joi.number(),
          endLandRealitySquare: Joi.number(),
          startValueSalePrice: Joi.number(),
          endValueSalePrice: Joi.number(),
        }),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        searchText: Joi.string(),
        order: Joi.object({
          key: Joi.string().default('activedDate').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'getListByUser');
    },
  },
  reviewRealEstate: {
    tags: ['api', `${moduleName}`],
    description: `Staff duyệt bài đăng`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number(),
        status: Joi.number().valid([0, 1, -1]),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'reviewRealEstate');
    },
  },
  uploadImageRealEstate: {
    tags: ['api', `${moduleName}`],
    description: `Upload image realEstate`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        imageData: Joi.string().required(),
        imageFormat: Joi.string().required(),
      }),
    },
    payload: {
      maxBytes: 10 * 1024 * 1024, //10 mb
      parse: true,
    },
    handler: function (req, res) {
      Response(req, res, 'uploadImage');
    },
  },
  uploadVideoRealEstate: {
    tags: ['api', `${moduleName}`],
    description: `Upload video realEstate`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        videoData: Joi.string().required(),
        videoFormat: Joi.string().required(),
      }),
    },
    payload: {
      maxBytes: 30 * 1024 * 1024, //30 mb
      parse: true,
    },
    handler: function (req, res) {
      Response(req, res, 'uploadVideo');
    },
  },

  pushNewRealEstate: {
    tags: ['api', `${moduleName}`],
    description: `API đẩy tin`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'pushNewRealEstate');
    },
  },
  statisticalRealEstateByMonth: {
    tags: ['api', `${moduleName}`],
    description: `report ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),

      payload: Joi.object({
        startDate: Joi.string(),
        endDate: Joi.string(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'statisticalRealEstateByMonth');
    },
  },
  callToRealEstateContact: {
    tags: ['api', `${moduleName}`],
    description: `handle processing when user click call to Contact of realestate`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'callToRealEstateContact');
    },
  },
  requestViewDetailProject: {
    tags: ['api', `${moduleName}`],
    description: `handle processing when user request to view detail project`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'requestViewDetailProject');
    },
  },
  exportExcel: {
    tags: ['api', `${moduleName}`],
    description: `exportExcel realEstate`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAdminToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        startDate: Joi.string(),
        endDate: Joi.string(),
        searchText: Joi.string(),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default('createdAt').allow(''),
          value: Joi.string().default('desc').allow(''),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'exportExcel');
    },
  },
  userHiddenById: {
    tags: ['api', `${moduleName}`],
    description: `hidden by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0).required(),
        isHidden: Joi.number().valid([0, 1]).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'userHiddenById');
    },
  },
  importRealEstateData: {
    tags: ['api', `${moduleName}`],
    description: `${moduleName} import realestate data`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        file: Joi.binary().encoding('base64'),
        fileFormat: Joi.string().valid(['xlsx', 'xls', 'csv']).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, 'importRealEstateData');
    },
  },
};
