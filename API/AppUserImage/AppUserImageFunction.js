/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const { UNKNOWN_ERROR } = require('../Common/CommonConstant');
const AppUserImageResourceAccess = require('./resourceAccess/AppUserImageResourceAccess');
const AppUserView = require('../AppUsers/resourceAccess/AppUserView');

async function insertImagesUser(appUserId, staffId, listImages) {
  let isSuccess = true;
  for (let imageUrl of listImages) {
    let imageData = {
      appUserId: appUserId,
      staffId: staffId,
      userImageUrl: imageUrl,
    };
    let result = await AppUserImageResourceAccess.insert(imageData);

    if (!result) {
      console.error(`can not insertImagesUser AppUserId ${appUserId}: ${UNKNOWN_ERROR}`);
      return undefined;
    }
  }

  if (isSuccess) {
    return isSuccess;
  } else {
    console.error(`can not insertImagesUser AppUserId ${appUserId}: ${UNKNOWN_ERROR}`);
    return undefined;
  }
}

async function updateImagesUser(listImages, appUserId, staffId) {
  let userImages = await AppUserImageResourceAccess.find({ appUserId: appUserId });

  if (userImages && userImages.length > 0) {
    for (let image of userImages) {
      let isDeleted = await AppUserImageResourceAccess.deleteById(image.AppUserImageId);
      if (!isDeleted) {
        console.error(`can not delete AppUserId ${appUserId}: ${UNKNOWN_ERROR}`);
        return undefined;
      }
    }
  }
  if (listImages.length > 0) {
    let result = await insertImagesUser(appUserId, staffId, listImages);
    if (!result) {
      console.error(`can not updateImagesUser AppUserId ${appUserId}: ${UNKNOWN_ERROR}`);
      return undefined;
    } else {
      return result;
    }
  } else {
    return 'success';
  }
}

async function getImagesUser(appUserId) {
  let listUserImages = [];
  let userImages = await AppUserImageResourceAccess.find({ appUserId: appUserId });
  if (userImages && userImages.length > 0 && userImages.length < 100) {
    for (let imageUrl of userImages) {
      listUserImages.push({ id: imageUrl.AppUserImageId, imageUrl: imageUrl.userImageUrl });
    }
  }
  return listUserImages;
}

module.exports = {
  insertImagesUser,
  updateImagesUser,
  getImagesUser,
};
