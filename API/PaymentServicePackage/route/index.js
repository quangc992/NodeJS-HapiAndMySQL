/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const PaymentServicePackage = require('./PaymentServicePackageRoute');
const PaymentServiceBonusPackage = require('./PaymentServiceBonusPackageRoute');
const UserPaymentServicePackageRoute = require('./UserPaymentServicePackageRoute');

module.exports = [
  { method: 'POST', path: '/PaymentServicePackage/insert', config: PaymentServicePackage.insert },
  { method: 'POST', path: '/PaymentServicePackage/updateById', config: PaymentServicePackage.updateById },
  { method: 'POST', path: '/PaymentServicePackage/find', config: PaymentServicePackage.find },
  { method: 'POST', path: '/PaymentServicePackage/findById', config: PaymentServicePackage.findById },
  { method: 'POST', path: '/PaymentServicePackage/deleteById', config: PaymentServicePackage.deleteById },
  {
    method: 'POST',
    path: '/PaymentServicePackage/activatePackagesByIdList',
    config: PaymentServicePackage.activatePackagesByIdList,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/deactivatePackagesByIdList',
    config: PaymentServicePackage.deactivatePackagesByIdList,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/adminCompletePackagesById',
    config: UserPaymentServicePackageRoute.adminCompletePackagesById,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/rewardProfitBonusForUser',
    config: PaymentServicePackage.rewardProfitBonusForUser,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/countAllUserPackage',
    config: UserPaymentServicePackageRoute.countAllUserPackage,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/findUserBuyPackage',
    config: UserPaymentServicePackageRoute.findUserBuyPackage,
  },

  {
    method: 'POST',
    path: '/PaymentServicePackage/user/getList',
    config: PaymentServicePackage.userGetListPaymentPackage,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/getListUserBuyPackage',
    config: UserPaymentServicePackageRoute.getListUserBuyPackage,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/user/getBalanceByUnitId',
    config: UserPaymentServicePackageRoute.userGetBalanceByUnitId,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/user/buyServicePackage',
    config: UserPaymentServicePackageRoute.buyServicePackage,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/user/getListUserBuyPackage',
    config: UserPaymentServicePackageRoute.getListUserBuyPackage,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/user/historyServicePackage',
    config: UserPaymentServicePackageRoute.historyServicePackage,
  },
  // { method: 'POST', path: '/PaymentServicePackage/user/activateServicePackage', config: UserPaymentServicePackageRoute.userActivateServicePackage },
  {
    method: 'POST',
    path: '/PaymentServicePackage/user/collectServicePackage',
    config: UserPaymentServicePackageRoute.userCollectServicePackage,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/user/completedServicePackage',
    config: UserPaymentServicePackageRoute.userRequestCompletedServicePackage,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/user/historyCompletedServicePackage',
    config: UserPaymentServicePackageRoute.historyCompleteServicePackage,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/user/historyCancelServicePackage',
    config: UserPaymentServicePackageRoute.historyCancelServicePackage,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/user/historyBonusServicePackage',
    config: UserPaymentServicePackageRoute.historyBonusServicePackage,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/admin/historyCompleteServicePackage',
    config: UserPaymentServicePackageRoute.adminHistoryCompleteServicePackage,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/admin/historyCancelServicePackage',
    config: UserPaymentServicePackageRoute.adminHistoryCancelServicePackage,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/admin/updateById',
    config: UserPaymentServicePackageRoute.adminUpdateCompleteServicePackage,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/user/userGetListBranch',
    config: UserPaymentServicePackageRoute.summaryReferedUser,
  },
  {
    method: 'POST',
    path: '/PaymentServicePackage/admin/getListReferralByUserId',
    config: UserPaymentServicePackageRoute.getListReferralByUserId,
  },

  {
    method: 'POST',
    path: '/PaymentServiceBonusPackage/staffSendBonusPackage',
    config: PaymentServiceBonusPackage.staffSendBonusPackage,
  },
  { method: 'POST', path: '/PaymentServiceBonusPackage/updateById', config: PaymentServiceBonusPackage.updateById },
  { method: 'POST', path: '/PaymentServiceBonusPackage/find', config: PaymentServiceBonusPackage.find },
  { method: 'POST', path: '/PaymentServiceBonusPackage/findById', config: PaymentServiceBonusPackage.findById },
  { method: 'POST', path: '/PaymentServiceBonusPackage/deleteById', config: PaymentServiceBonusPackage.deleteById },
  {
    method: 'POST',
    path: '/PaymentServiceBonusPackage/user/getList',
    config: PaymentServiceBonusPackage.userGetListPaymentBonusPackage,
  },
  {
    method: 'POST',
    path: '/PaymentServiceBonusPackage/user/claimBonusPackage',
    config: PaymentServiceBonusPackage.userClaimBonusPackage,
  },
];
