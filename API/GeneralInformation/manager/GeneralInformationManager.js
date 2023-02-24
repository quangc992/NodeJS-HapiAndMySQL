/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 11/18/21.
 */

'use strict';
const GeneralInformationResourceAccess = require('../resourceAccess/GeneralInformationResourceAccess');
const Logger = require('../../../utils/logging');

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await GeneralInformationResourceAccess.find({}, 0, 1);
      if (data) {
        resolve({ data: data });
      } else {
        resolve({ data: [] });
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
      let data = req.payload.data;
      let information = await GeneralInformationResourceAccess.find({}, 0, 1);
      if (information) {
        let id = information[0].generalInformationId;
        let result = await GeneralInformationResourceAccess.updateById(id, data);
        if (result) {
          resolve(result);
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

async function userGetAboutUs(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const _fields = ['aboutUs'];

      let data = await GeneralInformationResourceAccess.find({}, 0, 1, undefined, _fields);
      if (data) {
        resolve(data[0]);
      } else {
        resolve('');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userGetQuestionAndAnwser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const _fields = ['questionAndAnwser'];

      let data = await GeneralInformationResourceAccess.find({}, 0, 1, undefined, _fields);
      if (data) {
        resolve(data[0]);
      } else {
        resolve('');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userGetGeneralRule(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const _fields = ['generalRule'];

      let data = await GeneralInformationResourceAccess.find({}, 0, 1, undefined, _fields);
      if (data) {
        resolve(data[0]);
      } else {
        resolve('');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userGetAppPolicy(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const _fields = ['appPolicy'];

      let data = await GeneralInformationResourceAccess.find({}, 0, 1, undefined, _fields);
      if (data) {
        resolve(data[0]);
      } else {
        resolve('');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userViewGeneralRule(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const _fields = ['generalRule'];

      let data = await GeneralInformationResourceAccess.find({}, 0, 1, undefined, _fields);
      if (data) {
        resolve(data[0].generalRule);
      } else {
        resolve('');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userViewAppPolicy(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const _fields = ['appPolicy'];

      let data = await GeneralInformationResourceAccess.find({}, 0, 1, undefined, _fields);
      if (data) {
        resolve(data[0].appPolicy);
      } else {
        resolve('');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  find,
  updateById,
  userGetAppPolicy,
  userGetGeneralRule,
  userGetQuestionAndAnwser,
  userGetAboutUs,
  userViewGeneralRule,
  userViewAppPolicy,
};
