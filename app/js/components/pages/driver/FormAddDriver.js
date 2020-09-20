import React from "react";
import PropType from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import Button from "react-validation/build/button";
import required from "required";
import isUppercase from "isUppercase";
import getUserCookies from "./../../../helpers/getUserCookies";
import callApi from "./../../../util/apiCaller";
import { ADDUSERURL, UPDATEUSERURL } from "./../../../config/config";
import { Modal } from 'antd';
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

class AddDriver extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      visible: false,
      email: "",
      name: "",
      address: "",
      phone:"",
      password: "Abc123",
      password: "",
      userType: "Deliver",
      id: "",
      listUsers: [],
      value: {
        password: "",
        email: "",
      },
      errors: {
        password: "",
        email: "",
      },
      formValid: false,
      newpassword: false,
      newemail: false,
    };
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  };
  onChange = (e) => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value,
    });
  };
  //cmt
  async submit(event) {
    event.preventDefault();
    var user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let { email, name, address, phone, password, userType, id } = this.state;
    if (this.props.isCreateMode) {
      if (password === "") {
        password = "A123!@#";
      }
     
        let isChildOf = user_cookies.user.id;
        let userTypeAsRoleType = user_cookies.user.userType;
        if (password === "") {
          password = "A123!@#";
        }
        let params = {
          email: email,
          password: password,
          name: name,
          address: address,
          phone : phone,
          userType:
            userTypeAsRoleType === "" ? "SuperAdmin" : userTypeAsRoleType,
          userRole: userType,
          isChildOf: isChildOf,
          owner: isChildOf,
          staffOf: isChildOf,
        };
        await callApi("POST", ADDUSERURL, params, token).then((res) => {
          if (res.data.message === "Email da ton tai") {
            alert(this.props.t("EMAIL_EXIST"));
          } 
          else {
            alert(this.props.t("CREATE_SUCCESS"));
            window.location.reload(false);
            const modal = $("#create-user");
            modal.modal("hide");
          }
        });
    } else {
      let params1 = {};
      if (password === "") {
        params1 = {
          target_id: id,
          name: name,
          address: address,
          phone: phone,
        };
      } else {
        params1 = {
          target_id: id,
          name: name,
          new_password: password,
          address: address,
          phone: phone,
        };
      }
      await callApi("POST", UPDATEUSERURL, params1, token).then((res) => {
        window.location.reload(false);
      });
    }

    //console.log(user_cookies);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.userEdit && nextProps.listUsers) {
      this.setState({
        email: nextProps.userEdit.email,
        name: nextProps.userEdit.name,
        address: nextProps.userEdit.address,
        phone: nextProps.userEdit.phone,
        id: nextProps.userEdit.id,
        password: "",
      });
    } else {
      this.setState({
        email: "",
        name: "",
        address: "",
        phone:"",
        password: "",
      });
    }
  }

  handleErrorEmail = (e) => {
    let { name, value } = e.target;
    let { newemail } = this.state;
    let message = value === "" ? this.props.t("PLEASE_INPUT_HERE") : "";
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    newemail = message === "" ? true : false;
    if (value === "") {
      message = "";
    } else if (!filter.test(email.value)) {
      message = this.props.t("PLS_INPUT_RIGHT_EMAIL");
      // email.focus;
      document.getElementById("button").disabled = true;
      newemail = false;
    } else {
      message = "";
      document.getElementById("button").disabled = false;
      newemail = true;
    }
    this.setState(
      {
        errors: { ...this.state.errors, [name]: message },
        newemail,
      },
      () => {
        // this.FormValidation();
      }
    );
  };
  handleErrors = (e) => {
    let { name, value } = e.target;
    let message = value === "" ? this.props.t("PLEASE_INPUT_HERE") : "";
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
      messgae =
        this.props.t('PASS_REQUIRE');
      newpassword = false;
    } else if (value && value.match(number)) {
      message =
        "mật khẩu phải có ít nhất 6 kí tự bao gòm cả chữ và số hoặc kí tự đặc biệt";
      newpassword = true;
    } else if (value && value.match(pattern)) {
      message =
        this.props.t('PASS_REQUIRE');
      newpassword = true;
    } else if (value && value.length < 6) {
      message =
        this.props.t('PASS_REQUIRE');
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
  goBack = () => {
    window.location.hash =
      window.location.lasthash[window.location.lasthash.length - 1];
    //blah blah blah
    window.location.lasthash.pop();
  };
  render() {
    //console.log(this.state.listUsers);
    let { email, name, address, phone,password } = this.state;
    return (
      
      <div className="modal fade" id="create-user" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {this.props.isCreateMode
                  ? this.props.t("CREATE_DRIVER")
                  : this.props.t("EDIT_DRIVER")}
              </h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form
                onSubmit={this.goBack}
                ref={(c) => {
                  this.form = c;
                }}
                className="card"
                onSubmit={(event) => this.submit(event)}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{this.props.t("EMAIL")}</label>
                        <Input
                          //  disabled={this.props.isEditForm}
                          disabled={this.props.check}
                          className="form-control"
                          type="text"
                          name="email"
                          id="email"
                          onChange={this.onChange}
                          value={email}
                          validations={[required, isUppercase]}
                          onBlur={this.handleErrorEmail}
                          onKeyUp={this.handleErrorEmail}
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
                        <label>{this.props.t("NAME_DRIVER")}</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="name"
                          id="name"
                          onChange={this.onChange}
                          value={name}
                          validations={[required]}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{this.props.t("PHONE")}</label>
                        <Input 
                        className="form-control"
                        type="number"
                        name="phone"
                        value={phone}
                        onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>{this.props.t("ADDRESS")}</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="address"
                          id="address"
                          onChange={this.onChange}
                          value={address}
                          validations={[required]}
                        />
                      </div>
                    </div>
                    {this.props.isCreateMode === false && (
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>{this.props.t("PASSWORD")}</label>
                          <Input
                            className="form-control"
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={this.onChange}
                            onBlur={this.handleErrors}
                            onKeyUp={this.handleErrors}
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
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button className="btn btn-primary" id="button">
                    {this.props.t("SAVE")}
                  </Button>
                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                  >
                    {this.props.t("CLOSE")}
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

export default withNamespaces()(AddDriver);
