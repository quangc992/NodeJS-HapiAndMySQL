/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';

module.exports = {
  WALLET_RECORD_TYPE: {
    REFER_BONUS: 'REFER_BONUS', // Thưởng hoa hồng
    EVENT_BONUS: 'EVENT_BONUS', // Thưởng sự kiện
    ADMIN_BONUS: 'ADMIN_BONUS', // Admin thưởng tiền
    EARNED: 'EARNED', //Kiếm tiền
    ADMIN_ADJUST: 'ADMIN_ADJUST', //Admin điều chỉnh
    PAYMENT_DEPOSIT: 'PAYMENT_DEPOSIT', //Nạp tiền
    PAYMENT_WITHDRAW: 'PAYMENT_WITHDRAW', //Rút tiền
    DEPOSIT_POINTWALLET: 'DEPOSIT_POINTWALLET', //Nạp tiền ví chính
    WITHDRAW_POINTWALLET: 'WITHDRAW_POINTWALLET', //Rút tiền ví chính
    WITHDRAW_BONUSWALLET: 'WITHDRAW_BONUSWALLET', //Rút tiền hoa hồng
    WITHDRAW_REWARDWALLET: 'WITHDRAW_REWARDWALLET', //Rút tiền thưởng
    WITHDRAW_WINWALLET: 'WITHDRAW_WINWALLET', //Rút tiền thắng
    PAYMENT_WITHDRAW_REFUND: 'PAYMENT_WITHDRAW_REFUND', //Từ chối rút tiền
    PAYMENT_EXCHANGE_SEND: 'PAYMENT_EXCHANGE_SEND', //Gửi tiền hoán đổi
    PAYMENT_EXCHANGE_RECEIVE: 'PAYMENT_EXCHANGE_RECEIVE', //Nhận tiền hoán đổi
    PAYMENT_EXCHANGE_REFUND: 'PAYMENT_EXCHANGE_REFUND', //Hoàn tiền hoán đổi
    EXTERNAL_DEPOSIT: 'EXTERNAL_DEPOSIT', //Nạp tiền ngoài hệ thống
    EXTERNAL_WITHDRAW: 'EXTERNAL_WITHDRAW', //Rút tiền ngoài hệ thống
    REFUND: 'REFUND', //Hoàn tiền
    PLAY_GAME: 'PLAY_GAME', //Sử dụng tiền,
    MAKE_PAYMENT: 'MAKE_PAYMENT', //Thanh toán,
    BONUS_EXCHANGE_POINT: 'BONUS_EXCHANGE_POINT', //Chuyển tiền đến ví chính
  },
  PAYMENT_AMOUNT: {
    PAYMENT_AMOUNT_IN: 1, // tien ra
    PAYMENT_AMOUNT_OUT: 2, // tien vao
    PAYMENT_AMOUNT_IN_OUT: 0, // ca hai
  },
};
