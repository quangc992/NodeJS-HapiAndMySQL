/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const DATA = require('./initData.json');
const AreaDataResourceAccess = require('../resourceAccess/AreaDataResourceAccess');

async function bulkInsert(data, parentKey = 1) {
  let parentId = parentKey;
  for (let i = 0; i < data.length; i++) {
    //Lấy key data type
    let childKey = '';
    let AreaDataType = '';
    for (let k in data[i]) {
      // nó là thành phố và nó đang chứa district
      if (k === 'districts') {
        AreaDataType = 'CITY';
        parentId = 1;
        childKey = 'districts';
        break;
        // nó là quận và nó đang chứa ward
      } else if (k === 'wards') {
        AreaDataType = 'DISTRICT';
        childKey = 'wards';
        break;
      } else {
        //Nếu không chứa district hay ward thì nó là phường
        AreaDataType = 'WARD';
      }
    }
    let insertData = [
      {
        areaDataName: data[i].name,
        areaDataType: AreaDataType,
        areaParentId: parentId,
      },
    ];
    let result = await AreaDataResourceAccess.insert(insertData);
    if (childKey !== '') {
      bulkInsert(data[i][childKey], result[0]);
    } else {
      continue;
    }
  }
}

async function initData() {
  console.log('insert area data ....');
  await bulkInsert(DATA.cities, 1);
  console.log('insert area data done ....');
}

module.exports = initData;
