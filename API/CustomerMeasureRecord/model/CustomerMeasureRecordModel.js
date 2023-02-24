/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';

const moment = require('moment');

function fromData(data) {
  let modelData = data;
  // let modelData = {
  //   id: data.id,
  //   date_check: data.date_check,
  //   time: data.time,

  //   //  -------health-assessment------
  //   healthAssessment_title: data.healthAssessment_title,
  //   healthAssessment_value: data.healthAssessment_value,
  //   healthAssessment_unit: data.healthAssessment_unit,

  //   //  -------body composittion analysis
  //   bodyComposittionAnalysis_title: data.bodyComposittionAnalysis_title,
  //   bodyComposittionAnalysis_avg: data.bodyComposittionAnalysis_avg,
  //   bodyComposittionAnalysis_start_value: data.bodyComposittionAnalysis_start_value,
  //   bodyComposittionAnalysis_end_value: data.bodyComposittionAnalysis_end_value,

  //   //  -----control advice-------
  //   controlAdvice_title: data.controlAdvice_title,
  //   controlAdvice_curent: data.controlAdvice_curent,
  //   controlAdvice_control: data.controlAdvice_control,

  //   //  -------historycal record-----
  //   HistoricalRecord_title: data.HistoricalRecord_title,
  //   HistoricalRecord_data: data.HistoricalRecord_data,

  //   //  -------physical assessment-----
  //   PhysicalAssessment_title: data.PhysicalAssessment_title,
  //   PhysicalAssessment_value: data.id,
  //   PhysicalAssessment_normal_range: data.PhysicalAssessment_normal_range,

  //   //  ------segmental_Muscle------
  //   segmentalMuscle_LA: data.segmentalMuscle_LA,
  //   segmentalMuscle_RA: data.segmentalMuscle_RA,
  //   segmentalMuscle_TR: data.segmentalMuscle_TR,
  //   segmentalMuscle_LL: data.segmentalMuscle_LL,
  //   segmentalMuscle_RL: data.segmentalMuscle_RL,

  //   //  ------segmental fat
  //   segmentalFat_LA: data.segmentalFat_LA,
  //   segmentalFat_RA: data.segmentalFat_RA,
  //   segmentalFat_TR: data.segmentalFat_TR,
  //   segmentalFat_LL: data.segmentalFat_LL,
  //   segmentalFat_RL: data.segmentalFat_RL,
  //   segmentalFat_waistToHipFatRatio: data.segmentalFat_waistToHipFatRatio,

  //   //  -----posture assessment-----
  //   postureAssessment_title: data.postureAssessment_title,
  //   postureAssessment_front: data.postureAssessment_front,
  //   postureAssessment_back: data.postureAssessment_back,
  //   postureAssessment_side: data.postureAssessment_side,
  // };

  return modelData;
}

module.exports = {
  fromData,
};
