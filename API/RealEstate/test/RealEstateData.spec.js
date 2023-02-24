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
  let realEstateId;
  let token = '';
  let tokenStaff = '';
  let fakeUserName = faker.name.firstName() + faker.name.lastName();
  fakeUserName = fakeUserName.replace("'", '');
  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginUser();
      console.log(staffData);
      token = staffData.token;
      resolve();
    }).then(() => done());
  });
  it(`insert data${modelName}`, done => {
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
        realEstateSubCategoryId: 2,
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

  it(`insert data${modelName}`, done => {
    const body = {
      data: {
        realEstateTitle: 'Bán gấp đất Đặng Xá, Gia Lâm 56m2, giá 25.8tr/m2 cách 30m ra đường ô tô tránh',
        realEstatePhone: '0374307089',
        realEstateEmail: 'tranbachtruongan17@gmail.com',
        realEstateContacAddress: 'Gia Lâm Hà Nội',
        realEstateDescription:
          ' Cách khu đô thị Đặng Xá chỉ 1.5km. Chỉ 30m ra đường ô tô tránh chuẩn bị trải nhựa.Đất 56m2 MT 3.5m ngõ 2.2m hướng Tây Nam. Bán kính 500m đường Ỷ Lan. Ủy ban, trường học, y tế. Cách Vinhomes Ocean Park chỉ 5 phút đi xe.Tiềm năng đầu tư với nhiều quy hoạch dự án phát triển gia lâm lên quận',
        realEstateLandRealitySquare: 48,
        realEstateLandDefaultSquare: 48,
        realEstateLandRoadSquare: 3.5,
        realEstateLandRealConstructionSquare: 48,
        realEstateLandLongs: 12,
        realEstateLandWidth: 4,
        realEstateValueSalePrice: 1450000000,
        realEstateUnitPrice: 25900000,
        realEstateJuridicalName: 1,
        realEstateLocationFrontStreetWidth: 3.5,
        realEstateLocationStreetWidth: 3.5,
        realEstateHouseDirection: 7,
        realEstateContactTypeId: 10,
        realEstateCategoryId: 2,
        realEstatePostTypeId: 1,
        areaCountryId: 1,
        areaProvinceId: 4,
        lat: 998.99999,
        lng: 998.99999,
        areaDistrictId: 316,
        areaWardId: 666,
        areaStreetId: 0,
        agencyStatus: 1,
        agency: 1,
        realEstateVideo: 'https://www.youtube.com/embed/o8Yp38JsUKc',
        realEstateUtil: '13;15;16;16;20;24',
      },
      imagesLink: [
        'https://file4.batdongsan.com.vn/resize/745x510/2021/12/10/20211210073323-e595_wm.jpeg',
        'https://file4.batdongsan.com.vn/resize/745x510/2021/12/10/20211210073323-8491_wm.jpeg',
        'https://file4.batdongsan.com.vn/resize/745x510/2021/12/10/20211210073323-a2cb_wm.jpeg',
      ],
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/insert`)
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

  it(`insert data${modelName}`, done => {
    const body = {
      data: {
        realEstateTitle: "CHUYÊN CHO THUÊ CĂN HỘ, VĂN PHÒNG CAO CẤP TẠI VINHOMES D'CAPITALE TRẦN DUY HƯNG. LH 0944010***",
        realEstatePhone: '0374307089',
        realEstateEmail: 'tranbachtruongan17@gmail.com',
        realEstateContacAddress: 'Cần giờ Tp HCM',
        realEstateDescription:
          " Cam kết:- Giá thuê tốt nhất thị trường.- Miễn phí xem căn hộ 24/24.- Hỗ trợ 24/24 trong suốt quá trình thuê.Nội thất cơ bản: Thiết bị WC, điều hòa, hệ thống bếp.Full nội thất: TV, giường, tủ, máy giặt, bàn ăn,... (chỉ việc xách vali vào ở).- Căn studio (38m2): Cơ bản: 7 - 8 triệu/tháng. Full nội thất: 9 - 11 triệu/tháng.- Căn 1 - 1,5PN (50m2): Cơ bản: 9 - 10 triệu/tháng. Full nội thất: 12 - 14 triệu/tháng.- Căn 2PN (60 - 85m2): Cơ bản 11 - 12 triệu/tháng. Full nội thất: 13 - 16 triệu/tháng.- Căn 3PN (90 - 122m2): Cơ bản 15 - 16 triệu/tháng. Full nội thất: 16 - 22 triệu/tháng. Thô: 9 triệu/tháng.Tiện ích:- TTTM Vincom.- Hầm để xe rộng rãi. - Bể bơi. - Gym, sân bóng đá, sân bóng rổ, sân tennis. - Vườn nướng BBQ.- Lễ tân, bảo vệ 24/24.Công ty TSH Land - Đơn vị cho thuê căn hộ và văn phòng uy tín hàng đầu tại dự án Vinhomes D'Capitale. Hotline: 0944010*** Địa chỉ: C5 D'capitale - 119 Trần Duy Hưng, Cầu Giấy, Hà Nội",
        realEstateLandRealitySquare: 38,
        realEstateLandDefaultSquare: 38,
        realEstateLandRealConstructionSquare: 45,
        realEstateValueSalePrice: 5400000000,
        realEstatePlanRentPrice: 7500000,
        realEstateHouseDirection: 7,
        realEstateBalconyDirection: 7,
        realEstateLocationHomeNumber: '512/2a',
        realEstateHouseFloors: 4,
        realEstateHouseBedRooms: 5,
        realEstateHouseToilets: 6,
        realEstateCategoryId: 3,
        realEstatePostTypeId: 2,
        lat: 998.99999,
        lng: 998.99999,
        areaCountryId: 1,
        areaProvinceId: 2,
        areaDistrictId: 1290,
        areaWardId: 1440,
        areaStreetId: 0,
        agencyStatus: 1,
        agency: 1,
        realEstateProjectId: 2,
        realEstateHouseFurniture: 7,
        realEstateVideo: 'https://www.youtube.com/embed/o8Yp38JsUKc',
        realEstateUtil: '13;15;16;16;20;24',
      },
      imagesLink: [
        'https://file4.batdongsan.com.vn/resize/745x510/2021/10/15/20211015113812-f765_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/10/15/20211015113815-92e8_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/10/15/20211015113850-6646_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/10/15/20211015113850-df56_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/10/15/20211015113850-4d03_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/10/15/20211015113850-b204_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/10/15/20211015113851-b832_wm.jpg',
      ],
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/insert`)
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

  it(`insert data${modelName}`, done => {
    const body = {
      data: {
        realEstateTitle: 'ĐẤT THÀNH PHỐ ĐỒNG XOÀI GẦN KCN ĐỒNG XOÀI 3 VÀ KHU DÂN CƯ CÁT TƯỜNG PHÚ HƯNG CHÍNH CHỦ 0899886***',
        realEstatePhone: '0374307089',
        realEstateEmail: 'tranbachtruongan17@gmail.com',
        realEstateContacAddress: 'Cần giờ Tp HCM',
        realEstateDescription:
          ' Bán đất thành phố Đồng Xoài gần khu công nghiệp đỒng Xoài 3 và KDC Cát Tường Phú Hưng. Gọi tôi chính chủ: 0899886*** Nguyễn, đất thổ cư đã có sổ hồng riêng,Diện tích 150m2 = 5 x 30m.Mặt tiền đường 13m.Đất có sổ hồng riêng.Xây dựng nhà trọ cho thuê được ngay',
        realEstateLandRealitySquare: 150,
        realEstateLandDefaultSquare: 150,
        realEstateLandRealConstructionSquare: 100,
        realEstateValueSalePrice: 5400000000,
        realEstateHouseDirection: 7,
        realEstateBalconyDirection: 7,
        realEstateLocationHomeNumber: '512/2a',
        realEstateCategoryId: 4,
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
        realEstateProjectId: 2,
        realEstateHouseFurniture: 7,
        realEstateVideo: 'https://www.youtube.com/embed/o8Yp38JsUKc',
        realEstateUtil: '13;15;16;16;20;24',
      },
      imagesLink: [
        'https://file4.batdongsan.com.vn/2021/06/10/20210610180029-c396_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/06/10/20210610180029-22e5_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/06/10/20210610180029-fa3a_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/06/10/20210610180056-d9c6_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/11/19/20211119142917-4336_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/10/15/20211015113850-b204_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/10/15/20211015113851-b832_wm.jpg',
      ],
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/insert`)
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
  it(`insert ${modelName} sàn môi giới`, done => {
    const body = {
      data: {
        realEstateTitle: "CHUYÊN CHO THUÊ CĂN HỘ, VĂN PHÒNG CAO CẤP TẠI VINHOMES D'CAPITALE TRẦN DUY HƯNG. LH 0944010***",
        realEstatePhone: '0374307089',
        realEstateEmail: 'tranbachtruongan17@gmail.com',
        realEstateContacAddress: 'Cần giờ Tp HCM',
        realEstateDescription:
          " Cam kết:- Giá thuê tốt nhất thị trường.- Miễn phí xem căn hộ 24/24.- Hỗ trợ 24/24 trong suốt quá trình thuê.Nội thất cơ bản: Thiết bị WC, điều hòa, hệ thống bếp.Full nội thất: TV, giường, tủ, máy giặt, bàn ăn,... (chỉ việc xách vali vào ở).- Căn studio (38m2): Cơ bản: 7 - 8 triệu/tháng. Full nội thất: 9 - 11 triệu/tháng.- Căn 1 - 1,5PN (50m2): Cơ bản: 9 - 10 triệu/tháng. Full nội thất: 12 - 14 triệu/tháng.- Căn 2PN (60 - 85m2): Cơ bản 11 - 12 triệu/tháng. Full nội thất: 13 - 16 triệu/tháng.- Căn 3PN (90 - 122m2): Cơ bản 15 - 16 triệu/tháng. Full nội thất: 16 - 22 triệu/tháng. Thô: 9 triệu/tháng.Tiện ích:- TTTM Vincom.- Hầm để xe rộng rãi. - Bể bơi. - Gym, sân bóng đá, sân bóng rổ, sân tennis. - Vườn nướng BBQ.- Lễ tân, bảo vệ 24/24.Công ty TSH Land - Đơn vị cho thuê căn hộ và văn phòng uy tín hàng đầu tại dự án Vinhomes D'Capitale. Hotline: 0944010*** Địa chỉ: C5 D'capitale - 119 Trần Duy Hưng, Cầu Giấy, Hà Nội",
        realEstateLandRealitySquare: 38,
        realEstateLandDefaultSquare: 38,
        realEstateLandRealConstructionSquare: 45,
        realEstateValueSalePrice: 5400000000,
        realEstatePlanRentPrice: 7500000,
        realEstateHouseDirection: 7,
        realEstateBalconyDirection: 7,
        realEstateLocationHomeNumber: '512/2a',
        realEstateHouseFloors: 4,
        realEstateHouseBedRooms: 5,
        realEstateHouseToilets: 6,
        realEstateCategoryId: 5,
        realEstatePostTypeId: 2,
        lat: 998.99999,
        lng: 998.99999,
        areaCountryId: 1,
        areaProvinceId: 2,
        areaDistrictId: 1290,
        areaWardId: 1440,
        areaStreetId: 0,
        agencyStatus: 1,
        agency: 0,
        agencyPercent: 0.5,
        realEstateProjectId: 2,
        realEstateHouseFurniture: 7,
        realEstateVideo: 'https://www.youtube.com/embed/o8Yp38JsUKc',
        realEstateUtil: '13;15;16;16;20;24',
      },
      imagesLink: [
        'https://file4.batdongsan.com.vn/resize/745x510/2021/10/15/20211015113812-f765_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/10/15/20211015113815-92e8_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/10/15/20211015113850-6646_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/10/15/20211015113850-df56_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/10/15/20211015113850-4d03_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/10/15/20211015113850-b204_wm.jpg',
        'https://file4.batdongsan.com.vn/2021/10/15/20211015113851-b832_wm.jpg',
      ],
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/${modelName}/insert`)
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
  it(`insert data${modelName}`, done => {
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
        realEstateCategoryId: 6,
        realEstateSubCategoryId: 2,
        realEstatePostTypeId: 2,
        areaCountryId: 1,
        areaProvinceId: 2,
        areaDistrictId: 1290,
        areaWardId: 1440,
        areaStreetId: 0,
        lat: 998.99999,
        lng: 998.99999,
        agencyStatus: 1,
        agency: 1,
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

  it(`insert data${modelName}`, done => {
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
        realEstateCategoryId: 7,
        realEstateSubCategoryId: 3,
        realEstatePostTypeId: 2,
        areaCountryId: 1,
        areaProvinceId: 2,
        areaDistrictId: 1290,
        areaWardId: 1440,
        areaStreetId: 0,
        lat: 998.99999,
        lng: 998.99999,
        agencyStatus: 1,
        agency: 1,
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
  it(`insert data${modelName}`, done => {
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
        realEstateCategoryId: 8,
        realEstateSubCategoryId: 4,
        realEstatePostTypeId: 2,
        areaCountryId: 1,
        areaProvinceId: 2,
        areaDistrictId: 1290,
        areaWardId: 1440,
        areaStreetId: 0,
        lat: 998.99999,
        lng: 998.99999,
        agencyStatus: 1,
        agency: 1,
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
  it(`insert data${modelName}`, done => {
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
        realEstateCategoryId: 9,
        realEstateSubCategoryId: 5,
        realEstatePostTypeId: 2,
        areaCountryId: 1,
        areaProvinceId: 2,
        areaDistrictId: 1290,
        areaWardId: 1440,
        areaStreetId: 0,
        lat: 998.99999,
        lng: 998.99999,
        agencyStatus: 1,
        agency: 1,
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
  it(`insert data${modelName}`, done => {
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
        realEstateCategoryId: 10,
        realEstateSubCategoryId: 6,
        realEstatePostTypeId: 2,
        areaCountryId: 1,
        areaProvinceId: 2,
        areaDistrictId: 1290,
        areaWardId: 1440,
        areaStreetId: 0,
        lat: 998.99999,
        lng: 998.99999,
        agencyStatus: 1,
        agency: 1,
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
