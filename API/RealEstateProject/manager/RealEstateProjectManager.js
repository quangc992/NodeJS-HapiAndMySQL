/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 11/15/21.
 */
'use strict';
const RealEstateProjectResourceAccess = require('../resourceAccess/RealEstateProjectResourceAccess');
const Logger = require('../../../utils/logging');
const UploadFunction = require('../../Upload/UploadFunctions');
const folderUpload = 'realEstateProjectImage/';
const ExcelFunction = require('../../../ThirdParty/Excel/ExcelFunction');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateProjectData = req.payload;
      let result = await RealEstateProjectResourceAccess.insert(realEstateProjectData);
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;

      let realEstateProjects = await RealEstateProjectResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      let realEstateProjectCount = await RealEstateProjectResourceAccess.customCount(filter, startDate, endDate, searchText, order);
      if (realEstateProjects && realEstateProjectCount) {
        resolve({
          data: realEstateProjects,
          total: realEstateProjectCount[0].count,
        });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateProjectId = req.payload.id;
      let realEstateProject = await RealEstateProjectResourceAccess.findById(realEstateProjectId);
      if (realEstateProject) {
        resolve(realEstateProject);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateProjectId = req.payload.id;
      let realEstateProjectData = req.payload.data;
      let result = await RealEstateProjectResourceAccess.updateById(realEstateProjectId, realEstateProjectData);
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
/**
 *
 */
async function updateStatus(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateProjectId = req.payload.id;
      let status = req.payload.status;
      let result = await RealEstateProjectResourceAccess.updateById(realEstateProjectId, { status: status });
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
async function updateProgress(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateProjectId = req.payload.id;
      let progress = req.payload.progress;
      let result = await RealEstateProjectResourceAccess.updateById(realEstateProjectId, { progress: progress });
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

/**
 * Upload image for real estate project
 */
async function uploadImage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const id = req.payload.id;
      const imageData = req.payload.imageData;
      const imageFormat = req.payload.imageFormat;
      if (!imageData) {
        reject('Do not have image data');
        return;
      }
      var originaldata = Buffer.from(imageData, 'base64');
      let image = await UploadFunction.uploadMediaFile(originaldata, imageFormat, folderUpload + id.toString() + '/');
      if (image) {
        var result = await RealEstateProjectResourceAccess.updateById(id, {
          introduceImage: image,
        });
        if (result) {
          resolve(result);
        }
      } else {
        reject('failed to upload');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let result = await RealEstateProjectResourceAccess.deleteById(id);
      if (result) {
        resolve(result);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateStatusNote(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let statusNote = req.payload.statusNote;
      let result = await RealEstateProjectResourceAccess.updateById(id, {
        statusNote: statusNote,
      });
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function exportExcelFile(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;
      let realEstateProjects = await RealEstateProjectResourceAccess.customSearch(
        filter,
        undefined,
        undefined,
        startDate,
        endDate,
        searchText,
        order,
      );
      if (realEstateProjects && realEstateProjects.length > 0) {
        const fileName = 'BDS' + (new Date() - 1).toString();
        let filePath = await ExcelFunction.renderExcelFile(fileName, realEstateProjects, 'Real Estate Project');
        let url = `https://${process.env.HOST_NAME}/${filePath}`;
        resolve(url);
      } else {
        resolve('Not have data');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  insert,
  find,
  findById,
  updateById,
  updateStatus,
  updateProgress,
  uploadImage,
  deleteById,
  updateStatusNote,
  exportExcelFile,
};
