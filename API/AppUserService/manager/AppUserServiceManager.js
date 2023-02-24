/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moment = require('moment');

const AppUsersResourceAccess = require('../resourceAccess/AppUsersResourceAccess');
const AppUserView = require('../resourceAccess/AppUserView');
const AppUsersFunctions = require('../AppUsersFunctions');
const TokenFunction = require('../../ApiUtils/token');
const Logger = require('../../../utils/logging');
const UploadFunction = require('../../Upload/UploadFunctions');
const { USER_VERIFY_INFO_STATUS, USER_VERIFY_EMAIL_STATUS, USER_VERIFY_PHONE_NUMBER_STATUS, USER_ERROR } = require('../AppUserConstant');

const { APPROVE_USER_INFO, REFUSED_USER_INFO, USER_LOCKED, USER_ACTIVE } = require('../../CustomerMessage/CustomerMessageConstant');
const { handleSendMessageUser } = require('../../CustomerMessage/CustomerMessageFunctions');

async function _registerUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      let insertResult = await AppUsersFunctions.createNewUser(userData);

      if (insertResult) {
        resolve(insertResult);
      } else {
        reject('failed');
      }
      return;
    } catch (e) {
      Logger.error(__filename, e);
      if (e === USER_ERROR.INVALID_REFER_USER) {
        reject(USER_ERROR.INVALID_REFER_USER);
      } else if ((e = USER_ERROR.DUPLICATED_USER)) {
        reject(USER_ERROR.DUPLICATED_USER);
      } else if ((e = USER_ERROR.DUPLICATED_USER_EMAIL)) {
        reject(USER_ERROR.DUPLICATED_USER_EMAIL);
      } else if ((e = USER_ERROR.DUPLICATED_USER_PHONE)) {
        reject(USER_ERROR.DUPLICATED_USER_PHONE);
      } else {
        reject('failed');
      }
    }
  });
}
async function insert(req) {
  let userData = req.payload;
  return await _registerUser(userData);
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let searchText = req.payload.searchText;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let users = await AppUsersResourceAccess.customSearch(filter, skip, limit, searchText, startDate, endDate, order);
      let usersCount = await AppUsersResourceAccess.customCount(filter, searchText, startDate, endDate, order);
      if (users && usersCount) {
        resolve({ data: users, total: usersCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function _existedUserEmail(userData) {
  if (userData.email) {
    let user = await AppUsersResourceAccess.find({ email: userData.email });
    if (user && user.length > 0) {
      return 1;
    }
  }
  return 0;
}

async function _existedUserPhoneNumber(userData) {
  if (userData.phoneNumber) {
    let user = await AppUsersResourceAccess.find({
      phoneNumber: userData.phoneNumber,
    });
    if (user && user.length > 0) {
      return 1;
    }
  }
  return 0;
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = req.payload.data;
      let appUserId = req.payload.id;
      if (await _existedUserPhoneNumber(userData)) {
        reject(USER_ERROR.DUPLICATED_USER_PHONE);
        return; //always add "return" after reject / resolve to make sure everything will break
      } else if (await _existedUserEmail(userData)) {
        reject(USER_ERROR.DUPLICATED_USER_EMAIL);
        return; //always add "return" after reject / resolve to make sure everything will break
      }

      let updateResult = await AppUsersResourceAccess.updateById(appUserId, userData);
      if (updateResult) {
        // send message to user
        if (Object.keys(userData).indexOf('active') !== -1) {
          if (userData.active === 0) {
            // làm này để cho user thông báo biết đã bị khoá còn trăn trối
            if (process.env.GOOGLE_FIREBASE_PUSH_ENABLE) {
              handleSendMessageUser(USER_LOCKED, { time: moment().format('hh:mm DD/MM/YYYY') }, appUserId, {
                isForceLogout: true,
              });
            }
            AppUsersResourceAccess.updateById(appUserId, {
              active: userData.active,
            });
          } else {
            if (process.env.GOOGLE_FIREBASE_PUSH_ENABLE) {
              handleSendMessageUser(USER_ACTIVE, null, appUserId, null);
            }
          }
        }
        resolve(updateResult);
      } else {
        reject('failed to update user');
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
      let foundUser = await AppUsersFunctions.retrieveUserDetail(req.payload.id);
      if (foundUser) {
        resolve(foundUser);
      } else {
        reject(`can not find user`);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userGetDetailById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let foundUser = await AppUsersFunctions.retrieveUserDetail(req.currentUser.appUserId);
      if (foundUser) {
        //lay so luong thong bao chua doc cua user
        await AppUsersFunctions.getUnreadNotificationCount(foundUser);

        resolve(foundUser);
      } else {
        reject('Get detail failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function registerUser(req) {
  return insert(req);
}

async function registerUserByPhone(req) {
  let userData = req.payload;

  //Coi số điện thoại là username luôn
  userData.username = req.payload.phoneNumber;
  userData.isVerifiedPhoneNumber = USER_VERIFY_PHONE_NUMBER_STATUS.IS_VERIFIED;
  return await _registerUser(userData);
}

async function loginByPhone(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let username = req.payload.phoneNumber;
      let password = req.payload.password;

      //verify credential
      let foundUser = await AppUsersFunctions.verifyUserCredentials(username, password);

      if (foundUser) {
        if (foundUser.active === 0) {
          reject('user is locked');
        }

        //lay so luong thong bao chua doc cua user
        await AppUsersFunctions.getUnreadNotificationCount(foundUser);

        await AppUsersResourceAccess.updateById(foundUser.appUserId, {
          lastActiveAt: new Date(),
        });

        if (foundUser.twoFAEnable && foundUser.twoFAEnable > 0) {
          resolve({
            appUserId: foundUser.appUserId,
            twoFAEnable: foundUser.twoFAEnable,
          });
        } else {
          resolve(foundUser);
        }
      } else {
        Logger.error(`user phone ${req.payload.phoneNumber} do not existed`);
      }

      reject('loginByPhone failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('loginByPhone error');
    }
  });
}

async function loginUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let username = req.payload.username;
      let password = req.payload.password;

      //verify credential
      let foundUser = await AppUsersFunctions.verifyUserCredentials(username, password);

      if (foundUser) {
        if (foundUser.active === 0) {
          reject('user is locked');
        }
        await AppUsersResourceAccess.updateById(foundUser.appUserId, {
          lastActiveAt: new Date(),
        });

        if (foundUser.twoFAEnable && foundUser.twoFAEnable > 0) {
          resolve({
            appUserId: foundUser.appUserId,
            twoFAEnable: foundUser.twoFAEnable,
          });
        } else {
          resolve(foundUser);
        }
      } else {
        Logger.error(`username ${username} or password ${password} is wrong`);
      }

      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function changePasswordUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let username = req.currentUser.username;
      let password = req.payload.password;
      let newPassword = req.payload.newPassword;
      //verify credential
      let foundUser = await AppUsersFunctions.verifyUserCredentials(username, password);

      if (foundUser) {
        let result = AppUsersFunctions.changeUserPassword(foundUser, newPassword);
        if (result) {
          resolve(result);
        }
      }
      reject('change user password failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function verify2FA(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await AppUsersResourceAccess.find({
        appUserId: req.payload.id,
      });
      if (users && users.length > 0) {
        let foundUser = users[0];
        if (foundUser) {
          let otpCode = req.payload.otpCode;

          let verified = AppUsersFunctions.verify2FACode(otpCode.toString(), foundUser.twoFACode);

          if (verified) {
            foundUser = await AppUsersFunctions.retrieveUserDetail(foundUser.appUserId);

            await AppUsersResourceAccess.updateById(foundUser.appUserId, {
              twoFAEnable: true,
            });
            resolve(foundUser);
          } else {
            reject('failed to verify2FA');
          }
        } else {
          reject('user is invalid to verify2FA');
        }
      } else {
        reject('user not found to verify2FA');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function _loginSocial(username, password, name, email, avatar, socialInfo) {
  //verify credential
  let foundUser = await AppUsersResourceAccess.find({
    username: username,
  });

  //if user is not found
  if (foundUser === undefined || foundUser.length < 1) {
    let newUserData = {
      username: username,
      password: password,
      firstName: name,
      userAvatar: avatar,
    };

    if (socialInfo) {
      newUserData.socialInfo = JSON.stringify(socialInfo);
    }

    let registerResult = await AppUsersFunctions.createNewUser(newUserData);

    if (!registerResult) {
      return undefined;
    }

    foundUser = await AppUsersFunctions.verifyUserCredentials(username, password);
  } else {
    foundUser = foundUser[0];
    foundUser = await AppUsersFunctions.retrieveUserDetail(foundUser.appUserId);
  }

  await AppUsersResourceAccess.updateById(foundUser.appUserId, {
    lastActiveAt: new Date(),
  });

  if (foundUser.active === 0) {
    return undefined;
  }

  if (foundUser.twoFAEnable && foundUser.twoFAEnable > 0) {
    return {
      appUserId: foundUser.appUserId,
      twoFAEnable: foundUser.twoFAEnable,
    };
  } else {
    return foundUser;
  }
}

async function loginFacebook(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.payload.facebook_id && req.payload.facebook_id !== '' && req.payload.facebook_id !== null) {
        let username = 'FB_' + req.payload.facebook_id;
        let password = req.payload.facebook_id;
        let avatar = req.payload.facebook_avatar;
        let email = req.payload.facebook_email;
        let firstName = req.payload.facebook_name;

        let foundUser = await _loginSocial(username, password, firstName, email, avatar, req.payload);
        if (foundUser) {
          if (foundUser.active === 0) {
            reject('user is locked');
          }

          //lay so luong thong bao chua doc cua user
          await AppUsersFunctions.getUnreadNotificationCount(foundUser);

          foundUser.unreadMessage = countNotification[0].count;
          resolve(foundUser);
        } else {
          reject('failed');
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

async function loginGoogle(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.payload.google_id && req.payload.google_id !== '' && req.payload.google_id !== null) {
        let username = 'GOOGLE_' + req.payload.google_id;
        let password = req.payload.google_id;
        let avatar = req.payload.google_avatar;
        let email = req.payload.google_email;
        let firstName = req.payload.google_name;

        let loginResult = await _loginSocial(username, password, firstName, email, avatar, req.payload);
        if (loginResult) {
          resolve(loginResult);
        } else {
          reject('failed');
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

async function loginApple(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.payload.apple_id && req.payload.apple_id !== '' && req.payload.apple_id !== null) {
        let username = 'APPLE_' + req.payload.apple_id;
        let password = req.payload.apple_id;
        let avatar = req.payload.apple_avatar;
        let email = req.payload.apple_email;
        let firstName = req.payload.apple_name;

        let foundUser = await _loginSocial(username, password, firstName, email, avatar, req.payload);
        if (foundUser) {
          if (foundUser.active === 0) {
            reject('user is locked');
          }
          //lay so luong thong bao chua doc cua user
          await AppUsersFunctions.getUnreadNotificationCount(foundUser);

          resolve(foundUser);
        } else {
          reject('failed');
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

async function loginZalo(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.payload.zalo_id && req.payload.zalo_id !== '' && req.payload.zalo_id !== null) {
        let username = 'ZALO_' + req.payload.zalo_id;
        let password = req.payload.zalo_id;
        let avatar = req.payload.zalo_avatar;
        let email = req.payload.zalo_email;
        let firstName = req.payload.zalo_name;

        let foundUser = await _loginSocial(username, password, firstName, email, avatar, req.payload);
        if (foundUser) {
          if (foundUser.active === 0) {
            reject('user is locked');
          }

          //lay so luong thong bao chua doc cua user
          await AppUsersFunctions.getUnreadNotificationCount(foundUser);

          resolve(foundUser);
        } else {
          reject('failed');
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

async function userUpdateInfo(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = req.payload.data;
      let id = req.payload.id;

      if (await _existedUserPhoneNumber(userData)) {
        reject(USER_ERROR.DUPLICATED_USER_PHONE);
        return; //always add "return" after reject / resolve to make sure everything will break
      } else if (await _existedUserEmail(userData)) {
        reject(USER_ERROR.DUPLICATED_USER_EMAIL);
        return; //always add "return" after reject / resolve to make sure everything will break
      }

      if (userData.phoneNumber !== null && userData.phoneNumber !== undefined) {
        userData.isVerifiedPhoneNumber = USER_VERIFY_PHONE_NUMBER_STATUS.IS_VERIFIED;
      }
      let updateResult = await AppUsersResourceAccess.updateById(id, userData);
      if (updateResult) {
        const foundUser = await AppUsersFunctions.retrieveUserDetail(req.payload.id);
        if (foundUser) {
          resolve(foundUser);
        } else {
          Logger.error(`userUpdateInfo can not retriveUserDetail`);
          reject('can not find user to update');
        }
      } else {
        Logger.error('userUpdateInfo failed to update user');
        reject('failed to update user');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
async function getUsersByMonth(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let start = new Date(startDate);
      let end = new Date(endDate);
      var diff = (end - start) / 1000 / 60 / 60 / 24;
      if (diff > 365) {
        reject('start date and end date is so far');
      }
      let staff = req.currentUser;
      let filter = {};
      if (staff.roleId && staff.roleId !== 1) {
        filter.areaProvinceId = staff.areaProvinceId;
        filter.areaDistrictId = staff.areaDistrictId;
        filter.areaWardId = staff.areaWardId;
      }
      var users = await AppUserView.countUserMonthByYear(filter, startDate, endDate);
      end = new Date(moment(endDate).endOf('month').format('YYYY-MM-DD'));
      while (start <= end) {
        let year = start.getFullYear();
        let month = start.getMonth() + 1;
        let count = 0;
        users.forEach(item => {
          if (item.createMonth == month && item.createYear == year) {
            count++;
          }
        });
        if (count == 0) {
          users.push({
            createMonth: month,
            createYear: year,
            countCreateMonth: 0,
          });
        }
        start.setMonth(month);
      }
      for (let i = 0; i < users.length - 1; i++) {
        for (let j = i + 1; j < users.length; j++) {
          if (users[i].createYear > users[j].createYear) {
            let temp = users[i];
            users[i] = users[j];
            users[j] = temp;
          } else if (users[i].createMonth > users[j].createMonth && users[i].createYear == users[j].createYear) {
            let temp = users[i];
            users[i] = users[j];
            users[j] = temp;
          }
        }
      }
      resolve(users);
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function uploadBeforeIdentityCard(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const id = req.payload.id;
      const imageData = req.payload.imageData;
      const imageFormat = req.payload.imageFormat;
      if (!imageData) {
        reject('Do not have image data');
        return;
      }
      var originaldata = Buffer.from(imageData, 'base64');
      let image = await UploadFunction.uploadMediaFile(originaldata, imageFormat, 'AppUser/IdentityCard/' + id.toString() + '/');
      if (image) {
        let updateResult = await AppUsersResourceAccess.updateById(id, {
          imageBeforeIdentityCard: image,
        });
        if (updateResult) {
          resolve(image);
        } else {
          reject('failed to upload');
        }
      } else {
        reject('failed to upload');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function uploadAfterIdentityCard(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const id = req.payload.id;
      const imageData = req.payload.imageData;
      const imageFormat = req.payload.imageFormat;
      if (!imageData) {
        reject('Do not have image data');
        return;
      }
      var originaldata = Buffer.from(imageData, 'base64');
      let image = await UploadFunction.uploadMediaFile(originaldata, imageFormat, 'AppUser/IdentityCard/' + id.toString() + '/');
      if (image) {
        let updateResult = await AppUsersResourceAccess.updateById(id, {
          imageAfterIdentityCard: image,
        });
        if (updateResult) {
          resolve(image);
        } else {
          reject('failed to upload');
        }
      } else {
        reject('failed to upload');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function submitIdentityCardImage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.payload.id;
      let updateResult = await AppUsersResourceAccess.updateById(appUserId, {
        isVerified: USER_VERIFY_INFO_STATUS.VERIFYING,
      });
      if (updateResult) {
        resolve(updateResult);
      } else {
        resolve('failed to submit indentity card');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
async function verifyInfoUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.payload.id;
      const staff = req.currentUser;
      if (staff.roleId && staff.roleId !== 1) {
        const foundUser = await AppUsersResourceAccess.findById(appUserId);
        if (!foundUser) reject('error');
        const verifyArea = verifyAreaPermission(staff, foundUser);
        if (!verifyArea) reject("Don't have permission");
      }

      let updateResult = await AppUsersResourceAccess.updateById(appUserId, {
        isVerified: USER_VERIFY_INFO_STATUS.IS_VERIFIED,
        verifiedAt: new Date(),
      });
      if (updateResult) {
        if (process.env.GOOGLE_FIREBASE_PUSH_ENABLE) {
          const messageData = {
            time: moment(new Date()).format('hh:mm DD/MM/YYYY'),
          };
          handleSendMessageUser(APPROVE_USER_INFO, messageData, appUserId, {
            validated: true,
          });
        }
        resolve(updateResult);
      } else {
        resolve('failed to verify info user');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function rejectInfoUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.payload.id;
      const staff = req.currentUser;
      if (staff.roleId && staff.roleId !== 1) {
        const foundUser = await AppUsersResourceAccess.findById(appUserId);
        if (!foundUser) reject('error');
        const verifyArea = verifyAreaPermission(staff, foundUser);
        if (!verifyArea) reject("Don't have permission");
      }

      let updateResult = await AppUsersResourceAccess.updateById(appUserId, {
        isVerified: USER_VERIFY_INFO_STATUS.REJECTED,
        verifiedAt: new Date(),
      });
      if (updateResult) {
        if (process.env.GOOGLE_FIREBASE_PUSH_ENABLE) {
          const messageData = {
            time: moment(new Date()).format('hh:mm DD/MM/YYYY'),
          };
          handleSendMessageUser(REFUSED_USER_INFO, messageData, appUserId, {
            validated: true,
          });
        }
        resolve(updateResult);
      } else {
        resolve('failed to reject info user');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function uploadAvatar(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const id = req.payload.id;
      const imageData = req.payload.imageData;
      const imageFormat = req.payload.imageFormat;
      if (!imageData) {
        reject('Do not have image data');
        return;
      }
      var originaldata = Buffer.from(imageData, 'base64');
      let image = await UploadFunction.uploadMediaFile(originaldata, imageFormat, 'AppUser/Avatar/' + id.toString() + '/');
      if (image) {
        var result = await AppUsersResourceAccess.updateById(id, {
          userAvatar: image,
        });
        if (result) {
          resolve(image);
        } else {
          reject('failed to upload');
        }
      } else {
        reject('failed to upload');
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
      let order = req.payload.order;
      const staff = req.currentUser;
      if (staff.roleId && staff.roleId !== 1) {
        filter.areaProvinceId = staff.areaProvinceId;
        filter.areaDistrictId = staff.areaDistrictId;
        filter.areaWardId = staff.areaWardId;
      }
      let users = await AppUsersResourceAccess.customSearch(filter, undefined, undefined, order);
      if (users && users.length > 0) {
        const fileName = 'users' + (new Date() - 1).toString();
        let filePath = await ExcelFunction.renderExcelFile(fileName, users, 'Users');
        let url = `https://${process.env.HOST_NAME}/${filePath}`;
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

//TODO Implement later
async function forgotPassword(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let email = req.payload.email;
      let result = await AppUsersResourceAccess.find({ email: email });
      if (result && result.length > 0) {
        let userToken = await TokenFunction.createToken(result[0]);
        await AppUsersFunctions.sendEmailToResetPassword(result[0], userToken, email);
        resolve('success');
      } else {
        //cho dù email không tồn tại thì cũng không cần cho user biết
        //nó giúp bảo mật hơn, không dò được trong hệ thống mình có email này hay chưa
        //chỉ cần ghi log để trace là được
        console.error(`email ${email} do not existed in system`);
        resolve('success');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function forgotPasswordOTP(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let phoneNumber = req.payload.phoneNumber;
      let newPassword = req.payload.password;
      let user = await AppUsersResourceAccess.find({ username: phoneNumber });
      if (user && user.length > 0) {
        user = user[0];
        let result = await AppUsersFunctions.changeUserPassword(user, newPassword);
        if (result) {
          resolve('reset password success');
        } else {
          reject('failed');
        }
      } else {
        //cho dù email không tồn tại thì cũng không cần cho user biết
        //nó giúp bảo mật hơn, không dò được trong hệ thống mình có email này hay chưa
        //chỉ cần ghi log để trace là được
        console.error(`username ${phoneNumber} do not existed in system`);
        resolve('success');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function resetPasswordBaseOnUserToken(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let newPassword = req.payload.password;
      let user = req.currentUser;
      if (user === undefined || user.appUserId === null) {
        reject('invalid token');
      } else {
        let result = await AppUsersFunctions.changeUserPassword(user, newPassword);
        if (result) {
          resolve('reset password success');
        } else {
          reject('failed');
        }
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function adminResetPassword(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userId = req.payload.id;
      let user = await AppUsersResourceAccess.findById(userId);
      const staff = req.currentUser;
      if (staff.roleId && staff.roleId !== 1) {
        if (!user) reject('error');
        const verifyArea = verifyAreaPermission(staff, user);
        if (!verifyArea) reject("Don't have permission");
      }
      if (user) {
        let userToken = await TokenFunction.createToken(user);
        await AppUsersFunctions.sendEmailToResetPassword(user, userToken, user.email);
        resolve('success');
      } else {
        console.error(`user is not existed in system`);
        resolve('success');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function verifyEmailUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = req.currentUser;
      if (user === undefined || user.appUserId === null) {
        reject('invalid token');
      } else {
        let result = await AppUsersResourceAccess.updateById(user.appUserId, {
          isVerifiedEmail: USER_VERIFY_EMAIL_STATUS.IS_VERIFIED,
        });
        if (result) {
          const messageData = {
            time: moment(new Date()).format('hh:mm DD/MM/YYYY'),
          };

          if (process.env.GOOGLE_FIREBASE_PUSH_ENABLE) {
            handleSendMessageUser(APPROVE_USER_INFO, messageData, user.appUserId, { validated: true });
          }

          resolve('Verify email success');
        } else {
          reject('failed');
        }
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function sendMailToVerifyEmail(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let email = req.payload.email;
      let userId = req.currentUser.appUserId;
      let result = await AppUsersResourceAccess.find({
        appUserId: userId,
        email: email,
      });
      if (result && result.length > 0) {
        let userToken = await TokenFunction.createToken(result[0]);
        await AppUsersFunctions.sendEmailToVerifyEmail(result[0], userToken, email);
        resolve('success');
      } else {
        console.error(`email ${email} do not existed in system`);
        resolve('success');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function adminChangePasswordUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.payload.id;
      let newPassword = req.payload.password;
      let foundUser = await AppUsersResourceAccess.find(
        {
          appUserId: appUserId,
        },
        0,
        1,
      );

      if (foundUser && foundUser.length > 0) {
        let result = await AppUsersFunctions.changeUserPassword(foundUser[0], newPassword);
        if (result) {
          resolve(result);
        }
      }
      reject('change user password failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function adminChangeSecondaryPasswordUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.payload.id;
      let newPassword = req.payload.password;
      let foundUser = await AppUsersResourceAccess.find(
        {
          appUserId: appUserId,
        },
        0,
        1,
      );

      if (foundUser && foundUser.length > 0) {
        let result = await AppUsersFunctions.changeUserSecondaryPassword(foundUser[0], newPassword);
        if (result) {
          resolve(result);
        }
      }
      reject('change user password failed');
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
  registerUser,
  loginUser,
  changePasswordUser,
  verify2FA,
  loginFacebook,
  loginGoogle,
  loginZalo,
  loginApple,
  userUpdateInfo,
  registerUserByPhone,
  loginByPhone,
  getUsersByMonth,
  uploadBeforeIdentityCard,
  uploadAfterIdentityCard,
  submitIdentityCardImage,
  verifyInfoUser,
  rejectInfoUser,
  uploadAvatar,
  exportExcel,
  forgotPassword,
  verifyEmailUser,
  resetPasswordBaseOnUserToken,
  adminResetPassword,
  userGetDetailById,
  sendMailToVerifyEmail,
  forgotPasswordOTP,
  adminChangePasswordUser,
  adminChangeSecondaryPasswordUser,
};
