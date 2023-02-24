/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const DATA = require('../../AreaData/script/initData.json');
const AreaStreetResourceAccess = require('../resourceAccess/AreaStreetResourceAccess');

//theo file data Quận 1 được xếp đầu và luôn có id = 3
async function bulkInsert(data, parentKey = 3) {
  let allData = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i] && data[i].districts && data[i].districts.length > 0) {
      const districtData = data[i].districts;
      for (let j = 0; j < districtData.length; j++) {
        if (districtData[i] && districtData[i].streets && districtData[i].streets.length > 0) {
          const streetData = districtData[i].streets;
          for (let k = 0; k < streetData.length; k++) {
            if (streetData[k]) {
              const streetObjData = {
                areaStreetName: streetData[k].name,
              };
              allData.push(streetObjData);
            }
          }
        }
      }
    }
  }
  await AreaStreetResourceAccess.insert(allData);
}

async function initData() {
  console.log('insert area street ....');
  await bulkInsert(DATA.cities);
  console.log('insert area street done ....');
}

module.exports = initData;
