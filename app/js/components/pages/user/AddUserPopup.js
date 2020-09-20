import React from "react";
import PropType from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import Button from "react-validation/build/button";
import required from "required";
import email from "email";
import isUppercase from "isUppercase";
import getUserCookies from "getUserCookies";
import Agency from "../agency/Agency";

import { withNamespaces } from 'react-i18next';

const USERTYPE_ENUM = [
  {
    key: "SuperAdmin",
    value: "Quản trị viên",
  },
  {
    key: "Staff",
    value: "Nhân viên",
  },
];

class AddUserPopup extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: "",
      checked: true,
      password: '',
      code: '',
      groupCustomer: '',
      value: {
        password: "",
        email: "",
      },
      errors: {
        password: "",
        email: ""
      },
      formValid: false,
      newpassword: false,
      newemail: false,
      agency: [
        {
          agencyId: "",
          agencyName: "",
          agencyAddress: ""
        }
      ]
    };
  }

  handleAddClick = e => {
    this.setState({
      agency: [...this.state.agency, { agencyId: "", agencyName: "", agencyAddress: "" }]
    })
  }

  handleRemoveClick = (index) => {
    let val = [...this.state.agency];
    val.splice(index, 1);
    this.setState({
      agency: val
    });
  }

  /*handleAgencyAddChange = (e, index) => {
    const newAgency = this.state.agency.map((agency, agencyIndex) => {
      if (index !== agencyIndex) {
        return agency;
      }
      return {...agency, [e.target.name]: e.target.value};
    });
    this.setState({agency: newAgency});
  }*/

  handleAgencyChange = (e, index) => {
    const val = [...this.state.agency];
    if (e.target.name === "agencyId") {
      val[index].agencyId = e.target.value;
    }
    else if (e.target.name === "agencyName") {
      val[index].agencyName = e.target.value;
    }
    else {
      val[index].agencyAddress = e.target.value;
    }
    this.setState({
      agency: val
    });
  }

  submitTest(event) { }
  // async submit2(e){
  //   e.preventDefault();
  //   let data = this.form.getValues();
  //   console.log(data)
  // }

  async submit(event) {
    event.preventDefault();
    if (this.props.isCreateMode) {
      var user_cookies = await getUserCookies();
      let isChildOf = "";
      if (user_cookies) {
        isChildOf = user_cookies.user.id;
      }

      let data = this.form.getValues();
      // console.log('AGENCY', data)
      // alert('AGENCY')
      let result = false;
      if (this.props.isStationPage) {
        result = await this.props.addUser(
          data.email,
          data.name,
          data.address,
          "",
          "Station",
          isChildOf,
          "",
          this.state.checked,
          data.code,
        );
      }
      else if (this.props.isFactoryPage) {
        result = await this.props.addUser(
          data.email,
          data.name,
          data.address,
          "",
          "Factory",
          isChildOf,
          "",
          this.state.checked,
          "",
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0
        );
      }
      else if (this.props.isDrivePage) {
        result = await this.props.addUser(
          data.email,
          data.name,
          data.address,
          "",
          "Driver",
          isChildOf,
          "",
          this.state.checked,
          "",
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0
        );
      }
      else if (this.props.isInspectorPage) {
        result = await this.props.addUser(
          data.email,
          data.name,
          data.address,
          "",
          "ThanhTra",
          isChildOf,
          "",
          this.state.checked,
          "",
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0
        );
      }
      // else if(this.props.isTrunk){
      //   result = await this.props.addUser(
      //     data.license_plate,
      //     data.load_capacity,
      //     "",
      //     'Car',
      //     // isChildOf,
      //     "",
      //     this.state.checked
      //   )
      // }
      else if (this.props.isGeneralPage) {
        result = await this.props.addCustomer(
          data.name,
          data.email,
          data.invoiceName,
          data.invoiceAddress,
          "Distribution_Agency",
          data.code,
          "General",
          "SuperAdmin",
          user_cookies.user.id,
          isChildOf,
          this.state.agency,
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0,
          data.groupCustomer
        );
      }
      else if (this.props.isIndustryPage) {
        result = await this.props.addCustomer(
          data.name,
          data.email,
          data.invoiceName,
          data.invoiceAddress,
          "Industry",
          data.code,
          "General",
          "SuperAdmin",
          user_cookies.user.id,
          isChildOf,
          this.state.agency,
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0,
          data.groupCustomer
        );
      }
      else if (this.props.isRestaurantPage) {
        result = await this.props.addCustomer(
          data.name,
          data.email,
          data.invoiceName,
          data.invoiceAddress,
          "Restaurant_Apartment",
          data.code,
          "General",
          "SuperAdmin",
          user_cookies.user.id,
          isChildOf,
          this.state.agency,
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0,
          data.groupCustomer
        );
      }
      else if (this.props.isAgencyPage) {
        result = await this.props.addUser(
          data.email,
          data.name,
          data.address,
          "",
          "Agency",
          isChildOf,
          "",
          this.state.checked,
          "",
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0,
          data.code ? data.code : "",
        );
      }
      else if (this.props.isFixerPage) {
        result = await this.props.addUser(
          data.email,
          data.name,
          data.address,
          "",
          "Fixer",
          isChildOf,
          USERTYPE_ENUM[parseInt(data.userType)].key,
          this.state.checked,
          data.code,
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0
        );
      }
      else if (this.props.isFactoryChildPage) {
        result = await this.props.addUserFactoryChild(
          data.email,
          data.name,
          data.address,
          "",
          "Factory",
          isChildOf,
          "Owner",
          this.state.checked,
          "",
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0,
          data.code
        );
      }
      else {
        result = await this.props.addUser(
          data.email,
          data.name,
          data.address,
          "",
          USERTYPE_ENUM[parseInt(data.userType)].key,
          isChildOf,
          this.state.checked,
          "",
          data.lat ? data.lat : 0,
          data.lng ? data.lng : 0
        );
      }

      if (result) {
        const modal = $("#create-user");
        modal.modal("hide");
      }
    }
    else {
      var user_cookies = await getUserCookies();

      let data = this.form.getValues();
      // console.log('updateUser', data, this.props.isAgencyPage)
      let result = false;
      result = await this.props.updateUser(
        this.props.isEditForm.id,
        data.name,
        data.password,
        data.address,
        this.props.isFactoryChildPage ? data.code : "",
        (this.props.isGeneralPage || this.props.isIndustryPage || this.props.isRestaurantPage) ? data.code : "",
        (this.props.isGeneralPage || this.props.isIndustryPage || this.props.isRestaurantPage) ? data.invoiceAddress : "",
        (this.props.isGeneralPage || this.props.isIndustryPage || this.props.isRestaurantPage) ? data.groupCustomer : "",
        data.lat,
        data.lng,
        this.props.isAgencyPage ? data.code : "",
      );

      if (result) {
        const modal = $("#create-user");
        modal.modal("hide");
      }
    }
    // window.location.reload();
    return;
  }

  reloadPopup() {
    window.location.reload();
  }

  onChange = (e) => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value
    })
  }

  selectOptionHandler = (e) => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value
    });
  };

  handleChangeSelect = () => {
    this.setState({ checked: !this.state.checked });
  };

  handleErrorEmail = (e) => {
    let { name, value } = e.target;
    let { newemail } = this.state;
    value === "" ? "Xin Vui lòng nhập vô đây" : "";
    let message = value;
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    message === "" ? true : false;
    newemail = message;
    if (value === "") {
      message = "";
    }
    else if (!filter.test(email.value)) {
      message = "Định dạng email không đúng và yêu cầu nhập lại.";
      // email.focus;
      newemail = false;
    }
    else {
      message = "";
      document.getElementById()
      newemail = true;

    }
    this.setState(
      {
        errors: { ...this.state.errors, [name]: message },
        newemail,
      },
      () => {
        this.FormValidation();
      }
    );
  };

  handleErrors = (e) => {
    let { name, value } = e.target;
    let message = value === "" ? "Xin Vui lòng nhập vô đây" : "";
    let { newpassword } = this.state;
    var pattern = new RegExp(
      "^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
      "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
      "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$"
    );
    var number = /^[0-9]+$/;

    newpassword = message === "" ? true : false;
    if (
      value &&
      value.length < 6 &&
      value.match(pattern) &&
      value.match(number)
    ) {
      message =
        "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt";
      newpassword = false;
    }
    else if (value && value.match(number)) {
      message =
        "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt";
      newpassword = true;
    }
    else if (value && value.match(pattern)) {
      message =
        "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt";
      newpassword = true;
    }
    else if (value && value.length < 6) {
      message =
        "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt";
      newpassword = true;
    }

    this.setState(
      {
        errors: { ...this.state.errors, [name]: message },
        newpassword,
      },
      () => {
        this.FormValidation();
      }
    );
  };

  FormValidation = () => {
    this.setState({
      formValid: this.state.newpassword,
    });
  };

  //    checkEmail = () => {
  //     var email = document.getElementById('email');
  //     var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  //     if (!filter.test(email.value)) {
  //         alert('Hay nhap dia chi email hop le.\nExample@gmail.com');
  //         email.focus;
  //         return false;
  //     }
  //     else
  //     {
  //         alert('OK roi day, Email nay hop le.');
  //     }
  // }
  async componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.userEdit) {
      this.handleClear()
    }
    else {
      await this.setState({
        email: "",
        name: "",
        address: "",
        code: "",
        password: ''
      });
    }
  }

  handleClear = async (userEdit) => {
    alert('ok')
    await this.setState({
      email: userEdit.email,
      name: userEdit.name,
      address: userEdit.address,
      code: userEdit.code,
      id: userEdit.id,
      password: ''
    })
  }
 

  render() {
    let { password, agency } = this.state;
    // console.log("this.props", this.props);
    return (
      <div className="modal fade" id="create-user" tabIndex="-1" >
        <div className="modal-dialog modal-lg" >
          <div className="modal-content" >
            <div className="modal-header">
              <h5 className="modal-title">
                {this.props.isCreateMode
                  ? (this.props.isFactoryPage ? this.props.t('CREATE_FAC') :
                    this.props.isGeneralPage ? this.props.t('CREATE_GENE') :
                      this.props.isIndustryPage ? this.props.t('CREATE_INDUS') :
                        this.props.isRestaurantPage ? this.props.t('CREATE_RES') :
                          this.props.isAgencyPage ? this.props.t('CREATE_AGEN') :
                            this.props.isFactoryChildPage ? this.props.t('CREATE_CHILD') :
                              this.props.isFixerPage ? this.props.t('CREATE_FIXER') : "")
                  : (this.props.isFactoryPage ? this.props.t('EDIT_FAC') :
                    this.props.isGeneralPage ? this.props.t('EDIT_GENER') :
                      this.props.isIndustryPage ? this.props.t('EDIT_INDUS') :
                        this.props.isRestaurantPage ? this.props.t('EDIT_RES') :
                          this.props.isAgencyPage ? this.props.t('EDIT_AGEN') :
                            this.props.isFactoryChildPage ? this.props.t('EDIT_CHILD') :
                              this.props.isFixerPage ? this.props.t('EDIT_FIXER') : "")}
              </h5>
              <button type="button" className="close" data-dismiss="modal"
                // onClick={this.reloadPopup}
             
              >
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

            
            
                  <div className="row">

                  {(this.props.isGeneralPage) && (
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{this.props.t('AGENCY_ID')}</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="agencyId"
                          id="agencyId"
                        />
                      </div>
                      </div>
                      )}

                      {(this.props.isGeneralPage) && (
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>{this.props.t('AGENCY_NAME')}</label>
                            <Input
                              className="form-control"
                              type="text"
                              name="agencyName"
                              id="agencyName"

                            />
                          </div>
                        </div>)}

                    <div className="col-md-6">
                      <div className="form-group">

                        <label> {this.props.t('EMAIL')} </label>
                        <Input
                          // disabled={!this.props.isCreateMode}
                          disabled={this.props.isEditForm}
                          className="form-control"
                          type="text"
                          name="email"
                          id="email"
                          value={
                            this.props.isEditForm
                              ? this.props.isEditForm.email
                              : ""
                          }
                          validations={[required, isUppercase, email]}
                          // onClick={this.checkEmail}
                          onBlur={this.handleErrorEmail ? this.props.t('CREATE_USER')
                            : ""}
                          onKeyUp={this.handleErrorEmail ? this.props.t('CREATE_USER')
                            : ""}
                        />

                        {this.state.errors.email === "" ? (
                          ""
                        ) : (
                            <div className="alert alert-danger">
                              {this.state.errors.email}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>
                          {this.props.isFactoryPage ? this.props.t('NAME_FAC') :
                            this.props.isFactoryChildPage ? this.props.t('NAME_CHILD') :
                              this.props.isGeneralPage ? this.props.t('NAME_GENER') : 
                                this.props.isIndustryPage ? this.props.t('NAME_INDUS') :
                                  this.props.isRestaurantPage ? this.props.t('NAME_RES'): 
                                    this.props.isAgencyPage ? this.props.t('NAME_AGEN') :
                                      this.props.isFixerPage ? this.props.t('NAME_FIXER') : this.props.t('NAME_USER')}
                        </label>
                        <Input
                          className="form-control"
                          type="text"
                          name="name"
                          id="name"
                          value={
                            !!this.props.isEditForm
                              ? this.props.isEditForm.name
                              : ""
                          }
                          validations={[required]}
                        />
                      </div>
                    </div>
                    {(this.props.isGeneralPage || this.props.isIndustryPage || this.props.isRestaurantPage
                      || this.props.isFactoryChildPage || this.props.isFixerPage || this.props.isAgencyPage) && (
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            {this.props.isGeneralPage ? this.props.t('CODE_GENER') :
                              this.props.isIndustryPage ? this.props.t('CODE_INDUS') :
                              this.props.isRestaurantPage ? this.props.t('CODE_RES') : 
                              this.props.isFactoryChildPage ? this.props.t('CODE_CHILD'): 
                              this.props.isFixerPage ? this.props.t('CODE_FIXER') : 
                              this.props.isAgencyPage ? "Mã chi nhánh" : ""}
                          </label>
                          <Input
                            className="form-control"
                            type="text"
                            name="code"
                            id="code"
                            value={
                              this.props.isEditForm && !this.props.isFactoryChildPage && !this.props.isFixerPage
                                ? this.props.isEditForm.customerCode
                                : this.props.isEditForm && this.props.isFactoryChildPage
                                  ? this.props.isEditForm.warehouseCode
                                  : this.props.isEditForm && this.props.isFixerPage 
                                  ? this.props.isEditForm.fixerCode
                                  : ""
                            }
                          />
                        </div>
                      </div>
                    )}
                    {/* {this.props.isCreateMode &&
                      (this.props.isGeneralPage || this.props.isIndustryPage || this.props.isRestaurantPage) && (
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>{this.props.t('NAME_ORDER')}</label>
                            <Input
                              className="form-control"
                              type="text"
                              name="invoiceName"
                              id="invoiceName"
                            />
                          </div>
                        </div>
                      )} */}
                    {(!this.props.isGeneralPage && !this.props.isIndustryPage && !this.props.isRestaurantPage) && (
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>
                            {this.props.t('ADDRESS')}
                        </label>
                          <Input
                            className="form-control"
                            type="text"
                            name="address"
                            id="address"
                            value={
                              !!this.props.isEditForm
                                ? this.props.isEditForm.address
                                : ""
                            }
                            validations={[required]}
                          />
                        </div>
                      </div>)}
                    {(this.props.isGeneralPage || this.props.isIndustryPage || this.props.isRestaurantPage) && (
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            {this.props.t('NAME_ORDER')}
                          </label>
                          <Input
                            className="form-control"
                            type="text"
                            name="invoiceName"
                            id="invoiceName"
                            value={
                              !!this.props.isEditForm && (this.props.isGeneralPage || this.props.isIndustryPage || this.props.isRestaurantPage)
                                ? this.props.isEditForm.invoiceName
                                : ""
                            }
                            validations={[required]}
                          />
                        </div>
                      </div>)}
                      
                      {(this.props.isGeneralPage || this.props.isIndustryPage || this.props.isRestaurantPage) && (
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            {this.props.t('CUSTOMER_GROUP')}
                          </label>
                          <Select
                            className="form-control"
                            name="groupCustomer"
                            id="groupCustomer"
                             //value={this.props.isEditForm.groupCustomer}
                            value={
                              !!this.props.isEditForm
                                ? this.props.isEditForm.groupCustomer
                                : ""
                            }
                             //onChange={this.selectOptionHandler}
                            // validations={[required]}
                          >
                            <option value=''>{this.props.t('CHOOSE')}</option>
                            {/* Nhóm 1.5 */}
                            <option value={this.props.t('GR_1.5')}>{this.props.t('GR_1.5')}</option>
                            {/* Nhóm thực tế */}
                            <option value={this.props.t('GR_REAL')}>{this.props.t('GR_REAL')}</option>
                            {/* Nhóm 0.6 */}
                            <option value="03">{this.props.t('GR_0.6')}</option>
                            {/* Nhóm 1.5 thực tế */}
                            <option value="04">{this.props.t('GR_1.5_REAL')}</option>
                            {/* Nhóm 0.2 */}
                            <option value="05">{this.props.t('GR_0.2')}</option>
                            {/* Nhóm không tính */}
                            <option value="06">{this.props.t('GR_NO')}</option>
                            {/* Nhóm 0.4 */}
                            <option value="07">{this.props.t('GR_0.4')}</option>
                          </Select>
                        </div>
                      </div>)}
                      {(this.props.isGeneralPage || this.props.isIndustryPage || this.props.isRestaurantPage) && (
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            {this.props.t('ADDRESS_EXPORT_ORDER')}
                          </label>
                          <Input
                            className="form-control"
                            type="text"
                            name="invoiceAddress"
                            id="invoiceAddress"
                            value={
                              !!this.props.isEditForm && (this.props.isGeneralPage || this.props.isIndustryPage || this.props.isRestaurantPage)
                                ? this.props.isEditForm.invoiceAddress
                                : ""
                            }
                            validations={[required]}
                          />
                        </div>
                      </div>)}
                    {/* {this.props.isCreateMode && ( */}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>{this.props.t('LAT_LOC')}</label>
                          <Input
                            className="form-control"
                            type="number"
                            name="lat"
                            id="lat"
                            value={
                              !!this.props.isEditForm
                                ? this.props.isEditForm.LAT
                                : ""
                            }
                          />
                        </div>
                      </div>
                    {/* )} */}
                    {/* {this.props.isCreateMode && ( */}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>{this.props.t('LNG_LOC')}</label>
                          <Input
                            className="form-control"
                            type="number"
                            name="lng"
                            id="lng"
                            value={
                              !!this.props.isEditForm
                                ? this.props.isEditForm.LNG
                                : ""
                            }
                          />
                        </div>
                      </div>
                    {/* )} */}
                  </div>

                  {/* Thêm nhiều chi nhánh */}
                  {this.props.isCreateMode &&
                    (this.props.isIndustryPage || this.props.isRestaurantPage) &&
                    agency.map((store, index) =>
                      <div key={index}>
                        <div className="row" style={{ border: "black dashed 1px", marginTop: "10px", padding: "10px" }}>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>{this.props.t('AGENCY_ID')}</label>
                              <Input
                                className="form-control"
                                type="text"
                                name="agencyId"
                                id="agencyId"
                                value={store.agencyId}
                                onChange={e => this.handleAgencyChange(e, index)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>{this.props.t('AGENCY_NAME')}</label>
                              <Input
                                className="form-control"
                                type="text"
                                name="agencyName"
                                id="agencyName"
                                value={store.agencyName}
                                onChange={e => this.handleAgencyChange(e, index)}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group">
                              <label>{this.props.t('ADDRESS_SHIP')}</label>
                              <Input
                                className="form-control"
                                type="text"
                                name="agencyAddress"
                                id="agencyAddress"
                                value={store.agencyAddress}
                                onChange={e => this.handleAgencyChange(e, index)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <button
                                style={{ marginRight: "5px" }}
                                type="button"
                                class="btn btn-success"
                                onClick={e => this.handleAddClick(e)}
                              >{this.props.t('ADD_AGENCY')}
                                  </button>
                              <button
                                type="button"
                                class="btn btn-danger"
                                onClick={() => this.handleRemoveClick(index)}
                              >{this.props.t('DELETE')}
                                  </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  <div className="row">
                    {this.props.isCreateMode === false && (
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>{this.props.t('PASSWORD')}</label>
                          <Input
                            className="form-control"
                            type="password"
                            name="password"
                            id="password"
                            onChange={this.onChange}
                            onBlur={this.handleErrors}
                            onKeyUp={this.handleErrors}
                            value={password}
                          />
                          {this.state.errors.password === "" ? (
                            ""
                          ) : (
                              <div className="alert alert-danger">
                                {this.state.errors.password}
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                    {this.props.isFixerPage ? (
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>{this.props.t('PERMISSION')}</label>
                          <Select className="form-control" name="userType">
                            <option value="">{this.props.t('CHOOSE')}</option>
                            {USERTYPE_ENUM.map((item, index) => (
                              <option value={index}>{item.value}</option>
                            ))}
                          </Select>
                          {/*<Input className="form-control" type="text" name="color" id="color" value={this.state.color} validations={[required]} />*/}
                        </div>
                      </div>
                    ) : null}
                    {this.props.isStationPage ||
                      this.props.isFactoryPage ||
                      this.props.isGeneralPage ||
                      this.props.isIndustryPage ||
                      this.props.isRestaurantPage ||
                      this.props.isAgencyPage ||
                      this.props.isFixerPage ||
                      this.props.isDrivePage ||
                      this.props.isInspectorPage ||
                      // this.props.isTrunk ||
                      this.props.isFactoryChildPage ? null : (
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>{this.props.t('USER_TYPE')}</label>
                            <Select className="form-control" name="userType">
                              <option value="">{this.props.t('CHOOSE')}</option>
                              {USERTYPE_ENUM.map((item, index) => (
                                <option value={index}>{item.value}</option>
                              ))}
                            </Select>
                            {/*<Input className="form-control" type="text" name="color" id="color" value={this.state.color} validations={[required]} />*/}
                          </div>
                        </div>
                      )}
                    {/*{this.props.isCreateMode && (
                      <div className="col-md-6">
                        <div
                          className="form-group"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 32,
                          }}
                        >
                          <label>Trực thuộc</label>
                          <input
                            style={{ marginLeft: "5px", marginBottom: "5px" }}
                            type="checkbox"
                            onChange={() => this.handleChangeSelect()}
                            value={this.state.checked}
                          />
                        </div>
                      </div>
                    )}*/}
                  </div>
                  {/*<div className="form-group">*/}
                  {/*<label>Các vị trí</label>*/}
                  {/*<TagAutoComplete getPosition={this.getPosition.bind(this)}*/}
                  {/*data={this.state.job_titles}/>*/}
                  {/*</div>*/}
                

                <footer className="card-footer text-center">
                  <button className="btn btn-primary" >{this.props.t('SAVE')} </button>
                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                    // onClick={this.reloadPopup}
                  >
                    {this.props.t('CLOSE')}
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

export default withNamespaces()(AddUserPopup);
