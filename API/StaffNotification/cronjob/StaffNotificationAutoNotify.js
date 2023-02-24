/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const GenerateStaffNotificationJob = require('./GenerateStaffNotificationJob');

async function autoNotify() {
  await GenerateStaffNotificationJob.checkExpiredTask();
  process.exit();
}
autoNotify();
module.exports = {
  autoNotify,
};
