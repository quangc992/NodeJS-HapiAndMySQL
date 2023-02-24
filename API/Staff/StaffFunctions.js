/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const Logger = require('../../utils/logging');
const StaffResourceAccess = require('./resourceAccess/StaffResourceAccess');
const RoleStaffView = require('./resourceAccess/RoleStaffView');
const { STAFF_ERROR } = require('./StaffConstant');

const crypto = require('crypto');

function hashPassword(password) {
  const hashedPassword = crypto.createHmac('sha256', 'ThisIsStaffSecretKey').update(password).digest('hex');
  return hashedPassword;
}

function unhashPassword(hash) {
  const pass = cryptr.decrypt(hash);
  return pass;
}

async function verifyCredentials(username, password) {
  let hashedPassword = hashPassword(password);
  // Find an entry from the database that
  // matches either the email or username
  let verifyResult = await RoleStaffView.find({
    username: username,
    password: hashedPassword,
  });

  if (verifyResult && verifyResult.length > 0) {
    return verifyResult[0];
  } else {
    Logger.error('StaffFunctions', 'Staff password do not match');
    return undefined;
  }
}

async function changeStaffPassword(staffData, newPassword) {
  let newHashPassword = hashPassword(newPassword);

  let result = await StaffResourceAccess.updateById(staffData.staffId, {
    password: newHashPassword,
  });

  if (result) {
    return result;
  } else {
    return undefined;
  }
}

async function createNewStaff(staffData, newPassword) {
  //check existed username
  let _existedUsers = await StaffResourceAccess.find({
    username: staffData.username,
  });
  if (_existedUsers && _existedUsers.length > 0) {
    throw STAFF_ERROR.DUPLICATED_USER;
  }

  //check existed email
  if (staffData.email) {
    _existedUsers = await StaffResourceAccess.find({ email: staffData.email });
    if (_existedUsers && _existedUsers.length > 0) {
      throw STAFF_ERROR.DUPLICATED_USER_EMAIL;
    }
  }

  //check existed phoneNumber
  if (staffData.phoneNumber) {
    _existedUsers = await StaffResourceAccess.find({
      phoneNumber: staffData.phoneNumber,
    });
    if (_existedUsers && _existedUsers.length > 0) {
      throw STAFF_ERROR.DUPLICATED_USER_PHONE;
    }
  }

  let newHashPassword = hashPassword(newPassword);

  //hash password
  staffData.password = newHashPassword;

  //create new user
  let result = await StaffResourceAccess.insert(staffData);

  if (result) {
    return result;
  } else {
    return undefined;
  }
}

module.exports = {
  verifyCredentials,
  changeStaffPassword,
  unhashPassword,
  hashPassword,
  createNewStaff,
};
