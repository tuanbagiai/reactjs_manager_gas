import React, { Component } from "react";
import { Row, Col, Form, Input, Select, Button, Table, Icon, DatePicker } from "antd";
//import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import getAllUserApi from "getAllUserApi";
import getUserCookies from "getUserCookies";
import getDestinationUserAPI from "getDestinationUserAPI";
import Constants from "Constants";
import "./index.scss";
import { withNamespaces } from 'react-i18next';
import {
  GETSTAFF,
  GETINSPECTOR,
  CREATECALENDERINSPECTOR,
  GETCOMPANYTOFIX,
  GETLISTSCHEDULE
} from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
import TableBinhGas from "./tableBinhGas";
import TableBonGas from "./tableBonGas";
import getAllPartnerAPI from "getPartnerAPI";
const { Option } = Select;
class CreateCalenderInspector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      listUsersGeneral: [],
      listUsersAgency: [],
      listCompany: [],
      listUserFixer: [],
      valueCompany: "",
      listStaff: [],
      listInspector: [],
      address: "",
      title: "",
      staff: "",
      inspector: [],
      styleFix: "",
      tokenAPI: "",
      listPartner: [],
      listUserFixerMachince: [],
      createdId: "",
      listCreateCalenderInspector: [],
      customer: '',
      option: [],
      gas: '',
      dataoption: [
        { name: 'SOPET GAS ONE' }
      ]
    };
  }



  async componentDidMount() {
    // await this.getListFixer();
    await this.getAllPartner();
    // await this.getListFixerMachince();
    let user_cookies = await getUserCookies();
    //console.log(user_cookies.user.id);
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    await this.getAllCompanyToFix(id, token);
    await this.getAllStaff(id, token);
    await this.getAllInspector(id, token);
    this.getListSchedule(id, token);
    this.setState({
      tokenAPI: token,
      createdId: user_cookies.user.id
    });
    await this.getAllUser();
  }
  getListSchedule = async (id, token) => {
    let params = {
      id: id
    };
    await callApi("POST", GETLISTSCHEDULE, params, token).then((res) => {
      let arr = [];
      // console.log("lichbaotri", res.data);
      for (let i = 0; i < res.data.data.length; i++) {
        arr.push({
          tittle: res.data.data[i].tittle,
          // nameCompany: res.data.data[i].idCheckingAt.name,
          idStaff: res.data.data[i].idStaff,
          idInspector: res.data.data[i].idInspector.name,
          location: res.data.data[i].location,
          maintenanceType: res.data.data[i].maintenanceType === "00" ? "Bình gas" : "Bồn gas",
          maintenanceDate: res.data.data[i].maintenanceDate
        })
      }
      this.setState({
        listCreateCalenderInspector: arr
      }, () => console.log(this.state.listCreateCalenderInspector))
    })
  }
  async getAllCompanyToFix(id, token) {
    let params = {
      id: id
    }
    await callApi("POST", GETCOMPANYTOFIX, params, token).then(res => {
      // console.log(res.data.data);
      this.setState({
        listCompany: res.data.data
      })
    })
  }
  async getAllUserGeneral() {
    const dataUsers = await getAllUserApi(Constants.GENERAL);
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        this.setState({ listUsersGeneral: dataUsers.data });
      } else {
        showToast(
          dataUsers.data.message
            ? dataUsers.data.message
            : dataUsers.data.err_msg,
          2000
        );
      }

      //this.setState({image_link: profile.data.company_logo});
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }
  async getAllUserAGENCY() {
    const dataUsers = await getAllUserApi(Constants.AGENCY);
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        this.setState({ listUsersAgency: dataUsers.data });
      } else {
        showToast(
          dataUsers.data.message
            ? dataUsers.data.message
            : dataUsers.data.err_msg,
          2000
        );
      }

      //this.setState({image_link: profile.data.company_logo});
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }
  //nhà máy sửa chữa
  async getListFixerMachince() {
    const dataUsers = await getDestinationUserAPI(Constants.FIXER);
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        this.setState({
          listUserFixerMachince: dataUsers.data
        })
      } else {
        showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
      }

      //this.setState({image_link: profile.data.company_logo});
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }
  //cong ty con
  async getListFixer() {
    const dataUsers = await getDestinationUserAPI(
      Constants.FACTORY,
      "",
      Constants.OWNER
    );
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        this.setState({ listUserFixer: dataUsers.data });
      } else {
        showToast(
          dataUsers.data.message
            ? dataUsers.data.message
            : dataUsers.data.err_msg,
          2000
        );
      }

      //this.setState({image_link: profile.data.company_logo});
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }
  //lấy đối tác
  async getAllPartner() {
    //const jobMetaData = await this.getJobMetaData();
    const arr = []
    const dataUserRelation = await getAllPartnerAPI();
    if (dataUserRelation) {

      this.setState({
        listPartner: dataUserRelation.data
      }, () => console.log("đối tac là:", this.state.listPartner))

      //this.setState({image_link: profile.data.company_logo});
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }

  }

  async getAllStaff(id, token) {
    //const jobMetaData = await this.getJobMetaData();
    let prams = {
      id: id,
    };
    await callApi("POST", GETSTAFF, prams, token).then((res) => {
      this.setState({
        listStaff: res.data.data,
      });
    });

    //showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
  }
  async getAllInspector(id, token) {
    //const jobMetaData = await this.getJobMetaData();
    let prams = {
      id: id,
    };
    await callApi("POST", GETINSPECTOR, prams, token).then((res) => {
      this.setState(
        {
          listInspector: res.data.data,
        },
        () => console.log(this.state.listInspector)
      );
    });

    //showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
  }

  onChangeCompany = async (value) => {
    this.setState(
      {
        valueCompany: value
      },
      () => {
        let index = this.state.listCompany.findIndex(
          (company) => company.id === this.state.valueCompany
        );
        this.setState({
          address: this.state.listCompany[index].address,
        });
      }
    );
  };

  handleChangeStaff = (value) => {
    let stringStaff = "";
    for (let i = 0; i < value.length; i++) {
      stringStaff += value[i];
      if (i < value.length - 1) {
        stringStaff += ",";
      } else if (i === value.length - 1) {
        stringStaff += "";
      }
    }
    this.setState({
      staff: stringStaff,
    });
  };

  handleChangeDate = (date) => {
    this.setState({
      startDate: date
    });
  };

  onChange = (e) => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value
    });
  };

  handleChangeInspector = (value) => {
    let stringInspector = "";
    for (let i = 0; i < value.length; i++) {
      stringInspector += value[i];
      if (i < value.length - 1) {
        stringInspector += ",";
      } else if (i === value.length - 1) {
        stringInspector += "";
      }
    }
    this.setState({
      inspector: stringInspector,
    });
  };
  onChangeCustomer = e => {
    // let stringCustomer = "";
    // for (let i = 0; i < value.length; i++) {
    //   stringCustomer += value[i];
    //   if (i < value.length - 1) {
    //     stringCustomer += ",";
    //   } else if (i === value.length - 1) {
    //     stringCustomer += "";
    //   }
    // }
    // console.log('duc', e.target.value)
    // this.setState({
    //   title: stringCustomer,
    // })
    // console.log('duc', e.target.value)
    e.preventDefault();
    this.setState({
      title: e.target.value
    })
  }
  onChangeAddress = (e) => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value,
    });
  };

  onChangeStyleFix = (value) => {
    this.setState({
      styleFix: value,
    });
  };

  onCreate = async (e) => {
    e.preventDefault();
    let {
      address,
      title,
      staff,
      inspector,
      styleFix,
      startDate,
      // valueCompany,
      // customer,
    } = this.state;
    let dateNow = new Date();
    let dateChose = startDate;
    let d1 = Date.parse(dateNow);
    let d2 = Date.parse(dateChose);
    if (
      !address ||
      !title ||
      !staff ||
      !inspector ||
      !styleFix ||
      !startDate
      // !valueCompany
      // !customer

    ) {
      alert(this.props.t('INFOR_PROVIDER'));
    }
    if (
      address &&
      title &&
      staff &&
      inspector &&
      styleFix &&
      startDate
      // valueCompany
      // customer
    ) {
      if (moment(d2).format("YYYY-MM-DD") < moment(d1).format("YYYY-MM-DD")) {
        alert("Ngày bạn chọn phải lớn hơn hoặc bằng ngày hiện tạis");
      } else if (moment(d2).format("YYYY-MM-DD") >= moment(d1).format("YYYY-MM-DD")) {
        let date = moment(startDate).format("YYYY-MM-DD");
        let params = {
          tittle: title,
          // idCheckingAt: valueCompany,
          idStaff: staff,
          idInspector: inspector,
          location: address,
          maintenanceType: styleFix,
          maintenanceDate: date,
          createdBy: this.state.createdId
        };
        await callApi(
          "POST",
          CREATECALENDERINSPECTOR,
          params,
          this.state.tokenAPI
        ).then((res) => {
          // console.log("bao tri", res.data);
          if (res.data.success === true) {
            alert("Tạo thành công");
            window.location.reload()
          }
          else {
            alert("Đã có lỗi khi tạo");
          }

        });
      }
    }
  };
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(node) => {
              this.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              this.handleSearch(selectedKeys, confirm, dataIndex)
            }
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
        </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
        </Button>
        </div>
      ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text
        ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  async getAllUser() {

    //const jobMetaData = await this.getJobMetaData();
    const dataUsers = await getAllUserApi(Constants.GENERAL);
    // console.log("ducvidai", dataUsers);
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        // this.setState({ listUsers: dataUsers.data });
        this.setState({
          option: dataUsers.data.map((user) => {
            return {
              value: user.id,
              label: user.name,
            }
          })
        })
      } else {
        // showToast(
        //   dataUsers.data.message
        //     ? dataUsers.data.message
        //     : dataUsers.data.err_msg,
        //   2000
        // );
      }
      //this.setState({image_link: profile.data.company_logo});
    } else {
      // showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }


  onChangeGas = e => {
    e.preventDefault();
    // console.log('minh', e.target.value)
    this.setState({
      staff: e.target.value,
    })
  }
  render() {
    let {
      address,
      title,
      staff,
      inspector,
      styleFix,
      startDate,
      valueCompany,
      customer
    } = this.state;
    const columns = [
      {
        title: this.props.t('CREATE_DATE_MAIN'),
        dataIndex: "maintenanceDate",
        key: "maintenanceDate",
        ...this.getColumnSearchProps("maintenanceDate"),
      },
      {
        title: this.props.t('CREATE_CHECK_TEAM'),
        dataIndex: "idStaff",
        key: "idStaff",
        ...this.getColumnSearchProps("idStaff"),
      },

      // {
      //   title: "Tên khách hàng",
      //   dataIndex: "nameCompany",
      //   key: "nameCompany",
      //   ...this.getColumnSearchProps("nameCompany"),
      // },
      {
        title: this.props.t('CUSTOMER'),
        dataIndex: "tittle",
        key: "tittle",
        ...this.getColumnSearchProps("tittle"),
      },
      {
        title: this.props.t('CHECK_BY'),
        dataIndex: "idInspector",
        key: "idInspector",
        ...this.getColumnSearchProps("idInspector"),
      },

      {
        title: this.props.t('TYPE_MAINTAINCES'),
        dataIndex: "maintenanceType",
        key: "maintenanceType",
        ...this.getColumnSearchProps("maintenanceType"),
      },
      {
        title: this.props.t('ADDRESS'),
        dataIndex: "location",
        key: "location",
        ...this.getColumnSearchProps("location"),
      },


    ];
    //console.log(this.state.valueCompany);

    return (
      <div className="main-content">
        <div className="card">
          <div className="card-title">
            <h4>{this.props.t('CREATE_SCEDULES')}</h4>
          </div>
          <div>
            <Row>
              <Col xs={1}></Col>
              <Col xs={22}>
                <Form>
                  {/* <Row style={{ marginTop: 20 }}>
                <Col>
                 
                </Col>
              </Row> */}
                  <Row>

                    <Col xs={14} md={6}>
                      <Form.Item label={this.props.t('CREATE_CHECK_TEAM')} style={{ display: "block" }}>
                        <select className="custom-select "
                          id="staff"
                          // name="gas"
                          onChange={this.onChangeGas}
                          name="staff"
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >

                          <option selected>{this.props.t('SELECT')}</option>
                          {this.state.dataoption.map((item, index) => {
                            return (
                              <option key={index} value={item.id}>{item.name} </option>
                            )
                          })}
                          {/* <Input onChange={this.onChange} name="staff" value={staff} /> */}
                        </select>
                      </Form.Item>
                    </Col>
                    <Col xs={2}></Col>
                    <Col xs={14} md={6}>
                      <Form.Item label={this.props.t('CUSTOMER')}>
                        <select className="custom-select"
                          onChange={this.onChangeCustomer}
                          id="title"
                          name="title"
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          <option selected>{this.props.t('SELECT')}</option>
                          {this.state.option.map((item, index) =>
                            <option key={index} value={item.id}>{item.label}</option>
                          )}
                        </select>
                        {/* <Select
                          showSearch
                          optionFilterProp="children"
                          onChange={this.onChangeCompany}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.listCompany.map((company, index) => {
                            return (
                              <Option key={index} value={company.id}>
                                {company.name}
                              </Option>
                            );
                          })}
                        </Select> */}
                      </Form.Item>
                    </Col>
                    <Col xs={2}></Col>
                    <Col xs={14} md={6}>
                      <Form.Item
                        label={this.props.t('ADDRESS')}
                        style={{ display: "block" }}

                      >
                        <Input value={address} onChange={this.onChangeAddress}
                          className="form-control"
                          type="text"
                          name="address"
                          id="address" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={14} md={6}>
                      <Form.Item label={this.props.t('CHECK_BY')}>
                        <Select
                          mode="tags"
                          style={{ width: "100%" }}
                          onChange={this.handleChangeInspector}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        //tokenSeparators={[","]}
                        >

                          {this.state.listInspector.map((inspector, index) => {
                            return (

                              <Option key={index} value={inspector.id}>

                                {inspector.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={2}></Col>
                    <Col xs={14} md={6}>
                      <Form.Item label={this.props.t('TN_AND_DATE')} style={{ display: "block" }}>
                        <DatePicker
                          //selected={moment(this.state.startDate)}
                          defaultValue={moment()}
                          onChange={this.handleChangeDate}
                          //dateFormat="DD/MM/YYYY"
                          format="DD/MM/YYYY"
                          style={{ width: '260px' }}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={2}></Col>
                    <Col xs={14} md={6}>
                      <Form.Item label={this.props.t('TYPE_MAINTAINCES')}>
                        <Select
                          showSearch
                          optionFilterProp="children"
                          onChange={this.onChangeStyleFix}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          <Option value="00">Hệ thống Bình gas</Option>
                          <Option value="01">Hệ thống Bồn gas</Option>
                        </Select>
                      </Form.Item>
                    </Col>

                  </Row>

                </Form>
              </Col>
              <Col xs={1}></Col>
            </Row>

            {styleFix === "00" ? <TableBinhGas /> : ""}
            {styleFix === "01" ? <TableBonGas /> : ""}
            <Row>
              <Col xs={1} md={4}></Col>
              <Col xs={22} md={16}>
                <Form.Item>
                  <Button
                    style={{ width: "100%" }}
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    onClick={this.onCreate}
                  >
                    {this.props.t('CREATE_MAINTENANCE')}
                  </Button>
                </Form.Item>
              </Col>
              <Col xs={1} md={4}></Col>
            </Row>
            <Row>
              <Col xs={1}></Col>
              <Col xs={22}>
                <Table columns={columns} dataSource={this.state.listCreateCalenderInspector} scroll={{ x: 1300 }} />
              </Col>
              <Col xs={1}></Col>
            </Row>
          </div>
        </div>

      </div>
    );
  }
}
export default withNamespaces()(CreateCalenderInspector);