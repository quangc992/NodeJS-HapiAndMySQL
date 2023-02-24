/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const AppUserResource = require('../../AppUsers/resourceAccess/AppUsersResourceAccess');
const UserGamePlayRecordsView = require('../../GamePlayRecords/resourceAccess/UserGamePlayRecordsView');
const { payBonusForReferralUsers } = require('../UserPaymentBonusFunctions');

//tinh toan hoa hong tung ngay cho user
async function updateBonusDailyForAllUser() {
  const moment = require('moment');
  let yesterdayStart = moment().subtract(1, 'day').startOf('day').format();
  let yesterdayEnd = moment().startOf('day').format();

  console.info(`start updateBonusDailyForAllUser ${yesterdayStart} -- ${yesterdayEnd}`);

  let betRecordSummary = await UserGamePlayRecordsView.sumBetAmountDistinctByAppUserId({}, yesterdayStart, yesterdayEnd);

  if (betRecordSummary && betRecordSummary.length > 0) {
    for (let i = 0; i < betRecordSummary.length; i++) {
      const _userSummary = betRecordSummary[i];

      let _userDetail = await AppUserResource.findById(_userSummary.appUserId);

      //tien hoa hong dua tren so tien thua
      let totalBetAmountIn = _userSummary.totalSum;
      if (totalBetAmountIn <= 0) {
        continue;
      }

      payBonusForReferralUsers(_userDetail, totalBetAmountIn);
    }
  }
  console.info(`end updateBonusDailyForAllUser`);
}

module.exports = {
  updateBonusDailyForAllUser,
};
