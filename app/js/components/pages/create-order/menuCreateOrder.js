import React, { Component } from 'react';
import { CREATEORDER, GETALLORDER, GETORDERHISTORIES } from "./../../../config/config";
import { Row, Col, Input, Button, Table, Icon, Dropdown, Badge, Menu, Switch, Radio, Form, DatePicker, Tooltip, } from "antd";
import "./index.scss";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import getAllUserApi from "getAllUserApi";
import getUserCookies from "getUserCookies";
import getDestinationUserAPI from "getDestinationUserAPI";
import Highlighter from "react-highlight-words";
import Constants from "Constants";
import callApi from "./../../../util/apiCaller";
import required from 'required';
import { GETTYPECUSTOMER } from '../../../config/config';
import getListBranchAPI from "./../../../../api/getListBranchAPI";
import ViewOrderHistories from "./viewOrderHistories";
import EditOrder from "./editOrder";
import openNotificationWithIcon from "./../../../helpers/notification";
import { withNamespaces } from 'react-i18next';
import ReactToPrint from 'react-to-print';
import ImportPrinter from './../printer/ImportPrinter';
import getExportDataPrint from '../../../../api/getExportDataPrint';
import getDetailExportOrderAPI from '../../../../api/getDetailExportOrderAPI';

const { RangePicker } = DatePicker;

const menu = (
    <Menu>
        <Menu.Item>Action 1</Menu.Item>
        <Menu.Item>Action 2</Menu.Item>
    </Menu>
);

class MenuCreateOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //
            data: [],
            isLoading: false,
            isLoadingViewOrderHistories: false,    
            isLoadingViewEditOrder: false,
            viewingRecord: '',
            //
            listOrderNow:[],
            listOrderOld:[],
            //
            listAllOrder: [],
            orderHistories: [],

            //
            bordered: true,
            enableFilter: false,
            size: 'default',
            warning: 'none',
            warningValue: 'none',
            startDate: '',
            endDate: '',
            
            // Print
            text: 'AAA',
            // enablePrint: false,
            editingKey: '',
            exportDataPrint: [],

            // detailExportData
            detailDataExport: [],
            dataSource: [],
        }

        //////////////////

        this.columns = [
            {
                title: this.props.t("ORDER_ID"),
                dataIndex: "orderCode",
                key: "orderCode",
                ...this.getColumnSearchProps("orderCode"),
                // fixed: 'left',
                // width: 125
            },
            {
                title:this.props.t("CREATE_DATE") ,
                dataIndex: "createdAt",
                key: "createdAt",
                ...this.getColumnSearchProps("createdAt"),
                sortDirections: ['descend', 'ascend'],
                sorter: (a, b) =>  {
                    return (moment(a.createdAt) - moment(b.createdAt))
                },
                render: (text) => {                    
                    return (
                        <div>{moment(text).format("DD/MM/YYYY - HH:mm")}</div>
                    )
                }
            },
            {
                title: this.props.t("CUSTOMER_ID"),
                dataIndex: "customerId",
                key: "customerId",
                ...this.getColumnSearchProps("customerId"),
            },
            {
                title: this.props.t("AGENCY_ID"),
                dataIndex: "agencyId",
                key: "agencyId",
                ...this.getColumnSearchProps("agencyId"),
            },
            {
                title: this.props.t("EXPORT_WAREHOUSE_ID"),
                dataIndex: "warehouseId",
                key: "warehouseId",
                ...this.getColumnSearchProps("warehouseId"),
            },
            {
                title: this.props.t("DELIVERY_DATE"),
                dataIndex: "expected_DeliveryDate",
                key: "expected_DeliveryDate",
                ...this.getColumnSearchProps("expected_DeliveryDate"),
                // defaultSortOrder: 'descend',
                sortDirections: ['descend', 'ascend'],
                sorter: (a, b) =>  {
                    return (moment(a.deliveryDate) - moment(b.deliveryDate))
                },
                // render: (text) => {                    
                //     return (
                //         <div>{moment(text).format("DD/MM/YYYY")}</div>
                //     )
                // }
            },
            {
                title:this.props.t("DELIVERY_TIME"),
                dataIndex: "expected_DeliveryTime",
                key: "expected_DeliveryTime",
                ...this.getColumnSearchProps("expected_DeliveryTime"),
                // render: (text) => {                    
                //     return (
                //         <div>{moment(text).format("HH:mm:ss")}</div>
                //     )
                // }                
            },            
            {
                title:this.props.t("STATUS"),
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
                title:this.props.t("NOTE"),
                dataIndex: "note",
                key: "note",
                ...this.getColumnSearchProps("note"),
            },
            {
                title:this.props.t("ACTION"),
                key: 'operation',
                width: 120,
                align: 'center',
                fixed: "right",
                render: (record, index) => {
                    // const { enablePrint } = this.state;
                    const editable = this.isEditing(record);
                    return (
                        <div title="">
                        <Tooltip title="Lịch sử">
                            <Button
                                type="primary"
                                style={{ marginRight: 5 }}                            
                                data-toggle="modal"
                                data-target="#view-order-histories-modal"
                                onClick={() => this.getOrderHistories(record, index)}
                                icon='history'
                            />                            
                        </Tooltip>

                        {
                            !editable ?
                                <Tooltip title="Tải xuống">
                                    <Button
                                        type="primary"
                                        // style={{ marginRight: 5 }}
                                        onClick={() => this.getDataPrint(record.orderId, record.key)}
                                        icon='download'
                                    />                          
                                </Tooltip>
                                : ''
                        }                        
                        {
                            editable ?
                                <ReactToPrint
                                    style={{ marginLeft: 5 }}
                                    copyStyles={true}
                                    // onBeforeGetContent={this.handleOnBeforeGetContent}
                                    trigger={() => <Button type="primary" icon="printer" />}
                                    content={() => this.componentRef}
                                />
                                : ''
                        }
                        {/* <ImportPrinter ref={el => (this.componentRef = el)} data={record} text={this.state.text}/> */}
                    </div>
                    )                    
                }
            },
        ];


        //////////////////
    }

    isEditing = record => record.key === this.state.editingKey;
    
    edit(key) {
        // console.log('key', key)
        this.setState({ editingKey: key });
    }

    getAllOrder = async (id, token) => {
        this.setState({isLoading: true})
        let user_cookies = await getUserCookies();
        let parmas = {
            orderCreatedBy: user_cookies.user.id,
        };
        await callApi("POST", GETALLORDER, parmas, token).then((res) => {
            let temp = [];
            // console.log("data order", res.data);
            let i = 0;            
            for (let item of res.data.order) {
                temp.push({
                    key: i,
                    orderId: item.id ? item.id : '',
                    orderCode: item.orderCode ? item.orderCode : '',
                    customerId: item.customerId ? item.customerId.name : '',
                    agencyId: item.agencyId ? item.agencyId.name : '',
                    // warehouseId: item.warehouseId
                    //valve: item.valve ? item.valve : '',
                    //color: item.color ? item.color : '',
                    // time: moment(item.time).format("HH:mm:ss"),
                    //cylinderType: item.cylinderType ? item.cylinderType.name : '',
                    // listCylinder: item.listCylinder,
                    // listCylinder: item.listCylinder,
                    note: item.note ? item.note : '',
                    // status: item.status === "INIT" ? '' : item.status,

                    // idCustomer: item.idCustomer.name,
                    // idBranch: item.idBranch.name,
                    // numberCylinders: item.numberCylinders ? item.numberCylinders : 0,
                    listCylinder: item.listCylinder ? item.listCylinder : [],
                    warehouseId: item.warehouseId ? item.warehouseId.name : '',
                    // date: moment(item.orderDate).format("DD/MM/YYYY"),
                    // expected_DeliveryDate: item.expected_DeliveryDate,
                    createdAt: item.createdAt ? item.createdAt : '',
                    expected_DeliveryDate: moment(item.deliveryDate).format("DD/MM/YYYY"),
                    expected_DeliveryTime: moment(item.deliveryDate).format("HH:mm"),
                    deliveryDate: item.deliveryDate ? item.deliveryDate : '',
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

            console.log("tempTest",Date.parse((temp[1].deliveryDate)));
            let listOrderNowDay= [];
            let listOrderOldDay= [];
            temp.map((item,index)=>{
                // console.log("item[index]",item.deliveryDate);
                let createdAtDate=item.createdAt;
                let endDay=new Date().setHours(23, 59, 59, 999);
                let start =new Date().setHours(0, 0, 0, 0);
                if(Date.parse((createdAtDate))>=start){
                    console.log("Date.parse((item[index].deliveryDate))",Date.parse((item.deliveryDate)));
                    listOrderNowDay.push(item);
                }else if(Date.parse((createdAtDate))<start){
                    listOrderOldDay.push(item);
                }
           
            })            
            console.log("listOrderNowDay",listOrderNowDay);
            console.log("listOrderNowDay",listOrderOldDay);
            
            this.setState({
                listAllOrder: temp,
                isLoading: false,
                listOrderNow:listOrderNowDay,
                listOrderOld:listOrderOldDay,

            });
        });
    };
    async componentDidMount() {
       
    // await this.getAllUser();
    let user_cookies = await getUserCookies();
    //console.log(user_cookies.user.id);
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    this.setState({
     

      user_type: user_cookies.user.userType,
      tokenAPI: token,
      idAccount: id,
    });
        await this.getAllOrder(id, token);

    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
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
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
            </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
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

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    getOrderHistories = async (record, index) => {
        // console.log('getOrderHistories record', record)
        // console.log('getOrderHistories index', index)
        this.setState({
            isLoadingViewOrderHistories: true,
            viewingRecord: record.orderId,
        })

        let user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;

        let params={
            orderId: record.orderId
        }
        await callApi("POST",GETORDERHISTORIES,params,token).then(res=>{
            // console.log('GETORDERHISTORIES', res.data)
            if(res.data.status && res.data.resCode==="SUCCESS-00003"){
                // openNotificationWithIcon("success", res.data.message)

                // Chỉnh lại dữ liệu, trước khi chuyển cho viewOrderHitories
                let temp = [];
                let i = 0;
                for (let item of res.data.orderHistories) {
                    temp.push({
                        key: i,
                        status: item.status === "INIT" ? "Khởi tạo"
                            : item.status === "CONFIRMED" ? "Đã xác nhận đơn hàng"
                                : item.status === "DELIVERING" ? "Đang vận chuyển"
                                    : item.status === "DELIVERED" ? "Đã giao"
                                        : item.status === "COMPLETED" ? "Đã hoàn thành"
                                            : item.status === "CANCELLED" ? "Đã bị hủy"
                                                : item.status,
                        content: item.content ? item.content : '',
                        createdBy: item.createdBy ? item.createdBy.name : '',
                        createdAt: item.createdAt ? moment(item.createdAt).format("DD/MM/YYYY - HH:mm") : '',
                        
                    });
                    i++;
                }

                this.setState({ orderHistories: temp, isLoadingViewOrderHistories: false })
            }
            else {
                // openNotificationWithIcon("error","Đã có lỗi xảy ra")
                this.setState({ isLoadingViewOrderHistories: false })
                openNotificationWithIcon("error", res.data.message)
                
            }
        })
    }

    expandedRowRender = (record, index) => {
        // console.log('expandedRowRender', record, index)
        const columnsNestedTables = [
            { title: 'Loại bình', dataIndex: 'cylinderType', key: 'cylinderType' },
            { title: 'Màu sắc', dataIndex: 'color', key: 'color' },
            { title: 'Loại van', dataIndex: 'valve', key: 'valve' },
            { title: 'Số lượng bình', dataIndex: 'numberCylinders', key: 'numberCylinders' },
            // { title: 'Đã giao', /* dataIndex: 'numberCylinders', key: 'numberCylinders' */ },          
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

    handleToggle = prop => enable => {
        this.setState({ [prop]: enable });
    };

    handleSizeChange = e => {
        this.setState({ size: e.target.value });
    };

    handleDataChange = enableFilter => {
        this.setState({ enableFilter });
    };

    handleWarningChange = e => {        
        const {value} = e.target
        // const { listAllOrder, tempData } = this.state
        // console.log('warning', value)
        // console.log('listAllOrder', listAllOrder)
        // if (value==='INIT') {
        //     // console.log('notConfirmed')
        //     const data = listAllOrder.filter(order=> {
        //         return order.status === 'INIT'
        //     })
        //     // console.log('data', data)
        //     this.setState({data: data})
        // }
        // if (value==='CONFIRMED') {
        //     const data = listAllOrder.filter(order=> {
        //         return order.status === 'CONFIRMED'
        //     })
        //     this.setState({data: data})
        // }
        // if (value==='DELIVERING') {
        //     const data = listAllOrder.filter(order=> {
        //         return order.status === 'DELIVERING'
        //     })
        //     this.setState({data: data})
        // }


        this.setState({
            warning: value === 'none' ? 'none' : { position: value },
            warningValue: value,
        }, this.filterData)

        //this.filterData()
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

        // console.log('filterData')

        // if (enableFilter) {
        //     let tempData = listAllOrder

        //     // --- Lọc theo thời gian ---
        //     // if (startDate && endDate) {
        //     //     tempData = 
        //     // }

        //     // --- Lọc theo trạng thái đơn hàng ---
        //     if (warningValue === 'INIT') {
        //         // console.log('notConfirmed')
        //         const data = listAllOrder.filter(order => {
        //             return order.status === 'INIT'
        //         })
        //         // console.log('data', data)
        //         this.setState({ data: data })
        //     }
        //     if (warningValue === 'CONFIRMED') {
        //         const data = listAllOrder.filter(order => {
        //             return order.status === 'CONFIRMED'
        //         })
        //         this.setState({ data: data })
        //     }
        //     if (warningValue === 'DELIVERING') {
        //         const data = listAllOrder.filter(order => {
        //             return order.status === 'DELIVERING'
        //         })
        //         this.setState({ data: data })
        //     }

        //     return data
        // }
        // else {
        //     return listAllOrder
        // }

        let tempData = listAllOrder

        if (startDate && endDate) {
            // console.log('startDate && endDate', startDate, endDate)
            tempData = listAllOrder.filter(order=>{
                return (startDate<=moment(order.deliveryDate) && moment(order.deliveryDate)<=endDate)
            })
        }

        // console.log('warning', value)
        // console.log('listAllOrder', listAllOrder)
        if (warningValue==='INIT') {
            // console.log('INIT')
            const data = tempData.filter(order=> {
                return order.status === 'INIT'
            })
            // console.log('data', data)
            this.setState({data: data})
        }
        if (warningValue==='CONFIRMED') {
            const data = tempData.filter(order=> {
                return order.status === 'CONFIRMED'
            })
            this.setState({data: data})
        }
        if (warningValue==='DELIVERING') {
            const data = tempData.filter(order=> {
                return order.status === 'DELIVERING'
            })
            this.setState({data: data})
        }
    }

    handleOnBeforeGetContent = () => {
        console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console
        this.setState({ text: "Loading new text..."/* , isLoading: true */ });

        return new Promise((resolve) => {
            // setTimeout(() => {
            //     this.setState({ text: "New, Updated Text!"/* , isLoading: false */ }, resolve);
            // }, 2000);
            this.setState({ text: "New, Updated Text!"/* , isLoading: false *//* , exportDataPrint: 'CUONG' */}, resolve);
        });
    };

    getDataPrint = async (orderId, key) => {
        // console.log('orderId', orderId)
        const result = await getExportDataPrint(orderId)
        console.log('result', result)
        if (result.status===true) {
            this.setState({ 
                // enablePrint: true,
                editingKey: key,
                exportDataPrint: result.data
            })
        }
    }

    getDetailExportOrder = async () => {
        console.log('clicked getDetailExportOrder', this.state.viewingRecord)
        const result = await getDetailExportOrderAPI(this.state.viewingRecord)
        if (result.status===true) {
            let data = [];
            if (result.data.exportHistory) {
                const cylinders = result.data.exportHistory.cylinders
                const lengthListCylinder = cylinders.length
                for (let i = 0; i < lengthListCylinder; i++) {
                    data.push({
                        key: i,
                        serial: cylinders[i].serial,
                        color: cylinders[i].color,
                        valve: cylinders[i].valve,
                        weight: cylinders[i].weight,
                        status: 'STATUS'
                    });
                }
            }
            this.setState({ dataSource: data })
            // this.setState({ 
            //     // enablePrint: true,
            //     // editingKey: key,
            //     detailDataExport: result.data
            // })
        }
    }

    render() {
        const {
            bordered,
            enableFilter,
            size,
            // enablePrint
        } = this.state

        const defaultPageSize = {
            defaultPageSize: 10
        }
        console.log("listAllOrderTest",this.state.listAllOrder);
        console.log("listAllOrderdata",this.state.data);
        // const columns = [
        //     {
        //         title: this.props.t("ORDER_ID"),
        //         dataIndex: "orderCode",
        //         key: "orderCode",
        //         ...this.getColumnSearchProps("orderCode"),
        //     },
        //     {
        //         title:this.props.t("CREATE_DATE") ,
        //         dataIndex: "createdAt",
        //         key: "createdAt",
        //         ...this.getColumnSearchProps("createdAt"),
        //         sortDirections: ['descend', 'ascend'],
        //         sorter: (a, b) =>  {
        //             return (moment(a.createdAt) - moment(b.createdAt))
        //         },
        //         render: (text) => {                    
        //             return (
        //                 <div>{moment(text).format("DD/MM/YYYY - HH:mm:ss")}</div>
        //             )
        //         }
        //     },
        //     {
        //         title: this.props.t("CUSTOMER_ID"),
        //         dataIndex: "customerId",
        //         key: "customerId",
        //         ...this.getColumnSearchProps("customerId"),
        //     },
        //     {
        //         title: this.props.t("AGENCY_ID"),
        //         dataIndex: "agencyId",
        //         key: "agencyId",
        //         ...this.getColumnSearchProps("agencyId"),
        //     },
        //     {
        //         title: this.props.t("EXPORT_WAREHOUSE_ID"),
        //         dataIndex: "warehouseId",
        //         key: "warehouseId",
        //         ...this.getColumnSearchProps("warehouseId"),
        //     },
        //     {
        //         title: this.props.t("DELIVERY_DATE"),
        //         dataIndex: "expected_DeliveryDate",
        //         key: "expected_DeliveryDate",
        //         ...this.getColumnSearchProps("expected_DeliveryDate"),
        //         // defaultSortOrder: 'descend',
        //         sortDirections: ['descend', 'ascend'],
        //         sorter: (a, b) =>  {
        //             return (moment(a.deliveryDate) - moment(b.deliveryDate))
        //         },
        //         // render: (text) => {                    
        //         //     return (
        //         //         <div>{moment(text).format("DD/MM/YYYY")}</div>
        //         //     )
        //         // }
        //     },
        //     {
        //         title:this.props.t("DELIVERY_TIME"),
        //         dataIndex: "expected_DeliveryTime",
        //         key: "expected_DeliveryTime",
        //         ...this.getColumnSearchProps("expected_DeliveryTime"),
        //         // render: (text) => {                    
        //         //     return (
        //         //         <div>{moment(text).format("HH:mm:ss")}</div>
        //         //     )
        //         // }                
        //     },            
        //     {
        //         title:this.props.t("STATUS"),
        //         dataIndex: "status",
        //         key: "status",
        //         ...this.getColumnSearchProps("status"),
        //         render: (text) => {
        //             const txt = text === "INIT" ? "Khởi tạo"
        //                 : text === "CONFIRMED" ? "Đã xác nhận đơn hàng"
        //                     : text === "DELIVERING" ? "Đang vận chuyển"
        //                         : text === "DELIVERED" ? "Đã giao"
        //                             : text === "COMPLETED" ? "Đã hoàn thành"
        //                                 : text === "CANCELLED" ? "Đã bị hủy"
        //                                     : text
        //             return (
        //                 <div>{txt}</div>
        //             )
        //         }
        //     },
        //     {
        //         title:this.props.t("NOTE"),
        //         dataIndex: "note",
        //         key: "note",
        //         ...this.getColumnSearchProps("note"),
        //     },
        //     {
        //         title:this.props.t("ACTION"),
        //         key: 'operation',
        //         width: 120,
        //         align: 'center',
        //         render: (record, index) => (
        //             <div>
        //                 <Button
        //                     type="primary"
        //                     style={{ marginRight: 5 }}                            
        //                     data-toggle="modal"
        //                     data-target="#view-order-histories-modal"
        //                     onClick={() => this.getOrderHistories(record, index)}
        //                     icon='history'
        //                 />
        //                 {
        //                     !enablePrint ?
        //                         <Button
        //                             type="primary"
        //                             // style={{ marginRight: 5 }}
        //                             onClick={() => this.getDataPrint(record.orderId)}
        //                             icon='download'
        //                         />
        //                         : ''
        //                 }                        
        //                 {
        //                     enablePrint ?
        //                         <ReactToPrint
        //                             style={{ marginLeft: 5 }}
        //                             copyStyles={true}
        //                             onBeforeGetContent={this.handleOnBeforeGetContent}
        //                             trigger={() => <Button type="primary" icon="printer" />}
        //                             content={() => this.componentRef}
        //                         />
        //                         : ''
        //                 }                        
        //                 <ImportPrinter ref={el => (this.componentRef = el)} data={record} text={this.state.text}/>
        //             </div>
        //         )
        //     },
        // ];
        
        const columns = this.columns.map(col => {
            return {
                ...col,
                onCell: record => ({
                    record,                    
                    dataIndex: col.dataIndex,
                    title: col.title,
                }),
            };
        });

        let {
            listAllOrder,
            orderHistories,
            data,
            warning,
            isLoading,
            isLoadingViewOrderHistories,
            isLoadingViewEditOrder,
            viewingRecord,
            dataSource,
        } = this.state
        return (
            <div>
                {/* <label style={{ color: 'red', fontSize: '24px', marginLeft: '530px' }}>Danh sách đơn hàng</label> */}
                <Row style={{ marginTop: 20 }}>
                    <Col xs={1}></Col>
                    <Col xs={22}><h4>{this.props.t("LIST_ORDER")}</h4></Col>
                    <Col xs={1}></Col>
                </Row>
                <Row>
                    <Col xs={1}></Col>
                    <Col xs={22}>
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
                            <Form.Item label={this.props.t("Filter")}>
                                <Switch checked={enableFilter} onChange={this.handleDataChange} />
                            </Form.Item>
                            <Form.Item label={this.props.t("STATUS")}>
                                <Radio.Group
                                    value={warning ? warning.position : 'notConfirmed'}
                                    onChange={this.handleWarningChange}
                                >
                                    {/* <Radio.Button value="notConfirmed">Chưa xác nhận</Radio.Button>
                            <Radio.Button value="notDelivered">Chưa được giao</Radio.Button> */}
                                    <Radio.Button value="INIT">{this.props.t("INITIALIZATION")}</Radio.Button>
                                    <Radio.Button value="CONFIRMED">{this.props.t("CONFIRM")}</Radio.Button>
                                    <Radio.Button value="DELIVERING">{this.props.t("DELIVERY")}</Radio.Button>

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
                    <Col xs={1}></Col>
                </Row>
                <Row>
                    <Col xs={1}></Col>
                    <Col xs={22}>
                        <Table
                            //className="components-table-demo-nested"
                            scroll={{ x: 1500, y: 420 }}
                            loading={isLoading}
                            bordered={bordered}
                            size={size}
                            columns={columns}
                            dataSource={enableFilter ? this.state.listOrderOld : this.state.listOrderNow}
                            pagination={defaultPageSize}
                            expandedRowRender={(record, index) => this.expandedRowRender(record, index)}
                            // onRow={(record, index) => (
                            //     console.log('record, index', record, index)
                            //     // this.setState('')
                            //   )}
                        />
                    </Col>
                    <Col xs={1}></Col>
                </Row>
                <ViewOrderHistories
                    orderHistories={orderHistories}
                    isLoadingViewOrderHistories={isLoadingViewOrderHistories}
                    getDetailExportOrder={this.getDetailExportOrder}
                />
                <EditOrder
                    isLoadingViewEditOrder={isLoadingViewEditOrder}
                    dataSource={dataSource}
                />
                <ImportPrinter ref={el => (this.componentRef = el)} dataPrint={this.state.exportDataPrint} text={this.state.text}/>
            </div>
        );
    }
}

export default withNamespaces()(MenuCreateOrder) ;