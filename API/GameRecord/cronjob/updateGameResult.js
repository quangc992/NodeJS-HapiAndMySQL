/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const GameRecordsResourceAccess = require('../resourceAccess/GameRecordsResourceAccess');
const crawlLottery = require('../../../cron/crawlerLottery').crawlLottery;
const { GAME_RECORD_STATUS } = require('../GameRecordConstant');
const { PRODUCT_CHANNEL } = require('../../Product/ProductConstant');
const CustomerMessageFunctions = require('../../CustomerMessage/CustomerMessageFunctions');
const moment = require('moment');
async function updateGameResult(gameRecordSection) {
  let existedGameRecord = await GameRecordsResourceAccess.find({
    gameRecordSection: gameRecordSection,
  });
  if (existedGameRecord && existedGameRecord.length > 0) {
    existedGameRecord = existedGameRecord[0];
    if (existedGameRecord.gameRecordStatus !== GAME_RECORD_STATUS.COMPLETED) {
      let channel = existedGameRecord.gameRecordType.toLowerCase();
      const resultLottery = await _getResultLottery(channel);
      let gameDateResult = moment(resultLottery.ngayXoSo).format('YYYYMMDD'); // ngay xo so
      let getDateAdd = existedGameRecord.gameRecordSection.split('_'); //chi lay ngay tao
      let gameDateAdd = getDateAdd[getDateAdd.length - 1];
      if (gameDateResult === gameDateAdd) {
        let updateRecordData = {
          gameRecordValue: resultLottery.ketqua,
        };
        let isUpdateSuccess = await GameRecordsResourceAccess.updateById(existedGameRecord.gameRecordId, updateRecordData);
        let isGameRecordValueChange = existedGameRecord.gameRecordValue !== updateRecordData.gameRecordValue;
        if (isUpdateSuccess && isGameRecordValueChange) {
          let groupNotifyTitle = 'Kết quả quả xổ số';
          let gameDateResultFormat = moment(resultLottery.ngayXoSo).format('DD-MM-YYYY');
          let gameChannel = mappingModelGameRecordChannel(existedGameRecord.gameRecordType);
          let groupNotifyContent = `Đã có kết quả dò hôm nay đài ${gameChannel} ngày ${gameDateResultFormat}`;
          await CustomerMessageFunctions.sendNotificationAllUser(groupNotifyTitle, groupNotifyContent);
        }
      } else {
        console.error(`date game different to update result ${gameRecordSection}`);
      }
    }
  } else {
    console.error(`can not find game to update result ${gameRecordSection}`);
  }
}

function mappingModelGameRecordChannel(gameRecordType) {
  switch (gameRecordType) {
    case PRODUCT_CHANNEL.DONG_THAP:
      return 'Đồng Tháp';
    case PRODUCT_CHANNEL.CA_MAU:
      return 'Cà Mau';
    case PRODUCT_CHANNEL.BEN_TRE:
      return 'Bến Tre';
    case PRODUCT_CHANNEL.VUNG_TAU:
      return 'Vũng Tàu';
    case PRODUCT_CHANNEL.BAC_LIEU:
      return 'Bạc Liêu';
    case PRODUCT_CHANNEL.DONG_NAI:
      return 'Đồng Nai';
    case PRODUCT_CHANNEL.CAN_THO:
      return 'Cần Thơ';
    case PRODUCT_CHANNEL.SOC_TRANG:
      return 'Sóc Trăng';
    case PRODUCT_CHANNEL.TAY_NINH:
      return 'Tây Ninh';
    case PRODUCT_CHANNEL.AN_GIANG:
      return 'An Giang';
    case PRODUCT_CHANNEL.BINH_THUAN:
      return 'Bình Thuận';
    case PRODUCT_CHANNEL.VINH_LONG:
      return 'Vĩnh Long';
    case PRODUCT_CHANNEL.BINH_DUONG:
      return 'Bình Dương';
    case PRODUCT_CHANNEL.TRA_VINH:
      return 'Trà Vinh';
    case PRODUCT_CHANNEL.LONG_AN:
      return 'Long An';
    case PRODUCT_CHANNEL.HAU_GIANG:
      return 'Hậu Giang';
    case PRODUCT_CHANNEL.BINH_PHUOC:
      return 'Bình Phước';
    case PRODUCT_CHANNEL.LAM_DONG:
      return 'Lâm Đồng';
    case PRODUCT_CHANNEL.KIEN_GIANG:
      return 'Kiên Giang';
    case PRODUCT_CHANNEL.TIEN_GIANG:
      return 'Tiền Giang';
    default:
      return 'Hồ Chí Minh';
  }
}

async function _getResultLottery(channel) {
  return await crawlLottery(channel);
}

module.exports = {
  updateGameResult,
};
