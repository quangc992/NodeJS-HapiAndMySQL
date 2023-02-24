/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const PaymentDepositTransaction = require('./PaymentDepositTransactionRoute');
module.exports = [
  //Payment Deposit  APIs
  { method: 'POST', path: '/PaymentDepositTransaction/insert', config: PaymentDepositTransaction.insert },
  { method: 'POST', path: '/PaymentDepositTransaction/find', config: PaymentDepositTransaction.find },
  // { method: 'POST', path: '/PaymentDepositTransaction/updateById', config: PaymentDepositTransaction.updateById },
  { method: 'POST', path: '/PaymentDepositTransaction/findById', config: PaymentDepositTransaction.findById },
  // { method: 'POST', path: '/PaymentDepositTransaction/deleteById', config: PaymentDepositTransaction.deleteById },
  {
    method: 'POST',
    path: '/PaymentDepositTransaction/user/requestDeposit',
    config: PaymentDepositTransaction.userRequestDeposit,
  },
  {
    method: 'POST',
    path: '/PaymentDepositTransaction/user/depositHistory',
    config: PaymentDepositTransaction.depositHistory,
  },
  {
    method: 'POST',
    path: '/PaymentDepositTransaction/addPointForUser',
    config: PaymentDepositTransaction.addPointForUser,
  },
  {
    method: 'POST',
    path: '/PaymentDepositTransaction/approveDepositTransaction',
    config: PaymentDepositTransaction.approveDepositTransaction,
  },
  {
    method: 'POST',
    path: '/PaymentDepositTransaction/denyDepositTransaction',
    config: PaymentDepositTransaction.denyDepositTransaction,
  },
  // { method: 'POST', path: '/PaymentDepositTransaction/exportExcelHistory', config: PaymentDepositTransaction.exportExcelHistory },
  // { method: 'POST', path: '/PaymentDepositTransaction/exportSalesToExcel', config: PaymentDepositTransaction.exportSalesToExcel },
];
