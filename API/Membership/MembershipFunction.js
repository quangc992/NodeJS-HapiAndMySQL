/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 11/18/21.
 */

'use strict';
const SummaryUserPaymentView = require('../PaymentDepositTransaction/resourceAccess/SummaryUserPaymentDepositTransactionView');
const AppUserResource = require('../AppUsers/resourceAccess/AppUsersResourceAccess');
const Logger = require('../../utils/logging');

async function grantMembershipForUsers(membership) {
  const VND_TO_POINT = process.env.VND_TO_POINT || 1; //1 VND = 1 point

  let usersListCount = await SummaryUserPaymentView.countByMinBalance(membership.membershipPointRequired * VND_TO_POINT);
  if (!usersListCount || usersListCount.length <= 0 || usersListCount[0].count <= 0) {
    Logger.info(`no user to grant membership`);
    return undefined;
  }

  let usersCount = usersListCount[0].count;
  const MAX_USER_PER_BATCH = 100;
  let batchCount = parseInt(usersCount / MAX_USER_PER_BATCH);
  if (batchCount * MAX_USER_PER_BATCH < usersCount) {
    batchCount++;
  }

  for (let batchCounter = 0; batchCounter < batchCount; batchCounter++) {
    let _updatingUserList = await SummaryUserPaymentView.findByMinBalance(
      membership.membershipPointRequired * VND_TO_POINT,
      MAX_USER_PER_BATCH * batchCounter,
      MAX_USER_PER_BATCH,
    );

    if (_updatingUserList && _updatingUserList.length > 0) {
      let _updatingIdList = [];
      for (let idCounter = 0; idCounter < _updatingUserList.length; idCounter++) {
        _updatingIdList.push(_updatingUserList[idCounter].appUserId);
      }

      await AppUserResource.updateAllById(_updatingIdList, {
        memberLevelName: membership.membershipTitle,
      });
    }
  }
}

module.exports = {
  grantMembershipForUsers,
};
