/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const AppUser = require('../AppUsers/resourceAccess/AppUserView');

async function getListMemberShip(filter, skip, limit, startDay, endDay, order) {
  let result = await AppUser.customSearch(filter, skip, limit, startDay, endDay, order);
  if (result) {
    let resultCount = await AppUser.customCount(filter, order);
    if (resultCount) {
      return { data: result, total: resultCount[0].count };
    } else {
      return { data: result, total: 0 };
    }
  } else {
    return { data: [], total: 0 };
  }
}
module.exports = {
  getListMemberShip,
};
