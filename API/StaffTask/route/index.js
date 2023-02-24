/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const StaffTask = require('./StaffTaskRoute');
const TaskAttachmentRoute = require('./TaskAttachmentRoute');

module.exports = [
  { method: 'POST', path: '/StaffTask/insert', config: StaffTask.insert },
  { method: 'POST', path: '/StaffTask/deleteById', config: StaffTask.deleteById },
  { method: 'POST', path: '/StaffTask/updateById', config: StaffTask.updateById },
  { method: 'POST', path: '/StaffTask/updateStaffOnTask', config: StaffTask.updateStaffOnTask },
  { method: 'POST', path: '/StaffTask/findById', config: StaffTask.finById },
  { method: 'POST', path: '/StaffTask/find', config: StaffTask.find },
  { method: 'POST', path: '/StaffTask/generateTask', config: StaffTask.generateTask },
  { method: 'POST', path: '/StaffTask/statisticalWorkProgress', config: StaffTask.statisticalWorkProgress },
  { method: 'POST', path: '/StaffTask/statisticalAmountOfWork', config: StaffTask.statisticalAmountOfWork },
  { method: 'POST', path: '/StaffTask/statisticalOutOfWork', config: StaffTask.statisticalOutOfWork },

  //TaskAttachment
  { method: 'POST', path: '/TaskAttachment/insert', config: TaskAttachmentRoute.insert },
  // { method: 'POST', path: '/TaskAttachment/updateById', config: TaskAttachmentRoute.updateById },
  { method: 'POST', path: '/TaskAttachment/deleteById', config: TaskAttachmentRoute.deleteById },
  // { method: 'POST', path: '/TaskAttachment/findById', config: TaskAttachmentRoute.findById },
  { method: 'POST', path: '/TaskAttachment/find', config: TaskAttachmentRoute.find },
];
