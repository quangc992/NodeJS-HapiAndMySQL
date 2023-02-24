/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const Logger = require('../../../utils/logging');
const moment = require('moment');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { DOCUMENT_TYPES, DOCUMENT_STATUS, FILE_TYPES } = require('../StationDocumentsConstants');
const tableName = 'StationDocuments';
const primaryKeyField = 'StationDocumentsId';
require('dotenv').config();

async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, table => {
          table.increments(`${primaryKeyField}`).primary();
          table.string('documentCode');
          table.string('documentName');
          table.integer('documentType');
          table.string('fileUrl');
          table.string('thumbnailUrl');
          table.integer('fileType');
          table.integer('documentStatus'); // 0 is published, 1 is ...
          table.integer('stationsId');
          table.integer('createdByStaffId');
          table.string('issuedDate');
          timestamps(table);
          table.index(primaryKeyField);
          table.index('documentName');
          table.index('documentType');
        })
        .then(() => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          seeding().then(() => {
            resolve();
          });
        })
        .catch(e => {
          Logger.info(`${tableName}`, `${tableName} table created failure`);
          reject(e);
        });
    });
  });
}

async function seeding() {
  const _hostName = process.env.HOST_NAME || 'var-server.var.makefamousapp.com';
  const seedingData = [
    {
      documentName: 'Tài liệu kết hoạch đầu tư',
      documentCode: '123/DKVN-TS',
      documentType: DOCUMENT_TYPES.TAI_LIEU,
      fileUrl: `https://${_hostName}/uploads/documents/doc2.docx`,
      thumbnailUrl: `https://${_hostName}/uploads/thumnail_word.png`,
      fileType: FILE_TYPES.WORD,
      documentStatus: DOCUMENT_STATUS.PUBLISHED,
      issuedDate: moment().format(),
      createdByStaffId: 1,
      stationsId: 7,
    },
    {
      documentName: 'Công văn đề nghị thực hiện dự án đầu tư',
      documentCode: '1637/DKVN-TS',
      documentType: DOCUMENT_TYPES.CONG_VAN,
      fileUrl: `https://${_hostName}/uploads/documents/doc1.pptx`,
      thumbnailUrl: `https://${_hostName}/uploads/thumnail_pptx.png`,
      fileType: FILE_TYPES.POWER_POINT,
      documentStatus: DOCUMENT_STATUS.PUBLISHED,
      issuedDate: moment().format(),
      createdByStaffId: 1,
      stationsId: 7,
    },
    {
      documentName: 'Tài liệu chính trị văn hóa trong cơ quan',
      documentCode: '1272/DKVN-TS',
      documentType: DOCUMENT_TYPES.TAI_LIEU,
      fileUrl: `https://${_hostName}/uploads/documents/doc3.pdf`,
      thumbnailUrl: `https://${_hostName}/uploads/thumnail_pdf.png`,
      fileType: FILE_TYPES.PDF,
      documentStatus: DOCUMENT_STATUS.PUBLISHED,
      issuedDate: moment().format(),
      createdByStaffId: 1,
      stationsId: 7,
    },
    {
      documentName: 'Tài liệu cơ sở văn hóa Việt Nam',
      documentCode: '3823/DKVN-TS',
      documentType: DOCUMENT_TYPES.TAI_LIEU,
      fileUrl: `https://${_hostName}/uploads/documents/doc2.docx`,
      thumbnailUrl: `https://${_hostName}/uploads/thumnail_word.png`,
      fileType: FILE_TYPES.WORD,
      documentStatus: DOCUMENT_STATUS.PUBLISHED,
      issuedDate: moment().format(),
      createdByStaffId: 1,
      stationsId: 5,
    },
    {
      documentName: 'Công văn khẩn của sở kế hoạch và đầu tư',
      documentCode: '3231/DKVN-TS',
      documentType: DOCUMENT_TYPES.CONG_VAN,
      fileUrl: `https://${_hostName}/uploads/documents/doc3.pdf`,
      thumbnailUrl: `https://${_hostName}/uploads/thumnail_pdf.png`,
      fileType: FILE_TYPES.PDF,
      documentStatus: DOCUMENT_STATUS.PUBLISHED,
      issuedDate: moment().format(),
      createdByStaffId: 1,
      stationsId: 13,
    },
    {
      documentName: 'Công văn chông cho cả phòng ban',
      documentCode: '3283/DKVN-TS',
      documentType: DOCUMENT_TYPES.CONG_VAN,
      fileUrl: `https://${_hostName}/uploads/documents/doc4.xlsx`,
      thumbnailUrl: `https://${_hostName}/uploads/thumnail_pdf.png`,
      fileType: FILE_TYPES.EXCEL,
      documentStatus: DOCUMENT_STATUS.PUBLISHED,
      issuedDate: moment().format(),
      createdByStaffId: 1,
      stationsId: 7,
    },
    {
      documentName: 'Công văn tập huấn nội bộ',
      documentCode: '8573/DKVN-TS',
      documentType: DOCUMENT_TYPES.CONG_VAN,
      fileUrl: `https://${_hostName}/uploads/documents/doc3.pdf`,
      thumbnailUrl: `https://${_hostName}/uploads/thumnail_pdf.png`,
      fileType: FILE_TYPES.PDF,
      documentStatus: DOCUMENT_STATUS.PUBLISHED,
      issuedDate: moment().format(),
      createdByStaffId: 1,
      stationsId: 4,
    },
  ];
  return new Promise(async (resolve, reject) => {
    if (seedingData.length === 0) {
      resolve();
    } else {
      DB(`${tableName}`)
        .insert(seedingData)
        .then(result => {
          Logger.info(`${tableName}`, `seeding ${tableName}` + result);
          resolve();
        });
    }
  });
}

async function initDB() {
  await createTable();
}

function insert(data) {
  return Common.insert(tableName, data);
}

function updateById(id, data) {
  if (!data || Object.keys(data).length === 0) {
    return 1;
  }
  let filter = {};
  filter[primaryKeyField] = id;
  return Common.updateById(tableName, filter, data);
}

function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return Common.deleteById(tableName, dataId);
}

function find(filter, skip, limit, order) {
  return Common.find(tableName, filter, skip, limit, order);
}

function findById(id) {
  return Common.findById(tableName, primaryKeyField, id);
}

function updateAll(data, filter) {
  return Common.updateAll(tableName, data, filter);
}

function _createQueryBuilderByConditions(filter, skip, limit, startDate, endDate, searchText, order) {
  const queryBuilder = DB(tableName);
  const filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('documentName', 'like', `%${searchText}%`);
    });
  }

  queryBuilder.where({ isDeleted: 0 });

  queryBuilder.where(filterData);

  if (limit !== undefined) {
    queryBuilder.limit(limit);
  }

  if (skip !== undefined) {
    queryBuilder.offset(skip);
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  if (order && order.key !== '' && ['desc', 'asc'].includes(order.value)) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy('createdAt', 'desc');
  }

  return queryBuilder;
}

function customSearch(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _createQueryBuilderByConditions(filter, skip, limit, startDate, endDate, searchText, order);
  return query.select();
}

async function customCount(filter, startDate, endDate, searchText, order) {
  let query = _createQueryBuilderByConditions(filter, undefined, undefined, startDate, endDate, searchText, order);

  let count;

  try {
    const [record] = await query.count(`${primaryKeyField} as count`);
    if (record || record === 0) {
      count = record.count;
    }
  } catch (e) {
    Logger.error('ResourceAccess', `DB COUNT ERROR: ${tableName} : ${JSON.stringify(filter)} - ${JSON.stringify(order)}`);
    Logger.error('ResourceAccess', e);
  }

  return count;
}

module.exports = {
  initDB,
  insert,
  updateById,
  deleteById,
  find,
  findById,
  updateAll,
  customSearch,
  customCount,
};
