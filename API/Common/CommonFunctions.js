/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const token = require('../ApiUtils/token');
const SystemStatus = require('../Maintain/MaintainFunctions').systemStatus;
const errorCodes = require('./route/response').errorCodes;
const UserResource = require('../AppUsers/resourceAccess/AppUsersResourceAccess');
const StaffResource = require('../Staff/resourceAccess/RoleStaffView');
const Logger = require('../../utils/logging');

async function verifyToken(request, reply) {
  return new Promise(async function (resolve) {
    //if there is no token or empty token
    if (!(request.headers.authorization && request.headers.authorization !== '')) {
      Logger.error(`System was down - current active status = ${SystemStatus.all}`);
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    let result = token.decodeToken(request.headers.authorization);

    //invalid token
    if (result === undefined) {
      Logger.error(`invalid token`);
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    //append current user to request
    request.currentUser = result;

    if (!request.currentUser.active) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    //system down then normal user can not use anything, except staff
    if (result.appUserId && SystemStatus.all === false) {
      Logger.error(`System was down - current active status = ${SystemStatus.all}`);
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    //recheck again with realtime DB
    if (result.appUserId) {
      let currentUser = await UserResource.find({
        appUserId: result.appUserId,
      });
      if (currentUser && currentUser.length > 0 && currentUser[0].active) {
        //append current user to request
        request.currentUser = currentUser[0];
        resolve('ok');
      } else {
        reply.response(errorCodes[505]).code(505).takeover();
        return;
      }
    } else if (result.staffId) {
      let currentStaff = await StaffResource.find({ staffId: result.staffId });
      if (currentStaff && currentStaff.length > 0 && currentStaff[0].active) {
        //append current user to request
        request.currentUser = currentStaff[0];

        //do not allow multiple staff login
        //if (currentStaff[0].staffToken !== request.headers.authorization.replace('Bearer ','')) {
        //  reply.response(errorCodes[505]).code(505).takeover();
        //  return
        //}
        resolve('ok');
      } else {
        reply.response(errorCodes[505]).code(505).takeover();
        return;
      }
    }
    resolve('ok');
  }).then(function () {
    reply('pre-handler done');
  });
}

async function verifyTokenOrAllowEmpty(request, reply) {
  return new Promise(function (resolve) {
    if (request.headers.authorization !== undefined && request.headers.authorization.trim() !== '') {
      let result = token.decodeToken(request.headers.authorization);

      if (result === undefined || (result.appUserId && SystemStatus.all === false)) {
        reply.response(errorCodes[505]).code(505).takeover();
        return;
      }

      //append current user to request
      request.currentUser = result;
    }

    resolve('ok');
  }).then(function () {
    reply('pre-handler done');
  });
}

async function verifyStaffToken(request, reply) {
  return new Promise(function (resolve) {
    let currentUser = request.currentUser;
    console.log(currentUser.staffId)
    if (!currentUser || !currentUser.staffId || currentUser.staffId < 1) {
      Logger.error('do not have staffId or staff id is invalid');
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    if (!currentUser || !currentUser.staffRoleId || currentUser.staffRoleId < 1) {
      Logger.error('do not have staffRoleId or staffRoleId is invalid');
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    resolve('ok');
  }).then(function () {
    reply('pre-handler done');
  });
}

async function verifyAdminToken(request, reply) {
  return new Promise(function (resolve) {
    let currentUser = request.currentUser;

    if (!currentUser.staffId || currentUser.staffId < 1) {
      Logger.error('do not have staffId or staff id is invalid');
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    if (!currentUser.staffRoleId || currentUser.staffRoleId < 1) {
      Logger.error('do not have staffRoleId or staffRoleId is invalid');
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    const AGENT_ROLE = 5;
    if (currentUser.staffRoleId === AGENT_ROLE) {
      //if it is agent, reject user
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    if (currentUser.staffRoleId != 1) {
      Logger.error('do not have role admin');
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }
    resolve('ok');
  }).then(function () {
    reply('pre-handler done');
  });
}

async function verifyAgentToken(request, reply) {
  return new Promise(function (resolve) {
    let currentUser = request.currentUser;

    if (!currentUser.staffId || currentUser.staffId < 1) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    if (!currentUser.staffRoleId || currentUser.staffRoleId < 1) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    //neu day la agent
    const AGENT_ROLE = 5; //<< agent role luon la ID lon nhat ben trong he thong
    if (currentUser.staffRoleId < AGENT_ROLE) {
      //if it is agent, reject user
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    //if agent do not have station
    if (!currentUser.stationsId || currentUser.stationsId <= 0) {
      //if it is agent, reject user
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    resolve('ok');
  }).then(function () {
    reply('pre-handler done');
  });
}

//verify token is belong to user or not
//to make sure they can not get info or update other user
async function verifyOwnerToken(request, reply) {
  return new Promise(function (resolve) {
    let currentUser = request.currentUser;
    let userId = request.payload.id;

    if (userId && currentUser.appUserId && userId !== currentUser.appUserId) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    resolve('ok');
  }).then(function () {
    reply('pre-handler done');
  });
}
async function verifyTokenOrAllowEmpty(request, reply) {
  return new Promise(function (resolve) {
    if (request.headers.authorization !== undefined && request.headers.authorization.trim() !== '') {
      let result = token.decodeToken(request.headers.authorization);

      if (result === undefined || (result.appUserId && SystemStatus.all === false)) {
        reply.response(errorCodes[505]).code(505).takeover();
        return;
      }

      //append current user to request
      request.currentUser = result;
    }

    resolve('ok');
  }).then(function () {
    reply('pre-handler done');
  });
}

module.exports = {
  verifyToken,
  verifyStaffToken,
  verifyOwnerToken,
  verifyAdminToken,
  verifyAgentToken,
  verifyTokenOrAllowEmpty,
};
