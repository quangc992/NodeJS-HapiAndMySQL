/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const GeneralInformation = require('./GeneralInformationRoute');
const GeneralInformation_User = require('./GeneralInformation_UserRoute');

module.exports = [
  //Api CustomerSchedule
  {
    method: 'POST',
    path: '/GeneralInformation/find',
    config: GeneralInformation.find,
  },
  {
    method: 'POST',
    path: '/GeneralInformation/updateAboutUs',
    config: GeneralInformation.updateAboutUs,
  },
  {
    method: 'POST',
    path: '/GeneralInformation/updateAppPolicy',
    config: GeneralInformation.updateAppPolicy,
  },
  {
    method: 'POST',
    path: '/GeneralInformation/updateGeneralRule',
    config: GeneralInformation.updateGeneralRule,
  },
  {
    method: 'POST',
    path: '/GeneralInformation/updateQuestionAndAnwser',
    config: GeneralInformation.updateQuestionAndAnwser,
  },

  {
    method: 'POST',
    path: '/GeneralInformation/user/getAboutUs',
    config: GeneralInformation_User.userGetAboutUs,
  },
  {
    method: 'POST',
    path: '/GeneralInformation/user/getAppPolicy',
    config: GeneralInformation_User.userGetAppPolicy,
  },
  {
    method: 'POST',
    path: '/GeneralInformation/user/getGeneralRule',
    config: GeneralInformation_User.userGetGeneralRule,
  },
  {
    method: 'POST',
    path: '/GeneralInformation/user/getQuestionAndAnwser',
    config: GeneralInformation_User.userGetQuestionAndAnwser,
  },
  {
    method: 'GET',
    path: '/GeneralInformation/user/viewAppPolicy',
    config: GeneralInformation_User.userViewAppPolicy,
  },
  {
    method: 'GET',
    path: '/GeneralInformation/user/viewGeneralRule',
    config: GeneralInformation_User.userViewGeneralRule,
  },
];
