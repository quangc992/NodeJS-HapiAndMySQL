/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const RealEstateResourceAccess = require('../resourceAccess/RealEstateResourceAccess');
const RealEstateImageResourceAccess = require('../../RealEstateImage/resourceAccess/RealEstateImageResourceAccess');
const RealEstateViews = require('../resourceAccess/RealEstateViews');
const Logger = require('../../../utils/logging');
const RealEstateFunctions = require('../RealEstateFunctions');
const UploadFunction = require('../../Upload/UploadFunctions');
const RealEstateViewsReport = require('../resourceAccess/RealEstateViewsReport');
const convertMonth = require('../../ApiUtils/utilFunctions');
const fs = require('fs');
const {
  REFUSE_POST,
  APPROVED_POST,
  NEW_POST,
  USER_POST_NEW,
  REFUSE_POST_FOR_FOLLOWER,
  RESTORE_POST,
  RESTORE_POST_FOR_FOLLOWER,
  UPDATE_POST_FOR_FOLLOWER,
} = require('../../CustomerMessage/CustomerMessageConstant');
const moment = require('moment');
const RealEstateUtilitiesResourceAccess = require('../../RealEstateUtilities/resourceAccess/RealEstateUtilitiesResourceAccess');
const { initialPermissions } = require('../../Permission/resourceAccess/PermissionResourceAccess');
const PaymentRecordFunction = require('../../PaymentRecord/PaymentRecordFunctions');
const WalletResourAccess = require('../../Wallet/resourceAccess/WalletResourceAccess');
const ExcelFunction = require('../../../ThirdParty/Excel/ExcelFunction');
const PaymentRecordResourAccess = require('../../PaymentRecord/resourceAccess/PaymentRecordResourceAccess');
const { verifyAreaPermission } = require('../../AreaData/AreaDataFunctions');
const SystemChangeLog = require('../../SystemAppChangedLog/SystemAppChangedLogFunctions');
const RealEstateSavedFunction = require('../../RealEstateUserSaved/RealEstateUserSaveFunction');
const AppUserResource = require('../../AppUsers/resourceAccess/AppUsersResourceAccess');
const {
  handleSendMessageToFollower,
  handleSendMessageNewRealEstate,
  handleSendMessageRealEstate,
} = require('../../CustomerMessage/CustomerMessageFunctions');
const tableName = 'RealEstate';

async function _updateImagesForRealEstate(realEstateId, imagesArray) {
  let realEstateImage = '';

  if (imagesArray && imagesArray.length > 0) {
    let arrayLinkUpdate = [];
    //move file from temporary folder to persistent folder
    for (var i = 0; i < imagesArray.length; i++) {
      let _linkExisted = RealEstateFunctions.checkRealEstateImagePersistent(imagesArray[i]);
      if (_linkExisted) {
        if (_linkExisted.length > 0) {
          let uploadFileName = _linkExisted[0].uploadFileName;
          let uploadFormatFile = _linkExisted[0].uploadFileExtension;
          let linkUdate = await RealEstateFunctions.moveFile(uploadFileName, uploadFormatFile);
          if (linkUdate !== false) {
            arrayLinkUpdate.push(linkUdate);
          }
        } else {
          arrayLinkUpdate.push(imagesArray[i]);
        }
      } else {
        arrayLinkUpdate.push(linkUdate);
      }
    }

    if (arrayLinkUpdate.length > 0) {
      let _updatedData = {
        isDeleted: 1,
      };
      await RealEstateImageResourceAccess.updateAll(_updatedData, {
        realEstateId: realEstateId,
      });
      for (var i = 0; i < arrayLinkUpdate.length; i++) {
        await RealEstateFunctions.insertImage({
          realEstateImageUrl: arrayLinkUpdate[i],
          realEstateId: realEstateId,
        });
      }
      realEstateImage = arrayLinkUpdate[0];
    }
  }

  await RealEstateResourceAccess.updateById(realEstateId, {
    realEstateImage: realEstateImage,
  });
}

async function _insertNewRealEstate(realEstateData, currentUser) {
  //find common place nearby real Estate
  realEstateData.realEstateCommonPlace = await RealEstateFunctions.handleFindCommonPlace(realEstateData);

  // remove phone number from description
  realEstateData.realEstateDescription = RealEstateFunctions.removePhoneNumberInDescription(realEstateData.realEstateDescription);

  //if there is valid user, then check email from post and store to user data
  if (currentUser) {
    if (currentUser.email === '' || currentUser.email === null) {
      if (realEstateData.realEstateEmail && realEstateData.realEstateEmail !== '') {
        await AppUserResource.updateById(currentUser.appUserId, {
          email: realEstateData.realEstateEmail,
        });
      }
    }
  }

  let insertResult = await RealEstateResourceAccess.insert(realEstateData);
  return insertResult;
}

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateData = req.payload.data;
      realEstateData.appUserId = req.currentUser.appUserId;
      let arrayLink = req.payload.imagesLink;

      let result = await _insertNewRealEstate(realEstateData, req.currentUser);
      if (result) {
        let idRealEstate = result[0];

        let resultfindId = await RealEstateResourceAccess.findById(idRealEstate);
        if (resultfindId) {
          await _updateImagesForRealEstate(idRealEstate, arrayLink);
          resultfindId.realEstateId = idRealEstate;
          handleSendMessageNewRealEstate(realEstateData.appUserId, NEW_POST, realEstateData, {
            areaProvinceId: realEstateData.areaProvinceId,
            areaDistrictId: realEstateData.areaDistrictId,
          });

          // send message back to user
          const messageData = { id: idRealEstate };
          handleSendMessageRealEstate(USER_POST_NEW, messageData, resultfindId);
          resolve(resultfindId);
        } else {
          resolve(result);
        }
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
      let filter = req.payload.filter;
      let filterClause = req.payload.filterClause;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;
      let staff = req.currentUser;
      if (!req.currentUser.roleId) reject("Don't have permission");
      if (req.currentUser.roleId !== 1) {
        filter.adminAreaProvinceId = RealEstateFunctions.parseIntArray(staff.areaProvinceId);
        filter.adminAreaDistrictId = RealEstateFunctions.parseIntArray(staff.areaDistrictId);
        filter.adminAreaWardId = RealEstateFunctions.parseIntArray(staff.areaWardId);
      }
      let result = await RealEstateViews.customSearch(filter, undefined, filterClause, skip, limit, startDate, endDate, searchText, order);
      let resultCount = await RealEstateViews.customCount(filter, filterClause, startDate, endDate, searchText, order);
      if (result && resultCount) {
        if (req.currentUser && req.currentUser.appUserId) {
          result = await _checkUserSavedRealEstate(result, req.currentUser.appUserId);
        }
        resolve({ data: result, total: resultCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateId = req.payload.id;
      let realEstateData = req.payload.data;
      let arrayLink = req.payload.imagesLink;
      let dataBefore = await RealEstateResourceAccess.findById(realEstateId);
      console.log(dataBefore);
      let result = await RealEstateResourceAccess.updateById(realEstateId, realEstateData);
      if (result) {
        await _updateImagesForRealEstate(realEstateId, arrayLink);
        const newRealEstateData = await RealEstateResourceAccess.findById(realEstateId);
        console.log(newRealEstateData);
        if (newRealEstateData) {
          const TIME_SEND = moment().format('hh:mm DD/MM/YYYY');
          const messageData = {
            postId: realEstateId,
            timeUpdate: TIME_SEND,
          };
          // send message to followers
          handleSendMessageToFollower(UPDATE_POST_FOR_FOLLOWER, messageData, newRealEstateData);
        }
        await SystemChangeLog.logAppDataChanged(dataBefore, newRealEstateData, req.currentUser, tableName);
        resolve(result);
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
      let realEstateId = req.payload.id;
      let result = await RealEstateResourceAccess.findById(realEstateId);
      if (result) {
        let arrayImage = [];
        let image = await RealEstateFunctions.findImage(realEstateId);
        if (image) {
          for (var i = 0; i < image.length; i++) {
            arrayImage.push(image[i].realEstateImageUrl);
          }
          result.arrayImage = arrayImage;
          resolve(result);
        }
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateId = req.payload.id;

      let realEstateData = await RealEstateResourceAccess.findById(realEstateId);
      let result = await RealEstateResourceAccess.deleteById(realEstateId);
      if (result && realEstateData) {
        const TIME_SEND = moment().format('hh:mm DD/MM/YYYY');
        const messageData = {
          postId: realEstateId,
          timeRefused: TIME_SEND,
        };
        // send message to user who was posted
        handleSendMessageRealEstate(REFUSE_POST, messageData, realEstateData);
        // send message to followers
        handleSendMessageToFollower(REFUSE_POST_FOR_FOLLOWER, messageData, realEstateData);
        resolve(result);
      }
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
      let filterClause = req.payload.filterClause;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;
      let fieldGetList = await RealEstateFunctions.selectField();
      if (filter) {
        if (filter.realEstateContactTypeId === 0) {
          delete filter.realEstateContactTypeId;
        }
        if (filter.realEstateProjectId === 0) {
          delete filter.realEstateProjectId;
        }
        if (filter.realEstatePostTypeId === 0) {
          delete filter.realEstatePostTypeId;
        }
        if (filter.areaStreetId === 0) {
          delete filter.AreaStreetId;
        }
        if (filter.realEstateJuridicalId === 0) {
          delete filter.realEstateJuridicalId;
        }
        if (filter.realEstateFurnitureId === 0) {
          delete filter.realEstateFurnitureId;
        }
        if (filter.derectionHouseKey === 0) {
          delete filter.derectionHouseKey;
        }
        if (filter.areaCountryId === 0) {
          delete filter.areaCountryId;
        }
        if (filter.areaCountryId && filter.areaCountryId !== 0) {
          let areaCountryId = filter.areaCountryId;
          await RealEstateFunctions.viewAreaData(areaCountryId);
        }
        if (filter.areaProvinceId === 0) {
          delete filter.areaProvinceId;
        }
        if (filter.areaProvinceId && filter.areaProvinceId !== 0) {
          let areaProvinceId = filter.areaProvinceId;
          await RealEstateFunctions.viewAreaData(areaProvinceId);
        }
        if (filter.areaDistrictId === 0) {
          delete filter.areaDistrictId;
        }
        if (filter.areaDistrictId && filter.areaDistrictId !== 0) {
          let areaDistrictId = filter.areaDistrictId;
          await RealEstateFunctions.viewAreaData(areaDistrictId);
        }
        if (filter.areaWardId === 0) {
          delete filter.areaWardId;
        }
        if (filter.areaWardId && filter.areaWardId !== 0) {
          let areaWardId = filter.areaWardId;
          await RealEstateFunctions.viewAreaData(areaWardId);
        }
        if (filter.realEstateCategoryId === 0) {
          delete filter.realEstateCategoryId;
        }
        if (filter.realEstateSubCategoryId === 0) {
          delete filter.realEstateSubCategoryId;
        }
        if (filter.realEstateCategoryId !== 0 && filter.realEstateCategoryId) {
          let idCategory = filter.realEstateCategoryId;
          //increase view for both sub & main category if available
          if (filter.realEstateSubCategoryId !== 0 && filter.realEstateSubCategoryId) {
            let _realEstateSubCategoryId = filter.realEstateSubCategoryId;
            await RealEstateFunctions.viewCategory(idCategory, _realEstateSubCategoryId);
          } else {
            await RealEstateFunctions.viewCategory(idCategory);
          }
        }
      }
      let result = await RealEstateViews.customSearch(filter, fieldGetList, filterClause, skip, limit, startDate, endDate, searchText, order);
      let resultCount = await RealEstateViews.customCount(filter, filterClause, startDate, endDate, searchText, order);
      if (result && resultCount) {
        if (req.currentUser && req.currentUser.appUserId) {
          result = await _checkUserSavedRealEstate(result, req.currentUser.appUserId);
        }
        resolve({ data: result, total: resultCount[0].count });
        for (var i = 0; i < result.length; i++) {
          // function tăng lượt xem,
          await RealEstateFunctions.viewsRealEstate(result[i].realEstateId, result[i]);
        }
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
async function hiddenById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateId = req.payload.id;
      if (req.currentUser.roleId !== 1) {
        let realEstateData = await RealEstateResourceAccess.findById(realEstateId);
        if (!realEstateData) {
          reject('error');
        }
        const isValidRole = verifyAreaPermission(req.currentUser, realEstateData);
        if (!isValidRole) {
          reject("Don't have permission");
        }
      }
      let realEstateData = {};
      realEstateData.isHidden = req.payload.isHidden;
      let result = await RealEstateResourceAccess.updateById(realEstateId, realEstateData);
      realEstateData = await RealEstateResourceAccess.findById(realEstateId);
      if (result && realEstateData) {
        const TIME_SEND = moment().format('hh:mm DD/MM/YYYY');
        const messageData = {
          postId: realEstateId,
          timeRefused: TIME_SEND,
        };
        if (req.payload.isHidden === 1) {
          // send message to user who was posted
          handleSendMessageRealEstate(REFUSE_POST, messageData, realEstateData);
          //send message to user who are following
          handleSendMessageToFollower(REFUSE_POST_FOR_FOLLOWER, messageData, realEstateData);
        } else {
          // send message to user who was posted
          handleSendMessageRealEstate(RESTORE_POST, messageData, realEstateData);
          //send message to user who are following
          handleSendMessageToFollower(RESTORE_POST_FOR_FOLLOWER, messageData, realEstateData);
        }
        resolve(result);
      } else {
        resolve({ data: 'null' });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userHiddenById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateId = req.payload.id;
      let realEstateData = {};
      let appUserId = req.currentUser.appUserId;
      realEstateData.isHidden = req.payload.isHidden;
      if (appUserId === undefined) {
        reject('failed');
      }
      let resultRealEstate = await RealEstateResourceAccess.findById(realEstateId);
      if (resultRealEstate) {
        if (appUserId === resultRealEstate.appUserId) {
          let result = await RealEstateResourceAccess.updateById(realEstateId, realEstateData);
          if (result) {
            resolve(result);
          } else {
            reject('failed');
          }
        }
        reject('failed');
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function getDetail(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateId = req.payload.id;
      let paymentUserId;
      if (req.currentUser !== undefined) {
        paymentUserId = req.currentUser.appUserId;
      }
      let result = await RealEstateViews.find(
        {
          realEstateId: realEstateId,
          isDeleted: 0,
        },
        0,
        1,
      );
      if (result && result.length > 0) {
        result = result[0];
        result.paymentRecords = [];
        if (paymentUserId !== undefined) {
          let resultPayment = await PaymentRecordResourAccess.find({
            paymentUserId: paymentUserId,
            paymentTargetId: realEstateId,
          });
          if (resultPayment && resultPayment.length > 0) {
            result.paymentRecords = resultPayment;
          }
          if (resultPayment.length === 0) {
            if (req.currentUser === undefined || req.currentUser.appUserId !== result.appUserId) {
              delete result.realEstatePhone;
              delete result.realEstateEmail;
            }
          }
        } else {
          if (req.currentUser === undefined || req.currentUser.appUserId !== result.appUserId) {
            delete result.realEstatePhone;
            delete result.realEstateEmail;
          }
        }
        let arrayImage = [];
        let image = await RealEstateFunctions.findImage(realEstateId);
        if (image) {
          for (var i = 0; i < image.length; i++) {
            arrayImage.push(image[i].realEstateImageUrl);
          }
        }
        result.arrayImage = arrayImage;
        if (result.realEstateCommonPlace) {
          const arrayCommonPlace = result.realEstateCommonPlace.split(';');
          for (let placeId of arrayCommonPlace) {
            placeId = parseInt(placeId);
          }

          result.realEstateCommonPlace = await RealEstateFunctions.handleJoinCommonPlace(arrayCommonPlace, result);
        } else {
          result.realEstateCommonPlace = [];
        }
        let realEstateUtilData = [];
        if (result.realEstateCategoryId) {
          realEstateUtilData = await RealEstateUtilitiesResourceAccess.find({
            realEstateCategoryId: result.realEstateCategoryId,
          });
        }

        resolve({
          realEstateData: result,
          realEstateUtilData: realEstateUtilData,
        });
        // function tăng lượt click
        await RealEstateFunctions.clickRealEstate(realEstateId, result);
      } else {
        resolve({ data: [] });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
async function getListByLocation(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let dataUser = req.currentUser;
      if (dataUser !== undefined) {
        //thêm vào bộ lọc các thành phần vị trí của user. Có cái nào thì tìm kiếm theo cái đó
        if (dataUser.areaCountryId !== undefined) {
          filter.areaCountryId = dataUser.areaCountryId;
        }

        if (dataUser.provinceId !== undefined) {
          filter.areaProvinceId = dataUser.areaProvinceId;
        }

        if (dataUser.areaDistrictId !== undefined) {
          filter.areaDistrictId = dataUser.areaDistrictId;
        }

        if (dataUser.areaWardId !== undefined) {
          filter.areaWardId = dataUser.areaWardId;
        }
        let result = await RealEstateViews.find(filter, skip, limit, order);
        if (result && result.length > 0) {
          if (req.currentUser && req.currentUser.appUserId) {
            result = await _checkUserSavedRealEstate(result, req.currentUser.appUserId);
          }
          let resultCount = await RealEstateViews.count(filter, order);
          resolve({
            data: result,
            total: resultCount[0].count,
          });
          //thêm return để đảm bảo các dòng code phía sau sẽ không chạy nữa
          return;
        }
      }

      // nếu không tìm thấy kết quả nào thì lấy danh sách giống như thông thường
      let defaultList = await RealEstateViews.find({}, skip, limit, order);
      if (defaultList && defaultList.length > 0) {
        if (req.currentUser && req.currentUser.appUserId) {
          defaultList = await _checkUserSavedRealEstate(defaultList, req.currentUser.appUserId);
        }
        let resultCount = await RealEstateViews.count({}, order);
        resolve({
          data: defaultList,
          total: resultCount[0].count,
        });
      } else {
        //không có dữ liệu thì cũng ko báo lỗi
        resolve({
          data: [],
          total: 0,
        });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function getListByPrice(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      //TODO: Sua lai order cho dung
      let order = req.payload.order;
      let result = await RealEstateViews.find(filter, skip, limit, order);
      let resultCount = await RealEstateViews.count(filter, order);
      if (result && resultCount) {
        if (req.currentUser && req.currentUser.appUserId) {
          result = await _checkUserSavedRealEstate(result, req.currentUser.appUserId);
        }
        resolve({ data: result, total: resultCount[0].count });
        for (var i = 0; i < result.length; i++) {
          // function tăng lượt xem,
          await RealEstateFunctions.viewsRealEstate(result[i].realEstateId, result[i]);
        }
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function getListByRating(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      //TODO: Sua lai order cho dung
      let order = req.payload.order;
      let result = await RealEstateViews.find(filter, skip, limit, order);
      let resultCount = await RealEstateViews.count(filter, order);
      if (result && resultCount) {
        if (req.currentUser && req.currentUser.appUserId) {
          result = await _checkUserSavedRealEstate(result, req.currentUser.appUserId);
        }
        resolve({ data: result, total: resultCount[0].count });
        for (var i = 0; i < result.length; i++) {
          // function tăng lượt xem,
          await RealEstateFunctions.viewsRealEstate(result[i].realEstateId, result[i]);
        }
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function _checkUserSavedRealEstate(result, userId) {
  let realEstateSaved = await RealEstateSavedFunction.getRealEstateSavedByUserId(userId);
  for (let i = 0; i < result.length; i++) {
    let count = 0;
    realEstateSaved.forEach(element => {
      if (result[i].realEstateId === element.realEstateId) {
        result[i].isSaved = true;
        count++;
      }
    });
    if (count === 0) {
      result[i].isSaved = false;
    }
  }
  return result;
}

async function getListByUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      if (req.payload.filter !== undefined) {
        filter = req.payload.filter;
      }
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let searchText = req.payload.searchText;
      if (req.currentUser.appUserId === undefined) {
        resolve({ data: [], total: 0 });
      } else {
        filter.appUserId = req.currentUser.appUserId;
        let result = await RealEstateViews.customSearch(filter, undefined, undefined, skip, limit, undefined, undefined, searchText, order);
        let resultCount = await RealEstateViews.customCount(filter, undefined, undefined, undefined, searchText, order);
        if (result && resultCount) {
          if (req.currentUser && req.currentUser.appUserId) {
            result = await _checkUserSavedRealEstate(result, req.currentUser.appUserId);
          }
          resolve({ data: result, total: resultCount[0].count });
          for (var i = 0; i < result.length; i++) {
            // function tăng lượt xem,
            await RealEstateFunctions.viewsRealEstate(result[i].realEstateId, result[i]);
          }
        } else {
          resolve({ data: [], total: 0 });
        }
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
async function reviewRealEstate(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateId = req.payload.id;
      let staff = req.currentUser;
      let approveStatus = req.payload.status;
      let dataUpdate = {};
      if (staff.roleId !== 1) {
        let realEstateData = await RealEstateResourceAccess.findById(realEstateId);
        if (!realEstateData) {
          reject('error');
        }
        const isValidRole = verifyAreaPermission(req.currentUser, realEstateData);
        if (!isValidRole) {
          reject("Don't have permission");
        }
      }

      dataUpdate.approvePIC = staff.staffId;
      dataUpdate.approveStatus = approveStatus;
      if (approveStatus === 1) {
        let todayDate = new Date().toISOString();
        dataUpdate.approveDate = todayDate;
      }
      let result = await RealEstateResourceAccess.updateById(realEstateId, dataUpdate);
      let realEstateData = await RealEstateResourceAccess.findById(realEstateId);
      if (result && realEstateData) {
        const TIME_SEND = moment().format('hh:mm DD/MM/YYYY');
        if (approveStatus === -1) {
          const messageData = {
            postId: realEstateId,
            timeRefused: TIME_SEND,
          };
          handleSendMessageRealEstate(REFUSE_POST, messageData, realEstateData);
        }
        if (approveStatus === 1) {
          const messageData = {
            postId: realEstateId,
            timeApprove: TIME_SEND,
          };
          handleSendMessageRealEstate(APPROVED_POST, messageData, realEstateData);
        }
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
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
      let result = await UploadFunction.uploadMediaFile(originaldata, imageFormat, 'image_temp' + '/');
      if (result) {
        resolve(result);
      } else {
        reject('failed to upload');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function uploadVideo(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const videoData = req.payload.videoData;
      const videoFormat = req.payload.videoFormat;
      if (!videoData) {
        reject('Do not have image data');
        return;
      }
      var originaldata = Buffer.from(videoData, 'base64');
      let result = await UploadFunction.uploadMediaFile(originaldata, videoFormat, 'Video_temp' + '/');
      if (result) {
        resolve(result);
      } else {
        reject('failed to upload');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function pushNewRealEstate(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!req.currentUser.appUserId) {
        Logger.info(`user undefined`);
        reject('failed');
      }
      let dataUpdate = {};
      let todayDate = new Date();
      dataUpdate.activedDate = todayDate;
      let appUserId = req.currentUser.appUserId;
      let realEstateId = req.payload.id;
      let resultFunction = await PaymentRecordFunction.userPaytoPushNewRealEstate(appUserId, realEstateId);
      if (resultFunction !== undefined) {
        if (resultFunction === 'NOTENOUGHBALANCE') {
          reject('NOTENOUGHBALANCE');
        } else {
          let result = await RealEstateResourceAccess.updateById(realEstateId, dataUpdate);
          if (result) {
            resolve(result);
          } else {
            Logger.error(`update actived Date failed`);
            reject('failed to update');
          }
        }
      }
      Logger.error(`userPaytoPushNewRealEstate failed`);
      reject('failse');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function statisticalRealEstateByMonth(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let startMonth = req.payload.startDate;
      if (startMonth) {
        startMonth = convertMonth.FormatDate(startMonth, 'MM');
      }
      let endMonth = req.payload.endDate;
      if (endMonth) {
        endMonth = convertMonth.FormatDate(endMonth, 'MM');
      }
      let resultCount = await RealEstateViewsReport.customCount(startMonth, endMonth);
      if (resultCount && resultCount.length > 0) {
        resolve({ total: resultCount[0].count });
      } else {
        resolve({ total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

//TODO: IMplement later
async function callToRealEstateContact(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!req.currentUser.appUserId) {
        Logger.error(`user undefined`);
        reject('failed');
      }
      let appUserId = req.currentUser.appUserId;
      let realEstateId = req.payload.id;
      let result = await RealEstateResourceAccess.findById(realEstateId);
      if (result) {
        let resultPayment = await PaymentRecordResourAccess.find({
          paymentUserId: appUserId,
          paymentTargetId: realEstateId,
        });
        if (resultPayment && resultPayment.length > 0) {
          resolve({
            realEstatePhone: result.realEstatePhone,
            realEstateEmail: result.realEstateEmail,
            realEstateContacAddress: result.realEstateContacAddress,
          });
        } else {
          let resultFunction = await PaymentRecordFunction.userPaytoGetRealEstateContact(appUserId, realEstateId);
          if (resultFunction !== undefined) {
            if (resultFunction !== 'NOTENOUGHBALANCE') {
              resolve({
                realEstatePhone: result.realEstatePhone,
                realEstateEmail: result.realEstateEmail,
                realEstateContacAddress: result.realEstateContacAddress,
              });
            }
            if (resultFunction === 'NOTENOUGHBALANCE') {
              reject('NOTENOUGHBALANCE');
            }
          } else {
            Logger.error(`userPaytoGetRealEstateContact failed`);
            reject('failed');
          }
          resolve({ data: 0 });
        }
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
//TODO: IMplement later
async function requestViewDetailProject(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateId = req.payload.id;
      let result = await RealEstateResourceAccess.findById(realEstateId);
      if (result) {
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
async function exportExcel(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;
      let result = await RealEstateResourceAccess.customSearch(filter, undefined, skip, limit, startDate, endDate, searchText, order);
      if (result && result.length > 0) {
        const fileName = 'realEstate' + (new Date() - 1).toString();
        let filePath = await ExcelFunction.renderExcelFile(fileName, result, 'RealEstate');
        let url = `https://${process.env.HOST_NAME}${filePath}`;
        resolve(url);
      } else {
        resolve('Not have data');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function importRealEstateData(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let fileData = req.payload.file;
      let fileFormat = req.payload.fileFormat;

      if (!fileData) {
        Logger.error('do not have data to import');
        reject('ERR_DO_NOT_HAVE_DATA');
        return;
      }

      var originaldata = Buffer.from(fileData, 'base64');
      let newExcel = await UploadFunction.uploadMediaFile(originaldata, fileFormat, 'realestateimport/');

      if (newExcel) {
        let path = newExcel.replace(`https://${process.env.HOST_NAME}/`, '');

        const { importExcel } = require('../../../ThirdParty/Excel/ImportExcelFunction');
        let excelData = await importExcel(path);

        if (excelData === undefined) {
          Logger.error('failed to read data to import');
          reject('FAILED_TO_UPLOAD');
        } else {
          const MAX_IMPORT_PER_BATCH = 100;
          //notify to front-end
          //front-end will use this counter to display user waiting message
          if (excelData.length > MAX_IMPORT_PER_BATCH) {
            //!! IMPORTANT: do not return function here
            //if there are more than MAX_IMPORT_PER_BATCH record, we will response before function done
            resolve({
              importTotalWaiting: excelData.length,
            });
          }

          let importSuccessCount = 0;
          //if it is less than MAX_IMPORT_PER_BATCH records, let user wait until it finishes
          for (let dataCounter = 0; dataCounter < excelData.length; dataCounter++) {
            let _newRealEstateData = excelData[dataCounter];

            //delete data that we do not need to insert
            delete _newRealEstateData.createdAt;
            delete _newRealEstateData.isDeleted;
            delete _newRealEstateData.updatedAt;
            delete _newRealEstateData.activedDate;
            delete _newRealEstateData.realEstateId;

            let insertResult = await _insertNewRealEstate(_newRealEstateData);
            if (insertResult) {
              importSuccessCount++;
            }
          }

          //if data is bigger than MAX_IMPORT_PER_BATCH record, API will response before import,
          //then no need to respon here
          resolve({
            importSuccess: importSuccessCount,
            importTotal: excelData.length,
          });
        }
      } else {
        Logger.error('failed to upload file');
        reject('FAILED_TO_UPLOAD');
      }
    } catch (e) {
      Logger.error(__filename, e);
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
  hiddenById,
  getDetail,
  getListByLocation,
  getListByPrice,
  getListByRating,
  getListByUser,
  reviewRealEstate,
  uploadImage,
  uploadVideo,
  pushNewRealEstate,
  statisticalRealEstateByMonth,
  callToRealEstateContact,
  requestViewDetailProject,
  exportExcel,
  userHiddenById,
  importRealEstateData,
};
