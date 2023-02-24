/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const StationDocuments = require('./StationDocumentsRoute');

module.exports = [
  { method: 'POST', path: '/StationDocuments/insert', config: StationDocuments.insert },
  { method: 'POST', path: '/StationDocuments/find', config: StationDocuments.find },
  { method: 'POST', path: '/StationDocuments/findById', config: StationDocuments.findById },
  { method: 'POST', path: '/StationDocuments/updateById', config: StationDocuments.updateById },
  { method: 'POST', path: '/StationDocuments/deleteById', config: StationDocuments.deleteById },
];
