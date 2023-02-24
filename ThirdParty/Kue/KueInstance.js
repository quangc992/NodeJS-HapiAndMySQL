/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

var kue = require('kue');

const TaskQueue = kue.createQueue({
  // jobEvents: false, //Kue stores job objects in memory until they are complete/failed to be able to emit events on them. If you have a huge concurrency in uncompleted jobs, turn this feature off and use queue level events for better memory scaling.
  prefix: 'q',
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    options: {
      // see https://github.com/mranney/node_redis#rediscreateclient
      password: process.env.REDIS_PASS,
      auth: 'password',
    },
  },
});
async function init() {
  kue.app.set('Task queues', 'KUE Center');
  kue.app.listen(process.env.KUE_PORT, () => {
    console.log(`Kue running at: http://0.0.0.0:${process.env.KUE_PORT}`);
  });
}

module.exports = {
  init,
  TaskQueue: TaskQueue,
  KueInstance: kue,
};
