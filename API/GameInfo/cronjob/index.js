/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const { CronInstance, executeJob } = require('../../../ThirdParty/Cronjob/CronInstance');
const Logger = require('../../../utils/logging');

const { PRODUCT_CHANNEL } = require('../../Product/ProductConstant');
const GameInfoFunctions = require('../GameInfoFunctions');
const UpdateGameResult = require('./updateGameResult').updateGameResult;
const moment = require('moment');
async function startSchedule() {
  Logger.info('startSchedule ', new Date());

  //do not run schedule on DEV environments
  if (process.env.ENV === 'dev') {
    return;
  }

  //G8-G7-G6-G5-G4-G3-G2-G1-GDB
  const SAMPLE_RESULT = '--;---;----;----;----;----;-----;-----;-----;-----;-----;-----;-----;-----;-----;-----;-----;------';
  // await GameInfoFunctions.completeAllPendingGameInfo();

  // every monday
  CronInstance.schedule('0 7 * * 1', async function () {
    let newSection = moment().format('YYYYMMDD');
    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.CA_MAU}_${newSection}`, PRODUCT_CHANNEL.CA_MAU, SAMPLE_RESULT);

    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.TPHCM}_${newSection}`, PRODUCT_CHANNEL.TPHCM, SAMPLE_RESULT);

    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.DONG_THAP}_${newSection}`, PRODUCT_CHANNEL.DONG_THAP, SAMPLE_RESULT);
    // let previousSection1 = moment().format('YYYYMMDDHHmm');
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAMEWINGO1.replace('WINGO', '0'),
    //   GAME_RECORD_TYPE.GAMEWINGO1,
    // );
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAME5D1.replace('5D', '1'),
    //   GAME_RECORD_TYPE.GAME5D1,
    // );
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAMEK31.replace('K3', '2'),
    //   GAME_RECORD_TYPE.GAMEK31,
    // );

    // await GameInfoFunctions.completeAllPendingGameInfo();
  });

  // every tuesday
  CronInstance.schedule('0 7 * * 2', async function () {
    let newSection = moment().format('YYYYMMDD');
    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.BAC_LIEU}_${newSection}`, PRODUCT_CHANNEL.BAC_LIEU, SAMPLE_RESULT);

    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.BEN_TRE}_${newSection}`, PRODUCT_CHANNEL.BEN_TRE, SAMPLE_RESULT);

    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.VUNG_TAU}_${newSection}`, PRODUCT_CHANNEL.VUNG_TAU, SAMPLE_RESULT);
    // let previousSection1 = moment().format('YYYYMMDDHHmm');
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAMEWINGO1.replace('WINGO', '0'),
    //   GAME_RECORD_TYPE.GAMEWINGO1,
    // );
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAME5D1.replace('5D', '1'),
    //   GAME_RECORD_TYPE.GAME5D1,
    // );
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAMEK31.replace('K3', '2'),
    //   GAME_RECORD_TYPE.GAMEK31,
    // );

    // await GameInfoFunctions.completeAllPendingGameInfo();
  });

  // every webnesday
  CronInstance.schedule('0 7 * * 3', async function () {
    let newSection = moment().format('YYYYMMDD');
    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.CAN_THO}_${newSection}`, PRODUCT_CHANNEL.CAN_THO, SAMPLE_RESULT);

    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.DONG_NAI}_${newSection}`, PRODUCT_CHANNEL.DONG_NAI, SAMPLE_RESULT);

    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.SOC_TRANG}_${newSection}`, PRODUCT_CHANNEL.SOC_TRANG, SAMPLE_RESULT);
    // let previousSection1 = moment().format('YYYYMMDDHHmm');
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAMEWINGO1.replace('WINGO', '0'),
    //   GAME_RECORD_TYPE.GAMEWINGO1,
    // );
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAME5D1.replace('5D', '1'),
    //   GAME_RECORD_TYPE.GAME5D1,
    // );
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAMEK31.replace('K3', '2'),
    //   GAME_RECORD_TYPE.GAMEK31,
    // );

    // await GameInfoFunctions.completeAllPendingGameInfo();
  });

  // every thursday
  CronInstance.schedule('0 7 * * 4', async function () {
    let newSection = moment().format('YYYYMMDD');
    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.AN_GIANG}_${newSection}`, PRODUCT_CHANNEL.AN_GIANG, SAMPLE_RESULT);

    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.BINH_THUAN}_${newSection}`, PRODUCT_CHANNEL.BINH_THUAN, SAMPLE_RESULT);

    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.TAY_NINH}_${newSection}`, PRODUCT_CHANNEL.TAY_NINH, SAMPLE_RESULT);
    // let previousSection1 = moment().format('YYYYMMDDHHmm');
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAMEWINGO1.replace('WINGO', '0'),
    //   GAME_RECORD_TYPE.GAMEWINGO1,
    // );
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAME5D1.replace('5D', '1'),
    //   GAME_RECORD_TYPE.GAME5D1,
    // );
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAMEK31.replace('K3', '2'),
    //   GAME_RECORD_TYPE.GAMEK31,
    // );

    // await GameInfoFunctions.completeAllPendingGameInfo();
  });

  // every friday
  CronInstance.schedule('0 7 * * 5', async function () {
    let newSection = moment().format('YYYYMMDD');
    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.BINH_DUONG}_${newSection}`, PRODUCT_CHANNEL.BINH_DUONG, SAMPLE_RESULT);

    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.TRA_VINH}_${newSection}`, PRODUCT_CHANNEL.TRA_VINH, SAMPLE_RESULT);

    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.VINH_LONG}_${newSection}`, PRODUCT_CHANNEL.VINH_LONG, SAMPLE_RESULT);
    // let previousSection1 = moment().format('YYYYMMDDHHmm');
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAMEWINGO1.replace('WINGO', '0'),
    //   GAME_RECORD_TYPE.GAMEWINGO1,
    // );
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAME5D1.replace('5D', '1'),
    //   GAME_RECORD_TYPE.GAME5D1,
    // );
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAMEK31.replace('K3', '2'),
    //   GAME_RECORD_TYPE.GAMEK31,
    // );

    // await GameInfoFunctions.completeAllPendingGameInfo();
  });

  // every saturday
  CronInstance.schedule('0 7 * * 6', async function () {
    let newSection = moment().format('YYYYMMDD');
    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.TPHCM}_${newSection}`, PRODUCT_CHANNEL.TPHCM, SAMPLE_RESULT);

    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.BINH_PHUOC}_${newSection}`, PRODUCT_CHANNEL.BINH_PHUOC, SAMPLE_RESULT);

    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.HAU_GIANG}_${newSection}`, PRODUCT_CHANNEL.HAU_GIANG, SAMPLE_RESULT);

    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.LONG_AN}_${newSection}`, PRODUCT_CHANNEL.LONG_AN, SAMPLE_RESULT);
    // let previousSection1 = moment().format('YYYYMMDDHHmm');
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAMEWINGO1.replace('WINGO', '0'),
    //   GAME_RECORD_TYPE.GAMEWINGO1,
    // );
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAME5D1.replace('5D', '1'),
    //   GAME_RECORD_TYPE.GAME5D1,
    // );
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAMEK31.replace('K3', '2'),
    //   GAME_RECORD_TYPE.GAMEK31,
    // );

    // await GameInfoFunctions.completeAllPendingGameInfo();
  });

  // every sunday
  CronInstance.schedule('0 7 * * 7', async function () {
    let newSection = moment().format('YYYYMMDD');
    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.KIEN_GIANG}_${newSection}`, PRODUCT_CHANNEL.KIEN_GIANG, SAMPLE_RESULT);

    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.LAM_DONG}_${newSection}`, PRODUCT_CHANNEL.LAM_DONG, SAMPLE_RESULT);

    await GameInfoFunctions.addNewGameInfo(`${PRODUCT_CHANNEL.TIEN_GIANG}_${newSection}`, PRODUCT_CHANNEL.TIEN_GIANG, SAMPLE_RESULT);
    // let previousSection1 = moment().format('YYYYMMDDHHmm');
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAMEWINGO1.replace('WINGO', '0'),
    //   GAME_RECORD_TYPE.GAMEWINGO1,
    // );
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAME5D1.replace('5D', '1'),
    //   GAME_RECORD_TYPE.GAME5D1,
    // );
    // GameInfoFunctions.completeGameInfo(
    //   previousSection1 + GAME_RECORD_TYPE.GAMEK31.replace('K3', '2'),
    //   GAME_RECORD_TYPE.GAMEK31,
    // );

    // await GameInfoFunctions.completeAllPendingGameInfo();
  });

  // update Game result
  // every 15 minutes every monday 16h-23h
  CronInstance.schedule('*/15 16-23 * * 1', async function () {
    let newSection = moment().format('YYYYMMDD');
    await UpdateGameResult(`${PRODUCT_CHANNEL.CA_MAU}_${newSection}`);
    await UpdateGameResult(`${PRODUCT_CHANNEL.TPHCM}_${newSection}`);
    await UpdateGameResult(`${PRODUCT_CHANNEL.DONG_THAP}_${newSection}`);
  });

  // every 15 minutes every tuesday 16h-23h
  CronInstance.schedule('*/15 16-23 * * 2', async function () {
    let newSection = moment().format('YYYYMMDD');
    await UpdateGameResult(`${PRODUCT_CHANNEL.BAC_LIEU}_${newSection}`);

    await UpdateGameResult(`${PRODUCT_CHANNEL.BEN_TRE}_${newSection}`);

    await UpdateGameResult(`${PRODUCT_CHANNEL.VUNG_TAU}_${newSection}`);
  });

  // every 15 minutes every webnesday 16h-23h
  CronInstance.schedule('*/15 16-23 * * 3', async function () {
    let newSection = moment().format('YYYYMMDD');
    await UpdateGameResult(`${PRODUCT_CHANNEL.CAN_THO}_${newSection}`);

    await UpdateGameResult(`${PRODUCT_CHANNEL.DONG_NAI}_${newSection}`);

    await UpdateGameResult(`${PRODUCT_CHANNEL.SOC_TRANG}_${newSection}`);
  });

  // every 15 minutes every thursday 16h-23h
  CronInstance.schedule('*/15 16-23 * * 4', async function () {
    let newSection = moment().format('YYYYMMDD');
    await UpdateGameResult(`${PRODUCT_CHANNEL.AN_GIANG}_${newSection}`);

    await UpdateGameResult(`${PRODUCT_CHANNEL.BINH_THUAN}_${newSection}`);

    await UpdateGameResult(`${PRODUCT_CHANNEL.TAY_NINH}_${newSection}`);
  });

  // every 15 minutes every thursday
  CronInstance.schedule('*/15 16-23 * * 5', async function () {
    let newSection = moment().format('YYYYMMDD');
    await UpdateGameResult(`${PRODUCT_CHANNEL.BINH_DUONG}_${newSection}`);

    await UpdateGameResult(`${PRODUCT_CHANNEL.TRA_VINH}_${newSection}`);

    await UpdateGameResult(`${PRODUCT_CHANNEL.VINH_LONG}_${newSection}`);
  });

  // every 15 minutes every saturday 16h-23h
  CronInstance.schedule('*/15 16-23 * * 6', async function () {
    let newSection = moment().format('YYYYMMDD');
    await UpdateGameResult(`${PRODUCT_CHANNEL.TPHCM}_${newSection}`);

    await UpdateGameResult(`${PRODUCT_CHANNEL.BINH_PHUOC}_${newSection}`);

    await UpdateGameResult(`${PRODUCT_CHANNEL.HAU_GIANG}_${newSection}`);

    await UpdateGameResult(`${PRODUCT_CHANNEL.LONG_AN}_${newSection}`);
  });

  // every 15 minutes every sunday 16h-23h
  CronInstance.schedule('*/15 16-23 * * 7', async function () {
    let newSection = moment().format('YYYYMMDD');
    await UpdateGameResult(`${PRODUCT_CHANNEL.KIEN_GIANG}_${newSection}`);

    await UpdateGameResult(`${PRODUCT_CHANNEL.LAM_DONG}_${newSection}`);

    await UpdateGameResult(`${PRODUCT_CHANNEL.TIEN_GIANG}_${newSection}`);
  });
}

module.exports = {
  startSchedule,
};
