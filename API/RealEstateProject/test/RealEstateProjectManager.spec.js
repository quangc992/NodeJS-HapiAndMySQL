/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const Model = require('../resourceAccess/RealEstateProjectResourceAccess');

const app = require('../../../server');

describe(`Tests ${Model.modelName}`, function () {
  let id;
  let token = '';
  before(done => {
    new Promise(async function (resolve, reject) {
      let staffData = await TestFunctions.loginStaff();
      token = staffData.token;
      resolve();
    }).then(() => done());
  });

  it('insert real estate project', done => {
    const body = {
      realEstateProjectTitle: faker.name.jobTitle(),
      projectTypeId: 1,
      introduceImage: 'https://mangol.vn/wp-content/uploads/2017/10/bat-dong-san-thiet-bi-ve-sinh.jpg',
      countryId: 1,
      provinceId: 1,
      districtId: 1,
      wardId: 1,
      street: faker.address.streetName(),
      description: '<p>New Real Estate Project</p>',
      legalStatus: 'Sổ hồng lâu dài',
      constructionUnit: 'Coteccons',
      managerUnit: 'Vinhomes',
      designUnit: 'Artelia Group, EDSA',
      listFacilityIds: '1,2,3,4,5,6,7,8,9,10',
      latitude: 8.23423,
      longitude: 8.5234,
      numberOfBuilding: 15,
      numberOfApartment: 1500,
      buildingDensity: 35,
      realEstateProjectOwner: 1,
      status: 1,
      progress: 1,
      statusNote: 'Đang xây dựng',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProject/insert`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        id = res.body.data[0];
        done();
      });
  });

  it('get list all real estate project', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProject/find`)
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

  it('Delete real estate project by id', done => {
    const body = {
      id: id,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProject/deleteById`)
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

  it('Update real estate project by id', done => {
    const body = {
      id: id,
      data: {
        realEstateProjectTitle: faker.name.jobTitle() + ' update',
        projectTypeId: 1,
        introduceImage: 'https://mangol.vn/wp-content/uploads/2017/10/bat-dong-san-thiet-bi-ve-sinh.jpg',
        countryId: 1,
        provinceId: 1,
        districtId: 1,
        wardId: 1,
        street: faker.address.streetName(),
        description: '<p>New Real Estate Project</p>',
        legalStatus: 'Sổ hồng lâu dài',
        constructionUnit: 'Coteccons',
        managerUnit: 'Vinhomes',
        designUnit: 'Artelia Group, EDSA',
        listFacilityIds: '1,2,3,4,5,6,7,8,9,10',
        latitude: 8.23423,
        longitude: 8.5234,
        numberOfBuilding: 15,
        numberOfApartment: 1500,
        buildingDensity: 35,
        realEstateProjectOwner: 1,
        status: 1,
        progress: 1,
        statusNote: 'Đang xây dựng',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProject/updateById`)
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

  it('get real estate project by id', done => {
    const body = {
      id: id,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProject/findbyid`)
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

  it('update status of real estate project by id', done => {
    const body = {
      id: id,
      status: 2,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProject/updateStatus`)
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
  it('update progress of real estate project by id', done => {
    const body = {
      id: id,
      progress: 2,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProject/updateProgress`)
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
  it('find real estate project by name', done => {
    const body = {
      filter: {
        realEstateProjectTitle: 'Chung cư',
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProject/findByName`)
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

  it('filter real estate project by area', done => {
    const body = {
      filter: {
        countryId: 1,
        provinceId: 1,
        districtId: 1,
        wardId: 1,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProject/filterByArea`)
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
  it('filter real estate project by status', done => {
    const body = {
      filter: {
        status: 1,
        progress: 1,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProject/getListByStatus`)
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
  it('update status note of real estate project', done => {
    const body = {
      id: id,
      statusNote: 'Sắp hoàn thiện',
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProject/updateStatusNote`)
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

  it('Get list real estate project by project type', done => {
    const body = {
      filter: {
        projectTypeId: 1,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProject/getListByProjectType`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Admin get list real estate project by project type', done => {
    const body = {
      filter: {
        projectTypeId: 1,
      },
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProject/adminGetListByProjectType`)
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

  it('Export list real estate project to excel file', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/RealEstateProject/exportExcel`)
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
