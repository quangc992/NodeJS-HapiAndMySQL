/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const AppUsersMembership = require('./AppUserMembershipRoute');

module.exports = [
  //AppUsersMembership APIs
  {
    method: 'POST',
    path: '/AppUsersMembership/insert',
    config: AppUsersMembership.insert,
  },
  {
    method: 'POST',
    path: '/AppUsersMembership/find',
    config: AppUsersMembership.find,
  },
  {
    method: 'POST',
    path: '/AppUsersMembership/findById',
    config: AppUsersMembership.findById,
  },
  {
    method: 'POST',
    path: '/AppUsersMembership/updateById',
    config: AppUsersMembership.updateById,
  },
  {
    method: 'POST',
    path: '/AppUsersMembership/deleteById',
    config: AppUsersMembership.deleteById,
  },
  {
    method: 'POST',
    path: '/AppUsersMembership/userGetListMemberShip',
    config: AppUsersMembership.userGetListMemberShip,
  },
];
