/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
//This model is use to display info of Stations in public.
//BEWARE !! DO NOT SEND INFO THAT RELATED TO SYSTEM INSIDE MODEL
const Joi = require('joi');

const rawRealEstateSchema = Joi.object({
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
  realEstateValueSalePrice: Joi.number().required(),
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
  realEstateImage: Joi.array().items(Joi.string()),
});

function fromData(data) {
  let modelData = {
    ...data,
  };

  let outputModel = rawRealEstateSchema.validate(modelData);
  if (outputModel.error === undefined || outputModel.error === null || outputModel.error === '') {
    return outputModel.value;
  } else {
    console.error(outputModel.error);
    return undefined;
  }
}

function fromCrawlerData(crawlerData) {
  let modelData = {
    //thông tin chung bài đăng
    realEstateTitle: crawlerData.SystemRecordTitle,
    realEstateDescription: crawlerData.SystemRecordContent,
    //thông tin liên hệ bài đăng
    realEstatePhone: crawlerData.ContactPhone,
    realEstateEmail: crawlerData.ContactEmail,
    realEstateContacAddress: crawlerData.ContactAddress,
    //thông tin đất
    realEstateLandRealitySquare: crawlerData.LandRealitySquare,
    realEstateLandDefaultSquare: crawlerData.LandDefaultSquare,
    realEstateLandRoadSquare: crawlerData.LandRoadSquare,
    realEstateLandRealConstructionSquare: crawlerData.LandRealConstructionSquare,
    realEstateLandLongs: crawlerData.LandLong,
    realEstateLandWidth: crawlerData.LandWidth,
    realEstateDirection: crawlerData.LandDirectionName,
    //thông tin giá bán
    realEstateValueSalePrice: crawlerData.ValueSalePrice,
    realEstateUnitPrice: crawlerData.ValueSaleUnitPrice,
    //thông tin pháp lý
    realEstateJuridicalName: crawlerData.JuridicalName,
    //thông tin về vị trí
    realEstateLocationFrontStreetWidth: crawlerData.LocationFrontStreetWidth,
    realEstateLocationStreetWidth: crawlerData.LocationStreetWidth,
    //thông tin về nhà trên đất
    realEstateHouseFloors: crawlerData.HouseFloors,
    realEstateHouseBedRooms: crawlerData.HouseBedRooms,
    realEstateHouseToilets: crawlerData.HouseToilets,
    //hinh anh
    realEstateImage: crawlerData.ImagesHouse,
    //Các thông tin khác được xử lý bằng cách mapping dữ liệu
    //Do vậy phần mapping dữ liệu không cần để vào model
  };

  let outputModel = rawRealEstateSchema.validate(modelData);
  if (outputModel.error === undefined || outputModel.error === null || outputModel.error === '') {
    return outputModel.value;
  } else {
    console.error(outputModel.error);
    return undefined;
  }
}

module.exports = {
  fromData,
  fromCrawlerData,
  schema: rawRealEstateSchema,
};
