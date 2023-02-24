/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const BooksResourceAccess = require('./resourceAccess/BooksResourceAccess');
const BooksOverviewModel = require('./model/BooksOverviewModel');
const UtilFunctions = require('../ApiUtils/utilFunctions');
const Logger = require('../../utils/logging');

async function mappingToBookOverviewModel(books) {
  let bookList = [];

  for (let bookCounter = 0; bookCounter < books.length; bookCounter++) {
    const bookData = books[bookCounter];

    let bookModel = BooksOverviewModel.fromData(bookData);

    if (bookModel.error === undefined || bookModel.error === null || bookModel.error === '') {
      bookList.push(bookModel.value);
    } else {
      Logger.error('mappingToBookOverviewModel', bookModel.error);
    }
  }
  return bookList;
}

async function getBookList(filter, skip, limit, order) {
  let books = await BooksResourceAccess.find(filter, skip, limit, order);

  //Update search count
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    await BooksResourceAccess.updateSearchCount(book.booksId);
  }
  let booksCount = await BooksResourceAccess.count(filter, order);
  let bookList = await mappingToBookOverviewModel(books);
  let metadata = [];
  if (bookList && booksCount) {
    return { data: bookList, total: booksCount[0].count, metadata: metadata };
  } else {
    return { data: [], total: 0 };
  }
}

async function getLatestUpdate(filter, skip, limit) {
  let order = {
    key: 'booksUpdatedAt',
    value: 'desc',
  };

  return getBookList(filter, skip, limit, order);
}

async function getMostSearch(filter, skip, limit) {
  let order = {
    key: 'searchCount',
    value: 'desc',
  };
  return getBookList(filter, skip, limit, order);
}

async function getTopWeek(filter, skip, limit) {
  let order = {
    key: 'weekViewed',
    value: 'desc',
  };
  return getBookList(filter, skip, limit, order);
}

async function getTopMonth(filter, skip, limit) {
  let order = {
    key: 'monthViewed',
    value: 'desc',
  };
  return getBookList(filter, skip, limit, order);
}

async function getTopDay(filter, skip, limit) {
  let order = {
    key: 'dayViewed',
    value: 'desc',
  };
  return getBookList(filter, skip, limit, order);
}

async function getMostViewed(filter, skip, limit) {
  let order = {
    key: 'booksTotalViewed',
    value: 'desc',
  };
  return getBookList(filter, skip, limit, order);
}

async function getSummaryBooks(skip, limit) {
  let filter = {};
  let latestUpdateBooks = await getLatestUpdate(filter, skip, limit);
  let mostSearchBooks = await getMostSearch(filter, skip, limit);
  let mostViewedBooks = await getMostViewed(filter, skip, limit);
  let topDayBooks = await getTopDay(filter, skip, limit);
  let topMonthBooks = await getTopMonth(filter, skip, limit);
  let topWeekBooks = await getTopWeek(filter, skip, limit);

  return {
    latestUpdate: latestUpdateBooks,
    mostSearch: mostSearchBooks,
    mostViewed: mostViewedBooks,
    topDay: topDayBooks,
    topMonth: topMonthBooks,
    topWeek: topWeekBooks,
  };
}

async function getBookDetailsByUrl(booksUrl) {
  let bookInfo = await BooksResourceAccess.find({ booksUrl: booksUrl });
  if (bookInfo && bookInfo.length > 0) {
    bookInfo = bookInfo[0];
    await BooksResourceAccess.addViewCount(bookInfo.booksId);
    await BooksResourceAccess.updateSearchCount(bookInfo.booksId);
  }

  return bookInfo;
}

async function registerNewBook(bookData) {
  Logger.info('registerNewBook', JSON.stringify(bookData));
  try {
    //check existing booksUrl

    let booksUrl = bookData.booksUrl;

    if (booksUrl === undefined) {
      //generate booksUrl from booksName and check existing again
      booksUrl = UtilFunctions.nonAccentVietnamese(bookData.booksName);
      booksUrl = UtilFunctions.convertToURLFormat(booksUrl);
      bookData.booksUrl = booksUrl;
    }

    let existedBook = await BooksResourceAccess.find({ booksUrl: bookData.booksUrl }, 0, 1);
    if (existedBook && existedBook.length > 0) {
      Logger.info('registerNewBook existing', JSON.stringify(bookData));
      return;
    }

    //register new book
    bookData.booksTagCloud = await createBooksTagCloud(bookData);

    let insertResult = await BooksResourceAccess.insert(bookData);
    return insertResult;
  } catch (error) {
    Logger.error('registerNewBook', error);
    return undefined;
  }
}

async function createBooksTagCloud(bookData) {
  let booksCategoryList = bookData.booksCategories.split(';');
  let projectName = process.env.PROJECT_NAME || 'makefamousapp.com';
  let booksName = bookData.booksName || '';
  let tagCloud = [];
  for (let i = 0; i < booksCategoryList.length; i++) {
    tagCloud.push(booksCategoryList[i]);
    tagCloud.push(`${booksCategoryList[i]} ${projectName}`);
    tagCloud.push(`${booksCategoryList[i]} ${booksName}`);
    tagCloud.push(`${booksCategoryList[i]} ${projectName} ${booksName}`);
    tagCloud.push(`${booksCategoryList[i]} ${booksName} ${projectName}`);
    tagCloud.push(`${projectName} ${booksName} ${booksCategoryList[i]}`);
    tagCloud.push(`${booksName} ${projectName} ${booksCategoryList[i]}`);
  }
  return tagCloud.join(';');
}
module.exports = {
  getLatestUpdate,
  getMostSearch,
  getMostViewed,
  getTopDay,
  getTopMonth,
  getTopWeek,
  getSummaryBooks,
  getBookDetailsByUrl,
  getBookList,
  mappingToBookOverviewModel,
  registerNewBook,
  createBooksTagCloud,
};
