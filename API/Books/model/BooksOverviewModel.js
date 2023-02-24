/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';

const Joi = require('joi');

//this is output for client
const schema = Joi.object({
  booksName: Joi.string().required(),
  updatedAt: Joi.string().required(),
  booksAvatar: Joi.string().allow(''),
  booksId: Joi.number(),
  booksUrl: Joi.string(),
  booksChapter: Joi.array().items({
    booksChapterName: Joi.string().required().allow(''),
    booksChapterNumber: Joi.number().required(),
    booksChapterUrl: Joi.string(),
  }),
});

function fromData(data) {
  let modelData = {
    booksName: data.booksName,
    updatedAt: new Date(data.booksUpdatedAt).toISOString(),
    booksAvatar: data.booksAvatar,
    booksId: data.booksId,
    booksUrl: data.booksUrl,
  };

  modelData.booksChapter = [];
  if (data.booksChapter && data.booksChapter.length > 0) {
    for (let i = 0; i < data.booksChapter.length; i++) {
      const chapter = data.booksChapter[i];
      modelData.booksChapter.push({
        booksChapterName: chapter.booksChapterName,
        booksChapterNumber: chapter.booksChapterNumber,
        booksChapterUrl: chapter.booksChapterUrl,
      });
    }
  }

  return schema.validate(modelData);
}

module.exports = {
  fromData,
};
