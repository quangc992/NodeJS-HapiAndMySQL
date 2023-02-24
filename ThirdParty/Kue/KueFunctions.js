/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { KueInstance, TaskQueue } = require('./KueInstance');

const kueUrl = `http://0.0.0.0:${process.env.KUE_PORT}`;

let TASK_PER_BATCH = 20;
async function executeTask(queueName, executeFunction, taskCount = TASK_PER_BATCH) {
  return new Promise((resolve, reject) => {
    try {
      TaskQueue.process(`${queueName}`, taskCount, function (job, done) {
        executeFunction(job.data, result => {
          if (result) {
            return done(null, result);
          } else {
            console.error(`ERROR: executeFunction ${job.data}`);
          }
          resolve(result);
          return done(new Error('invalid to address'));
        });
      });
    } catch (e) {
      console.error(`ERROR: executeTask ${queueName} count ${taskCount}`);
      console.error(e);
      reject('failed');
    }
  });
}

async function _getStats() {
  console.log('_getStats');
  return new Promise((resolve, reject) => {
    chai
      .request(kueUrl)
      .get(`/stats`)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        console.log(res.body);

        resolve(res.body);
      });
  });
}

async function createTask(queueName, taskData) {
  let projectName = process.env.PROJECT_NAME;
  let environment = process.env.NODE_ENV;
  return new Promise(async (resolve, reject) => {
    try {
      if (taskData.id === undefined) {
        reject('task must have id attribute');
        return;
      }

      let taskId = `${projectName}_${environment}_${queueName}_${taskData.id}`;
      var job = TaskQueue.create(queueName, {
        id: taskId,
        ...taskData,
      })
        .removeOnComplete(true)
        .save(function (err) {
          if (err) {
            console.log(err);
            console.error(`${job.id} has error on data for ${taskId}`);
            reject('task must have id attribute');
            return;
          }
          resolve('Done');
        });
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}

async function cleanAllTask(queueName) {
  await cleanupTaskList(queueName, 'active');
  await cleanupTaskList(queueName, 'inactive');
  await cleanupTaskList(queueName, 'failed');
  await cleanupTaskList(queueName, 'complete');
}
async function cleanupTaskList(queueName, type) {
  console.log(`cleanupTaskList ${queueName}: ${type}`);

  return new Promise((resolve, reject) => {
    KueInstance.Job.rangeByType(queueName, type, 0, -1, 'asc', function (err, selectedJobs) {
      for (let i = 0; i < selectedJobs.length; i++) {
        const oldJob = selectedJobs[i];
        oldJob.remove();
      }
      resolve('done');
    });
  });
}

_getStats();

module.exports = {
  executeTask,
  createTask,
  cleanAllTask,
  cleanupTaskList,
};
