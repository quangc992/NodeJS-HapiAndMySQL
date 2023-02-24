/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

require('dotenv').config();
/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const HANET_AUTH_HOST = 'https://oauth.hanet.com';
const HANET_CLIENT_ID = '5cd6138e94a140e0b91f24505272a744';
const HANET_CLIENT_SECRET = 'f382d13cd9a13449e44c7263244347fa';
const HANET_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIzMTgwNzU0MDYwMjE3MDU3MjgiLCJlbWFpbCI6ImNoYXVwYWRAZ21haWwuY29tIiwiY2xpZW50X2lkIjoiNWNkNjEzOGU5NGExNDBlMGI5MWYyNDUwNTI3MmE3NDQiLCJ0eXBlIjoiYXV0aG9yaXphdGlvbl9jb2RlIiwiaWF0IjoxNjcxNjE0MTU1LCJleHAiOjE3MDMxNTAxNTV9.Vjv1lAh5ysTXH5Eej3nGAIrmEpJNzViPXrAoqex3ljk';
const HANET_API_HOST = 'https://partner.hanet.ai';
//NOT TESTED
async function getToken() {
  return new Promise((resolve, reject) => {
    const body = {
      code: 'code',
      grant_type: 'authorization_code',
      client_id: 'CLIENT_ID',
      redirect_uri: 'HTTP_CALLBACK_URL',
      client_secret: 'CLIENT_SECRET',
    };
    let _tokenUrl = '/token';
    var querystring = require('qs');
    _tokenUrl += '?' + querystring.stringify(body, { encode: true });

    chai
      .request(`${HANET_AUTH_HOST}`)
      .post(`/AppDevices/UpdateById`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        console.log(res.body);
        resolve(res.body);
      });
  });
}

let PLACE_ID = 13910;
async function getPlaces() {
  return new Promise((resolve, reject) => {
    const body = {
      token: HANET_TOKEN,
    };
    chai
      .request(`${HANET_API_HOST}`)
      .post(`/place/getPlaces`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        if (res.body && res.body.returnCode === 0) {
          PLACE_ID = res.body.data.length > 0 ? res.body.data[0].id : 13910;
          return resolve(res.body.data);
        }
        return resolve([]);
      });
  });
}

//Sample request
//registerPersonByUrl("https://i.dailymail.co.uk/1s/2018/12/21/00/7684868-6518423-image-m-127_1545353619137.jpg", "David", "STAFF_1");
async function registerPersonByUrl(imageUrl, personName, aliasID, type = '0') {
  return new Promise((resolve, reject) => {
    let body = {
      token: HANET_TOKEN,
      name: personName,
      url: imageUrl,
      aliasID: aliasID,
      type: type, //Nhân viên: 0, Khách hàng: 1. Mặc định sẽ là 0
      placeID: PLACE_ID,
    };
    var querystring = require('qs');
    body = querystring.stringify(body, { encode: true });

    chai
      .request(`${HANET_API_HOST}`)
      .post(`/person/registerByUrl`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }

        if (res.body && (res.body.returnCode === 0 || res.body.returnCode === 1)) {
          if (res.body.data) {
            return resolve(res.body.data.personID);
          }
        }
        return resolve(undefined);
      });
  });
}

// updateByFaceUrlByPersonID("https://i.dailymail.co.uk/1s/2018/12/21/00/7684868-6518423-image-m-127_1545353619137.jpg", "2320792753748721664");
async function updateByFaceUrlByPersonID(imageUrl, personID) {
  console.log('updateByFaceUrlByPersonID');
  return new Promise((resolve, reject) => {
    const body = {
      token: HANET_TOKEN,
      personID: personID,
      url: imageUrl,
      placeID: PLACE_ID,
    };
    chai
      .request(`${HANET_API_HOST}`)
      .post(`/person/updateByFaceUrlByPersonID`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }

        if (res.body && res.body.returnCode === 0) {
          if (res.body.data) {
            return resolve(res.body.data.path);
          }
        }
        return resolve(undefined);
      });
  });
}

module.exports = {
  registerPersonByUrl,
  updateByFaceUrlByPersonID,
};
