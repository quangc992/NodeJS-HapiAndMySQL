/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 11/18/21.
 */

'use strict';
const MembershipResourceAccess = require('../resourceAccess/MembershipResourceAccess');
const MembershipFunctions = require('../MembershipFunction');

async function UpdateAllMembership() {
  let membershipList = await MembershipResourceAccess.find(
    {
      isDeleted: 0,
    },
    undefined,
    undefined,
    {
      key: 'membershipPointRequired',
      value: 'asc',
    },
  );

  if (!membershipList || membershipList.length <= 0) {
    return undefined;
  }
  for (let i = 0; i < membershipList.length; i++) {
    const _membership = membershipList[i];
    await MembershipFunctions.grantMembershipForUsers(_membership);
  }
}

UpdateAllMembership();

module.exports = {
  UpdateAllMembership,
};
