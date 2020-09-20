import React, { Component } from "react";
import { Row, Col, Form, Input, Select, Button, Table, Icon, Menu, Switch, Radio, DatePicker, message } from "antd";
//import './index.scss';
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import getAllUserApi from "getAllUserApi";
import getUserCookies from "getUserCookies";
import getDestinationUserAPI from "getDestinationUserAPI";
import Highlighter from "react-highlight-words";
import Constants from "Constants";
import { GETORDERFACTORY, UPDATEORDER } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
//import firebase from './../../../util/firebase';
import ImportDriverTypeCylinder from "../factory/ImportDriverTypeCylinder";
import PopupExportOrder from "./popupExportOrder"
import PopupDriverExportOrder from "./popupDriverExportOrder";
//import getOrderFactoryExcelAPI from "../../../../api/getOrderFactoryExcelAPI";
import {withNamespaces} from 'react-i18next';
// import ExportJsonExcel from 'js-export-excel';
import ReactHTMLTableToExcel from 'react-html-table-to-excel'; 

import './order.scss';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ONE_DAY = 24 * 60 * 60 * 1000 // millisecond
const key = 'updatable'

class UpdateOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listAllOrder: [],
      idAPI: "",
      tokenAPI: "",
      // visibleModal: false,
      product_parse: [],
      selectedOrderIDs: [],
      selectedOrderInfor: [],

      //
      data: [],
      enableFilter: false,
      warning: 'none',
      warningValue: 'none',
      startDate: '',
      endDate: '',
      selectedRowKeys: [],
      selectedRows: [],
      listTableExcel: [],
      excelToday: moment(new Date()).format("DD/MM/YYYY"),
    };
  }
  async componentDidMount() {
    let user_cookies = await getUserCookies();
    //console.log(user_cookies.user.id);
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    this.setState({
      idAPI: id,
      tokenAPI: token,
    });
    await this.getAllOrder(id, token);
    // const messaging=firebase.messaging();
    // messaging.requestPermission().then(()=>{
    //   console.log("Have Permission");
    //   return messaging.getToken();
    // }).then((tokenFirebase)=>{
    //   console.log(tokenFirebase);
    // })
    await this.handleButtonExportExcel();
  }

  getAllOrder = async (id, token) => {
    let parmas = {
      factoryId: id,
    };
    await callApi("POST", GETORDERFACTORY, parmas, token).then((res) => {
      // console.log('getAllOrder', res.data);
      let temp = [];
      let i = 0;
      console.log("ResDataaaaa", res.data.orderFactory);
      let stepAll = [];
     
      for (let item of res.data.orderFactory) {
        temp.push({
          key: i,
          id: item.id,
          orderCode: item.orderCode,
          // customerCode: item.customerId.customerCode,
          customerName: item.customerId.name,
          // agencyCode: item.agencyId.agencyCode,
          agencyName: item.agencyId ? item.agencyId.name : '',
          listCylinder: item.listCylinder ? item.listCylinder : [],
          orderDate: item.createdAt ? moment(item.createdAt).format("DD/MM/YYYY") : '__/__/____',
          expected_DeliveryDate: item.deliveryDate ? moment(item.deliveryDate).format("DD/MM/YYYY - HH:mm") : '__/__/____',
          // expected_DeliveryTime: item.deliveryDate ? moment(item.deliveryDate).format("HH:mm") : '__:__',      
          deliveryDate: item.deliveryDate ? item.deliveryDate : '',
          note: item.note,
          // status: item.status === "INIT" ? "Khởi tạo"
          // : item.status === "CONFIRMED" ? "Đã xác nhận đơn hàng"
          // : item.status === "DELIVERING" ? "Đang vận chuyển"
          // : item.status === "DELIVERED" ? "Đã giao"
          // : item.status === "COMPLETED" ? "Đã hoàn thành"
          // : item.status === "CANCELLED" ? "Đã bị hủy"
          // : item.status,
          status: item.status ? item.status : '',
        });
        i++;
      }
       for (let items of res.data.orderFactory) {
        if(items.orderCode === 'DH080920-193509') {
          console.log("dataOrderCodeSuccess",items);
        }
      }
      console.log('listAllOrder11111111111111111', temp);
      this.setState({
        listAllOrder: temp,
      });
    });
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

  onChangeStatusOK = async (id, status) => {
    message.loading({ content: 'Đang cập nhật...', key, duration: 5 });

    // this.setState({
    //   visibleModal: true,
    // });
    // console.log('visibleModal', this.state.visibleModal)
    let updateOrderStatus = {
      updatedBy: this.state.idAPI,
      orderStatus: status,
      orderId: id,
    }
    let parmas = {
      updateOrderStatus
    };
    
    await callApi("POST", UPDATEORDER, parmas, this.state.tokenAPI)
      .then(async (res) => {
        console.log('UPDATEORDER', res);

        if (res.data.status === true) {
          message.success({ content: 'Thành công!', key, duration: 2 });
        }
        else {
          message.error({ content: 'Lỗi: ' + res.data.message, key, duration: 3 });
        }
        await this.getAllOrder(this.state.idAPI, this.state.tokenAPI);
      })
      .catch()
      
  };

  // handleOk = () => {
  //   // this.setState({
  //   //   ModalText: 'The modal will be closed after two seconds',
  //   //   confirmLoading: true,
  //   // });
  //   setTimeout(() => {
  //     this.setState({
  //       visibleModal: false,
  //       //confirmLoading: false,
  //     });
  //   }, 2000);
  // };

  // handleCancel = () => {
  //   console.log('Clicked cancel button');
  //   this.setState({
  //     visibleModal: false,
  //   });
  // };

  expandedRowRender = (record, index) => {
    // console.log('expandedRowRender', record, index)
    const columnsNestedTables = [
      { title: 'Loại bình', dataIndex: 'cylinderType', key: 'cylinderType' },
      { title: 'Màu sắc', dataIndex: 'color', key: 'color' },
      { title: 'Loại van', dataIndex: 'valve', key: 'valve' },
      { title: 'Số lượng bình', dataIndex: 'numberCylinders', key: 'numberCylinders' },
    ];

    const data = [];
    const lengthListCylinder = record.listCylinder.length
    for (let i = 0; i < lengthListCylinder; i++) {
      data.push({
        key: i,
        cylinderType: record.listCylinder[i].cylinderType,
        color: record.listCylinder[i].color,
        valve: record.listCylinder[i].valve,
        numberCylinders: record.listCylinder[i].numberCylinders,
      });
    }
    return <Table columns={columnsNestedTables} dataSource={data} pagination={false} />;
  };

  getListProducts = (products) => {
    this.setState({ product_parse: products });
  }

  handleDataChange = enableFilter => {
    this.setState({ enableFilter });
  };

  handleWarningChange = e => {
    const { value } = e.target
    
    this.setState({
      warning: value === 'none' ? 'none' : { position: value },
      warningValue: value,
    }, this.filterData)
  };

  onChangeTime = (dates, dateStrings) => {
    // console.log('From: ', dates[0], ', to: ', dates[1]);
    // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);

    // console.log(moment(dates[0]).toDate())
    // console.log(moment(dates[0]).isValid())
    this.setState({
      startDate: dates[0] ? moment(dates[0]).toDate() : '',
      endDate: dates[0] ? moment(dates[1]).toDate() : ''
    }, this.filterData)
  }

  filterData = () => {
    const {
      startDate,
      endDate,
      listAllOrder,
      data,
      warningValue,
    } = this.state

    let tempData = listAllOrder

    if (startDate && endDate) {
      // console.log('startDate && endDate', startDate, endDate)
      tempData = listAllOrder.filter(order => {
        return (startDate <= moment(order.deliveryDate) && moment(order.deliveryDate) <= endDate)
      })
    }

    // console.log('warning', warningValue)
    // console.log('listAllOrder', listAllOrder)
    if (warningValue === 'INIT') {
      // console.log('INIT')
      const data = tempData.filter(order => {
        return order.status === 'INIT'
      })
      // console.log('data', data)
      this.setState({ data: data })
    }
    if (warningValue === 'CONFIRMED') {
      const data = tempData.filter(order => {
        return order.status === 'CONFIRMED'
      })
      this.setState({ data: data })
    }
    if (warningValue === 'DELIVERING') {
      const data = tempData.filter(order => {
        return order.status === 'DELIVERING'
      })
      this.setState({ data: data })
    }
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    // console.log('selectedRows changed: ', selectedRows);
    this.setState({ selectedRowKeys, selectedRows });
  };

  onSelectRowChange = (record, selected, selectedRows, nativeEvent) => {
    // console.log('onSelectChange_record: ', record);
    // console.log('onSelectChange_selected: ', selected);
    // console.log('onSelectChange_selectedRows: ', selectedRows);
    // console.log('onSelectChange_nativeEvent: ', nativeEvent);
    // this.setState({ selectedRowKeys });
  };

  //this.setState({selectedOrderIDs: [order.id]})
  createListOrderIDs = () => {
    const {
      selectedRows
    } = this.state

    if (selectedRows.length===0) {
      alert('Chưa chọn đơn hàng nào')
    }
    else {
      let orderIDs = []
      selectedRows.forEach(row => {
        orderIDs.push(row.id)
      });
      this.setState({selectedOrderIDs: orderIDs, selectedOrderInfor: selectedRows})
    }
  }
  handleButtonExportExcel = () => {

    const data = this.state.listAllOrder;
    let dataTable = [];
    if(data) {
      for(let item in data) {
        for(let items in data[item].listCylinder){
          let binh12;
          let binh45;
          let binh50;
          if(data[item].listCylinder[items].cylinderType === "CYL12KG" ){
            binh12 = data[item].listCylinder[items].numberCylinders;
            console.log("Bình 12", binh12);
          } else if(data[item].listCylinder[items].cylinderType === "CYL45KG"){
            binh45 = data[item].listCylinder[items].numberCylinders;
            console.log("Bình 45", binh45);          
          } else if(data[item].listCylinder[items].cylinderType === "CYL50KG"){
            binh50 = data[item].listCylinder[items].numberCylinders;
            console.log("Bình 50", binh50);         
          }
          console.log("itemssNumCylinder", data[item].listCylinder[items])
        
        // console.log("numbercylinderrr222", data[item].listCylinder);
        // console.log("numbercylinderrr111", data[item].listCylinder[item]);
        if(data) {
          let obj = {
            'No': item,
            'maKH': data[item].orderCode,
            'Provine': '',
            'ten': data[item].customerName,
            'soXe': '',
            'thoiGianGH': data[item].expected_DeliveryDate,
            // 'Số lượng bình': data[item].listCylinder[items].numberCylinders,
            'binh12': binh12,
            'binh45': binh45,
            'binh50': binh50,
            'ghiChu': ''
          }
          dataTable.push(obj);
        }
        }
      }
      this.setState({
        listTableExcel: dataTable
      })
      console.log("listTableExcel", this.state.listTableExcel)
    }
    // option.fileName = 'Xem don hang';
    // option.datas = [
    //   {
    //     sheetData: dataTable,
    //     sheetName: 'Danh sách đơn hàng',
    //     sheetFilter:['No','Mã khách hàng','Provine', 'name', 'Số xe', 'Thời gian giao hàng', 'Số lượng bình 12', 'Số lượng bình 45', 'Số lượng bình 50', 'Ghi chú'],
    //     sheetHeader:['No','Mã khách hàng','Provine', 'name', 'Số xe', 'Thời gian giao hàng', 'Số lượng bình 12', 'Số lượng bình 45', 'Số lượng bình 50', 'Ghi chú'],
        
    //   }
    // ];
    // var toExcel = new ExportJsonExcel(option); 
    // toExcel.saveExcel();
  }
  render() {
    let {
      maDH,
      countOrder,
      listAllOrder,
      selectedRowKeys,
      //visibleModal,
      enableFilter,
      warning,
      data,
      //selectedRowKeys,
    } = this.state;

    console.log('listAllOrder bắt đầu', listAllOrder);
        
    // if (listAllOrder.length > 0) {
    //   console.log('listAllOrder bắt đầu chỉnh sửa', listAllOrder)
    //   listAllOrder.forEach(order => {
    //     let totalNumberCylinders = 0
    //     if (order.hasOwnProperty('listCylinder') && order.listCylinder.length>0) {
    //       order.listCylinder.forEach(element => {
    //         totalNumberCylinders += element.numberCylinders
    //       });          
    //     }
    //     order.totalNumberCylinders = numberCylinders
    //   });
    //   console.log('listAllOrder sau khi chỉnh sửa', listAllOrder)
    // }

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelectRowChange,
    };
    

    const columns = [
      {
        title: this.props.t('ORDERED_CODE'),
        dataIndex: "orderCode",
        key: "orderCode",
        ...this.getColumnSearchProps("orderCode"),
        // fixed: 'left',
        // width: 150
      },
      {
        title: this.props.t('TIME_CREATE'),
        dataIndex: "orderDate",
        key: "orderDate",
        ...this.getColumnSearchProps("orderDate"),
      },
      // {
      //   title: "Mã khách hàng",
      //   dataIndex: "customerCode",
      //   key: "customerCode",
      //   ...this.getColumnSearchProps("customerCode"),
      // },
      {
        title: this.props.t('CUSTOMER'),
        dataIndex: "customerName",
        key: "customerName",
        ...this.getColumnSearchProps("customerName"),
      },
      // {
      //   title: "Mã chi nhánh",
      //   dataIndex: "agencyCode",
      //   key: "agencyCode",
      //   ...this.getColumnSearchProps("agencyCode"),
      // },
      {
        title: this.props.t('AGENCY_NAME'),
        dataIndex: "agencyName",
        key: "agencyName",
        ...this.getColumnSearchProps("agencyName"),
      },
      {
        title: this.props.t('DELIVERY_DATE'),
        dataIndex: "expected_DeliveryDate",
        key: "expected_DeliveryDate",
        ...this.getColumnSearchProps("expected_DeliveryDate"),
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          return (moment(a.deliveryDate) - moment(b.deliveryDate))
        },
        // render: (text) => {
        //   return (
        //     <div>{moment(text).format("DD/MM/YYYY - HH:mm")}</div>
        //   )
        // }
      },
      // {
      //   title: "Thời gian",
      //   key: "expected_DeliveryTime",
      //   dataIndex: "expected_DeliveryTime",
      //   ...this.getColumnSearchProps("expected_DeliveryTime"),
      //   sortDirections: ['descend', 'ascend'],
      //   sorter: (a, b) => {
      //     return (moment(a.deliveryDate) - moment(b.deliveryDate))
      //   },
      //   // render: (text) => {
      //   //   return (
      //   //     <div>{moment(text).format("HH:mm")}</div>
      //   //   )
      //   // }
      // },
        // Thay đổi màu sắc của 1 cell trong table
        // render(text, record) {
        //   return {
        //     props: {
        //       style: { background: '#ddd' },
        //     },
        //     children: <div>{text}</div>,
        //   };
        // },
      
      // {
      //   title: "Ngày giao hàng",
      //   dataIndex: "expected_DeliveryDate",
      //   key: "expected_DeliveryDate",
      //   ...this.getColumnSearchProps("expected_DeliveryDate"),
      // },
      // {
      //   title: "Giờ giao",
      //   dataIndex: "expected_DeliveryTime",
      //   key: "expected_DeliveryTime",
      //   ...this.getColumnSearchProps("expected_DeliveryTime"),
      // },
      {
        title: this.props.t('NOTE'),
        dataIndex: "note",
        key: "note",
        ...this.getColumnSearchProps("note"),
      },
      {
        title: this.props.t('STATUS'),
        dataIndex: "status",
        key: "status",
        ...this.getColumnSearchProps("status"),
        render: (text) => {
          const txt = text === "INIT" ? "Khởi tạo"
              : text === "CONFIRMED" ? "Đã xác nhận đơn hàng"
                  : text === "DELIVERING" ? "Đang vận chuyển"
                      : text === "DELIVERED" ? "Đã giao"
                          : text === "COMPLETED" ? "Đã hoàn thành"
                              : text === "CANCELLED" ? "Đã bị hủy"
                                  : text
          return (
              <div>{txt}</div>
          )
      }
      },
      {
        title: this.props.t('UPDATE_STATUS'),
        align: "center",
        key: "updateOrder",
        fixed: 'right',
        width: 150,
        render: (order) => (
          <div>
            <Button
              style={{width: 100, marginBottom: 2}}
              type="primary"
              onClick={() => this.onChangeStatusOK(order.id, "CONFIRMED")}
            >
              {this.props.t('RECEIVED')}
            </Button>
            <Button
              type="danger"
              style={{width: 100, marginBottom: 2}}
              // onClick={() =>
              //   this.onChangeStatusOK(order.id, "DELIVERING")
              // }
              data-toggle="modal"
              data-target="#export-order-modal"
              onClick={() => this.setState({selectedOrderIDs: [order.id], selectedOrderInfor: [order]})}
            >
              {this.props.t('TRANSPORT')}
            </Button>
            <Button
              type="danger"
              style={{width: 100, marginBottom: 2}}
              onClick={() => this.onChangeStatusOK(order.id, "CANCELLED")}
            >
              {this.props.t('CANCEL')}
            </Button>            
            {/* <button
              className="btn btn-sm btn-primary"
              data-toggle="modal"
              data-target="#export-order-modal"
              style={{ backgroundColor: "#ED383C" }}
              onClick={() => this.setState({selectedOrderId: order.id})}
            >
              Export
            </button> */}
          </div>
        ),
      },
    ];
    //console.log(this.state.valueCompany);
    return (
      <div>
        <Row style={{ marginTop: 20 }}>
          <Col xs={1}></Col>
          <Col xs={22}>
            <h4>{this.props.t('VIEW_ORDER_RECEIVE')}</h4>
          </Col>
          <Col xs={1}></Col>
        </Row>
        <Row>
          <Col xs={1}></Col>
          <Col xs={2} style={{marginRight: "20px"}}>
            {/* <Button
              type="danger"
              onClick={() => this.handleButtonExportExcel()}
            >
              {this.props.t("EXCEL")}
            </Button> */}
            <ReactHTMLTableToExcel  
              className="btn btn-success"  
              table="emp"  
              filename="_Danh_Sach_Don_Hang_"  
              sheet="Danh sách đơn hàng"  
              buttonText={this.props.t("EXCEL")}
            /> 
          </Col>
          <Col xs={3}>
            <Button
              type="primary"
              data-toggle="modal"
              data-target="#export-order-modal"
              onClick={this.createListOrderIDs}
            >
              {this.props.t('TRANSPORT')}
            </Button>
          </Col>
          <Col xs={17}></Col>
        </Row>
        <Row>
          <Col xs={1}></Col>
          <Col xs={19}>
            <Form
              layout="inline"
              // className="components-table-demo-control-bar"
              style={{ marginBottom: 16 }}
            >
              {/* <Form.Item label="Bordered">
                                <Switch checked={bordered} onChange={this.handleToggle('bordered')} />
                            </Form.Item>
                            <Form.Item label="Size">
                                <Radio.Group value={size} onChange={this.handleSizeChange}>
                                    <Radio.Button value="default">Default</Radio.Button>
                                    <Radio.Button value="middle">Middle</Radio.Button>
                                    <Radio.Button value="small">Small</Radio.Button>
                                </Radio.Group>
                            </Form.Item> */}
              <Form.Item label={this.props.t('FILTER')}>
                <Switch checked={enableFilter} onChange={this.handleDataChange} />
              </Form.Item>
              <Form.Item label={this.props.t('STATUS')}>
                <Radio.Group
                  value={warning ? warning.position : 'notConfirmed'}
                  onChange={this.handleWarningChange}
                >
                  {/* <Radio.Button value="notConfirmed">Chưa xác nhận</Radio.Button>
                            <Radio.Button value="notDelivered">Chưa được giao</Radio.Button> */}
                  <Radio.Button value="INIT">{this.props.t('INITIALIZATION')}</Radio.Button>
                  <Radio.Button value="CONFIRMED">{this.props.t('ACCEPT')}</Radio.Button>
                  <Radio.Button value="DELIVERING">{this.props.t('DELIVERY')}</Radio.Button>

                </Radio.Group>
              </Form.Item>
              <Form.Item>
                <RangePicker
                  ranges={{
                    'Hôm nay': [moment().startOf('day'), moment().endOf('day')],
                    'Tháng hiện tại': [moment().startOf('month'), moment().endOf('month')],
                  }}
                  showTime={{ format: "HH:mm", defaultValue: [moment('07:00', 'HH:mm'), moment('22:00', 'HH:mm')] }}
                  format="DD/MM/YYYY HH:mm"
                  onChange={this.onChangeTime}
                />
              </Form.Item>
            </Form>
          </Col>
          <Col xs={4}></Col>
        </Row>
        <Row>
          <Col xs={1}>
            <div hidden="true">
          <table id="emp" class="table">  
              <thead>
                <tr>
                  <th colspan="11">
                  <img
                    src="https://vieclamnhanh.net.vn/thumb/2018/12/14/155/155/lox1544784113.jpg"
                    alt="logo icon"
                  />
                  </th>
                </tr>
                <tr>
                  <th colspan="11">
                    <h1>LỆNH GIAO HÀNG</h1>
                  </th>
                </tr>
                <tr><th></th></tr>
                <tr><th></th></tr>
                <tr><th></th></tr>
                <tr><th></th></tr>
                <tr>
                  <th colspan="8"></th>
                  <th colspan="3">
                      D.O. No.: 
                  </th>                              
                </tr>
                <tr>
                  <th colspan="8"></th>
                  <th colspan="3">
                      Date: {this.state.excelToday}
                  </th>
                </tr>                             
                <tr>
                  <th colspan="11">
                    <h5>
                    Quý công ty vui lòng giao hàng lên phương tiện Vận tải được chỉ định bời Công ty TNHH GAS SOPET					
                    với các chi tiết sau:					
                    </h5>
                  </th>
                </tr>
                <tr>
                  <th rowSpan="2">No.</th>
                  <th rowSpan="2">Ngày nhận hàng</th>
                  <th rowSpan="2">Mã khách hàng</th>
                  <th rowSpan="2">Provine</th>
                  <th rowSpan="2">Khách hàng</th>
                  <th rowSpan="2">Số xe</th>
                  <th rowSpan="2">Thời gian giao hàng</th>
                  <th colSpan="3" rowSpan="1">Số lượng bình</th>        
                  <th rowSpan="2">Ghi chú</th>
                </tr>
                <tr>
                   <th colSpan="1" rowSpan="1">Loại 50kg</th>
                  <th colSpan="1" rowSpan="1">Loại 45kg</th>
                  <th colSpan="1" rowSpan="1">Loại 12kg</th>                   
                </tr>
              </thead>  
              <tbody>
                {this.state.listTableExcel.map((p, index) => {
                  return <tr key={index}>  
                            <td>{index}</td>
                            <td></td>
                            <td>{p.maKH}</td>
                            <td></td>
                            <td>{p.ten}</td>
                            <td></td>
                            <td>{p.thoiGianGH}</td>
                            <td>{p.binh50 !== 0 ? p.binh50 : ''}</td>
                            <td>{p.binh45 !== 0 ? p.binh45 : ''}</td>
                            <td>{p.binh12 !== 0 ? p.binh12 : ''}</td>
                            <td></td>
                          </tr>                  
                })}
              </tbody>  
            </table>
            </div>
          </Col>
          <Col xs={22}>
            <Table
              //title = {() => 'Here is title'}
              scroll={{ x: 1500, y: 420 }}
              bordered
              columns={columns}
              dataSource={enableFilter ? data : listAllOrder}
              expandedRowRender={(record, index) => this.expandedRowRender(record, index)}
              // rowClassName={(record, index) => ((moment(record.deliveryDate, "DD/MM/YYYY - HH:MM:SS") - (new Date)) < ONE_DAY ? "red" : "blue")}
              rowSelection={rowSelection}
            />
          </Col>
          <Col xs={1}></Col>
        </Row>   
        {/* <ImportDriverTypeCylinder
              // product_parse={this.state.product_parse}
              // typeExportCylinder={this.state.typeExportCylinder}
              // listUsersPartner={this.state.listUsersPartner}
              // listUserFixer={this.state.listUserFixer}
              // handleChangeTypeExportCylinderEmpty={() =>
              //   this.handleChangeTypeExportCylinderEmpty
              // }
        /> */}
        <PopupExportOrder
          getListProducts={this.getListProducts}
          selectedOrderInfor={this.state.selectedOrderInfor}
        />
        <PopupDriverExportOrder
          product_parse={this.state.product_parse}
          selectedOrderIDs={this.state.selectedOrderIDs}
        />        
      </div>
    );
  }
}
export default withNamespaces()(UpdateOrder);