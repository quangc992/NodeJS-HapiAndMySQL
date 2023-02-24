/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

require('dotenv').config();
module.exports = {
  MESSAGE_CATEGORY: {
    SMS: 'SMS',
    EMAIL: 'Email',
    ZNS: 'ZNS',
    FIREBASE_PUSH: 'FIREBASE_PUSH',
    GENERAL: 'GENERAL',
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
    USER: 'USER', //USER_<ID của user>,
    AGENCY: 'AGENCY', //AGENCY_<ID của staff>
  },
  MESSAGE_TYPE: {
    GENERAL: 'GENERAL',
    CUSTOMER_SCHEDULE_NEW: 'CUSTOMER_SCHEDULE_NEW',
    CUSTOMER_SCHEDULE_CANCELED: 'CUSTOMER_SCHEDULE_CANCELED',
    CUSTOMER_SCHEDULE_APPROVED: 'CUSTOMER_SCHEDULE_APPROVED',
    USER: 'USER',
  },
  MESSAGE_RECEIVER: {
    USER: 1,
    STAFF: 2,
    AGENCY: 3,
  },
  REFUSE_POST: {
    customerMessageTitle: 'Bài viết #{{postId}} của bạn đã bị ẩn.',
    customerMessageContent: 'Bài viết #{{postId}} của bạn đã bị quản trị viên ẩn vào lúc {{timeRefused}} do vi phạm tiêu chuẩn của công ty.',
    customerMessageCategories: 'USER',
    customerMessageSendStatus: 'New',
  },
  RESTORE_POST: {
    customerMessageTitle: 'Bài viết #{{postId}} của bạn đã được khôi phục.',
    customerMessageContent:
      'Bài viết #{{postId}} của bạn đã được khôi phục vào lúc {{timeRefused}}. Giờ đây bạn đã có thể quảng cáo bài viết của mình.',
    customerMessageCategories: 'USER',
    customerMessageSendStatus: 'New',
  },
  REPORTED_POST: {
    customerMessageTitle: 'Có người đã báo cáo bài viết #{{postId}} của bạn.',
    customerMessageContent: 'Có người đã báo cáo bài viết #{{postId}} của bạn vì lý do {{reason}} vào lúc {{timeRefused}}.',
    customerMessageCategories: 'REALESTATE',
    customerMessageSendStatus: 'New',
  },
  UPDATE_POST_FOR_FOLLOWER: {
    customerMessageTitle: 'Bài viết #{{postId}} bạn quan tâm có cập nhật mới.',
    customerMessageContent: 'Bài viết #{{postId}} mà bạn quan tâm có cập nhật mới vào lúc {{timeUpdate}}. Click để xem ngay.',
    customerMessageCategories: 'REALESTATE',
    customerMessageSendStatus: 'New',
  },
  REFUSE_POST_FOR_FOLLOWER: {
    customerMessageTitle: 'Bài viết #{{postId}} bạn quan tâm đã bị ẩn.',
    customerMessageContent: 'Bài viết #{{postId}} mà bạn quan tâm đã bị ẩn vào lúc {{timeRefused}} do vi phạm tiêu chuẩn của công ty.',
    customerMessageCategories: 'REALESTATE',
    customerMessageSendStatus: 'New',
  },
  RESTORE_POST_FOR_FOLLOWER: {
    customerMessageTitle: 'Bài viết #{{postId}} bạn quan tâm đã được khổi phục.',
    customerMessageContent: 'Bài viết #{{postId}} mà bạn quan tâm đã đã được khôi phục vào lúc {{timeRefused}}. Giờ đây bạn có thể trao đổi mua bán.',
    customerMessageCategories: 'REALESTATE',
    customerMessageSendStatus: 'New',
  },
  USER_POST_NEW: {
    customerMessageTitle: 'Bạn vừa đăng bài viết #{{id}}.',
    customerMessageContent: 'Bạn vừa đăng bài viết #{{id}}.. Click để xem ngay.',
    customerMessageCategories: 'REALESTATE',
    customerMessageSendStatus: 'New',
  },
  NEW_POST: {
    customerMessageTitle: 'Bất động sản mới gần bạn.',
    customerMessageContent: 'Bài đăng bất động sản mới gần bạn. Click để xem ngay.',
    customerMessageCategories: 'REALESTATE',
    customerMessageSendStatus: 'New',
  },
  APPROVED_POST: {
    customerMessageTitle: 'Bài viết #{{postId}} của bạn đã được duyêt.',
    customerMessageContent: 'Bài viết #{{postId}} của bạn đã được duyệt vào lúc {{timeApprove}}.',
    customerMessageCategories: 'USER',
    customerMessageSendStatus: 'New',
  },
  APPROVED_PAYMENT: {
    customerMessageTitle: 'Giao dịch #{{paymentId}} đã thành công. Bạn được khuyến mãi +{{promotionMoney}} điểm.',
    customerMessageContent: 'Giao dịch #{{paymentId}} đã thành công. Bạn được khuyến mãi +{{promotionMoney}} điểm. Tổng số dư {{totalMoney}}',
    customerMessageCategories: 'USER',
    customerMessageSendStatus: 'New',
  },
  REFUSED_PAYMENT: {
    customerMessageTitle: `Giao dịch #{{paymentId}} thất bại. Nếu đó là lỗi, vui lòng liên hệ hotline ${process.env.HOTLINE} để được hỗ trợ tốt nhất.`,
    customerMessageContent: `Giao dịch #{{paymentId}} thất bại. Nếu đó là lỗi, vui lòng liên hệ hotline ${process.env.HOTLINE} để được hỗ trợ tốt nhất. Rất xin lỗi quý khách vì vấn đề này.`,
    customerMessageCategories: 'USER',
    customerMessageSendStatus: 'New',
  },
  REWARD_POINT: {
    customerMessageTitle: `Tài khoản của bạn được cộng thêm +{{money}} điểm.`,
    customerMessageContent: `Tài khoản của bạn được cộng thêm +{{money}} điểm vào lúc {{time}}.`,
    customerMessageCategories: 'USER',
    customerMessageSendStatus: 'New',
  },
  REWARD_MONEY: {
    customerMessageTitle: `Tài khoản của bạn được cộng thêm +{{money}} VND.`,
    customerMessageContent: `Tài khoản của bạn được cộng thêm +{{money}} VND vào lúc {{time}}.`,
    customerMessageCategories: 'USER',
    customerMessageSendStatus: 'New',
  },
  APPROVE_USER_INFO: {
    customerMessageTitle: `Thông tin của bạn đã được chấp nhận vào lúc {{time}}.`,
    customerMessageContent: `Thông tin của bạn đã được chấp nhận vào lúc {{time}}.`,
    customerMessageCategories: 'USER',
    customerMessageSendStatus: 'New',
  },
  REFUSED_USER_INFO: {
    customerMessageTitle: `Thông tin của bạn đã bị từ chối vào lúc {{time}}.`,
    customerMessageContent: `Thông tin của bạn đã bị từ chối vào lúc {{time}}. Vui lòng kiểm tra lại.`,
    customerMessageCategories: 'USER',
    customerMessageSendStatus: 'New',
  },
  USER_LOCKED: {
    customerMessageTitle: `Tài khoản của bạn đã bị khoá!`,
    customerMessageContent: `Tài khoản của bạn đã bị khoá vào lúc {{time}} do vi phạm chính sách của công ty. Nếu đây là lỗi vui lòng liên hệ tới hotline: ${process.env.HOTLINE} để được hỗ trợ.`,
    customerMessageCategories: 'USER',
    customerMessageSendStatus: 'New',
  },
  USER_ACTIVE: {
    customerMessageTitle: `Tài khoản của bạn đã hoạt động trở lại!`,
    customerMessageContent: `Tài khoản của bạn đã được hoạt động trở lại. Giờ đây bạn có để tìm kiếm hoặc đăng bán bất động sản.`,
    customerMessageCategories: 'USER',
    customerMessageSendStatus: 'New',
  },
  MESSAGE_ERROR: {
    MESSAGE_NOT_FOUND: 'MESSAGE_NOT_FOUND',
    NO_PERMISSION: 'NO_PERMISSION',
  },
};
