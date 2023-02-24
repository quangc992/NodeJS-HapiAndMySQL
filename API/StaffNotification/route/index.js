/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const StaffNotification = require('./StaffNotificationRoute');
const GroupNotification = require('./GroupStaffNotificationRoute');

module.exports = [
  { method: 'POST', path: '/StaffNotification/insert', config: StaffNotification.insert },
  { method: 'POST', path: '/StaffNotification/find', config: StaffNotification.find },
  { method: 'POST', path: '/StaffNotification/findById', config: StaffNotification.findById },
  { method: 'POST', path: '/StaffNotification/deleteById', config: StaffNotification.deleteById },

  { method: 'POST', path: '/GroupNotification/insert', config: GroupNotification.insert },
  { method: 'POST', path: '/GroupNotification/find', config: GroupNotification.find },
  { method: 'POST', path: '/GroupNotification/findById', config: GroupNotification.findById },
];
