/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

const BooksChapter = require('../API/BooksChapter/resourceAccess/BooksChapterResourceAccess');
const BooksResourceAccess = require('../API/Books/resourceAccess/BooksResourceAccess');

async function updateBooksTotalChapter() {
  console.log('updateBooksTotalChapter');
  let booksCount = await BooksResourceAccess.count({});
  if (booksCount === undefined) {
    console.log('No books count');
    return;
  }
  console.log(booksCount);
  booksCount = booksCount[0].count;

  for (let i = 0; i < booksCount; i++) {
    //update booksChapter count
    let booksData = await BooksResourceAccess.find({}, i, 1);
    if (booksData && booksData.length > 0) {
      booksData = booksData[0];
      let chapterCount = await BooksChapter.count({
        booksId: booksData.booksId,
      });
      if (chapterCount) {
        chapterCount = chapterCount[0].count;
        console.log(`${booksData.booksName} has ${chapterCount} chapters`);
        await BooksResourceAccess.updateById(booksData.booksId, {
          booksTotalChapter: chapterCount,
        });
      }
    }
  }
}

updateBooksTotalChapter();
