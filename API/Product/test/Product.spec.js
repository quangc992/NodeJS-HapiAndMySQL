/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const { ethers } = require('ethers');
const FiNFT = require('../../../ThirdParty/Blockchain/contracts/FiNFT.json');
const chai = require('chai');
const chaiHttp = require('chai-http');
require('dotenv').config();
const faker = require('faker');
const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

describe(`Mint NFT`, () => {
  let staffToken = '';
  let mintTx = { hash: '' };
  let newTokenId;

  before(done => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      staffToken = staffData.token;

      // mint NFT
      const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_ENDPOINT);
      const signer = new ethers.Wallet('09f7d8dc6bb32ea0c218fcef000e6fc8fd3c92bea2074e8022767b25a0e9d91f', provider);
      const contractInstance = new ethers.Contract(FiNFT.networks[parseInt(process.env.CHAIN_ID)].address, FiNFT.abi, signer);
      mintTx = await contractInstance.mint();
      await mintTx.wait();
      resolve();
    }).then(() => done());
  });

  it('save NFT: ' + mintTx.hash, done => {
    const body = {
      productName: faker.name.lastName(),
      productDescription: 'By decentraweb DecentraWeb is a decentralized implementation of the DNS base layer protocol on the Ethereum Blockchain.',
      productShortDescription: 'A handcrafted collection of 10,000 characters developed by artist DirtyRobot.',
      productCreator: faker.name.firstName(),
      productPrice: Math.random() * 100,
      productTxHash: mintTx.hash,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Product/insert`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        newTokenId = res.body.data[0];
        done();
      });
  });

  it('check NFT metadata', done => {
    const body = {
      id: newTokenId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Product/findById`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
});
