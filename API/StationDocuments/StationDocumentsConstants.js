/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

module.exports = {
  RECORD_ERRORS: {
    RECORD_NOT_EXIST: 'RECORD_NOT_EXIST',
    INVALID_RECORD: 'INVALID_RECORD',
    RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
  },
  DOCUMENT_TYPES: {
    NORMAL_DOCUMENT: 1, // tai lieu
    ANNOUCEMENT_DOCUMENT: 2, // cong van
  },
  FILE_TYPES: {
    WORD: 1,
    POWER_POINT: 2,
    PDF: 3,
    EXCEL: 4,
  },
  DOCUMENT_STATUS: {
    IS_BEING_ISSUED: 10, // dang dược ban hanh
    NOT_ISSUED_YET: 20, // chua ban hanh
  },
};
