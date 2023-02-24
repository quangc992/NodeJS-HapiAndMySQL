/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const VMG_HOST_URL = process.env.VMG_HOST_URL || 'https://api.brandsms.vn';
const VMG_TOKEN =
  process.env.VMG_TOKEN ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c24iOiJ2dHNzIiwic2lkIjoiOWY3ZWFhYjItMTE2Ni00M2M5LWFjZjYtYjljYWJjZjNjYTg1Iiwib2J0IjoiIiwib2JqIjoiIiwibmJmIjoxNjU1NDM4OTgzLCJleHAiOjE2NTU0NDI1ODMsImlhdCI6MTY1NTQzODk4M30.iQ9FdtyX2R-bntxDXsyKsMHmbpkmdb3YZSp1730trcU';
const VMG_BRANDNAME = process.env.VMG_BRANDNAME || 'TTDK 29-14D';
const REPORT_URL_SMS_VMG = process.env.REPORT_URL_SMS_VMG || 'http://report-api.brandsms.vn/api';
const VMG_OTT_HOST_URL = process.env.VMG_OTT_HOST_URL || 'https://api-ott.brandsms.vn';

// sendSMSMessage('0343902960', 'TTDK 2914D kinh bao: Xe 30A999999 het han kiem dinh ngay 2022/04/05. Quy khach can ho tro vui long lien he 0343902960');
// "000" NoError Không lỗi
// "001" InputNotValid
// Có lỗi giá trị không phù hợp với
// kiểu dữ liệu mô tả
// Kiểm tra dữ liệu
// nhập
// "100" TokenNotValid Token không hợp lệ
// "101" UserIsLock Tài khoản bị khóa
// "102" UserNotValid Tài khoản không đúng
// "103" UserNotRoleValid Tài khoản không có quyền
// "304" DuplicateMessage
// Tin bị lặp trong 5 phút hoặc trùng
// requestID trong 1h
// UM.API.V3: Tài liệu Hướng dẫn kết nối API SMS Brandname v 1.5
// Internal Use 41/42
// "904" BrandnameNotValid Brandname không hợp lệ
// "002" MessageTypeNotValid Loại tin không hợp lệ
// "003" MessageTypeNotAllow Loại tin không được phép gửi
// "005" ReceiverNotValid Số điện thoại nhận không hợp lệ
// "006" TelcoNotValid Mã nhà mạng không hợp lệ
// "007" ContentContainsBlockedWord Nội dung chứa từ khóa bị chặn
// "008" ContentContainsUnicode Nội dung chứa ký tự unicode
// "009" ContentNotValidateGsm0338 Nội dung có ký tự không hợp lệ
// "010" LengthOfContentNotValid Độ dài nội dung không hợp lệ
// "011" NotMatchTemplate
// Nội dung không khớp với mẫu
// khai
// “011” NotMatchTemplatePriority
// Nội dung không khớp với mẫu tin
// ưu tiên (OTP)
// "012" TelcoNotAllow
// Tài khoản không được phân gửi
// tới nhà mạng
// "013" MsisdnInBlacklist
// Số điện thoại nhận trong danh
// sách cấm gửi
// "014" AccountNotEnoughToPay
// Tài khoản không đủ tiền để chi
// trả
// "015" AccountNotEnoughQuota Tài khoảng không đủ tin để gửi
// "016" ScheduledNotValid Thời gian gửi tin không hợp lệ
// "017" OrderCodeNotValid Mã order không hợp lệ
// "018" PackageCodeNotValid Mã gói không hợp lệ
// "019" MsisdnNotValid
// Số điện thoại không hợp lệ đói
// với hàm gửi tin CSKH
// "019" ReceiverNotEnough
// Số điện thoại nhận không đủ đối
// với hàm gửi tin QC
// "020" TelcoFilter
// Số điện thoại không trong danh
// sách nhà mạng được lọc
// "021" BlockingTimeAdv
// Gửi vào thời điểm bị cấm gửi
// quảng cáo
// "022" FormatOfContentNotValid Định dạnh nội dung không hợp lệ
// "024" OverMaxMT
// Số MT vượt quá giới hạn
// maxMt
// "025" CantConvertToNotUnicode
// Không thể Convert sang ký tự
// NotUnicode (Áp dụng trường hợp
// sử dụng tham số useUnicode(2))
// "801" TemplateNotSet Mẫu tin chưa được thiết lập
// Liên hệ với VMG
// "802" AccountNotSetProfile
// Tài khoản chưa được thiết lập
// profile
// "803" AccountNotSetPrice Tài khoản chưa được thiết lập giá
// UM.API.V3: Tài liệu Hướng dẫn kết nối API SMS Brandname v 1.5
// Internal Use 42/42
// "804" RouterNotAvaiable Đường gửi tin chưa được thiết lập
// "805" RouterNotSuportUnicode
// Đường gửi tin không hỗ trợ
// unicode
// "999" ErrorOnServer Lỗi khác trên hệ thống
async function sendSMSMessage(phoneNumber, messageContent, customConfig, trackId) {
  console.info(`VMG sendSMSMessage ${phoneNumber} - ${trackId} - ${messageContent}`);
  let requestUrl = VMG_HOST_URL;
  let requestToken = VMG_TOKEN;
  let requestBrandname = VMG_BRANDNAME;

  if (customConfig) {
    requestUrl = customConfig.smsApiUrl;
    requestToken = customConfig.smsApiToken;
    requestBrandname = customConfig.smsAPIBrand;
  }

  let body = {
    to: phoneNumber,
    telco: '', //Mã telco theo bảng mã đi kèm. Nếu có mã telco, hệ thống sẽ sử dụng để gửi tới telco này Để trống trường này thì hệ thống sẽ tự xác định theo dữ liệu chuyển mạng giữ số của Cục Viễn Thông
    type: 1, //Loại tin cần gửi(1: Chăm sóc khách hàng)
    from: requestBrandname, //Brandname dùng để gửi tin
    message: messageContent, //Nội dung tin cần gửi
    scheduled: '', //Gửi tin đặt lịch - (“scheduled”:””), tin sẽ được gửi luôn sau khi VMG nhận thành công.
    requestId: trackId ? trackId : '', //ID định danh của đối tác, sẽ gửi lại trong nội dung phản hồi hoặc để trống(“requestId”,””) Nếu truyền tham số requestID, hệ thống sẽ check tham số requestID trong 1h (60 ph )
    useUnicode: 0, //Gửi tin notUnicode(0), Nội dung Unicode(1), tự động chuyển đổi nội dung Unicode sang notUnicode (2)
    ext: {}, //copy,
  };

  return new Promise((resolve, reject) => {
    chai
      .request(VMG_HOST_URL)
      .post('/api/SMSBrandname/SendSMS')
      .set('Content-Type', 'application/json; charset=utf-8')
      .set('token', requestToken)
      .send(JSON.stringify(body))
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        if (res && res.body) {
          let result = res.body;
          if (result.errorCode) {
            switch (result.errorCode) {
              case '001':
                result.errorMessage += '- Có lỗi giá trị không phù hợp với kiểu dữ liệu mô tả. Kiểm tra dữ liệu nhập';
                break;
              case '100':
                result.errorMessage += '- TokenNotValid Token không hợp lệ';
                break;
              case '101':
                result.errorMessage += '- UserIsLock Tài khoản bị khóa';
                break;
              case '102':
                result.errorMessage += '- UserNotValid Tài khoản không đúng';
                break;
              case '103':
                result.errorMessage += '- UserNotRoleValid Tài khoản không có quyền';
                break;
              case '304':
                result.errorMessage += '- DuplicateMessage Tin bị lặp trong 5 phút hoặc trùng requestID trong 1h';
                break;
              case '904':
                result.errorMessage += '- BrandnameNotValid Brandname không hợp lệ';
                break;
              case '002':
                result.errorMessage += '- MessageTypeNotValid Loại tin không hợp lệ';
                break;
              case '003':
                result.errorMessage += '- MessageTypeNotAllow Loại tin không được phép gửi';
                break;
              case '005':
                result.errorMessage += '- ReceiverNotValid Số điện thoại nhận không hợp lệ';
                break;
              case '006':
                result.errorMessage += '- TelcoNotValid Mã nhà mạng không hợp lệ';
                break;
              case '007':
                result.errorMessage += '- ContentContainsBlockedWord Nội dung chứa từ khóa bị chặn';
                break;
              case '008':
                result.errorMessage += '- ContentContainsUnicode Nội dung chứa ký tự unicode';
                break;
              case '009':
                result.errorMessage += '- ContentNotValidateGsm0338 Nội dung có ký tự không hợp lệ';
                break;
              case '010':
                result.errorMessage += '- LengthOfContentNotValid Độ dài nội dung không hợp lệ';
                break;
              case '011':
                result.errorMessage +=
                  '- NotMatchTemplate Nội dung không khớp với mẫu khai - NotMatchTemplatePriority Nội dung không khớp với mẫu tin ưu tiên (OTP)';
                break;
              case '012':
                result.errorMessage += '- TelcoNotAllow Tài khoản không được phân gửi tới nhà mạng';
                break;
              case '013':
                result.errorMessage += '- MsisdnInBlacklist Số điện thoại nhận trong danh sách cấm gửi';
                break;
              case '014':
                result.errorMessage += '- AccountNotEnoughToPay Tài khoản không đủ tiền để chi trả';
                break;
              case '015':
                result.errorMessage += '- AccountNotEnoughQuota Tài khoảng không đủ tin để gửi';
                break;
              case '016':
                result.errorMessage += '- ScheduledNotValid Thời gian gửi tin không hợp lệ';
                break;
              case '017':
                result.errorMessage += '- OrderCodeNotValid Mã order không hợp lệ';
                break;
              case '018':
                result.errorMessage += '- PackageCodeNotValid Mã gói không hợp lệ';
                break;
              case '019':
                result.errorMessage +=
                  '- MsisdnNotValid Số điện thoại không hợp lệ đói với hàm gửi tin CSKH - ReceiverNotEnough Số điện thoại nhận không đủ đối với hàm gửi tin QC';
                break;
              case '020':
                result.errorMessage += '- TelcoFilter Số điện thoại không trong danh sách nhà mạng được lọc';
                break;
              case '021':
                result.errorMessage += '- BlockingTimeAdv Gửi vào thời điểm bị cấm gửi quảng cáo';
                break;
              case '022':
                result.errorMessage += '- FormatOfContentNotValid Định dạnh nội dung không hợp lệ';
                break;
              case '024':
                result.errorMessage += '- OverMaxMT Số MT vượt quá giới hạn maxMt';
                break;
              case '025':
                result.errorMessage += '- CantConvertToNotUnicode Không thể Convert sang ký tự';
                break;
              case '801':
                result.errorMessage += '- TemplateNotSet Mẫu tin chưa được thiết lập';
                break;
              case '802':
                result.errorMessage += '- AccountNotSetProfile Tài khoản chưa được thiết lập profile';
                break;
              case '803':
                result.errorMessage += '- AccountNotSetPrice Tài khoản chưa được thiết lập giá';
                break;
              case '804':
                result.errorMessage += '- RouterNotAvaiable Đường gửi tin chưa được thiết lập';
                break;
              case '805':
                result.errorMessage += '- RouterNotSuportUnicode Đường gửi tin không hỗ trợ unicode';
                break;
              case '999':
                result.errorMessage += '- ErrorOnServer Lỗi khác trên hệ thống';
                break;
              case '000':
                result.errorMessage += '- NoError Không lỗi';
                break;
              default:
                result.errorMessage += '- ErrorOnServer Lỗi khác trên hệ thống';
                break;
            }
          }

          resolve(result);
        } else {
          resolve(undefined);
        }
      });
  });
}

async function checkStatusByClientID(programCode, referentId, time) {
  if (programCode == undefined && referentId == undefined) return;
  if (time === undefined) {
    time = '';
  }
  let body = {
    programCode: programCode,
    referentId: referentId,
    sendDate: time,
  };
  return new Promise((resolve, reject) => {
    chai
      .request(REPORT_URL_SMS_VMG)
      .post('/Brandname/ReportDetailSend')
      .set('Content-Type', 'application/json; charset=utf-8')
      .set('token', TOKEN_SMS_VMG)
      .send(JSON.stringify(body))
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
      });
  });
}

async function createClient(smsApiUrl, smsApiToken, smsAPIBrand) {
  const invalidClient = undefined;
  if (smsApiUrl === undefined || smsApiUrl === null || smsApiUrl.trim() === '') {
    console.error(`invalid smsApiUrl ${smsApiUrl}`);
    return invalidClient;
  }

  if (smsApiToken === undefined || smsApiToken === null || smsApiToken.trim() === '') {
    console.error(`invalid smsApiToken ${smsApiToken}`);
    return invalidClient;
  }

  if (smsAPIBrand === undefined || smsAPIBrand === null || smsAPIBrand.trim() === '') {
    console.error(`invalid smsAPIBrand ${smsAPIBrand}`);
    return invalidClient;
  }

  const newClient = {
    smsApiUrl: smsApiUrl,
    smsApiToken: smsApiToken,
    smsAPIBrand: smsAPIBrand,
  };
  return newClient;
}

module.exports = {
  sendSMSMessage,
  checkStatusByClientID,
  createClient,
};
