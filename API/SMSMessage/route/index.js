/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const SMSMessageRoute = require('./SMSMessageRoute');

module.exports = [
  { method: 'POST', path: '/SMSMessage/insert', config: SMSMessageRoute.insert },
  { method: 'POST', path: '/SMSMessage/find', config: SMSMessageRoute.find },
  { method: 'POST', path: '/SMSMessage/findById', config: SMSMessageRoute.findById },
  { method: 'POST', path: '/SMSMessage/updateById', config: SMSMessageRoute.updateById },

  // { method: "POST", path: "/SMSMessage/user/create", config: SMSMessageRoute.create },
  // { method: "POST", path: "/SMSMessage/user/getList", config: SMSMessageRoute.getList },
  // { method: "POST", path: "/SMSMessage/user/getDetailById", config: SMSMessageRoute.getDetailById },
  // { method: "POST", path: "/SMSMessage/user/updateDataMessage", config: SMSMessageRoute.updateDataMessage },
];
