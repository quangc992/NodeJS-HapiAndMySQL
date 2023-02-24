/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

module.exports = {
  PACKAGE_STATUS: {
    NEW: 1,
    HOT: 2,
    NORMAL: 3,
    SOLD: 4,
  },
  ACTIVITY_STATUS: {
    COMPLETED: 0,
    WORKING: 1,
    STANDBY: 2,
    CANCELED: 3,
  },
  CLAIMABLE_STATUS: {
    DISABLE: 0,
    ENABLE: 1,
    CLAIMED: 2,
  },
  MINING_DURATION: 24, //24 hours
  PACKAGE_CATEGORY: {
    NORMAL: 'Normal',
    BONUS_RANK: 'Rank',
    BONUS_NORMAL: 'Bonus',
    BONUS_KYC: 'KYC',
  },
  // CỬA HÀNG (vào để mua máy đào đồng FAC)
  // 1. Có 3 loại máy có giá trị, số lượng đồng FAC khai thác ra và kí hiệu khác nhau sau mỗi giai đoạn. Gồm có 5 giai đoạn, mỗi giai đoạn là 90 ngày
  // - Giai đoạn 1 : máy có kí hiệu
  // + máy giá $100 kí hiệu là A100FAC... Khai thác được 50 FAC/ngày
  // + Máy $500 kí hiệu là A500FAC... Khai thác 500FAC/ngày
  // + Máy $1000 kí hiệu là A1000FAC... Khai thác 1500FAC/ngày
  // - Giai đoạn 2:
  // + Máy $100 kí hiệu C100FAC... Khai thác 42FAC/ngày
  // + Máy $500 kí hiệu C500FAC... Khai thác 417FAC/ngày
  // + Máy $1000 kí hiệu C1000FAC... Khai thác 1250FAC/ngày
  // - Giai đoạn 3 :
  // + Máy $100 kí hiệu D100FAC... Khai thác 34FAC/ngày
  // + Máy $500 kí hiệu D500FAC... Khai thác 334FAC/ngày
  // + Máy $1000 kí hiệu D1000FAC... Khai thác 1000FAC/ngày
  // - Giai đoạn 4 :
  // + Máy $100 kí hiệu S100FAC... Khai thác 25FAC/ngày
  // + Máy $500 kí hiệu S500FAC... Khai thác 250 FAC/ngày
  // + Máy $1000 kí hiệu S1000FAC... Khai thác 750FAC/ngày
  // - Giai đoạn 5 :
  // + Máy $100 kí hiệu V100FAC... Khai thác 17FAC/ngày
  // + Máy $500 kí hiệu V500FAC... Khai thác 167FAC/ngày
  // + Máy $1000 kí hiệu V1000FAC... Khai thác 500FAC/ngày
  PACKAGE_TYPE: {
    A100FAC: {
      type: 'A100FAC',
      stage1: 50,
      stage2: 42,
      stage3: 34,
      stage4: 25,
      stage5: 17,
      defaultPrice: 100,
    },
    A500FAC: {
      type: 'A500FAC',
      stage1: 500,
      stage2: 417,
      stage3: 334,
      stage4: 250,
      stage5: 167,
      defaultPrice: 500,
    },
    A1000FAC: {
      type: 'A1000FAC',
      stage1: 1200,
      stage2: 1000,
      stage3: 800,
      stage4: 600,
      stage5: 400,
      defaultPrice: 1000,
    },
  },
};
