/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const BooksResourceAccess = require('../resourceAccess/BooksResourceAccess');
const BookFunctions = require('../BooksFunctions');
const Logger = require('../../../utils/logging');
const SEOUtils = require('../../ApiUtils/seoUtils');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let booksData = req.payload;
      let result = await BookFunctions.registerNewBook(booksData);
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

      let books = await BooksResourceAccess.find(filter, skip, limit, order);
      let booksCount = await BooksResourceAccess.count(filter, order);
      if (books && booksCount) {
        resolve({ data: books, total: booksCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let booksId = req.payload.id;
      let booksData = req.payload.data;
      let result = await BooksResourceAccess.updateById(booksId, booksData);
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

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let booksId = req.payload.id;
      let result = await BooksResourceAccess.findById(booksId);
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

async function summaryView(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let skip = req.payload.skip;
      let limit = req.payload.limit;

      let summaryBooks = await BookFunctions.getSummaryBooks(skip, limit);
      resolve(summaryBooks);
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function latestUpdate(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let filter = req.payload.filter;
      let booksData = await BookFunctions.getLatestUpdate(filter, skip, limit);
      resolve(booksData);
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function mostSearch(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let filter = req.payload.filter;
      let booksData = await BookFunctions.getMostSearch(filter, skip, limit);
      resolve(booksData);
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function topDay(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let filter = req.payload.filter;
      let booksData = await BookFunctions.getTopDay(filter, skip, limit);
      resolve(booksData);
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function topMonth(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let filter = req.payload.filter;
      let booksData = await BookFunctions.getTopMonth(filter, skip, limit);
      resolve(booksData);
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function topWeek(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let filter = req.payload.filter;
      let booksData = await BookFunctions.getTopWeek(filter, skip, limit);
      resolve(booksData);
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function mostViewed(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let filter = req.payload.filter;
      let booksData = await BookFunctions.getMostViewed(filter, skip, limit);
      resolve(booksData);
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function searchBooks(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      let books = await BooksResourceAccess.customSearch(filter, skip, limit, order);
      let booksCount = await BooksResourceAccess.customCount(filter, order);
      let metadata = SEOUtils.getMetatagsForPages();
      books = await BookFunctions.mappingToBookOverviewModel(books);

      if (books && booksCount) {
        resolve({
          data: books,
          total: booksCount[0].count,
          metadata: metadata,
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

async function bookDetail(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let booksUrl = req.payload.booksUrl;
      let bookDetail = await BookFunctions.getBookDetailsByUrl(booksUrl);
      let metadata = SEOUtils.getMetatagsForBooks(bookDetail);
      if (bookDetail) {
        resolve({ data: bookDetail, metadata: metadata });
      } else {
        resolve({ data: {} });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function bookList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      let booksList = await BookFunctions.getBookList(filter, skip, limit, order);
      if (booksList) {
        resolve(booksList);
      } else {
        resolve({ data: [], total: 0 });
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
  updateById,
  findById,
  mostViewed,
  topWeek,
  topMonth,
  topDay,
  mostSearch,
  latestUpdate,
  summaryView,
  searchBooks,
  bookDetail,
  bookList,
};
