/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const WalletRoute = require('./WalletRoute');

module.exports = [
  { method: 'POST', path: '/Wallet/increaseBalance', config: WalletRoute.increaseBalance },
  { method: 'POST', path: '/Wallet/decreaseBalance', config: WalletRoute.decreaseBalance },
  { method: 'POST', path: '/Wallet/insert', config: WalletRoute.insert },
];
