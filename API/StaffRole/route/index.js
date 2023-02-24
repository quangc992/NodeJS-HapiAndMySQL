/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const StaffRole = require('./StaffRoleRoute');

module.exports = [
  { method: 'POST', path: '/StaffRole/insert', config: StaffRole.insert },
  { method: 'POST', path: '/StaffRole/getList', config: StaffRole.find },
  // { method: 'POST', path: '/StaffRole/getDetailById', config: StaffRole.findById },
  { method: 'POST', path: '/StaffRole/updateById', config: StaffRole.updateById },
];
