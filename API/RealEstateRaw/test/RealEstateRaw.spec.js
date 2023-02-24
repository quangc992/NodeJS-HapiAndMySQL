/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
const Model = require('../resourceAccess/RealEstateRawResourceAccess');

const app = require('../../../server');
const { modelName } = require('../resourceAccess/RealEstateRawResourceAccess');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

describe(`Tests ${Model.modelName}`, function () {
  let realEstateId;
  let token = '';
  let tokenStaff = '';
  let fakeUserName = faker.name.firstName() + faker.name.lastName();
  fakeUserName = fakeUserName.replace("'", '');
  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginStaff();
      token = staffData.token;
      resolve();
    }).then(() => done());
  });
  it(`insert data${modelName}`, done => {
    const body = [
      {
        AreaCountryName: 'Việt Nam',
        AreaProvinceName: 'Cao Bằng',
        AreaDistrictName: 'Vĩnh Quang',
        AreaTypeName: 'Bán nhà biệt thự,liền kề',
        LocationHomeNumber: '123a',
        LocationStreetWidth: 500,
        LocationFrontStreetWidth: 200,
        LandWidth: 10,
        LandLong: 20,
        LandDefaultSquare: 200,
        LandRealitySquare: 500,
        LandRoadSquare: 400,
        LandRealConstructionSquare: 500,
        HouseFloors: 3,
        HouseBedRooms: 0,
        HouseToilets: 0,
        HouseTerrace: 'string',
        HouseFrontYard: 'string',
        HouseBackYard: 'string',
        HouseGarage: 'string',
        HousePool: 'string',
        HouseBasement: 'string',
        HouseMiddleFloors: 'string',
        HouseStairType: 'string',
        HouseWallType: 'string',
        HouseFloorsType: 'string',
        HouseRoofType: 'string',
        HouseCompleteName: 'string',
        HouseFurnitureName: 'string',
        HouseFurnitureList: 'string',
        HouseQualityName: 'string',
        HouseElectricity: 'string',
        HouseWater: 'string',
        HouseConstructionHeight: 'string',
        HouseAbilites: 'string',
        HouseNearbyPlace: 'string',
        ValueSalePrice: 0,
        ValueSaleUnitPrice: 0,
        ValueDiscussPrice: 'string',
        ValueLandUnitPrice: 'string',
        ValueHouseUnitPrice: 'string',
        ValueHousePrice: 'string',
        ValueLandPrice: 'string',
        ValueRentPrice: 'string',
        ValueRentUnitPrice: 'string',
        JuridicalName: 0,
        JuridicalPaperCode: 'string',
        JuridicalLandCode: 'string',
        JuridicalLandSquare: 'string',
        JuridicalConstructionSquare: 'string',
        JuridicalMainConstruction: 'string',
        JuridicalOtherObject: 'string',
        JuridicalFloorSquare: 'string',
        JuridicalSubConstructions: 'string',
        JuridicalLatest: 'string',
        JuridicalUpdates: 'string',
        JuridicalContructionLimitation: 'string',
        JuridicalStatusName: 'string',
        JuridicalUsingStatusName: 'string',
        ContactName: 'string',
        ContactAge: 'string',
        ContactDob: 'string',
        ContactGender: 'string',
        ContactPhone: '0374307089',
        ContactAddress: 'string',
        ContactIdentity: 'string',
        ContactFacebook: 'string',
        ContactTwitter: 'string',
        ContactTelegram: 'string',
        ContactZalo: 'string',
        ContactGoogle: 'string',
        ContactApple: 'string',
        ContactPosition: 'string',
        ContactDomain: 'string',
        ContactJob: 'string',
        ContactCompany: 'string',
        ContactEmail: 'trantrieuan224@gmail.com',
        PlanRentPrice: 'string',
        PlanRentUnitPrice: 'string',
        Plan6mSalePrice: 'string',
        Plan3mSalePrice: 'string',
        Plan1ySalePrice: 'string',
        Plan5ySalePrice: 'string',
        PlanEvaluation: 'string',
        PlanProfitPercentage: 'string',
        PlanLoanPercentage: 'string',
        PlanLoanMaximum: 'string',
        PlanLoanPayRateMonthly: 'string',
        PlanLoanTime: 'string',
        PlanInvestmentTypeName: 'string',
        PlanInvestmentRankingName: 'string',
        PlanInvestmentPoints: 'string',
        ContactAnalysisOwnerReason: 'string',
        ContactAnalysisOwnerConfident: 'string',
        ContactAnalysisBrokerReason: 'string',
        ContactAnalysisBrokerConfident: 'string',
        RecordAnalysisFakeReasons: 'string',
        RecordAnalysisFakeConfident: 'string',
        SystemModifierName: 'string',
        SystemCreatorName: 'string',
        SystemInfomationRankingName: 'string',
        SystemInfoConfirmStatusName: 'string',
        SystemInfoUsingStatusName: 'string',
        SystemInfoVisibleStatus: 'string',
        SystemInfoSecurityLevelName: 'string',
        SystemSourceName: 'string',
        SystemSourceType: 'string',
        SystemPostType: 'Nhà đất bán',
        SystemPostUrl: 'string',
        SystemSourceLink: 'string',
        SystemCrawlingStatus: 'string',
        SystemDateOfPost: 'string',
        SystemLastActiveDate: 'string',
        SystemNote: 'string',
        SystemCollectionPoints: 'string',
        SystemRecordType: 'string',
        SystemRecordTitle: 'Nhà Đất Cần Bán',
        SystemRecordContent: 'bán nhà mặt tiền',
        SystemViewCount: 'string',
        SystemViewerName: 'string',
        SystemAnalysisLevel: 'string',
        Comments: 'string',
        ChangedActivities: 'string',
      },
    ];
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/insert`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        realEstateId = res.body.data[0];
        done();
      });
  });
  it(`find ${modelName}`, done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`Update ${modelName} ById`, done => {
    const body = {
      id: realEstateId,
      data: {
        realEstateTitle: 'string',
        realEstatePhone: 'string',
        realEstateEmail: 'string',
        realEstateContacAddress: 'string',
        realEstateDescription: 'string',
        realEstateLandRealitySquare: 0,
        realEstateLandDefaultSquare: 0,
        realEstateLandRoadSquare: 0,
        realEstateLandRealConstructionSquare: 0,
        realEstateLandLongs: 0,
        realEstateLandWidth: 0,
        realEstateValueSalePrice: 0,
        realEstateUnitPrice: 0,
        realEstateJuridicalName: 0,
        realEstateLocationFrontStreetWidth: 0,
        realEstateLocationStreetWidth: 0,
        realEstateHouseDirection: 0,
        realEstateBalconyDirection: 0,
        realEstateDirection: 0,
        realEstateLocationHomeNumber: 'string',
        realEstateHouseFurnitureList: 'string',
        realEstateLandShapeName: 0,
        realEstateHouseFloors: 0,
        realEstateHouseBedRooms: 0,
        realEstateHouseToilets: 0,
        realEstateContactTypeId: 0,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/updateById`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`findById ${modelName}`, done => {
    const body = {
      id: realEstateId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/findById`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`deleteById ${modelName}`, done => {
    const body = {
      id: realEstateId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/deleteById`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
});
