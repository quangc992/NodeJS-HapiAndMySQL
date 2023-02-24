'use strict';
const TickerMovieResourceAccess = require('../resourceAccess/TickerMovieResourceAccess');
const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let tickerMovieData = req.payload;
      // console.log(req.headers.authorization)
      // let result = token.decodeToken(request.headers.authorization);
      let dataMovieData;

      dataMovieData = await TickerMovieResourceAccess.insert(tickerMovieData);
      if (dataMovieData) return resolve('insert');
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findAll(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let dataMovieData;
      let countMovieData;

      dataMovieData = await TickerMovieResourceAccess.find();
      countMovieData = await TickerMovieResourceAccess.countAll();

      if (dataMovieData && countMovieData) {
        resolve({
          countMovieData: countMovieData,
          dataMovieData: dataMovieData
        });
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let getTickerMovieById = req.payload;
      let dataMovieData;

      dataMovieData = await TickerMovieResourceAccess.findById(getTickerMovieById);
      if (dataMovieData) resolve(dataMovieData);
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let updateById = req.payload;
      let TickerMovieId = req.payload.TickerMovieId;
      let dataMovieData;
      dataMovieData = await TickerMovieResourceAccess.updateById(TickerMovieId, updateById);
      if (dataMovieData) resolve(dataMovieData);
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let deleteById = req.payload;
      let dataMovieData;
      dataMovieData = await TickerMovieResourceAccess.deleteById(deleteById);
      if (dataMovieData) resolve(dataMovieData);
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  insert,
  findAll,
  findById,
  updateById,
  deleteById,
};