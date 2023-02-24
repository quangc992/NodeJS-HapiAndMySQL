/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

async function createDatabase() {
  //*************CREATE TABLES******************
  // << khi reset user nhớ reset Wallet để nó ra ví tương ứng
  await require('../API/AppUsers/resourceAccess/AppUsersResourceAccess').initDB();
  await require('../API/AppUserMembership/resourceAccess/AppUserMembershipResourceAccess').initDB();
  await require('../API/AppUsers/resourceAccess/AppUserView').initViews();

  await require('../API/GameInfo/resourceAccess/GameInfoResourceAccess').initDB();
  await require('../API/GameRecord/resourceAccess/GameRecordsResourceAccess').initDB();
  await require('../API/GamePlayRecords/resourceAccess/GamePlayRecordsResourceAccess').initDB();
  await require('../API/GamePlayRecords/resourceAccess/GamePlayRecordsView').initViews();

  await require('../API/CustomerMessage/resourceAccess/CustomerMessageResourceAccess').initDB();
  await require('../API/CustomerMessage/resourceAccess/GroupCustomerMessageResourceAccess').initDB();

  await require('../API/LeaderBoard/resourceAccess/LeaderBoardResourAccess').initDB();
  await require('../API/LeaderBoard/resourceAccess/LeaderBoardViews').initViews();

  await require('../API/PaymentDepositTransaction/resourceAccess/PaymentDepositTransactionResourceAccess').initDB();
  await require('../API/PaymentDepositTransaction/resourceAccess/PaymentDepositTransactionUserView').initViews();

  await require('../API/PaymentMethod/resourceAccess/PaymentMethodResourceAccess').initDB();

  await require('../API/PaymentWithdrawTransaction/resourceAccess/PaymentWithdrawTransactionResourceAccess').initDB();
  await require('../API/PaymentWithdrawTransaction/resourceAccess/SummaryUserWithdrawTransactionView').initViews();
  await require('../API/PaymentWithdrawTransaction/resourceAccess/WithdrawTransactionUserView').initViews();

  await require('../API/StaffPermission/resourceAccess/StaffPermissionResourceAccess').initDB();
  await require('../API/StaffRole/resourceAccess/StaffRoleResourceAccess').initDB();
  await require('../API/Staff/resourceAccess/StaffResourceAccess').initDB();
  await require('../API/Staff/resourceAccess/RoleStaffView').initViews();

  await require('../API/SystemAppChangedLog/resourceAccess/SystemAppChangedLogResourceAccess').initDB();
  await require('../API/SystemConfigurations/resourceAccess/SystemConfigurationsResourceAccess').initDB();

  await require('../API/Upload/resourceAccess/UploadResourceAccess').initDB();

  await require('../API/Wallet/resourceAccess/WalletResourceAccess').initDB();
  await require('../API/WalletRecord/resourceAccess/WalletRecordResoureAccess').initDB();
  await require('../API/WalletRecord/resourceAccess/WalletRecordView').initViews();
}
createDatabase();
