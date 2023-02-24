/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
var request = require('request');
var cheerio = require('cheerio');
const fs = require('fs');

const Logger = require('../utils/logging');
const BooksChapterResourceAccess = require('../API/BooksChapter/resourceAccess/BooksChapterResourceAccess');
const BooksImageResourceAccess = require('../API/BooksImage/resourceAccess/BooksImageResourceAccess');
const CrawlerUtils = require('./crawlerUtils');
const UploadFunctions = require('../API/Upload/UploadFunctions');

const ERROR_FETCH_FAILED = 'Can not fetch data';
const ERROR_EXTRACT_FAILED = 'extract failed';

async function _crawlChapterImage() {
  Logger.info('_crawlChapterImage', 'Start');
  let targetChapter = await BooksChapterResourceAccess.find({ booksChapterCrawlingStatus: 0, priority: 1 }, 0, 1);

  if (targetChapter === undefined || targetChapter.length < 1) {
    Logger.error('_crawlChapterImage', 'everything was done');
    return;
  }
  targetChapter = targetChapter[0];
  Logger.info('_crawlChapterImage', targetChapter.booksChapterOriginUrl);
  return new Promise(async (resolve, reject) => {
    var options = {
      url: targetChapter.booksChapterOriginUrl,
      headers: {
        'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Safari/537.36',
        'Content-Type': '',
        Cookie: '',
        Referer: '',
      },
    };

    request(options, async function (err, response, html) {
      if (err) {
        Logger.info('Error in request ', err);
      } else {
        try {
          var page = cheerio.load(html);
          let bookImageList = [];
          var imageArrayList = page('.chapter-images').children('img');
          if (imageArrayList.length < 1) {
            Logger.error(ERROR_FETCH_FAILED, targetChapter.booksChapterOriginUrl);
            return 'error';
          }
          Logger.info('_crawlChapterImage', imageArrayList.length);

          //extract book info from book list
          for (let i = 0; i < imageArrayList.length; i++) {
            const imageSource = page(imageArrayList[i]);

            let bookImageData = {
              booksImageUrl: '',
              booksImageOriginUrl: '',
              booksChapterId: targetChapter.booksChapterId,
              booksImageIndex: i,
            };

            let imageUrl = imageSource.prop('data-src');
            if (imageUrl === undefined) {
              imageUrl = imageSource.prop('src');
            }

            bookImageData.booksImageOriginUrl = imageUrl;

            //download image
            let downloadChapterImage = await CrawlerUtils.downloadImage(imageUrl);
            let imageData = await CrawlerUtils.getImageData(downloadChapterImage);

            //clear download image
            fs.unlinkSync(downloadChapterImage);

            //upload to image host
            let newChapterImageUrl = await UploadFunctions.uploadMediaFile(imageData, 'jpg');
            bookImageData.booksImageUrl = newChapterImageUrl;
            bookImageList.push(bookImageData);
          }

          let updateImageResult = await BooksImageResourceAccess.insert(bookImageList);
          if (updateImageResult) {
            BooksChapterResourceAccess.updateById(targetChapter.booksChapterId, { booksChapterCrawlingStatus: 1 });
          }
        } catch (e) {
          Logger.error(ERROR_EXTRACT_FAILED, e);
          resolve('done error');
        }
      }
      resolve('done');
    });
  });
}

async function crawlChapterDetail(priority) {
  Logger.info('crawlChapterDetail');
  _crawlChapterImage(priority);
}

crawlChapterDetail();

module.exports = {
  crawlChapterDetail,
};
