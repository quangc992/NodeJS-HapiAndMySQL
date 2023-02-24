/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

async function _seedStations() {
  console.log('_seedStations');
  const StationsResource = require('../API/Stations/resourceAccess/StationsResourceAccess');
  for (let i = 0; i < 10; i++) {
    let initialStation = {
      stationsName: `Chi nhánh ${i}: Phạm Văn Đồng`,
      stationsDescription: `Là 1 trong hệ thống những phòng tập với không gian xanh, đầy đủ trang thiết bị hiện đại cùng huấn luyện viên chuyên nghiệp tạo nên môi trường lí tưởng để mang đến hiệu quả tập luyện cao nhất cho hội viên.
      \r\nHệ thống phòng gym hiện đại nhất quận: Hệ thống lọc khí ion cùng trang thiết bị cao cấp nhập khẩu trực tiếp từ Mỹ, đem đến môi trường tập luyện tốt nhất cho bạn
      \r\n\r\nĐa dạng về bài tập Gym - Yoga - Dance
      \r\nBài tập thay đổi liên tục sau mỗi tuần khi có kết quả in đo chỉ số cơ thể, đảm bảo hoàn thành mục tiêu theo từng lộ trình
      \r\n\r\nCam kết hiệu quả tập luyện
      \r\n100% hội viên đã đạt được kết quả tập luyện khi thực hiện đúng chương trình Cá Nhân Hóa của XStudio.`,
    };
    await StationsResource.insert(initialStation);
  }
}

async function _seedPaymentServicePackage() {
  console.log('_seedPaymentServicePackage');

  const PaymentServicePackage = require('../API/PaymentServicePackage/resourceAccess/PaymentServicePackageResourceAccess');
  const { PACKAGE_TYPE } = require('../API/PaymentServicePackage/PaymentServicePackageConstant');

  for (let i = 0; i < 10; i++) {
    let _data = {
      packageName: `Gói tập ${i * 3} tháng`,
      packageType: PACKAGE_TYPE.COUNTER,
      packageDescription: `Cùng tham gia gói tập ${i * 3} tháng tập để nâng cao sức khỏe và có thân hình săn chắc`,
      packagePrice: i * 1000000,
      packagePerformance: 50,
      packageDuration: 365,
    };
    await PaymentServicePackage.insert(_data);
  }
}

async function seedDatabase() {
  console.log('seedDatabase');
  // await _seedStations();
  await _seedPaymentServicePackage();
}

seedDatabase();
