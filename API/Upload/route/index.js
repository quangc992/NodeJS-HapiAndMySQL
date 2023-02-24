/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const Upload = require('./UploadRoute');

module.exports = [
  { method: 'POST', path: '/Upload/uploadMediaFile', config: Upload.uploadMediaFile },
  { method: 'POST', path: '/Upload/uploadUserAvatar', config: Upload.uploadUserAvatar },
];
