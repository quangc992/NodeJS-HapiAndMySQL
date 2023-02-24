/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

module.exports = {
  MESSAGE_CATEGORY: {
    SMS: 'SMS',
    EMAIL: 'Email',
    ZNS: 'ZNS',
  },
  MESSAGE_STATUS: {
    NEW: 'New',
    SENDING: 'Sending',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    CANCELED: 'Canceled',
  },
  MESSAGE_TOPIC: {
    GENERAL: 'GENERAL',
    REALESTATE: 'REALESTATE', //REALESTATE_<ID của realestate>
    USER: 'USER', //USER_<ID của user>
    NEW_REAL_ESTATE: 'NEW_REAL_ESTATE', //NEW_REAL_ESTATE_<AREAprovince>_<AREAdistrict>_<AREAward>
  },
  MESSAGE_TYPE: {
    GENERAL: 'GENERAL',
    REALESTATE: 'REALESTATE',
    USER: 'USER',
  },
  REFUSE_POST: {
    customerMessageTitle: 'Bài viết của bạn đã bị từ chối',
    customerMessageContent: 'Bài viết #{{postId}} của bạn đã bị quản trị viên từ chối vào lúc {{timeRefused}} do vi phạm tiêu chuẩn của công ty',
    customerMessageCategories: 'USER_{{userId}}',
    messageSendStatus: 'New',
  },
  REPORTED_POST: {
    customerMessageTitle: 'Có người đã báo cáo bài viết của bạn',
    customerMessageContent:
      'Có người đã báo cáo bài viết #{{postId}} của bạn vì lý do {{reason}} vào lúc {{timeRefused}}. Hệ thống đã tạm ẩn bài viết',
    customerMessageCategories: 'USER_{{userId}}',
    messageSendStatus: 'New',
  },
};
