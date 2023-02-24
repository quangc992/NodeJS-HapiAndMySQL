/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const WalletResourceAccess = require('../resourceAccess/WalletResourceAccess');
const WalletFunction = require('../WalletFunctions');
const KueFunction = require('../../ThirdParty/Kue/KueFunctions');

async function syncAllETHWallets() {
  return new Promise(async (resolve, reject) => {
    try {
      //get all eth wallets
      let ethWallets = await WalletResourceAccess.find({ walletType: 'Payment' });
      console.info(`ethWallets: ${ethWallets.length}`);
      if (ethWallets === undefined || ethWallets.length < 0) {
        reject('No wallet to check');
        return 'failed';
      }

      await KueFunction.cleanAllTask('WalletJobs');

      for (let i = 0; i < ethWallets.length; i++) {
        const wallet = ethWallets[i];
        if (wallet.walletAddress && wallet.walletAddress !== '' && wallet.walletAddress !== null) {
          await KueFunction.createTask('WalletJobs', {
            walletAddress: wallet.walletAddress,
            walletId: wallet.walletId,
            id: wallet.walletAddress,
          });
        }
      }

      const taskPerBatch = 5;
      KueFunction.executeTask('WalletJobs', WalletFunction.syncETHWallet, taskPerBatch);
      console.info('done');
      resolve('done');
      return 'done';
    } catch (e) {
      console.error('error:', e);
      reject('failed');
      return 'failed';
    }
  });
}

async function checkAllTransactionHistory() {
  return new Promise(async (resolve, reject) => {
    try {
      //get all eth wallets
      let ethWallets = await WalletResourceAccess.find({ walletType: 'Payment' });
      console.info(`ethWallets: ${ethWallets.length}`);
      if (ethWallets === undefined || ethWallets.length < 0) {
        reject('No wallet to check');
        return 'failed';
      }

      await KueFunction.cleanAllTask('WalletBalance');

      for (let i = 0; i < ethWallets.length; i++) {
        const wallet = ethWallets[i];
        if (wallet.walletAddress && wallet.walletAddress !== '' && wallet.walletAddress !== null) {
          await KueFunction.createTask('WalletBalance', {
            walletAddress: wallet.walletAddress,
            walletId: wallet.walletId,
            id: wallet.walletAddress,
          });
        }
      }

      const taskPerBatch = 5;
      KueFunction.executeTask('WalletBalance', WalletFunction.checkETHWalletHistory, taskPerBatch);
      console.info('done');
      resolve('done');
      return 'done';
    } catch (e) {
      console.error(e);
      reject('failed');
      return 'failed';
    }
  });
}

module.exports = {
  syncAllETHWallets,
  checkAllTransactionHistory,
};
