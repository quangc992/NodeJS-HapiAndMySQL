/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const { _detectSingleResult, _detectBatchResult } = require('../GameInfoFunctions');

function testRecultGame() {
  console.log('ok');

  const existedGameInfoSingle = {
    gameRecordValue: '97;758;7144;2985;2893;4026;91612;47726;52720;30307;33661;70784;94115;86152;22364;64481;41786;511023',
  };
  const single = [
    { type: 'Single', value: '511023', predict: 2500000000, errorMessage: 'sai Giải DB ' },
    { type: 'Single', value: '041786', predict: 30000000, errorMessage: 'sai Giải 1 ' },
    { type: 'Single', value: '064481', predict: 15000000, errorMessage: 'sai Giải 2 ' },
    { type: 'Single', value: '086152', predict: 10000000, errorMessage: 'sai Giải 3 ' },
    { type: 'Single', value: '091612', predict: 3000000, errorMessage: 'sai Giải 4 ' },
    { type: 'Single', value: '004026', predict: 1000000, errorMessage: 'sai Giải 5 ' },
    { type: 'Single', value: '007144', predict: 400000, errorMessage: 'sai Giải 6 ' },
    { type: 'Single', value: '000758', predict: 200000, errorMessage: 'sai Giải 7 ' },
    { type: 'Single', value: '000097', predict: 100000, errorMessage: 'sai Giải 8 ' },
    { type: 'Single', value: '111023', predict: 50000000, errorMessage: 'sai Giải phụ đặc biệt ' },
    { type: 'Single', value: '211023', predict: 50000000, errorMessage: 'sai Giải phụ đặc biệt ' },
    { type: 'Single', value: '311023', predict: 50000000, errorMessage: 'sai Giải phụ đặc biệt ' },
    { type: 'Single', value: '411023', predict: 50000000, errorMessage: 'sai Giải phụ đặc biệt ' },
    { type: 'Single', value: '611023', predict: 50000000, errorMessage: 'sai Giải phụ đặc biệt ' },
    { type: 'Single', value: '711023', predict: 50000000, errorMessage: 'sai Giải phụ đặc biệt ' },
    { type: 'Single', value: '811023', predict: 50000000, errorMessage: 'sai Giải phụ đặc biệt ' },
    { type: 'Single', value: '911023', predict: 50000000, errorMessage: 'sai Giải phụ đặc biệt ' },
    { type: 'Single', value: '011023', predict: 50000000, errorMessage: 'sai Giải phụ đặc biệt ' },
    { type: 'Single', value: '511021', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số cuối - 6) ' },
    { type: 'Single', value: '511022', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số cuối - 6) ' },
    { type: 'Single', value: '511024', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số cuối - 6) ' },
    { type: 'Single', value: '511025', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số cuối - 6) ' },
    { type: 'Single', value: '511026', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số cuối - 6) ' },
    { type: 'Single', value: '511027', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số cuối - 6) ' },
    { type: 'Single', value: '511028', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số cuối - 6) ' },
    { type: 'Single', value: '511029', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số cuối - 6) ' },
    { type: 'Single', value: '511003', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số kế cuối - 5 ' },
    { type: 'Single', value: '511013', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số kế cuối - 5) ' },
    { type: 'Single', value: '511033', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số kế cuối - 5) ' },
    { type: 'Single', value: '511043', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số kế cuối - 5) ' },
    { type: 'Single', value: '511053', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số kế cuối - 5) ' },
    { type: 'Single', value: '511063', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số kế cuối - 5) ' },
    { type: 'Single', value: '511073', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số kế cuối - 5) ' },
    { type: 'Single', value: '511083', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số kế cuối - 5) ' },
    { type: 'Single', value: '511093', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số kế cuối - 5) ' },
    { type: 'Single', value: '511123', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số  - 4) ' },
    { type: 'Single', value: '511223', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số  - 4) ' },
    { type: 'Single', value: '511323', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số  - 4) ' },
    { type: 'Single', value: '511423', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số  - 4) ' },
    { type: 'Single', value: '511523', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số  - 4) ' },
    { type: 'Single', value: '511623', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số  - 4) ' },
    { type: 'Single', value: '511723', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số  - 4) ' },
    { type: 'Single', value: '511823', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số  - 4) ' },
    { type: 'Single', value: '511923', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số  - 4) ' },
    { type: 'Single', value: '510023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số -3) ' },
    { type: 'Single', value: '512023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số -3) ' },
    { type: 'Single', value: '513023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số -3) ' },
    { type: 'Single', value: '514023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số -3) ' },
    { type: 'Single', value: '515023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số -3) ' },
    { type: 'Single', value: '516023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số -3) ' },
    { type: 'Single', value: '517023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số -3) ' },
    { type: 'Single', value: '518023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số -3) ' },
    { type: 'Single', value: '519023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số -3) ' },
    { type: 'Single', value: '501023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số - 2)  ' },
    { type: 'Single', value: '521023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số - 2) ' },
    { type: 'Single', value: '531023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số - 2) ' },
    { type: 'Single', value: '541023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số - 2) ' },
    { type: 'Single', value: '551023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số - 2) ' },
    { type: 'Single', value: '561023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số - 2) ' },
    { type: 'Single', value: '571023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số - 2) ' },
    { type: 'Single', value: '581023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số - 2) ' },
    { type: 'Single', value: '591023', predict: 6000000, errorMessage: 'sai Giải khuyến khích (khác số - 2) ' },
  ];

  for (let i = 0; i < single.length; i++) {
    const { pointWin } = _detectSingleResult(existedGameInfoSingle, {
      betRecordValue: single[i].value,
      betRecordQuantity: 1,
    });

    if (pointWin !== single[i].predict) {
      console.log(single[i].errorMessage);
    }
  }

  const batch = [
    { type: 'Batch', value: '*11023', predict: 32450000000 },
    { type: 'Batch', value: '*41786', predict: 3300000000 },
    { type: 'Batch', value: '*64481', predict: 1650000000 },
    { type: 'Batch', value: '*86152', predict: 1100000000 },
    { type: 'Batch', value: '*91612', predict: 330000000 },
    { type: 'Batch', value: '*04026', predict: 110000000 },
    { type: 'Batch', value: '*07144', predict: 44000000 },
    { type: 'Batch', value: '*00758', predict: 22000000 },
    { type: 'Batch', value: '*00097', predict: 11000000 },
    { type: 'Batch', value: '*11021', predict: 66000000 },
    { type: 'Batch', value: '*11003', predict: 66000000 },
    { type: 'Batch', value: '*11123', predict: 66000000 },
    { type: 'Batch', value: '*10023', predict: 66000000 },
    { type: 'Batch', value: '*01023', predict: 66000000 },
  ];

  for (let i = 0; i < batch.length; i++) {
    const { pointWin } = _detectBatchResult(existedGameInfoSingle, {
      betRecordValue: batch[i].value,
      betRecordQuantity: 1,
    });

    if (pointWin !== batch[i].predict) {
      console.log(`sai value ${batch[i].value} ${pointWin} !== ${batch[i].predict}`);
    }
  }
}

testRecultGame();
