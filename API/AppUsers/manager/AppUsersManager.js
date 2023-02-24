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
const utilitiesFunction = require('../../ApiUtils/utilFunctions');
const Logger = require('../../../utils/logging');
const UploadFunction = require('../../Upload/UploadFunctions');
const { ERROR } = require('../../Common/CommonConstant');
const WalletResourceAccess = require('../../Wallet/resourceAccess/WalletResourceAccess');

const { USER_VERIFY_INFO_STATUS, USER_VERIFY_EMAIL_STATUS, USER_VERIFY_PHONE_NUMBER_STATUS, USER_ERROR } = require('../AppUserConstant');
const { confirmOTPById } = require('../../OTPMessage/OTPMessageFunction');

async function _storeUserIp(req, appUserId) {
  //store IP & last login
  const requestIp = require('request-ip');
  const clientIp = requestIp.getClientIp(req);
  let lastLogin = new Date().toISOString();
  await AppUsersResourceAccess.updateById(appUserId, {
    lastActiveAt: lastLogin,
    ipAddress: clientIp,
  });
}

async function _registerUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      let newUser = await AppUsersFunctions.createNewUser(userData);
      if (newUser) {
        //tao vi cho user
        const WalletFunction = require('../../Wallet/WalletFunctions');
        await WalletFunction.createWalletForUser(newUser.appUserId);
        resolve(newUser);
      } else {
        console.error(`error AppUserManage can not registerUser: ${ERROR}`);
        reject('failed');
      }
      return;
    } catch (e) {
      Logger.error(__filename, e);
      if (e === USER_ERROR.INVALID_REFER_USER) {
        console.error(`error AppUserManage can not registerUser: ${USER_ERROR.INVALID_REFER_USER}`);
        reject(USER_ERROR.INVALID_REFER_USER);
      } else if (e === USER_ERROR.DUPLICATED_USER) {
        console.error(`error AppUserManage can not registerUser: ${USER_ERROR.DUPLICATED_USER}`);
        reject(USER_ERROR.DUPLICATED_USER);
      } else if (e === USER_ERROR.DUPLICATED_USER_EMAIL) {
        console.error(`error AppUserManage can not registerUser: ${USER_ERROR.DUPLICATED_USER_EMAIL}`);
        reject(USER_ERROR.DUPLICATED_USER_EMAIL);
      } else if (e === USER_ERROR.DUPLICATED_USER_PHONE) {
        console.error(`error AppUserManage can not registerUser: ${USER_ERROR.DUPLICATED_USER_PHONE}`);
        reject(USER_ERROR.DUPLICATED_USER_PHONE);
      } else if (e === USER_ERROR.REFER_USER_NOT_FOUND) {
        console.error(`error AppUserManage can not registerUser: ${USER_ERROR.REFER_USER_NOT_FOUND}`);
        reject(USER_ERROR.REFER_USER_NOT_FOUND);
      } else {
        console.error(`error AppUserManage can not registerUser: ${ERROR}`);
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

      let users = await AppUserView.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      if (users && users.length > 0) {
        for (let user of users) {
          let wallets = await WalletResourceAccess.find({ appUserId: user.appUserId });
          user.wallets = wallets;
        }
        let usersCount = await AppUserView.customCount(filter, skip, limit, startDate, endDate, searchText, order);
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
      return user[0];
    }
  }
  return undefined;
}

async function _existedUserPhoneNumber(userData) {
  if (userData.phoneNumber) {
    let user = await AppUsersResourceAccess.find({ phoneNumber: userData.phoneNumber });
    if (user && user.length > 0) {
      return user[0];
    }
  }
  return undefined;
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = req.payload.data;
      let appUserId = req.payload.id;

      const existedPhoneUser = await _existedUserPhoneNumber(userData);
      if (existedPhoneUser) {
        if (existedPhoneUser.appUserId !== appUserId) {
          console.error(`error ${USER_ERROR.DUPLICATED_USER_PHONE} updateById failed`);
          reject(USER_ERROR.DUPLICATED_USER_PHONE);
          return; //always add "return" after reject / resolve to make sure everything will break
        }
      }

      const existedEmailUser = await _existedUserEmail(userData);
      if (existedEmailUser) {
        if (existedEmailUser.appUserId !== appUserId) {
          console.error(`error ${USER_ERROR.DUPLICATED_USER_EMAIL} updateById failed`);
          reject(USER_ERROR.DUPLICATED_USER_EMAIL);
          return; //always add "return" after reject / resolve to make sure everything will break
        }
      }

      let updateResult = await AppUsersResourceAccess.updateById(appUserId, userData);
      if (updateResult) {
        // send message to user
        if (Object.keys(userData).indexOf('active') !== -1) {
          if (userData.active === 0) {
            // làm này để cho user thông báo biết đã bị khoá còn trăn trối
            if (process.env.GOOGLE_FIREBASE_PUSH_ENABLE) {
              const { APPROVE_USER_INFO, REFUSED_USER_INFO, USER_LOCKED, USER_ACTIVE } = require('../../CustomerMessage/CustomerMessageConstant');
              const { handleSendMessageUser } = require('../../CustomerMessage/CustomerMessageFunctions');
              handleSendMessageUser(USER_LOCKED, { time: moment().format('hh:mm DD/MM/YYYY') }, appUserId, {
                isForceLogout: true,
              });
            }
            AppUsersResourceAccess.updateById(appUserId, {
              active: userData.active,
            });
          } else {
            if (process.env.GOOGLE_FIREBASE_PUSH_ENABLE) {
              const { APPROVE_USER_INFO, REFUSED_USER_INFO, USER_LOCKED, USER_ACTIVE } = require('../../CustomerMessage/CustomerMessageConstant');
              const { handleSendMessageUser } = require('../../CustomerMessage/CustomerMessageFunctions');
              handleSendMessageUser(USER_ACTIVE, null, appUserId, null);
            }
          }
        }
        resolve(updateResult);
      } else {
        console.error(`error: failed to update user id ${appUserId}`);
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
        // lay thong tin giao dich
        await AppUsersFunctions.retrieveUserTransaction(foundUser);
        resolve(foundUser);
      } else {
        console.error(`error can not find user by id:${req.payload.id}`);
        reject(`can not find user`);
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
      let appUserId = req.payload.id;

      let result = await AppUsersResourceAccess.deleteById(appUserId);
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
async function userGetDetailById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let foundUser = await AppUsersFunctions.retrieveUserDetail(req.currentUser.appUserId);
      if (foundUser) {
        //lay so luong thong bao chua doc cua user
        await AppUsersFunctions.getUnreadNotificationCount(foundUser);

        //lay so luong giao dich & so tien da rut cua user
        //lay thong tin giao dich
        // await AppUsersFunctions.retrieveUserTransaction(foundUser);

        resolve(foundUser);
      } else {
        console.error(`error get detail by id ${req.currentUser.appUserId} failed`);
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
  //Lưu họ và tên vào hết firstName
  if (userData.fullName) {
    userData.firstName = userData.fullName;
    //loại bỏ field fullName, để ko bị lỗi DUPLICATED_USER
    delete userData.fullName;
  }
  //Coi số điện thoại là username luôn
  userData.username = req.payload.phoneNumber;
  userData.isVerifiedPhoneNumber = USER_VERIFY_PHONE_NUMBER_STATUS.IS_VERIFIED;
  return await _registerUser(userData);
}

async function registerUserByEmail(req) {
  let userData = req.payload;

  //Coi số điện thoại là username luôn
  userData.username = req.payload.email;

  return await _registerUser(userData);
}

async function _login(username, password) {
  //verify credential
  let foundUser = await AppUsersFunctions.verifyUserCredentials(username, password);

  if (foundUser) {
    if (foundUser.active === 0) {
      throw USER_ERROR.USER_LOCKED;
    }
    // if (foundUser.isVerifiedPhoneNumber !== USER_VERIFY_PHONE_NUMBER_STATUS.IS_VERIFIED) {
    //   throw USER_ERROR.NOT_VERIFIED_PHONE;
    // }

    //lay so luong thong bao chua doc cua user
    await AppUsersFunctions.getUnreadNotificationCount(foundUser);

    await AppUsersResourceAccess.updateById(foundUser.appUserId, {
      lastActiveAt: new Date(),
    });

    if (foundUser.twoFAEnable && foundUser.twoFAEnable > 0) {
      return {
        appUserId: foundUser.appUserId,
        twoFAEnable: foundUser.twoFAEnable,
      };
    } else {
      return foundUser;
    }
  }
}

async function loginByPhone(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let username = req.payload.phoneNumber;
      let password = req.payload.password;

      let foundUser = await _login(username, password);
      if (foundUser) {
        _storeUserIp(req, foundUser.appUserId);
        resolve(foundUser);
      } else {
        console.error(`error AppUserManage loginByPhone: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('loginByPhone error');
    }
  });
}
async function loginByToken(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let token = req.payload.token;
      let _userData = TokenFunction.decodeToken(token);

      //invalid token
      if (_userData === undefined) {
        Logger.error(`invalid token`);
        reject('INVALID_TOKEN');
        return;
      }

      let foundUser = await AppUsersFunctions.retrieveUserDetail(_userData.appUserId);

      if (foundUser) {
        _storeUserIp(req, foundUser.appUserId);

        resolve(foundUser);
      } else {
        console.error(`error AppUserManage loginByToken: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('loginByToken error');
    }
  });
}
async function loginByEmail(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let username = req.payload.email;
      let password = req.payload.password;

      let foundUser = await _login(username, password);
      if (foundUser && foundUser.isVerifiedEmail !== USER_VERIFY_EMAIL_STATUS.IS_VERIFIED) {
        await _sendOTPToUserEmail(foundUser);
        reject(USER_ERROR.NOT_VERIFIED_EMAIL);
      } else {
        if (foundUser) {
          _storeUserIp(req, foundUser.appUserId);
          resolve(foundUser);
        } else {
          console.error(`error AppUserManage loginByEmail: ${ERROR}`);
          reject('failed');
        }
      }
    } catch (e) {
      Logger.error(__filename, e);
      if (e === USER_ERROR.NOT_VERIFIED_EMAIL) {
        console.error(`error AppUserManage loginByEmail: ${USER_ERROR.NOT_VERIFIED_EMAIL}`);
        reject(USER_ERROR.NOT_VERIFIED_EMAIL);
      } else if (e === USER_ERROR.DUPLICATED_USER) {
        console.error(`error AppUserManage loginByEmail: ${USER_ERROR.DUPLICATED_USER}`);
        reject(USER_ERROR.DUPLICATED_USER);
      } else if (e === USER_ERROR.DUPLICATED_USER_EMAIL) {
        console.error(`error AppUserManage loginByEmail: ${USER_ERROR.DUPLICATED_USER_EMAIL}`);
        reject(USER_ERROR.DUPLICATED_USER_EMAIL);
      } else if (e === USER_ERROR.DUPLICATED_USER_PHONE) {
        console.error(`error AppUserManage loginByEmail: ${USER_ERROR.DUPLICATED_USER_PHONE}`);
        reject(USER_ERROR.DUPLICATED_USER_PHONE);
      } else {
        console.error(`error AppUserManage loginByEmail: ${ERROR}`);
        reject('failed');
      }
    }
  });
}

async function loginUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let username = req.payload.username;
      let password = req.payload.password;

      let foundUser = await _login(username, password);
      if (foundUser) {
        _storeUserIp(req, foundUser.appUserId);
        // console.log(foundUser)
        resolve(foundUser); // resp trả về
      } else {
        console.error(`error login user: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      if (e === USER_ERROR.INVALID_REFER_USER) {
        console.error(`error login user: ${USER_ERROR.INVALID_REFER_USER}`);
        reject(USER_ERROR.INVALID_REFER_USER);
      } else if (e === USER_ERROR.USER_LOCKED) {
        console.error(`error login user: ${USER_ERROR.USER_LOCKED}`);
        reject(USER_ERROR.USER_LOCKED);
      } else {
        console.error(`error login user: ${ERROR}`);
        reject('failed');
      }
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
          return; //make sure everything stop
        }
      }
      console.error(`error change password for user: ${username}`);
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
            console.error(`error verify2FA`);
            reject('failed to verify2FA');
          }
        } else {
          console.error(`error user is invalid to verify2FA with AppUserId ${req.payload.id}`);
          reject('user is invalid to verify2FA');
        }
      } else {
        console.error(`error user not found to verify2FA with AppUserId ${req.payload.id}`);
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

    let newUser = await _registerUser(newUserData);

    if (!newUser) {
      return undefined;
    }

    foundUser = newUser;
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
          _storeUserIp(req, foundUser.appUserId);
          if (foundUser.active === 0) {
            reject('user is locked');
            return;
          }

          //lay so luong thong bao chua doc cua user
          await AppUsersFunctions.getUnreadNotificationCount(foundUser);

          resolve(foundUser);
        } else {
          console.error(`error loginFacebook: ${ERROR}`);
          reject('failed');
        }
      } else {
        console.error(`error loginFacebook: ${ERROR}`);
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
          _storeUserIp(req, foundUser.appUserId);
          if (foundUser.active === 0) {
            reject('user is locked');
            return;
          }
          resolve(loginResult);
        } else {
          console.error(`error loginGoogle: ${ERROR}`);
          reject('failed');
        }
      } else {
        console.error(`error loginGoogle: ${ERROR}`);
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
          _storeUserIp(req, foundUser.appUserId);
          if (foundUser.active === 0) {
            reject('user is locked');
          }
          //lay so luong thong bao chua doc cua user
          await AppUsersFunctions.getUnreadNotificationCount(foundUser);

          resolve(foundUser);
        } else {
          console.error(`error loginApple: ${ERROR}`);
          reject('failed');
        }
      } else {
        console.error(`error loginApple: ${ERROR}`);
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
          _storeUserIp(req, foundUser.appUserId);
          if (foundUser.active === 0) {
            reject('user is locked');
          }

          //lay so luong thong bao chua doc cua user
          await AppUsersFunctions.getUnreadNotificationCount(foundUser);

          resolve(foundUser);
        } else {
          console.error(`error loginZalo: ${ERROR}`);
          reject('failed');
        }
      } else {
        console.error(`error loginZalo: ${ERROR}`);
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

      const existedPhoneUser = await _existedUserPhoneNumber(userData);
      if (existedPhoneUser) {
        if (existedPhoneUser.appUserId !== id) {
          reject(USER_ERROR.DUPLICATED_USER_PHONE);
          return; //always add "return" after reject / resolve to make sure everything will break
        }
      }

      const existedEmailUser = await _existedUserEmail(userData);
      if (existedEmailUser) {
        if (existedEmailUser.appUserId !== id) {
          reject(USER_ERROR.DUPLICATED_USER_EMAIL);
          return; //always add "return" after reject / resolve to make sure everything will break
        }
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
      let filter = {};

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
          console.error(`error upload Before Identity Card`);
          reject('failed to upload');
        }
      } else {
        console.error(`error upload Before Identity Card`);
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
          console.error(`error upload After Identity Card`);
          reject('failed to upload');
        }
      } else {
        console.error(`error upload After Identity Card`);
        reject('failed to upload');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userSubmitIdentity(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.currentUser.appUserId;
      let updateResult = await AppUsersResourceAccess.updateById(appUserId, {
        isVerified: USER_VERIFY_INFO_STATUS.VERIFYING,
      });
      if (updateResult) {
        resolve(updateResult);
      } else {
        console.error(`error AppUserManager userSubmitIdentity with appUserId ${appUserId}: ${ERROR}`);
        reject('failed');
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
      const foundUser = await AppUsersResourceAccess.findById(appUserId);
      if (!foundUser) {
        reject('error');
        return; //to make sure everything stop
      }

      // if (staff.staffRoleId && staff.staffRoleId !== 1) {
      //   const verifyArea = verifyAreaPermission(staff, foundUser);
      //   if (!verifyArea) {
      //     reject("Don't have permission");
      //     return; //to make sure everything stop
      //   }
      // }

      let updateResult = await AppUsersResourceAccess.updateById(appUserId, {
        isVerified: USER_VERIFY_INFO_STATUS.IS_VERIFIED,
        verifiedAt: new Date(),
      });
      if (updateResult) {
        //thuong khi user KYC thanh cong
        const AppuserRewardFunctions = require('../AppUsersReferralRewardFunctions');
        await AppuserRewardFunctions.rewardForVerifiedInfo(appUserId, foundUser.referUserId);
        await AppuserRewardFunctions.rewardByTotalReferalUser(foundUser.referUserId);

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
        console.error(`error to verify info user`);
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
      if (staff.staffRoleId && staff.staffRoleId !== 1) {
        const foundUser = await AppUsersResourceAccess.findById(appUserId);
        if (!foundUser) reject('error');
        const verifyArea = verifyAreaPermission(staff, foundUser);
        if (!verifyArea) reject("Don't have permission");
      }

      let updatedData = {
        isVerified: USER_VERIFY_INFO_STATUS.REJECTED,
        verifiedAt: new Date(),
      };

      let appUserNote = req.payload.appUserNote;
      if (appUserNote) {
        updatedData.appUserNote = appUserNote;
      }
      let updateResult = await AppUsersResourceAccess.updateById(appUserId, updatedData);
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
        console.error(`error to reject info user`);
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
          console.error(`error upload Avatar`);
          reject('failed to upload');
        }
      } else {
        console.error(`error upload Avatar`);
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
      if (staff.staffRoleId && staff.staffRoleId !== 1) {
        filter.areaProvinceId = staff.areaProvinceId;
        filter.areaDistrictId = staff.areaDistrictId;
        filter.areaWardId = staff.areaWardId;
      }
      let users = await AppUsersResourceAccess.customSearch(filter, undefined, undefined, undefined, undefined, undefined, order);
      if (users && users.length > 0) {
        const fileName = 'users' + (new Date() - 1).toString();
        let filePath = await ExcelFunction.renderExcelFile(fileName, users, 'Users');
        let url = `https://${process.env.HOST_NAME}/${filePath}`;
        resolve(url);
      } else {
        console.error(`error not have data`);
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
          console.error(`error AppUserManager forgotPasswordOTP with phoneNumber ${phoneNumber}: ${ERROR}`);
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

async function forgotPasswordSMSOTP(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let phoneNumber = req.payload.phoneNumber;
      let newPassword = req.payload.newPassword;
      let otp = req.payload.otpCode;
      let user = await AppUsersResourceAccess.find({ username: phoneNumber });
      if (user && user.length > 0) {
        user = user[0];
        let confirmResult = await confirmOTPById(phoneNumber, otp);
        if (!confirmResult) {
          return reject('otp confirm failed');
        }
        let result = await AppUsersFunctions.changeUserPassword(user, newPassword);
        if (result) {
          resolve('reset password success');
        } else {
          console.error(`error AppUserManager forgotPasswordOTP with phoneNumber ${phoneNumber}: ${ERROR}`);
          reject('failed');
        }
      } else {
        //cho dù email không tồn tại thì cũng không cần cho user biết
        //nó giúp bảo mật hơn, không dò được trong hệ thống mình có email này hay chưa
        //chỉ cần ghi log để trace là được
        console.error(`username ${phoneNumber} do not existed in system`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

// forgotPasswordEmailOTP
async function forgotPasswordEmailOTP(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let email = req.payload.email;
      let newPassword = req.payload.newPassword;
      let otp = req.payload.otpCode;
      let user = await AppUsersResourceAccess.find({ username: email });
      if (user && user.length > 0) {
        user = user[0];
        let confirmResult = await confirmOTPById(email, otp);
        if (!confirmResult) {
          return reject('otp confirm failed');
        }
        let result = await AppUsersFunctions.changeUserPassword(user, newPassword);
        if (result) {
          resolve('reset password success');
        } else {
          console.error(`error AppUserManager forgotPasswordOTP with email ${email}: ${ERROR}`);
          return reject('failed');
        }
      } else {
        //cho dù email không tồn tại thì cũng không cần cho user biết
        //nó giúp bảo mật hơn, không dò được trong hệ thống mình có email này hay chưa
        //chỉ cần ghi log để trace là được
        console.error(`username ${email} do not existed in system`);
        return reject('failed');
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
          console.error(`error AppUserManager resetPasswordBaseOnUserToken with appUserId ${user.appUserId}: ${ERROR}`);
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
      if (staff.staffRoleId && staff.staffRoleId !== 1) {
        if (!user) reject('error');
        const verifyArea = verifyAreaPermission(staff, user);
        if (!verifyArea) reject("Don't have permission");
      }
      if (user) {
        let userToken = await TokenFunction.createToken(user);
        await AppUsersFunctions.sendEmailToResetPassword(user, userToken, user.email);
        resolve('success');
      } else {
        console.error(`user: ${userId} is not existed in system`);
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
            const { APPROVE_USER_INFO, REFUSED_USER_INFO, USER_LOCKED, USER_ACTIVE } = require('../../CustomerMessage/CustomerMessageConstant');
            const { handleSendMessageUser } = require('../../CustomerMessage/CustomerMessageFunctions');
            handleSendMessageUser(APPROVE_USER_INFO, messageData, user.appUserId, { validated: true });
          }

          resolve('Verify email success');
        } else {
          console.error(`error AppUserManager verifyEmailUser with appUserId ${user.appUserId}: ${ERROR}`);
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
      } else {
        reject('change user password failed');
      }
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
      console.error(`error admin Change Secondary Password User: ${appUserId}`);
      reject('change user password failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userChangeSecondaryPassword(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.currentUser.appUserId;
      let newPassword = req.payload.password;
      let oldPassword = req.payload.oldPassword;
      let foundUser = await AppUsersResourceAccess.find(
        {
          appUserId: appUserId,
        },
        0,
        1,
      );

      if (foundUser && foundUser.length > 0) {
        let result = await AppUsersFunctions.changeUserSecondaryPassword(foundUser[0], newPassword, oldPassword);
        if (result) {
          resolve(result);
          return; //make sure everything stop
        }
      }
      console.error(`error user Change Secondary Password User: ${appUserId}`);
      reject('change user password failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userViewsListMembership(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      filter.appUserId = req.currentUser.appUserId;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let searchText = req.payload.searchText;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let result = await AppUserView.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      if (result && result.length > 0) {
        let resultCount = await AppUserView.customCount(filter, skip, limit, searchText, startDate, endDate, order);
        if (resultCount) {
          resolve({ data: result, total: resultCount[0].count });
        } else {
          resolve({ data: result, total: 0 });
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
async function findAllUsersFollowingReferId(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let searchText = req.payload.searchText;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let dataUser = await AppUserView.findAllUsersFollowingReferId(filter, skip, limit, startDate, endDate, searchText, order);
      if (dataUser && dataUser.length > 0) {
        let count = await AppUserView.countAllUsersByReferId(filter, startDate, endDate, searchText, order);

        resolve({
          data: dataUser,
          count: count[0].count,
        });
      } else {
        resolve({
          data: [],
          count: 0,
        });
      }
    } catch (error) {
      Logger.error('Find all users have branch failed', error);
      reject('failed');
    }
  });
}
async function userCheckExistingAccount(req) {
  return new Promise(async (resolve, reject) => {
    try {
      //kiem tra username, email, phonenumber, companyName la duy nhat
      let username = req.payload.username;
      let email = req.payload.email;
      let phoneNumber = req.payload.phoneNumber;
      let companyName = req.payload.companyName;

      if (username && username !== null) {
        const foundUser = await AppUsersResourceAccess.find(
          {
            username: username,
          },
          0,
          1,
        );
        if (foundUser && foundUser.length > 0) {
          reject(USER_ERROR.DUPLICATED_USER);
          return; //to make sure everything stop
        }
      } else if (email && email !== null) {
        const foundUser = await AppUsersResourceAccess.find(
          {
            email: email,
          },
          0,
          1,
        );
        if (foundUser && foundUser.length > 0) {
          console.error(`error userCheckExistingAccount: ${USER_ERROR.DUPLICATED_USER_EMAIL} with email: ${email}`);
          reject(USER_ERROR.DUPLICATED_USER);
          return; //to make sure everything stop
        }
      } else if (phoneNumber && phoneNumber !== null) {
        const foundUser = await AppUsersResourceAccess.find(
          {
            phoneNumber: phoneNumber,
          },
          0,
          1,
        );
        if (foundUser && foundUser.length > 0) {
          console.error(`error userCheckExistingAccount: ${USER_ERROR.DUPLICATED_USER_PHONE} with phoneNumber: ${phoneNumber}`);
          reject(USER_ERROR.DUPLICATED_USER);
          return; //to make sure everything stop
        }
      } else if (companyName && companyName !== null) {
        const foundUser = await AppUsersResourceAccess.find(
          {
            companyName: companyName,
          },
          0,
          1,
        );
        if (foundUser && foundUser.length > 0) {
          console.error(`error userCheckExistingAccount: ${USER_ERROR.DUPLICATED_USER} with companyName: ${companyName}`);
          reject(USER_ERROR.DUPLICATED_USER);
          return; //to make sure everything stop
        }
      }

      resolve('success');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function _sendOTPToUserEmail(targetUser) {
  const email = targetUser.email;

  let newOTP = utilitiesFunction.randomInt(999999);
  newOTP = utilitiesFunction.padLeadingZeros(newOTP, 6);

  if (process.env.EMAIL_OTP_ENABLE * 1 === 1) {
    const EmailClient = require('../../../ThirdParty/Email/EmailClient');
    const EmailGenerator = require('../../../ThirdParty/Email/EmailGenerator');
    let _emailData = EmailGenerator.generateNewOTPEmail(`${targetUser.username}`, newOTP);
    EmailClient.sendEmail(email, _emailData.subject, _emailData.body, _emailData.htmlBody).then(result => {
      if (!result) {
        console.error(`SEND_OTP_TO_EMAIL_FAILED ${email}`);
      }
    });
  } else {
    newOTP = '999999';
  }

  await AppUsersResourceAccess.updateById(targetUser.appUserId, {
    activeOTPCode: newOTP,
    activeOTPAt: new Date().toISOString(),
  });
}

async function sendEmailOTP(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let email = req.payload.email;

      let existEmails = await AppUsersResourceAccess.find({
        email: email,
      });
      if (existEmails && existEmails.length > 0) {
        _sendOTPToUserEmail(existEmails[0]);
        resolve('success');
      } else {
        console.error(`insert OTP data error: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function confirmEmailOTP(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let email = req.payload.email;
      let otpCode = req.payload.otp;
      let foundUsers = await AppUsersResourceAccess.find(
        {
          email: email,
        },
        0,
        1,
      );
      if (!foundUsers || foundUsers.length < 1) {
        console.error(`error confirm Email OTP invalid email`);
        reject('INVALID EMAIL');
        return; //make sure everything stop
      }

      let foundUser = foundUsers[0];

      let _confirmTime = new Date() - 1;
      let _otpTime = new Date(foundUser.activeOTPAt) - 1;
      const MAX_VALID_DURATION = 5 * 60 * 1000; //5 minutes
      if (foundUser.activeOTPCode === otpCode && _otpTime < _confirmTime && _confirmTime - _otpTime <= MAX_VALID_DURATION) {
        await AppUsersResourceAccess.updateById(foundUser.appUserId, {
          isVerifiedEmail: USER_VERIFY_EMAIL_STATUS.IS_VERIFIED,
        });
        resolve(foundUser);
      } else {
        console.error(`error AppUserManager confirmEmailOTP with email ${email}: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function changePasswordviaEmailOTP(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let email = req.payload.email;
      let otpCode = req.payload.otpCode;
      let newPassword = req.payload.newPassword;
      let foundUsers = await AppUsersResourceAccess.find(
        {
          email: email,
        },
        0,
        1,
      );
      if (!foundUsers || foundUsers.length < 1) {
        console.error(`error confirm Email OTP invalid email`);
        reject('INVALID_EMAIL');
        return; //make sure everything stop
      }
      let foundUser = foundUsers[0];
      if (foundUser.activeOTPCode === otpCode) {
        let result = AppUsersFunctions.changeUserPassword(foundUser, newPassword);
        if (result) {
          resolve(result);
        } else {
          console.error(`error AppUserManager changePasswordviaEmailOTP with email ${email}, otpCode ${otpCode}: ${ERROR}`);
          reject('failed');
        }
      } else {
        console.error(`error otp code ${otpCode}`);
        reject('OTP_CODE_INVALID');
        return; //make sure everything stop
      }
      return; //make sure everything stop
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function sendPhoneOTP(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let phoneNumber = req.payload.phoneNumber;
      let foundUsers = await AppUsersResourceAccess.find(
        {
          phoneNumber: phoneNumber,
        },
        0,
        1,
      );
      if (!foundUsers || foundUsers.length < 1) {
        console.error(`error send phone OTP invalid number`);
        reject('INVALID PHONE NUMBER');
        return; //make sure everything stop
      }
      let foundUser = foundUsers[0];
      _sendOTPToUserPhoneNumber(foundUser);
      resolve('success');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function _sendOTPToUserPhoneNumber(targetUser) {
  const phoneNumber = targetUser.phoneNumber;

  let newOTP = utilitiesFunction.randomInt(999999);

  if (process.env.STRINGEE_OTP_ENABLE * 1 === 1) {
    newOTP = utilitiesFunction.padLeadingZeros(newOTP, 6);
    const otpClientFunctions = require('../../../ThirdParty/StringeeOTPAPI/StringeeOtpFunctions');
    let sendOtp = await otpClientFunctions.sendVoiceOTP(phoneNumber, newOTP);

    if (sendOtp !== true) {
      console.error(`SEND_OTP_TO_PHONENUMBER_FAILED ${phoneNumber}`);
      return; //make sure everything stop
    }
  } else {
    newOTP = '999999';
  }

  await AppUsersResourceAccess.updateById(targetUser.appUserId, {
    activeOTPCode: newOTP,
    activeOTPAt: new Date().toISOString(),
  });
}

async function confirmPhoneOTP(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let phoneNumber = req.payload.phoneNumber;
      let otpCode = req.payload.otp;
      let foundUsers = await AppUsersResourceAccess.find({ phoneNumber: phoneNumber }, 0, 1);

      if (!foundUsers || foundUsers.length < 1) {
        console.error(`error confirm phone OTP invalid phone`);
        reject('INVALID PHONE');
        return; //make sure everything stop
      }

      let foundUser = foundUsers[0];

      let _confirmTime = new Date() - 1;
      let _otpTime = new Date(foundUser.activeOTPAt) - 1;
      const MAX_VALID_DURATION = 5 * 60 * 1000; //5 minutes
      if (foundUser.activeOTPCode === otpCode && _otpTime < _confirmTime && _confirmTime - _otpTime <= MAX_VALID_DURATION) {
        await AppUsersResourceAccess.updateById(foundUser.appUserId, {
          active: 1,
          isVerifiedPhoneNumber: USER_VERIFY_PHONE_NUMBER_STATUS.IS_VERIFIED,
        });
        resolve(foundUser);
      } else {
        console.error(`error AppUserManager confirmPhoneOTP with phoneNumber ${phoneNumber}, otpCode ${otpCode}: ${ERROR}`);
        reject('failed');
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
  registerUserByEmail,
  loginByPhone,
  loginByToken,
  loginByEmail,
  getUsersByMonth,
  uploadBeforeIdentityCard,
  uploadAfterIdentityCard,
  userSubmitIdentity,
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
  userViewsListMembership,
  findAllUsersFollowingReferId,
  userCheckExistingAccount,
  sendEmailOTP,
  confirmEmailOTP,
  changePasswordviaEmailOTP,
  userChangeSecondaryPassword,
  sendPhoneOTP,
  confirmPhoneOTP,
  forgotPasswordEmailOTP,
  forgotPasswordSMSOTP,
};
