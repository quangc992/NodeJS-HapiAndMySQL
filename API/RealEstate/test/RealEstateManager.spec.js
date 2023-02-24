/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
const Model = require('../resourceAccess/RealEstateResourceAccess');

const app = require('../../../server');
const { modelName } = require('../resourceAccess/RealEstateResourceAccess');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

describe(`Tests ${Model.modelName}`, function () {
  let realEstateId = 1;
  let token = '';
  let tokenUser = '';
  let fakeUserName = faker.name.firstName() + faker.name.lastName();
  fakeUserName = fakeUserName.replace("'", '');
  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginStaff();
      token = staffData.token;
      let userData = await TestFunctions.loginUser();
      tokenUser = userData.token;
      resolve();
    }).then(() => done());
  });
  it(`insert ${modelName}`, done => {
    const body = {
      data: {
        realEstateTitle: 'TÔI CHÍNH CHỦ CẦN BÁN 2 CĂN NHÀ Ở QUẬN BÌNH TÂN - SỔ HỒNG RIÊNG 2021',
        realEstatePhone: '0374307089',
        realEstateEmail: 'tranbachtruongan17@gmail.com',
        realEstateContacAddress: 'Cần giờ Tp HCM',
        realEstateDescription:
          ' Diện tích: 4m x 15m (hai căn có cùng diện tích, 1 căn hướng Tây và 1 căn hướng Đông)Kết Cấu: 4 Tấm có Sân Thượng.1. Thiết bị vệ sinh Cao cấp2. Tặng Máy nước nóng Năng lượng Mặt trời 160 Lít.Vị trí: Hẻm 1 sẹc Đường Bình Thành, P. Bình Hưng Hoà B, Quận Bình Tân. Thiết kế: 1 Trệt, 3 Lầu, Tất cả có 5 Phòng ngủ, 6 WC, 1 Phòng Khách, 1 Phòng bếp, Phòng giặt, Sân Thượng. Đường nhựa trước nhà 8m thông. Xe hơi, xe tải ra vào thoải mái.Nhà đã hoàn công xây dựng ra sổ hồng tháng 11/2021. Nhà mới 100% chưa qua sử dụng.',
        realEstateLandRealitySquare: 60,
        realEstateLandDefaultSquare: 60,
        realEstateLandRoadSquare: 15,
        realEstateLandRealConstructionSquare: 45,
        realEstateLandLongs: 12,
        realEstateLandWidth: 5,
        realEstateValueSalePrice: 5400000000,
        realEstateUnitPrice: 90000000,
        realEstateJuridicalName: 3,
        realEstateLocationFrontStreetWidth: 8,
        realEstateLocationStreetWidth: 8,
        realEstateHouseDirection: 7,
        realEstateBalconyDirection: 7,
        realEstateLocationHomeNumber: '512/2a',
        realEstateHouseFloors: 4,
        realEstateHouseBedRooms: 5,
        realEstateHouseToilets: 6,
        realEstateContactTypeId: 10,
        realEstateCategoryId: 1,
        realEstateSubCategoryId: 1,
        realEstatePostTypeId: 1,
        areaCountryId: 1,
        areaProvinceId: 2,
        areaDistrictId: 1290,
        areaWardId: 1440,
        areaStreetId: 0,
        lat: 998.99999,
        lng: 998.99999,
        agencyStatus: 1,
        agency: 1,
        agencyPercent: 10,
        realEstateHouseFurniture: 7,
        realEstateVideo: 'https://www.youtube.com/embed/o8Yp38JsUKc',
        realEstateUtil: '13;15;16;16;20;24',
      },
      imagesLink: [
        'https://file4.batdongsan.com.vn/resize/745x510/2021/12/10/20211210171126-e764_wm.jpg',
        'https://file4.batdongsan.com.vn/resize/745x510/2021/12/10/20211210171048-d161_wm.jpg',
        'https://file4.batdongsan.com.vn/resize/200x200/2021/12/10/20211210171110-3c38_wm.jpg',
      ],
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/insert`)
      .set('Authorization', `Bearer ${tokenUser}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        realEstateId = res.body.data.realEstateId;
        done();
      });
  });

  it(`find ${modelName}`, done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`find ${modelName} lọc theo diện tích thực tế >= 400 m2`, done => {
    const body = {
      filterClause: {
        startLandRealitySquare: 400,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`find ${modelName} lọc theo diện tích thực tế<= 700 m2`, done => {
    const body = {
      filterClause: {
        endLandRealitySquare: 700,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`find ${modelName} lọc theo diện tích từ 300m2 đến 800m2`, done => {
    const body = {
      filterClause: {
        startLandRealitySquare: 300,
        endLandRealitySquare: 800,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`find ${modelName} lọc theo dự án`, done => {
    const body = {
      filter: {
        realEstateProjectId: 2,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`find ${modelName} lọc theo loại bất động sản`, done => {
    const body = {
      filter: {
        realEstateCategoryId: 2,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`find ${modelName} lọc theo quốc gia`, done => {
    const body = {
      filter: {
        areaCountryId: 1,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`find ${modelName} lọc theo tỉnh`, done => {
    const body = {
      filter: {
        areaProvinceId: 1,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`find ${modelName} lọc theo quận huyện`, done => {
    const body = {
      filter: {
        areaDistrictId: 1,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`find ${modelName} lọc theo phường xã`, done => {
    const body = {
      filter: {
        areaWardId: 1,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`find ${modelName} lọc theo đường`, done => {
    const body = {
      filter: {
        areaStreetId: 1,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`find ${modelName} lọc theo giá từ 300 đến 800`, done => {
    const body = {
      filterClause: {
        startValueSalePrice: 300,
        endValueSalePrice: 800,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`find ${modelName} lọc theo giá từ 300 `, done => {
    const body = {
      filterClause: {
        startValueSalePrice: 300,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`find ${modelName} lọc theo giá <= 900 `, done => {
    const body = {
      filterClause: {
        startValueSalePrice: 900,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`searchText ${modelName}`, done => {
    const body = {
      searchText: 'string',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`findById ${modelName}`, done => {
    const body = {
      id: realEstateId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/findById`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`update by id ${modelName}`, done => {
    const body = {
      id: realEstateId,
      data: {
        realEstateTitle: 'Luân đại gia bán biệt thự cao cấp',
        realEstatePhone: '0935742640',
        realEstateEmail: 'mailto:Luanlay2020@gmail.com',
        realEstateContacAddress: 'string',
        realEstateDescription: 'Biệt thự đẹp dữ lắm',
        realEstateLandRealitySquare: 800,
        realEstateLandDefaultSquare: 820,
        realEstateLandRoadSquare: 0,
        realEstateLandRealConstructionSquare: 0,
        realEstateLandLongs: 40,
        realEstateLandWidth: 20,
        realEstateValueSalePrice: 3000000000,
        realEstateUnitPrice: '3500000000',
        realEstateJuridicalName: 1,
        realEstateLocationFrontStreetWidth: 20,
        realEstateLocationStreetWidth: 20,
        realEstateHouseDirection: 1,
        realEstateBalconyDirection: 1,
        realEstateDirection: 1,
        realEstateLocationHomeNumber: 'string',
        realEstateHouseFurnitureList: 'Ti vi, bộ bàn gỗ, tủ trang trí',
        realEstateHouseFloors: 3,
        realEstateHouseBedRooms: 5,
        realEstateHouseToilets: 3,
        realEstateContactTypeId: 1,
        realEstateCategoryId: 3,
        realEstatePostTypeId: 1,
        areaCountryId: 84,
        areaProvinceId: 60,
        areaDistrictId: 27,
        areaWardId: 13,
        areaStreetId: 11,
        lat: 10.736828195077917,
        lng: 106.67958504440837,
        apartmentCode: 'string',
        apartmentCodeStatus: 0,
        agencyStatus: 0,
        agency: 1,
        realEstateHouseFurniture: 7,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/updateById`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`hidden by id ${modelName}`, done => {
    const body = {
      id: realEstateId,
      isHidden: 0,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/hiddenById`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`getList ${modelName}`, done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getList`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`getDetail ${modelName}`, done => {
    const body = {
      id: realEstateId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getDetail`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`getDetail ${modelName}không token`, done => {
    const body = {
      id: realEstateId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getDetail`)
      .set('Authorization', ``)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`getList ${modelName} không có Token`, done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getList`)
      .set('Authorization', '')
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`searchText ${modelName}`, done => {
    const body = {
      searchText: 'string',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getList`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`getList ${modelName} lọc theo diện tích thực tế >= 400 m2`, done => {
    const body = {
      filterClause: {
        startLandRealitySquare: 400,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getList`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`getList ${modelName} lọc theo diện tích thực tế<= 700 m2`, done => {
    const body = {
      filterClause: {
        endLandRealitySquare: 700,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getList`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`getList ${modelName} lọc theo diện tích từ 300m2 đến 800m2`, done => {
    const body = {
      filterClause: {
        startLandRealitySquare: 300,
        endLandRealitySquare: 800,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getList`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`getList ${modelName} lọc theo dự án`, done => {
    const body = {
      filter: {
        realEstateProjectId: 2,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getList`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`getList ${modelName} lọc theo loại bất động sản`, done => {
    const body = {
      filter: {
        realEstateCategoryId: 2,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getList`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`getList ${modelName} lọc theo quốc gia`, done => {
    const body = {
      filter: {
        areaCountryId: 0,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getList`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`getList ${modelName} lọc theo tỉnh`, done => {
    const body = {
      filter: {
        areaProvinceId: 1,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getList`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`getList ${modelName} lọc theo quận huyện`, done => {
    const body = {
      filter: {
        areaDistrictId: 1,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getList`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`getList ${modelName} lọc theo phường xã`, done => {
    const body = {
      filter: {
        areaWardId: 1,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getList`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`getList ${modelName} lọc theo đường`, done => {
    const body = {
      filter: {
        AreaStreetId: 1,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getList`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`getList ${modelName} lọc theo giá từ 300 đến 800`, done => {
    const body = {
      filterClause: {
        startValueSalePrice: 300,
        endValueSalePrice: 800,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getList`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`getList ${modelName} lọc theo giá từ 300 `, done => {
    const body = {
      filterClause: {
        startValueSalePrice: 300,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getList`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`getList ${modelName} lọc theo giá <= 900 `, done => {
    const body = {
      filterClause: {
        startValueSalePrice: 900,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getList`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`getList ${modelName} lọc theo loại bất động sản `, done => {
    const body = {
      filter: {
        realEstateCategoryId: 0,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/filter/category`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`getList ${modelName} lọc theo dự án `, done => {
    const body = {
      filter: {
        realEstateProjectId: 0,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/filter/project`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`getList ${modelName} lọc theo User đăng bài `, done => {
    const body = {
      filter: {
        appUserId: 0,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/filter/user`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`getList ${modelName} lọc theo bài đăng cá nhân  `, done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getListByUser`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`getList ${modelName} lọc theo bài đăng cá nhân theo status  `, done => {
    const body = {
      filter: {
        statusId: 14,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getListByUser`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`getList ${modelName} Bất động sản nổi bật `, done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getListByRating`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`getList ${modelName} Bất động sản giá rẻ `, done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getListByPrice`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`getList ${modelName} bất động sản gần bạn `, done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getListByLocation`)
      .set('Authorization', `Bearer ${tokenUser}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it('Upload image RealEstate', done => {
    fs.readFile('uploads/sampleAvatar.jpg', function read(err, data) {
      if (err) {
        return null;
      }

      var base64data = Buffer.from(data, 'binary').toString('base64');
      const body = {
        imageData: base64data,
        imageFormat: 'jpg',
      };
      chai
        .request(`0.0.0.0:${process.env.PORT}`)
        .post(`/RealEstate/uploadImage`)
        .set('Authorization', `Bearer ${token}`)
        .send(body)
        .end((err, res) => {
          if (err) {
            console.error(err);
          }
          checkResponseStatus(res, 200);
          done();
        });
    });
  });

  // it(`delete by id ${modelName}`, done => {
  //     const body = {
  //         "id": realEstateId,
  //     };
  //     chai
  //         .request(`0.0.0.0:${process.env.PORT}`)
  //         .post(`/${modelName}/deleteById`)
  //         .set("Authorization", `Bearer ${token}`)
  //         .send(body)
  //         .end((err, res) => {
  //             if (err) {
  //                 console.error(err);
  //             }
  //             checkResponseStatus(res, 200);
  //             done();
  //         });
  // });

  it(`thống kê ${modelName} theo tháng `, done => {
    const body = {
      startDate: new Date(),
      endDate: new Date(),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/Staff/Statisticalrealestatebymonth`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`${modelName} - user request to get project detail`, done => {
    const body = {
      id: realEstateId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/requestViewDetailProject`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`${modelName} - user request to call to real estate contact`, done => {
    const body = {
      id: realEstateId,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/callToRealEstateContact`)
      .set('Authorization', `Bearer ${tokenUser}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`exportExcel ${modelName} không filter`, done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/exportExcel`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`exportExcel ${modelName}  filter Email`, done => {
    const body = {
      filter: {
        realEstateEmail: 'tranbachtruongan17@gmail.com',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/exportExcel`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it(`getList ${modelName} sàn môi giới `, done => {
    const body = {
      filter: {
        agency: 0,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/getList`)
      .set('Authorization', `Bearer ${tokenUser}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it(`getList ${modelName} sàn môi giới `, done => {
    const body = {
      filter: {
        agency: 0,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
});
