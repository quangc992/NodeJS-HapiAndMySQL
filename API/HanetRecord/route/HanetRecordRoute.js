/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const moduleName = 'HanetRecord';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require('joi');
const Response = require('../../Common/route/response').setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const customerCheckin = {
  action_type: Joi.string(), //type sẽ là"update" để xác định thao tác thêm mới/cập nhật
  aliasID: Joi.string(), //: là id định danh của một FaceID.
  data_type: Joi.string(), //: type là "log" để xác định loại dữ liệu là dữ liệu chấm công
  date: Joi.string(), //: Date format: YYYY-MM-DD HH:mm:ss
  detected_image_url: Joi.string(), //: link checkin của FaceID.
  deviceID: Joi.string(), //: là id của device
  deviceName: Joi.string(), //: là tên của device
  hash: Joi.string(), //: MD5 của "client_secret" + "id", dùng để verify record này là được gửi từ HANET
  id: Joi.string(), //: unique record ID
  keycode: Joi.string(), //: là token định danh của đối tác gửi cho HANET khi authen qua Oauth
  personID: Joi.string(), //: id định danh của một FaceID
  personName: Joi.string(), //: tên của FaceID
  personTitle: Joi.string(), //: chức danh của FaceID
  personType: Joi.string(), //: có các giá trị (0,1,2,3,4,5,6) trong đó giá trị (0 là Nhân viên) hoặc (1 là Khách hàng) còn (2,3,4,5 là người lạ), (6 là ảnh chụp hình từ camera).
  placeID: Joi.string(), //: là ID của địa điểm mà camera đang dùng
  placeName: Joi.string(), //: là tên địa điểm.
  mask: Joi.string(), //: thông tin có đeo khẩu trang hay ko (-1: không có bật tính năng kiểm tra khẩu trang, 0: không đeo khẩu trang, 2: có đeo khẩu trang)
  time: Joi.string(), //: Timestamp tại thời điểm camera checkin.
};

module.exports = {
  customerCheckinHook: {
    tags: ['api', `${moduleName}`],
    description: `insert ${moduleName}`,
    // pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    // auth: {
    //   strategy: 'jwt',
    // },
    // validate: {
    //   headers: Joi.object({
    //     authorization: Joi.string(),
    //   }).unknown(),
    //   payload: Joi.object({}).unknown(),
    // },
    handler: function (req, res) {
      Response(req, res, 'customerCheckinHook');
    },
  },
};
