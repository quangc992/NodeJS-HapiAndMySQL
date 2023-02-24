/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moment = require('moment');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const CustomerMeasureRecordModel = require('./model/CustomerMeasureRecordModel');

let YOUJI_TOKEN = undefined;

async function _fetchYoujiToken() {
  console.info('_fetchYoujiToken ' + new Date());
  // curl -X POST "https://open.youjiuhealth.com/api/session?app_id=699871606176812&app_secret=NjliY2MwZDcxNzg3Y2U3NGFkNGU5YzRkZThkNWFmZTc2MDEwNWY2Zg" -H "accept: application/vnd.XoneAPI.v2+json"
  return new Promise((resolve, reject) => {
    chai
      .request(`https://open.youjiuhealth.com`)
      .post(`/api/session?app_id=699871606176812&app_secret=NjliY2MwZDcxNzg3Y2U3NGFkNGU5YzRkZThkNWFmZTc2MDEwNWY2Zg`)
      .set('accept', 'application/vnd.XoneAPI.v2+json')
      .end((err, res) => {
        if (err) {
          console.error(err);
        }

        if (res && res.body && res.body.access_token) {
          YOUJI_TOKEN = res.body.access_token;
        }
        if (YOUJI_TOKEN === undefined) {
          console.error(`YOUJI_TOKEN is invalid`);
        }
        resolve(YOUJI_TOKEN);
      });
  });
}

//fetch token for firstTime
_fetchYoujiToken().then(token => {
  // console.log(token)
  // _fetchYoujiReportListByPhone("0962961214").then((result) => {
  // console.log(result.data);
  //   const measureId = result.data[1].measurement.id;
  //   _fetchYoujiReportDetailById(measureId).then((result) => {
  //     const fs = require('fs');
  //     fs.writeFileSync('data.json', JSON.stringify(result));
  //     console.log(result);
  //   });
  // })
});

//refresh token after 10 minutes
setInterval(() => {
  _fetchYoujiToken().then(token => {
    console.log(token);
  });
}, 1000 * 60 * 10); //10 minutes

function _convertYoujiRecordListToMeasureList(youjiRecordList) {
  let newMeasureList = [];
  if (!youjiRecordList || youjiRecordList.length <= 0) {
    return newMeasureList;
  }

  for (let i = 0; i < youjiRecordList.length; i++) {
    const _youjiRecord = youjiRecordList[i].measurement;
    let _newMeasureRecord = {
      id: _youjiRecord.id,
      date_check: moment(_youjiRecord.start_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY/MM/DD'),
      time: moment(_youjiRecord.start_time, 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
      email: _youjiRecord.email,
      height: _youjiRecord.height,
      weight: _youjiRecord.weight,
      gender: _youjiRecord.gender,
      birthday: _youjiRecord.birthday,
      age: _youjiRecord.age,
      score: _youjiRecord.score,
      outline: _youjiRecord.outline,
      testType: _youjiRecord.inclusion === 1 ? 'Body Composition Analysis' : 'Postural Assessment',
    };
    newMeasureList.push(_newMeasureRecord);
  }
  return newMeasureList;
}

function _assessmentTextFromValue(value) {
  if (value === 3) {
    return 'HIGH';
  } else if (value === 1) {
    return 'LOW';
  } else {
    return 'NORMAL';
  }
}

function _riskAssessmentTextFromValue(value) {
  if (value === 4) {
    return 'High';
  } else if (value === 3) {
    return 'Medium';
  } else if (value === 2) {
    return 'Low';
  } else {
    return 'No';
  }
}

function _convertYoujiRecordDetailToMeasureDetail(youjiRecord) {
  if (!youjiRecord) {
    return undefined;
  }

  let _newMeasureRecord = {
    id: youjiRecord.measurement.id,
    date_check: moment(youjiRecord.measurement.start_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY/MM/DD'),
    time: moment(youjiRecord.measurement.start_time, 'YYYY-MM-DD HH:mm:ss').format('hh:mm'),
    email: youjiRecord.measurement.email,
    height: youjiRecord.measurement.height,
    weight: youjiRecord.measurement.weight,
    gender: youjiRecord.measurement.gender,
    birthday: youjiRecord.measurement.birthday,
    age: youjiRecord.measurement.age,
    score: youjiRecord.measurement.score,
    outline: youjiRecord.measurement.outline,
    testType: youjiRecord.measurement.inclusion === 1 ? 'Body Composition Analysis' : 'Postural Assessment',
  };

  if (youjiRecord.measurement.inclusion === 1) {
    //  -------body composittion analysis
    const _youjiBodyComposition = youjiRecord.composition;
    let bodyComposittionAnalysis = [
      {
        bodyComposittionAnalysis_title: 'WEIGHT',
        bodyComposittionAnalysis_avg: _youjiBodyComposition.weight.value,
        bodyComposittionAnalysis_start_value: _youjiBodyComposition.weight.prv[0],
        bodyComposittionAnalysis_end_value: _youjiBodyComposition.weight.prv[1],
      },
      {
        bodyComposittionAnalysis_title: 'MINERAL',
        bodyComposittionAnalysis_avg: _youjiBodyComposition.mineral.value,
        bodyComposittionAnalysis_start_value: _youjiBodyComposition.mineral.prv[0],
        bodyComposittionAnalysis_end_value: _youjiBodyComposition.mineral.prv[1],
      },
      {
        bodyComposittionAnalysis_title: 'FAT FREE MASS',
        bodyComposittionAnalysis_avg: _youjiBodyComposition.ffm.value,
        bodyComposittionAnalysis_start_value: _youjiBodyComposition.ffm.prv[0],
        bodyComposittionAnalysis_end_value: _youjiBodyComposition.ffm.prv[1],
      },
      {
        bodyComposittionAnalysis_title: 'TOTAL BODYWATER',
        bodyComposittionAnalysis_avg: _youjiBodyComposition.tbw.value,
        bodyComposittionAnalysis_start_value: _youjiBodyComposition.tbw.prv[0],
        bodyComposittionAnalysis_end_value: _youjiBodyComposition.tbw.prv[1],
      },
      // {
      //   bodyComposittionAnalysis_title: "SOFT LEAN MASS",
      //   bodyComposittionAnalysis_avg: _youjiBodyComposition.slm.value,
      //   bodyComposittionAnalysis_start_value: _youjiBodyComposition.slm.prv[0],
      //   bodyComposittionAnalysis_end_value: _youjiBodyComposition.slm.prv[1],
      // },
      // {
      //   bodyComposittionAnalysis_title: "VISCERAL FAT INDEX",
      //   bodyComposittionAnalysis_avg: _youjiBodyComposition.weight.value,
      //   bodyComposittionAnalysis_start_value: _youjiBodyComposition.weight.prv[0],
      //   bodyComposittionAnalysis_end_value: _youjiBodyComposition.weight.prv[1],
      // },
      {
        bodyComposittionAnalysis_title: 'FAT',
        bodyComposittionAnalysis_avg: _youjiBodyComposition.fat.value,
        bodyComposittionAnalysis_start_value: _youjiBodyComposition.fat.prv[0],
        bodyComposittionAnalysis_end_value: _youjiBodyComposition.fat.prv[1],
      },
      {
        bodyComposittionAnalysis_title: 'PROTEIN',
        bodyComposittionAnalysis_avg: _youjiBodyComposition.protein.value,
        bodyComposittionAnalysis_start_value: _youjiBodyComposition.protein.prv[0],
        bodyComposittionAnalysis_end_value: _youjiBodyComposition.protein.prv[1],
      },
    ];
    _newMeasureRecord.bodyComposittionAnalysis = bodyComposittionAnalysis;

    //  -------health-assessment------
    const _youjiHealthAssessment = youjiRecord.composition;
    let healthAssessment = [
      {
        healthAssessment_title: `Basic Metabolic Rate`,
        healthAssessment_value: _youjiHealthAssessment.bmr.value,
        healthAssessment_unit: `KCAL`,
      },
      {
        healthAssessment_title: `Total Energy Expenditure`,
        healthAssessment_value: _youjiHealthAssessment.tee.value,
        healthAssessment_unit: `KCAL`,
      },
      {
        healthAssessment_title: `Physical Age`,
        healthAssessment_value: _youjiHealthAssessment.body_age.value,
        healthAssessment_unit: `YRS`,
      },
      {
        healthAssessment_title: `Risk Assessment`,
        healthAssessment_value: _riskAssessmentTextFromValue(youjiRecord.score),
        healthAssessment_unit: `Risk`,
      },
    ];
    _newMeasureRecord.healthAssessment = healthAssessment;

    //  ------segmental_Muscle------
    const _youjiSegmentalMuscle = youjiRecord.composition.segmental_muscle;
    _newMeasureRecord = {
      ..._newMeasureRecord,

      segmentalMuscle_LA: _youjiSegmentalMuscle.la.value,
      segmentalMuscle_LA_EVAL: _assessmentTextFromValue(_youjiSegmentalMuscle.la.grade),
      segmentalMuscle_RA: _youjiSegmentalMuscle.ra.value,
      segmentalMuscle_RA_EVAL: _assessmentTextFromValue(_youjiSegmentalMuscle.ra.grade),
      segmentalMuscle_TR: _youjiSegmentalMuscle.tr.value,
      segmentalMuscle_TR_EVAL: _assessmentTextFromValue(_youjiSegmentalMuscle.tr.grade),
      segmentalMuscle_LL: _youjiSegmentalMuscle.ll.value,
      segmentalMuscle_LL_EVAL: _assessmentTextFromValue(_youjiSegmentalMuscle.ll.grade),
      segmentalMuscle_RL: _youjiSegmentalMuscle.rl.value,
      segmentalMuscle_RL_EVAL: _assessmentTextFromValue(_youjiSegmentalMuscle.rl.grade),
    };

    //  ------segmental fat
    const _youjiSegmentalFat = youjiRecord.composition.segmental_fat;
    _newMeasureRecord = {
      ..._newMeasureRecord,

      segmentalFat_LA: _youjiSegmentalFat.la.value,
      segmentalFat_LA_EVAL: _assessmentTextFromValue(_youjiSegmentalFat.la.grade),
      segmentalFat_RA: _youjiSegmentalFat.ra.value,
      segmentalFat_RA_EVAL: _assessmentTextFromValue(_youjiSegmentalFat.ra.grade),
      segmentalFat_TR: _youjiSegmentalFat.tr.value,
      segmentalFat_TR_EVAL: _assessmentTextFromValue(_youjiSegmentalFat.tr.grade),
      segmentalFat_LL: _youjiSegmentalFat.ll.value,
      segmentalFat_LL_EVAL: _assessmentTextFromValue(_youjiSegmentalFat.ll.grade),
      segmentalFat_RL: _youjiSegmentalFat.rl.value,
      segmentalFat_RL_EVAL: _assessmentTextFromValue(_youjiSegmentalFat.rl.grade),
      segmentalFat_waistToHipFatRatio: youjiRecord.composition.whfr.value,
    };

    //  -------physical assessment-----
    const _youjiPhysicalAssessment = youjiRecord.composition;
    let PhysicalAssessment = [
      {
        PhysicalAssessment_title: 'BMI (KG/M2)',
        PhysicalAssessment_value: _youjiPhysicalAssessment.bmi.value,
        PhysicalAssessment_normal_range: `${_youjiPhysicalAssessment.bmi.prv[0]} ~ ${_youjiPhysicalAssessment.bmi.prv[1]}`,
      },
      {
        PhysicalAssessment_title: 'WEIGHT (KG)',
        PhysicalAssessment_value: _youjiPhysicalAssessment.weight.value,
        PhysicalAssessment_normal_range: `${_youjiPhysicalAssessment.weight.prv[0]} ~ ${_youjiPhysicalAssessment.weight.prv[1]}`,
      },
      {
        PhysicalAssessment_title: 'SKELETAL MUSCLE MASS (KG)',
        PhysicalAssessment_value: _youjiPhysicalAssessment.smm.value,
        PhysicalAssessment_normal_range: `${_youjiPhysicalAssessment.smm.prv[0]} ~ ${_youjiPhysicalAssessment.smm.prv[1]}`,
      },
      {
        PhysicalAssessment_title: 'BODY WATER (KG)',
        PhysicalAssessment_value: _youjiPhysicalAssessment.tbw.value,
        PhysicalAssessment_normal_range: `${_youjiPhysicalAssessment.tbw.prv[0]} ~ ${_youjiPhysicalAssessment.tbw.prv[1]}`,
      },
      {
        PhysicalAssessment_title: 'PERCENT BODY FAT (%)',
        PhysicalAssessment_value: _youjiPhysicalAssessment.pbf.value,
        PhysicalAssessment_normal_range: `${_youjiPhysicalAssessment.pbf.prv[0]} ~ ${_youjiPhysicalAssessment.pbf.prv[1]}`,
      },
    ];
    _newMeasureRecord.PhysicalAssessment = PhysicalAssessment;

    //  -----control advice-------
    const _youjiControlAdvice = youjiRecord.composition;
    let controlAdvice = [
      {
        controlAdvice_title: 'FAT (KG)',
        controlAdvice_curent: _youjiControlAdvice.fat.value,
        controlAdvice_control: `-${_youjiControlAdvice.fat_control.value}`,
      },
      {
        controlAdvice_title: 'MUSCLE (KG)',
        controlAdvice_curent: _youjiControlAdvice.muscle.value,
        controlAdvice_control: `+${_youjiControlAdvice.muscle_control.value}`,
      },
    ];
    _newMeasureRecord.controlAdvice = controlAdvice;
  } else {
    //  -----posture assessment-----
    const _youjiPosture = youjiRecord.posture;
    _newMeasureRecord.postureAssessment_front = _youjiPosture.front_photo_url;
    _newMeasureRecord.postureAssessment_back = _youjiPosture.left_photo_url;
    _newMeasureRecord.postureAssessment_side = _youjiPosture.back_photo_url;
  }

  return _newMeasureRecord;
}

async function _fetchYoujiReportListByPhone(phoneNumber, skip = 0) {
  console.info(`fetchYoujiReportListByPhone: ${phoneNumber} - ${new Date()}`);
  const _limit = 10;

  const _page = parseInt(skip / _limit) + 1;

  return new Promise((resolve, reject) => {
    chai
      .request(`https://open.youjiuhealth.com`)
      .get(`/api/reports?phone=${phoneNumber}&page=${_page}`)
      .set('accept', 'application/vnd.XoneAPI.v2+json')
      .set('Authorization', `Bearer ${YOUJI_TOKEN}`)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        if (res && res.body) {
          resolve(res.body);
        } else {
          resolve(undefined);
        }
      });
  });
}

async function _fetchYoujiReportDetailById(id) {
  console.info(`_fetchYoujiReportDetailById: ${id} - ${new Date()}`);

  return new Promise((resolve, reject) => {
    chai
      .request(`https://open.youjiuhealth.com`)
      .get(`/api/reports/${id}`)
      .set('accept', 'application/vnd.XoneAPI.v2+json')
      .set('Authorization', `Bearer ${YOUJI_TOKEN}`)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        if (res && res.body) {
          resolve(res.body);
        } else {
          resolve(undefined);
        }
      });
  });
}

async function fetchRecordDetailById(id) {
  let measureRecordData = await _fetchYoujiReportDetailById(id);

  measureRecordData = _convertYoujiRecordDetailToMeasureDetail(measureRecordData.data);

  return measureRecordData;
}

async function fetchRecordListByPhone(phoneNumber, skip = 0) {
  let _recordData = await _fetchYoujiReportListByPhone(phoneNumber, skip);
  let outputData = {
    data: [],
    total: 0,
  };

  if (_recordData && _recordData.data) {
    outputData.data = _convertYoujiRecordListToMeasureList(_recordData.data);
    outputData.total = _recordData.meta.pagination.total;
  }

  return outputData;
}

async function _fetchYoujiDetailForAllRecord(recordList) {
  let measureList = [];
  for (let i = 0; i < recordList.length; i++) {
    const _record = recordList[i];
    let measureRecord = await fetchRecordDetailById(_record.id);
    measureList.push(measureRecord);
  }
  return measureList;
}

//HistoricalRecord
function _extractHistoricalDataFromList(measureList, measureStartIndex) {
  //  -------historycal record-----
  let historicalMeasureList = [
    {
      HistoricalRecord_title: 'WEIGHT (KG)',
      HistoricalRecord_data1: '23.4',
    },
    {
      HistoricalRecord_title: 'PERCENT BODY FAT (%)',
      HistoricalRecord_data1: '23.4',
    },
    {
      HistoricalRecord_title: 'SKELETAL MUSCLE MASS (KG)',
      HistoricalRecord_data1: '23.4',
    },
    {
      HistoricalRecord_title: 'TIME',
      HistoricalRecord_data1: '10:04',
    },
  ];
  let historicalIndex = 1;
  for (let i = 0; i < measureList.length; i++) {
    const _measureData = measureList[i];
    //bo qua cac record moi, chi lay cac record cu hon record hien tai
    if (i < measureStartIndex) {
      continue;
    }
    if (measureList[i].testType === 'Body Composition Analysis') {
      historicalMeasureList[0][`HistoricalRecord_data${historicalIndex}`] = _measureData.weight;
      historicalMeasureList[1][`HistoricalRecord_data${historicalIndex}`] = _measureData.outline.pbf;
      historicalMeasureList[2][`HistoricalRecord_data${historicalIndex}`] = _measureData.outline.smm;
      historicalMeasureList[3][`HistoricalRecord_data${historicalIndex}`] = `${_measureData.date_check} ${_measureData.time}`;
      historicalIndex++;
    }
  }

  return historicalMeasureList;
}
async function fetchAllRecordByPhone(phoneNumber, skip = 0) {
  let _recordData = await _fetchYoujiReportListByPhone(phoneNumber, skip);
  let outputData = {
    data: [],
    total: 0,
  };

  if (_recordData && _recordData.data) {
    let measureList = [];
    measureList = _convertYoujiRecordListToMeasureList(_recordData.data);

    measureList = await _fetchYoujiDetailForAllRecord(measureList);

    for (let i = 0; i < measureList.length; i++) {
      if (measureList[i].testType === 'Body Composition Analysis') {
        measureList[i].HistoricalRecord = _extractHistoricalDataFromList(measureList, i);
      }
    }
    outputData.data = measureList;
    outputData.total = _recordData.meta.pagination.total;
  }

  return outputData;
}

module.exports = {
  fetchAllRecordByPhone,
  fetchRecordListByPhone,
  fetchRecordDetailById,
};
