/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const Staff = require('./StaffRoute');

module.exports = [
  { method: 'POST', path: '/Staff/loginStaff', config: Staff.loginStaff },
  { method: 'POST', path: '/Staff/registerStaff', config: Staff.registerStaff },
  { method: 'POST', path: '/Staff/updateStaffById', config: Staff.updateById },
  { method: 'POST', path: '/Staff/deleteStaffById', config: Staff.deleteById },
  { method: 'POST', path: '/Staff/getListStaff', config: Staff.find },
  { method: 'POST', path: '/Staff/insertStaff', config: Staff.insert },
  { method: 'POST', path: '/Staff/getDetailStaff', config: Staff.findById },
  { method: 'POST', path: '/Staff/resetPasswordStaff', config: Staff.resetPasswordStaff },
  { method: 'POST', path: '/Staff/changePasswordStaff', config: Staff.changePasswordStaff },
  { method: 'POST', path: '/Staff/adminChangePasswordStaff', config: Staff.adminChangePasswordStaff },
];
