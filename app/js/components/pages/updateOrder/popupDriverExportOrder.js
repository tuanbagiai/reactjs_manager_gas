import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
//import Select from "react-select";
import SelectMulti from "react-select";
import Button from "react-validation/build/button";
import required from "required";
import Constant from "Constants";
import showToast from "showToast";
//import TagAutocomplete from "TagAutoComplete";
import getUserCookies from "./../../../helpers/getUserCookies";
import getAllUserApi from "getAllUserApi";
import { NAMEDRIVE, GETTYPECUSTOMER, CREATEEXPORTORDERHISTORY } from "./../../../config/config";
// import { GETTYPECUSTOMER } from '../../../config/config';
import callApi from './../../../util/apiCaller';
import createHistoryAPI from "createHistoryAPI";
import { Select, Checkbox } from "antd";
import getListBranchAPI from "./../../../../api/getListBranchAPI";
import openNotificationWithIcon from "./../../../helpers/notification";
import {withNamespaces} from 'react-i18next';

const Option = Select.Option;


//var user_cookie = await getUserCookies();
//let token="Bearer " + user_cookie.token,
//"email": user_cookie.user.email,
class PopupDriverExportOrder extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: "",
      listProducts: [],
      isShowNumber: false,
      AgencyResults: [],
      GeneralResults: "",
      listExportPlaceData: "",
      listExportPlaceDataID: "",
      driverName: "",
      idDriver: "",
      listDriver: [],
      listDistributionAgency: [],
      listIndustry: [],
      listRestaurant: [],
      typeCustomer: "",
      listCustomer: [],
      CustomerResults: [],
      listBranch: [],
      BranchResults: [],
      display: true,
      checked: false,
      textDriver: ''
    };
  }

  handleChangeGeneral = async (e) => {
    await this.setState({
      GeneralResults: e.target.value
    });
    // console.log("id general", this.state.GeneralResults);
    await this.getListBranch(this.state.GeneralResults);
  };

  handleChangeBranch = (langValue) => {
    // console.log("!!!!", langValue);
    this.setState({ BranchResults: langValue });
  };

  handleChangeCustomer = (langValue) => {
      this.setState({ CustomerResults: langValue });
  };
  handleChangeCustomer1 = (langValue) => {
    if(this.state.CustomerResults.length >= 1){
      showToast("Chỉ được chọn một tài xế!", 3000);
      this.setState({CustomerResults: []});
    }
    else{
      this.setState({ CustomerResults: langValue });
    }
    
  }
  handleChangeAgency = (langValue) => {
    this.setState({ AgencyResults: langValue });
    // console.log("id agency", this.state.AgencyResults);
  };

  handleChangeDriver = (value) => {
    this.setState({
      idDriver: value,
    });
  };
  handleTextDriver = (e) => {
    this.setState({
      textDriver: e.target.value,
      idDriver: ''
    })
  }
  handleChangeTypeCustomer = (value) => {
    this.setState({
      typeCustomer: value,
    });
  };

  async getAllCustomer() {
    const dataUsers = await getAllUserApi(Constant.GENERAL);
    if (dataUsers) {
      if (dataUsers.status === Constant.HTTP_SUCCESS_BODY) {
        let listCustomerTemp = [];
        for (let i = 0; i < dataUsers.data.length; i++)
        {
          listCustomerTemp.push({
            value: dataUsers.data[i].id,
            label: dataUsers.data[i].name,
            ...dataUsers.data[i],
          })
        }
        this.setState({
            listCustomer: listCustomerTemp
        })
      } 
      else {
        showToast(
          dataUsers.data.message
            ? dataUsers.data.message
            : dataUsers.data.err_msg,
          2000
        );
      }
    } 
    else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }

  async getDistributionAgencyCustomer(id, token) {
    let reqListCustomer = {
      isChildOf: id,
      customerType: "Distribution_Agency"
    };
    let params = {
      reqListCustomer
    };
    await callApi("POST", GETTYPECUSTOMER, params, token).then(res => {
      // console.log("khach hang dai ly", res.data);
      if (res.data) {
        if (res.data.success === true) {
          let listDistributionAgencyTemp = [];
          for (let i = 0; i < res.data.data.length; i++)
          {
            listDistributionAgencyTemp.push({
              value: res.data.data[i].id,
              label: res.data.data[i].name,
              ...res.data.data[i]
            })
          }
          this.setState({
            listDistributionAgency: listDistributionAgencyTemp
          })
        }
        else {
          showToast(
            res.data.message
              ? res.data.message
              : res.data.err_msg,
            2000
          );
          return false;
        }
      }
      else {
        showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
      }
    });
  }

  async getIndustryCustomer(id, token) {
    let reqListCustomer = {
        isChildOf: id,
        customerType: "Industry"
    };
    let params = {
        reqListCustomer
    };
    await callApi("POST", GETTYPECUSTOMER, params, token).then(res => {
      // console.log("khach hang cong nghiep", res.data);
      if (res.data) {
        if (res.data.success === true) {
          let listIndustryTemp = [];
          for (let i = 0; i < res.data.data.length; i++)
          {
            listIndustryTemp.push({
              value: res.data.data[i].id,
              label: res.data.data[i].name,
              ...res.data.data[i]
            })
          }
          this.setState({
            listIndustry: listIndustryTemp
          })
        }
        else {
          showToast(
              res.data.message
                  ? res.data.message
                  : res.data.err_msg,
              2000
          );
          return false;
        }
      }
      else {
          showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
      }
    });
  }

  async getRestaurantCustomer(id, token) {
    let reqListCustomer = {
      isChildOf: id,
      customerType: "Restaurant_Apartment"
    };
    let params = {
      reqListCustomer
    };
    await callApi("POST", GETTYPECUSTOMER, params, token).then(res => {
        // console.log("khach hang nha hang", res.data);
        if (res.data) {
          if (res.data.success === true) {
            let listRestaurantTemp = [];
            for (let i = 0; i < res.data.data.length; i++)
            {
              listRestaurantTemp.push({
                value: res.data.data[i].id,
                label: res.data.data[i].name,
                ...res.data.data[i]
              })
            }
            this.setState({
              listRestaurant: listRestaurantTemp
            })
          }
          else {
            showToast(
                res.data.message
                    ? res.data.message
                    : res.data.err_msg,
                2000
            );
            return false;
          }
        }
        else {
          showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }
    });
  }

  async getListBranch(id) {
    let listBranchTemp = [];
    const dataBranch = await getListBranchAPI(id);
    // console.log("data branch", dataBranch.data.data);
    for (let i = 0; i < dataBranch.data.data.length; i++) {
      listBranchTemp.push({
        value: dataBranch.data.data[i].id,
        label: dataBranch.data.data[i].name,
        ...dataBranch.data.data[i]
      })
    }
    this.setState({
      listBranch: listBranchTemp
    })
  }
  async addHistoryTurnBack(
    driver,
    license_plate,
    cylinders, 
    type, 
    stationId, 
    numberOfCylinder, 
    idDriver, 
    sign,
    cylinderImex,
    idImex,
    typeImex,
    flow
  ){
    this.setState({ isLoading: true });
    // console.log(stationId);
    const user = await createHistoryAPI(
        driver,
        license_plate,
        cylinders,
        Constant.IMPORT_FACTORY,
        '',
        type,
        numberOfCylinder,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        idDriver,
        sign,
        cylinderImex,
        idImex,
        typeImex,
        flow
    );
    this.setState({ isLoading: false });
    //console.log('register',user);
    if (user) {
        if (user.status === Constant.HTTP_SUCCESS_CREATED || user.status === Constant.HTTP_SUCCESS_BODY && !user.data.hasOwnProperty("err_msg")) {
            showToast('Nhập hàng thành công!', 3000);
            const modal = $("#export-driver-order");
            modal.modal('hide');
            //this.props.refresh();
            return true;
        }
        else {
            showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
            const modal = $("#export-driver-order");
            modal.modal('hide');
            //this.props.refresh();
            return false;
        }
    }
    else {
        showToast("Xảy ra lỗi trong quá trình tạo bình ");
        return false;
    }
    //this.setState({registerSuccessful: false});

  };
  async addHistory(
    driverName,
    license_plate,
    cylinders,
    to_array,
    number_array,
    idDriver,
    sign,
    cylinderImex,
    idImex,
    typeImex,
    flow
  ) {
    // Call api
    /* this.setState({ isLoading: true });
    const user = await createHistoryAPI(
      driverName,
      license_plate,
      cylinders,
      Constants.EXPORT_FACTORY,
      "",
      "",
      "",
      "",
      to_array,
      number_array,
      "",
      "",
      "",
      "",
      "",
      idDriver,
      sign
    );
    this.setState({ isLoading: false });
    //console.log('register',user);
    if (user) {
      if (
        user.status === Constants.HTTP_SUCCESS_CREATED ||
        user.status === Constants.HTTP_SUCCESS_BODY
      ) {
        showToast("Xuất hàng thành công!", 3000);
        const modal = $("#export-driver");
        modal.modal("hide");
        //this.props.refresh();
        return true;
      } else {
        showToast(
          user.data.message ? user.data.message : user.data.err_msg,
          2000
        );
        return false;
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình tạo bình ");
      return false;
    }
 */

    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;

    let params = {
      userId: user_cookies.user.id,

      // Chi tiết export
      type: 'EXPORT',
      driver: driverName,
      license_plate,
      from: user_cookies.user.id,
      toArray: to_array,
      numberArray: number_array,
      cylinders,
      idDriver,
      signature: sign,
      cylinderImex,
      idImex,
      typeImex,
      flow,

      // Đơn hàng
      orderId: this.props.selectedOrderIDs,
    };


    await callApi("POST", CREATEEXPORTORDERHISTORY, params, token).then((res) => {
      // console.log('check_cylidners_for_order', res.data)
      const resData = res.data
      const modal = $("#export-driver-order");
      modal.modal("hide");
      if (resData.status && resData.resCode === 'SUCCESS-00002') {        
        return openNotificationWithIcon("success", resData.message)
      }
      else {
        return openNotificationWithIcon("error", res.data.message)
      }
    });
    
  }

  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let id;
    let token = "Bearer " + user_cookies.token;
    // console.log("user cookieess999", user_cookies.user);
    let params = {
      id: user_cookies.user.id,
    };
    if (user_cookies.user.userType === "Factory" && user_cookies.user.userRole === "Owner") {
      id = user_cookies.user.isChildOf
    }
    else {
      id = user_cookies.user.id;
    }
    
    await callApi("POST", NAMEDRIVE, params, token).then((res) => {
      if (res.data.data <= 0) {
        this.setState({
          listDriver: [{
            name: "Bạn chưa có tài xế",
            id: "null"
          }],
        });
      }
      else {
        //console.log(user_cookie.user.id+""+res.data.data);
        this.setState(
          {
            listDriver: res.data.data,
          },
          () => console.log(this.state.listDriver)
        );
      }
    });
    await this.getAllCustomer();
    await this.getDistributionAgencyCustomer(id, token);
    await this.getIndustryCustomer(id, token);
    await this.getRestaurantCustomer(id, token);
  }


  async submit(event) {
    // console.log('submit event')
    event.preventDefault();
    let { listDriver, textDriver } = this.state;
    if(this.state.checked === false) {
      var index = listDriver.findIndex((l) => l.id === this.state.idDriver);
      var nameDriver =  listDriver[index].name;      
    }
    else if(this.state.checked === true) {
      var textDrivers = textDriver;
    }

    //// var products=await this.getAllCylenders();
    var cylinders = [];
    let cylinderImex = [];
    let cylinderImexTurnBack = [];
    for (let i = 0; i < this.props.product_parse.length; i++) {
      cylinders.push(this.props.product_parse[i].id);
      cylinderImex.push(
          {
              id: this.props.product_parse[i].id,
              status: "FULL",
              condition: "NEW"
          }
      )
      cylinderImexTurnBack.push(
          {
              id: this.props.product_parse[i].id,
              status: "FULL",
              condition: "NEW"
          }
      )
    }

    let data = this.form.getValues();
    console.log("data checkbox", this.state.checked);
    // console.log("data", data);
    // console.log("numberGeneral0", data.numberGeneral0);
    // console.log(data["numberGeneral1"]);
    let toArray = [];
    let numberArray = [];
    let generalList = this.state.GeneralResults;
    let branchList = this.state.BranchResults;
    let customerList = this.state.CustomerResults;
    let idImex = Date.now();
    let typeImex = "OUT";
    let flow="EXPORT";
    let typeImexTurnBack="IN";
    let flowTurnBack="IMPORT";
    //let agencyList = this.state.AgencyResults;
    if (customerList.length === 0 && generalList.length === 0) {
      showToast("Hãy chọn nơi cần xuất bình");
      return;
    } else {
      for (let i = 0; i < branchList.length; i++) {
        toArray.push(branchList[i].value);
        if (data["numberGeneral" + i])
          numberArray.push(data["numberGeneral" + i]);
        else 
          numberArray.push(0);
      }
      for (let i = 0; i < customerList.length; i++) {
        toArray.push(customerList[i].value);
        if (data["numberAgency" + i])
          numberArray.push(data["numberAgency" + i]);
        else 
          numberArray.push(0);
      }
    }
    if(this.state.checked === false) {
      await this.addHistory(
        nameDriver,
        data.license_plate,
        cylinders,
        toArray,
        numberArray,
        this.state.idDriver,
        "Xuất đơn hàng trên WEB",
        cylinderImex,
        idImex,
        typeImex,
        flow
      );  
    }
    else if(this.state.checked === true) {
      await this.addHistory(
        textDrivers,
        data.license_plate,
        cylinders,
        toArray,
        numberArray,
        this.state.idDriver,
        "Xuất đơn hàng trên WEB",
        cylinderImex,
        idImex,
        typeImex,
        flow
      );       
      await this.addHistoryTurnBack(
        textDrivers,
        data.license_plate,
        cylinders,
        Constant.TURN_BACK_TYPE,
        data.station,
        numberArray,
        this.state.idDriver,
        "Nhập hàng trực tiếp",
        cylinderImexTurnBack,
        idImex,
        typeImexTurnBack,
        flowTurnBack
      );
    }
    console.log("idDriver", this.state.idDriver);
    return;
  }

  async submitTextFile(event) {
    // /* if (!file) showToast('Vui lòng chọn file!', 3000);
    //      this.setState({isLoading: true});
    //      const result = await importProductsFromExcelAPI(file);
    //      this.setState({isLoading: false});
    //      console.log(result);
    //      if (result && result.status === 200) {
    //          if (typeof (result) !== 'undefined') {
    //              showToast('Đưa vào thành công!', 3000);
    //              this.props.refresh();
    //          }
    //          else {
    //              //showToast("Xảy ra lỗi trong quá trình đăng ký",2000);
    //          }
    //          return;
    //      } else {
    //          showToast("Xảy ra lỗi trong quá trình import. Vui lòng kiểm tra lại dữ liệu", 2000);
    //      }
    //      return;
    //      $("#import-product").modal('hide');
    //      return;*/
  }

  handleChangeExportType = (langValue) => {
    this.setState({
      listExportPlaceData: langValue,
      listExportPlaceDataID: langValue.id,
    });
  };
  // handleClickOutCar = (e) => {
  //   this.setState({
  //     display: !this.state.display,
  //     checked: !this.state.checked
  //   })
  // }
  handleOnChangeCheck = (e) => {
    this.setState({
      checked: e.target.checked
    })
  }
  render() {
    //console.log("hahahhahaha", this.props.listExportPlace);
    const display = this.state.display ? 'none':'' // toggle css display: none
    const checked = this.state.checked ? true : false // toggle checked
    let ar = [];
    for(let i=0;i<this.state.CustomerResults.length;i++){
      ar.push(this.state.CustomerResults[i].id);
    }
    console.log(this.state.CustomerResults[0]);
    let dri = [];
    for(let i=0;i<this.state.listDriver.length;i++){
      dri.push(this.state.listDriver[i].name);
    }
    console.log("listDriver", this.state.listDriver[0]);
    console.log("textdri", this.state.textDriver);
    return (
      <div
        className="modal fade"
        id="export-driver-order"
        tabIndex="-1"
        style={{ overflowY: "auto" }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Đơn Hàng: Xuất Bình - Bước 2 - Thông Tin Tài Xế
              </h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form
                ref={(c) => {
                  this.form = c;
                }}
                className="card"
                onSubmit={(event) => this.submit(event)}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                     <div className="form-group d-flex justify-content-between">
                        <Checkbox className="text-align-left" 
                                  name="checkCarOut"
                                  id="checkCarOut"
                                  checked={this.state.checked}
                                  onChange={this.handleOnChangeCheck}
                        >
                          <label>Xe ngoài</label>
                        </Checkbox>
                        {/* <Checkbox className="text-align-right" 
                                  style={{display: display}}
                        >
                          <label>Tạo lệnh nhập kho</label>
                        </Checkbox> */}
                      </div>
                    </div>
                    <div className="col-md-6"></div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Tên tài xế</label>
                        {checked === true ?(
                          <Input
                            className="form-control"
                            type="text"
                            placeholder="Nhập tài xế..."
                            value={this.state.textDriver}
                            onChange={this.handleTextDriver}
                            style={{ width: "100%" }}
                          />
                        ) : <Select
                              showSearch
                              style={{ width: "100%", display: this.state.display }}
                              placeholder="Chọn tài xế..."
                              optionFilterProp="children"
                              onChange={this.handleChangeDriver}
                              filterOption={(input, option) =>
                                option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            >
                            {this.state.listDriver.map((l, index) => {
                              return (
                                <Option key={index} value={l.id}>
                                  {l.name}
                                </Option>
                              );
                            })}
                          </Select>
                        }
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Biển số xe</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="license_plate"
                          id="license_plate"
                          validations={[required]}
                        />
                        {/* <Select
                          showSearch
                          style={{ width: "100%" }}
                          placeholder="Chọn xe..."
                          optionFilterProp="children"
                          onChange={this.handleChangeDriver}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.listDriver.map((l, index) => {
                            return (
                              <Option key={index} value={l.id}>
                                {l.name}
                              </Option>
                            );
                          })}
                        </Select> */}
                      </div>
                    </div>

                    {/*<div className="col-md-12">*/}
                    {/*    <div className="form-group">*/}
                    {/*        <label>Loại xuất </label>*/}
                    {/*        <Select onClick={() => {*/}
                    {/*            this.setState({isShowDropdown: this.form.getValues().type_export})*/}
                    {/*        }} className="form-control"*/}
                    {/*                name="type_export"*/}
                    {/*                validations={[required]}>*/}
                    {/*            <option value="0">-- Chọn --</option>*/}
                    {/*            <option value="2">Xuất cho thương nhân mua bán</option>*/}
                    {/*            <option value="3">Xuất cho cửa hàng bán lẻ</option>*/}
                    {/*        </Select>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*{this.props.userType === Constant.FACTORY && (*/}
                    {/*    <div className="col-md-12">*/}
                    {/*        <div className="form-group">*/}
                    {/*            <label>"Địa điểm xuất bình"</label>*/}
                    {/*            <Select*/}
                    {/*                options={this.props.listExportPlace}*/}
                    {/*                onChange={this.handleChangeExportType.bind(this)}*/}
                    {/*                placeholder="Chọn..."*/}
                    {/*                value={this.state.listExportPlaceData}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                    {this.props.userType === Constant.GENERAL 
                    ? ( "" ) 
                    : (
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Chọn loại khách hàng</label>
                          <Select
                            style={{ width: "100%" }}
                            placeholder="Chọn loại khách hàng..."
                            onChange={this.handleChangeTypeCustomer}
                          >
                            <Option value="Distribution_Agency">Đại lý phân phối</Option>
                            <Option value="Industry">Khách hàng công nghiệp</Option>
                            <Option value="Restaurant_Apartment">Nhà hàng, tòa nhà</Option>
                          </Select>
                        </div>

                          {this.state.typeCustomer !== "Distribution_Agency" &&
                            <div className="form-group">
                              <label>Chọn khách hàng</label>
                              <select
                                className="form-control"
                                style={{ width: "100%" }}
                                placeholder="Chọn khách hàng..."
                                onChange={e => this.handleChangeGeneral(e)}
                                value={this.state.GeneralResults}
                              >
                                <option value="">Chọn khách hàng...</option>
                                {/* {this.state.typeCustomer === "Distribution_Agency" && 
                              this.state.listDistributionAgency.map((l, index) => {
                                return (
                                  <option key={index} value={l.id}>
                                    {l.name}
                                  </option>
                                );
                              })
                            } */}
                                {this.state.typeCustomer === "Industry" &&
                                  this.state.listIndustry.map((l, index) => {
                                    return (
                                      <option key={index} value={l.id}>
                                        {l.name}
                                      </option>
                                    );
                                  })
                                }
                                {this.state.typeCustomer === "Restaurant_Apartment" &&
                                  this.state.listRestaurant.map((l, index) => {
                                    return (
                                      <option key={index} value={l.id}>
                                        {l.name}
                                      </option>
                                    );
                                  })
                                }
                              </select>
                            </div>
                          }
                        
                          {this.state.typeCustomer !== "Distribution_Agency" &&
                          <div className="form-group">
                            <label>Chọn các chi nhánh</label>
                            <SelectMulti.Creatable
                              multi={true}
                              options={this.state.listBranch}
                              onChange={this.handleChangeBranch.bind(this)}
                              placeholder={this.props.t('CHOOSE')}
                              value={this.state.BranchResults}
                              promptTextCreator={() => {
                                return;
                              }}
                            />
                          </div>}
                          {this.state.typeCustomer === "Distribution_Agency" &&
                          <div className="form-group">
                            <label>Chọn các khách hàng</label>
                            <SelectMulti.Creatable
                              multi={true}
                              options={this.state.listDistributionAgency}
                              onChange={checked ? this.handleChangeCustomer1.bind(this) : this.handleChangeCustomer.bind(this)}
                              placeholder={this.props.t('CHOOSE')}
                              value={this.state.CustomerResults}
                              promptTextCreator={() => {
                                return;
                              }}
                            />
                          </div>}
                        </div>
                      )}

                    {/* <div className="col-md-6">
                      <div className="form-group">
                        <label>Chọn các khách hàng</label>
                          <SelectMulti.Creatable
                            multi={true}
                            options={this.state.listCustomer}
                            onChange={this.handleChangeCustomer.bind(this)}
                            placeholder="Chọn..."
                            value={this.state.CustomerResults}
                            promptTextCreator={() => {
                              return;
                            }}
                          />

                         <label>Cửa hàng bán lẻ</label>

                        <SelectMulti.Creatable
                          multi={true}
                          options={this.props.listFactoryExports.filter(
                            (x) => x.userType === Constants.AGENCY
                          )}
                          onChange={this.handleChangeAgency.bind(this)}
                          placeholder="Chọn..."
                          value={this.state.AgencyResults}
                          promptTextCreator={() => {
                            return;
                          }}
                        /> 
                      </div>
                    </div> */}
                    {/* {this.state.typeCustomer === "Distribution_Agency"
                      ? ( */}
                        <div className="col-md-6">
                          <table
                            className="table table-striped table-bordered seednet-table-keep-column-width"
                            cellSpacing="0"
                          >
                            <tbody className="display-block display-tbody">
                              {this.state.CustomerResults.map((store, index) => {
                                return (
                                  <tr key={index}>
                                    <td scope="row" className="text-center">
                                      {store.name}
                                    </td>
                                    <td scope="row" className="text-center">
                                      <Input
                                        name={"numberGeneral" + index}
                                        placeholder={"Nhập số lượng"}
                                        //validations={[required]}
                                        className="form-control"
                                        type="number"
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      {/* )
                      : ( */}
                        <div className="col-md-6"></div>
                        <div className="col-md-6">
                          <table
                            className="table table-striped table-bordered seednet-table-keep-column-width"
                            cellSpacing="0"
                          >
                            <tbody className="display-block display-tbody">
                              {this.state.BranchResults.map((store, index) => {
                                return (
                                  <tr key={index}>
                                    <td scope="row" className="text-center">
                                      {store.name}
                                    </td>
                                    <td scope="row" className="text-center">
                                      <Input
                                        name={"numberAgency" + index}
                                        placeholder={"Nhập số lượng"}
                                        //validations={[required]}
                                        className="form-control"
                                        type="number"
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      {/* )} */}
                    {/* <div className="col-md-6">
                      <table
                        className="table table-striped table-bordered seednet-table-keep-column-width"
                        cellSpacing="0"
                      >
                        <tbody className="display-block display-tbody">
                          {this.state.CustomerResults.map((store, index) => {
                            return (
                              <tr key={index}>
                                <td scope="row" className="text-center">
                                  {store.name}
                                </td>
                                <td scope="row" className="text-center">
                                  <Input
                                    name={"numberAgency" + index}
                                    placeholder={"Nhập số lượng"}
                                    className="form-control"
                                    type="number"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div> */}

                    {/* {this.state.isShowDropdown==='1' && (<div className="col-md-6">
                                            <div className="form-group">
                                                <label>Trạm chiết nạp</label>
                                                <Select className="form-control"
                                                        name="station"
                                                        validations={[required]}>
                                                    <option value="">-- Chọn --</option>
                                                    {this.props.listStationUser.map((item, index) => <option value={item.id}>{item.name}</option>)}
                                                </Select>
                                            </div>
                                        </div>)} */}
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button className="btn btn-primary" type="submit">
                    Lưu
                  </Button>
                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                  >
                    Đóng
                  </button>
                </footer>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(PopupDriverExportOrder);
