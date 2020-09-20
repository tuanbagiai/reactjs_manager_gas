import React from "react";
import { connect } from "react-redux";
import PopupLogOut from "./PopupLogOut";
import { getCookie, setCookie } from "redux-cookie";
import getReportByUserAPI from "getReportByUserAPI";
import getHistoryImportAPI from "getHistoryImportAPI";
import getCylinderByHistoryId from "getCylinderByHistoryId";
import moment from "moment";
import "moment/locale/vi";
import getUserCookies from "getUserCookies";
import UltiHelper from "UltiHelper";
import GetReportChartApi from "getReportChart";
import getReportPieChartAPI from "getReportPieChart";
import imexGetExport from "app/api/imexGetExport";
import imexGetStatistics from "app/api/imexGetStatistics";
import imexPieGetExport from "app/api/imexGetCurrentInventory";
import imexGetCurrentInventoryByItSelf from "app/api/imexGetCurrentInventoryByItSelf";
import getExportByItSelf from "app/api/getExportByItSelf";
import ShowPieChart from "./showPieChart";
import ShowBarChart from "./showBarChart";
import { withNamespaces } from "react-i18next";
import {
  urlSeeDetailDataExport,
  urlDetailHistoryImport,
} from "./../../../config/config-reactjs";
import "./dashboard.scss";
//dai
import {
  Bar,
  LabelList,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Sector,
  Cell,
  Text,
  ResponsiveContainer,
  Line,
} from "recharts";
import Select from "react-select";
import updateAllowReportApi from "updateUserAllowReportApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import YearPicker from "react-year-picker";
import showToast from "showToast";
import Switch from "react-switch";
import getReportChildsAPI from "getReportChilds";
import Constants from "Constants";
import TableDataInfo from "./tableDataInfo";
import getChildAndNumberImportAPI from "getChildAndNumberImport";
import apiReportTurnBackInfoAPI from "apiReportTurnBackInfo";
import callDataTurnBackInfoAPI from "callDataTurnBackInfo";
import { Row, Col } from "antd";
import getReportExcelByTargetAndDateTimeAPI from "getReportExcelByTargetAndDateTimeAPI";
import callApi from "../../../util/apiCaller";
import { TOPEXPORTCYLINDER } from "./../../../config/config";

moment.locale("vi");

let COLORS = [
  "#2568a7",
  "#d171ca",
  "#99915a",
  "#6b28a6",
  "#62e0f6",
  "#92b4b0",
  "#d22ac2",
  "#4a889c",
  "#40d3a6",
  "#71d892",
  "#b2e447",
  "#ee5592",
  "#4b79e6",
];
const RADIAN = Math.PI / 180;

const data = [{ name: "Chưa có Data", value: 0 }];

let ACTION_REPORT_TYPE = [
  { value: "IMPORT", label: "Nhập Hàng" },
  { value: "EXPORT", label: "Xuất Hàng" },
  { value: "IMPORT_CELL", label: "Nhập vỏ" },
  { value: "EXPORT_CELL", label: "Xuất Vỏ" },
  { value: "TURN_BACK", label: "Hồi Lưu" },
  { value: "FIX", label: "Xuất Sửa Chữa" },
  { value: "CREATE", label: "Bình Đã Tạo" },
  { value: "SYNTHESIS_REPORT_CREATE", label: "BCT bình đã tạo" },
  { value: "SYNTHESIS_REPORT_DELIVERY", label: "BCT giao nhận bình" },
];
// const constrenderCustomizedLabelImex = ({
//   cx,
//   cy,
//   midAngle,
//   innerRadius,
//   outerRadius,
//   percent,
//   index,
// }) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);
//   return (
//     <text
//       x={x}
//       y={y}
//       fill="white"
//       textAnchor={x > cx ? "start" : "end"}
//       dominantBaseline="central"
//     >
//       {`${(percent * 100).toFixed(0)}%`}
//       {/* {this.state.dataImexPieGetExport.length > 0 ? this.state.dataImexPieGetExport[index].value : ''} */}
//     </text>
//   );
// };

class DashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_input_type: "",
      current_input_role: "",
      valueReports: [],
      dataValueReports: null,
      actionTypeReportExcel: "",
      selectedId: "",
      user: null,
      resultImport: { reveneu: 0 },
      resultExport: {},
      user_current: { userType: "" },
      historyImport: [],
      historyExport: [],
      dataPieChart: [],
      dataBarChart: [],
      dataImexBarGetExport: [],
      dataImexBarGetExportWarehouse: [],
      dataImexPieGetExport: [],
      dataimexGetStatistics: [],
      dataImexPieGetExportWareHouse: [],
      dataImexGetStatisticsTotal: null,
      dataImexGetStatisticsTotal_12kg: null,
      dataImexGetStatisticsTotal_45kg: null,
      dataImexGetStatisticsTotal_50kg: null,
      dataImexGetStatisticsInventoryCylinder_Total: null,
      dataImexGetStatisticsInventoryCylinder_Total_12kg: null,
      dataImexGetStatisticsInventoryCylinder_Total_45kg: null,
      dataImexGetStatisticsInventoryCylinder_Total_50kg: null,
      dataImexGetStatisticsOutCylinder_Total: null,
      dataImexGetStatisticsOutCylinder_Total_12kg: null,
      dataImexGetStatisticsOutCylinder_Total_45kg: null,
      dataImexGetStatisticsOutCylinder_Total_50kg: null,
      dataImexGetStatisticsTurnbackCylinder_Total: null,
      dataImexGetStatisticsTurnbackCylinder_Total_12kg: null,
      dataImexGetStatisticsTurnbackCylinder_Total_45kg: null,
      dataImexGetStatisticsTurnbackCylinder_Total_50kg: null,
      yearSubmit: "",
      dataArrYear: [],
      startDate: moment(),
      endDate: moment(),
      startDateSubmit: moment(new Date()).format("MM/DD/YYYY"),
      endDateSubmit: moment(new Date()).format("MM/DD/YYYY"),
      checkDataChart: [],
      valueCheckChart: false,
      namePopup: "",
      checked: true,
      objectData: [
        { label: this.props.t("ALL"), value: 0 },
        { label: this.props.t("GENERAL"), value: 1, name: "General" },
        // { label: this.props.t("RETAIL"), value: 2, name: "Agency" },
        { label: this.props.t("FACTORY_CHILD"), value: 3, name: "Factory" },
        { label: this.props.t("FIXER"), value: 4, name: "Fixer" },
      ],
      dataChild1: [],
      dataChild2: [],
      dataChild3: [],
      dataChild4: [],

      objectDataChild: [
        //{ label: "Chi nhánh trực thuộc", value: 0 },
        { label: this.props.t("ALL"), value: 0 },
        { label: this.props.t("GENERAL"), value: 1, name: "General" },
        { label: this.props.t("RETAIL"), value: 2, name: "Agency" },
        { label: this.props.t("FIXER"), value: 4, name: "Fixer" },
      ],
      objectDataChildTNMBFAC: [
        //{ label: "Chi nhánh trực thuộc", value: 0 },
        { label: this.props.t("RETAIL"), value: 1, name: "Agency" },
      ],
      //label: "Chi nhánh trực thuộc", value: 0
      dataObjectChecked: { label: this.props.t("ALL"), value: 0 },
      dataObjectCheckedChild: { label: this.props.t("ALL"), value: 0 },
      dataObjectCheckedGENARAL: {},

      dataObjectCheckedID: 0,
      dataObjectChecked1: "",
      dataObjectCheckedID1: "",

      dataObjectCheckedIDChild: 0,
      dataObjectCheckedTNMBFAC: "",
      dataObjectCheckedTNMBFACID: "",

      dataObjectCheckedGENARALID: "",
      dataObjectAgencyGeneral: "",
      dataObjectAgencyGeneralID: "",

      itemData: "",
      itemDataObject4: "",
      itemDataObject5: "",
      dataTableChart: "",
      infoReportTurnback: "",
      dataTurnBacks: [],
      allDataImport: [],
      allDataExport: [],
      listTopExportCylinder: [],
      userTypeCheck: "",
    };
    this.state.dataImexGetStatisticsTotal = this.state.dataImexGetStatisticsTotal;
  }

  resetData(step) {
    switch (step) {
      case 1:
        this.setState({
          ataObjectCheckedID: 0,
          dataObjectChecked1: "",
          dataObjectCheckedID1: "",

          dataObjectCheckedIDChild: 0,
          dataObjectCheckedTNMBFAC: "",
          dataObjectCheckedTNMBFACID: "",

          dataObjectCheckedGENARALID: "",
          dataObjectAgencyGeneral: "",
          dataObjectAgencyGeneralID: "",
          dataValueReports: "",
        });
        break;
      case 2:
        this.setState({
          dataObjectCheckedIDChild: 0,
          dataObjectCheckedTNMBFAC: "",
          dataObjectCheckedTNMBFACID: "",

          dataObjectCheckedGENARALID: "",
          dataObjectAgencyGeneralID: "",
          dataObjectAgencyGeneral: "",
          dataValueReports: "",
        });
        break;
      case 3:
        this.setState({
          dataObjectCheckedGENARALID: "",
          dataObjectAgencyGeneral: "",
          dataObjectAgencyGeneralID: "",
          dataValueReports: "",
        });
        break;
    }
  }

  _getRandomColor(index = 0) {
    let today = new Date();
    today.setDate(today.getDate() + index);
    const randomNumber = Math.random(today.getMilliseconds());
    const cc = "#" + ("000000" + randomNumber.toString(16)).substr(-6);
    return cc;
  }

  _getArrayColor(numberLength = 5) {
    let arrayColor = [];
    let i = 0;
    while (i < numberLength) {
      const color = this._getRandomColor(i);
      arrayColor.push(color);
      i++;
    }
    if (arrayColor.length > 0) {
      COLORS = arrayColor;
    }
  }

  translateReportChart = (item) => {
    let reportVN = "";
    switch (item) {
      case "inventoryAtMySelf":
        return (reportVN = this.props.t("IS_INVENTORY"));
      case "atResident":
        return (reportVN = this.props.t("SELL_GENERAL"));
      case "else":
        return (reportVN = this.props.t("IN_OTHER"));
      case "atFactoryChilds":
        return (reportVN = this.props.t("IN_CHILD_COMPANY"));
      case "atGeneralChilds":
        return (reportVN = this.props.t("IN_TRADER"));
      case "atAgencyChilds":
        return (reportVN = this.props.t("IN_AGENCY"));
      case "atPartners":
        return (reportVN = this.props.t("IN_PARTNER"));
      case "atFixer":
        return (reportVN = this.props.t("IN_FIXER"));
      case "totalFixer":
        return (reportVN = this.props.t("FIX_TITLE"));
      case "totalGeneral":
        return (reportVN = this.props.t("TRADER"));
      case "totalAgency":
        return (reportVN = this.props.t("AGENCY_CODE"));
      case "totalCompanyChild":
        return (reportVN = this.props.t("CHILD_CPN_TT"));
      case "totalBuyPartner":
        return (reportVN = this.props.t("PART_BUY"));
      case "totalRentPartner":
        return (reportVN = this.props.t("PART_HIRE"));
      default:
        return (reportVN = "");
    }
  };
  renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {this.state.dataImexPieGetExportWareHouse[index].value == 0
          ? 1
          : this.state.dataImexPieGetExportWareHouse[index].value}
      </text>
    );
  };
  renderCustomizedLabelImex = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {/* {`${(percent * 100).toFixed(0)}%`} */}
        {this.state.dataImexPieGetExport[index].value === 0
          ? ""
          : this.state.dataImexPieGetExport[index].value}
      </text>
    );
  };
  getImexStatistics = async () => {
    const data = await imexGetStatistics();
    console.log("Bieu Do tron imexGetStatisticsAPI", data);
    console.log("dat.data.data", data.data.data);
    //Get genaral\
    this.setState({
      dataImexGetStatisticsTotal: data.data.data.createdCylinder.total,
      dataImexGetStatisticsTotal_12kg:
        data.data.data.createdCylinder.total_CYL12KG +
        data.data.data.createdCylinder.total_CYL12KGCO,
      dataImexGetStatisticsTotal_45Kg:
        data.data.data.createdCylinder.total_CYL45KG,
      dataImexGetStatisticsTotal_50Kg:
        data.data.data.createdCylinder.total_CYL50KG,
      dataImexGetStatisticsInventoryCylinder_Total:
        data.data.data.inventoryCylinder.total,
      dataImexGetStatisticsInventoryCylinder_Total_12kg:
        data.data.data.inventoryCylinder.total_CYL12KG +
        data.data.data.inventoryCylinder.total_CYL12KGCO,
      dataImexGetStatisticsInventoryCylinder_Total_45kg:
        data.data.data.inventoryCylinder.total_CYL45KG,
      dataImexGetStatisticsInventoryCylinder_Total_50kg:
        data.data.data.inventoryCylinder.total_CYL50KG,
      dataImexGetStatisticsOutCylinder_Total: data.data.data.outCylinder.total,
      dataImexGetStatisticsOutCylinder_Total_12kg:
        data.data.data.outCylinder.total_CYL12KG +
        data.data.data.outCylinder.total_CYL12KGCO,
      dataImexGetStatisticsOutCylinder_Total_45kg:
        data.data.data.outCylinder.total_CYL45KG,
      dataImexGetStatisticsOutCylinder_Total_50kg:
        data.data.data.outCylinder.total_CYL50KG,
      dataImexGetStatisticsTurnbackCylinder_Total:
        data.data.data.turnbackCylinder.total,
      dataImexGetStatisticsTurnbackCylinder_Total_12kg:
        data.data.data.turnbackCylinder.total_CYL12KG +
        data.data.data.turnbackCylinder.total_CYL12KGCO,
      dataImexGetStatisticsTurnbackCylinder_Total_45kg:
        data.data.data.turnbackCylinder.total_CYL45KG,
      dataImexGetStatisticsTurnbackCylinder_Total_50kg:
        data.data.data.turnbackCylinder.total_CYL50KG,
    }),
      // this.setState({
      //   dataimexGetStatisticsTotal : dataimexGetStatistics.createdCylinder.total
      // });
      console.log(
        "dataimexGetStatisticsTotal",
        this.state.dataImexGetStatisticsTotal
      );
    console.log(
      "dataimexGetStatisticsTotal",
      this.state.dataImexGetStatisticsTotal_12kg
    );
    console.log(
      "dataimexGetStatisticsTotal",
      this.state.dataImexGetStatisticsTotal_45Kg
    );
    console.log(
      "dataimexGetStatisticsTotal",
      this.state.dataImexGetStatisticsTotal_50Kg
    );
    console.log(
      "dataimexGetStatisticsTotal",
      this.state.dataImexGetStatisticsInventoryCylinder_Total
    );
    console.log(
      "dataImexGetStatisticsInventoryCylinder_Total_12kg",
      this.state.dataImexGetStatisticsInventoryCylinder_Total_12kg
    );
    console.log(
      "dataImexGetStatisticsInventoryCylinder_Total_45kg",
      this.state.dataImexGetStatisticsInventoryCylinder_Total_45kg
    );
    console.log(
      "dataImexGetStatisticsInventoryCylinder_Total_50kg",
      this.state.dataImexGetStatisticsInventoryCylinder_Total_50kg
    );
    console.log(
      "dataImexGetStatisticsOutCylinder_Total",
      this.state.dataImexGetStatisticsTurnbackCylinder_Total
    );
    console.log(
      "dataImexGetStatisticsOutCylinder_Total_Total_12kg",
      this.state.dataImexGetStatisticsTurnbackCylinder_Total_12kg
    );
    console.log(
      "dataImexGetStatisticsOutCylinder_Total_Total_45kg",
      this.state.dataImexGetStatisticsTurnbackCylinder_Total_45kg
    );
    console.log(
      "dataImexGetStatisticsOutCylinder_Total_Total_50kg",
      this.state.dataImexGetStatisticsTurnbackCylinder_Total_50kg
    );
  };
  getImexBarChart = async (userId = "", startDate = "", endDate = "") => {
    //const data = await imexGetExport( userId ,(new Date(startDate)).toISOString(),(new Date(endDate)).toISOString());
    const data = await imexGetExport(userId, startDate, endDate);
    console.log("data getImexBarChart", data);
    // if(!(this.state.user_current.userType === "Factory"
    // && this.state.user_current.userRole === "SuperAdmin")
    // && this.state.user_current.userType !== "Agency"
    // && this.state.user_current.userType !== "Fixer"){
    // const data = await getExportByItSelf( userId ,startDate,endDate);
    // console.log("Bieu Do tron imex Bar11111111111111111111111111111112222222",data);
    // }

    const barChart = [];
    for (let itemBarChart in data.data.data) {
      console.log("dat.data.data", data.data.data[2].count);
      barChart.push({
        //Get genaral\
        name: data.data.data[itemBarChart].name,
        bình: data.data.data[itemBarChart].count,
      });
    }
    this.setState({
      dataImexBarGetExport: barChart,
    });
  };
  getImexBarChartWarehouse = async (
    userId = "",
    startDate = "",
    endDate = ""
  ) => {
    //const data = await imexGetExport( userId ,(new Date(startDate)).toISOString(),(new Date(endDate)).toISOString());
    const data = await getExportByItSelf(userId, startDate, endDate);
    console.log("data getImexBarChartWarehouse1", data);
    const barChart = [];
    for (let itemBarChart in data.data.data) {
      console.log("dat.data.data", data.data.data[2].count);
      barChart.push({
        //Get genaral\
        name: data.data.data[itemBarChart].name,
        bình: data.data.data[itemBarChart].count,
      });
    }
    this.setState({
      dataImexBarGetExportWarehouse: barChart,
    });
    console.log(
      "dataImexBarGetExportWarehouse",
      this.state.dataImexBarGetExportWarehouse
    );
  };
  getImexBarChart1 = async (userId, startDate, endDate) => {
    const data = await getExportByItSelf(userId, startDate, endDate);
    console.log("Bieu Do tron imex Bar", data);
    const barChart = [];
    for (let itemBarChart in data.data.data) {
      console.log("dat.data.data", data.data.data[2].count);
      barChart.push({
        //Get general\
        name: data.data.data[itemBarChart].name,
        bình: data.data.data[itemBarChart].count,
      });
    }
    this.setState({
      dataImexBarGetExport: barChart,
    });
  };

  getImexPieChart = async (target_id = "", endDate) => {
    // const data = await imexPieGetExport( target_id,(new Date(endDate)).toISOString());
    const data = await imexPieGetExport(target_id, endDate);
    console.log("Bieu Do tron imex Pie", data);
    const PieChart = [];
    for (let itemPieChart in data.data.data) {
      console.log("dat.data.data", data.data.data[0].count);
      PieChart.push({
        //Get general\
        name:
          data.data.data[itemPieChart] <= 0
            ? ""
            : data.data.data[itemPieChart].name,
        value:
          data.data.data[itemPieChart].count <= 0
            ? 0
            : data.data.data[itemPieChart].count,
      });
    }
    console.log("testBieuDo", Pie);
    this.setState({
      dataImexPieGetExport: PieChart,
    });
  };
  getImexPieChart1 = async (target_id, endDate) => {
    const data = await imexGetCurrentInventoryByItSelf(target_id, endDate);
    console.log("Bieu Do tron imex Pie", data);
    const PieChart = [];
    for (let itemPieChart in data.data.data) {
      console.log("dat.data.data", data.data.data[0].count);
      PieChart.push({
        //Get genaral\
        name:
          data.data.data[itemPieChart] < 0
            ? ""
            : data.data.data[itemPieChart].name,
        value:
          data.data.data[itemPieChart].count < 0
            ? 0
            : data.data.data[itemPieChart].count,
      });
    }
    this.setState({
      dataImexPieGetExport: PieChart,
    });
  };
  getImexPieChartWareHouse = async (target_id, endDate) => {
    const data = await imexGetCurrentInventoryByItSelf(target_id, endDate);
    console.log("Bieu Do tron imex Pie", data);
    const PieChart = [];
    for (let itemPieChart in data.data.data) {
      console.log("dat.data.data", data.data.data[0].count);
      PieChart.push({
        //Get genaral\
        name:
          data.data.data[itemPieChart] < 0
            ? ""
            : data.data.data[itemPieChart].name,
        value:
          data.data.data[itemPieChart].count < 0
            ? 0
            : data.data.data[itemPieChart].count,
      });
    }
    this.setState({
      dataImexPieGetExportWareHouse: PieChart,
    });
    console.log(
      "getImexPieChartWareHouse",
      this.state.dataImexPieGetExportWareHouse
    );
  };
  getReportPieChart = async () => {
    const data = await getReportPieChartAPI();
    console.log("Bieu Do tron1", data);
    // const data1 = await imexGetCurrentInventoryByItSelf();
    // console.log("imexGetCurrentInventoryByItSelf",data1);
    // const data1 = await imexGetExport();
    // console.log("Bieu Do tron imex",data1);
    // alert(data1.userId);
    const arrPieChart = [];
    const checkArrChart = [];
    for (let itemPieChart in data.data) {
      arrPieChart.push({
        //Get genaral
        name: this.translateReportChart(itemPieChart),
        value: data.data[itemPieChart],
      });
    }
    arrPieChart.map(async (item) => {
      if (item.value === 0) {
        await checkArrChart.push(item);
      }
    });
    if (checkArrChart.length === arrPieChart.length) {
      this.setState({ checkDataChart: checkArrChart });
    }
    this.setState({
      dataPieChart: arrPieChart,
      dataTableChart: data.data,
    });
  };
  giveTop10DataExport = (dataExport) => {
    let top10DataExport = [];
    if (dataExport.length > 10) {
      for (let p = 0; p < 10; p++) {
        top10DataExport.push(dataExport[p]);
      }
    } else if (dataExport.length < 10) {
      for (let p = 0; p < dataExport.length; p++) {
        top10DataExport.push(dataExport[p]);
      }
    }
    return top10DataExport;
  };
  async componentDidMount() {
    // Get user from cookie
    this.getUser();
    this.getAllReports();
    this.getImportHistory();
    this.getReportPieChart();
    this.getImexBarChart();
    // this.getImexBarChart1();
    this.getImexBarChartWarehouse();
    this.getImexPieChart();
    // this.getImexPieChart1();
    this.getImexStatistics();
    this.getImexPieChartWareHouse();
    var user_cookies = await getUserCookies();
    // console.log("123 cookies", user_cookies);
    this.setState({
      user_current: user_cookies.user,
      checked: user_cookies.user.allowReport,
      userTypeCheck: user_cookies.user.userType,
    });
    let token = "Bearer " + user_cookies.token;
    // console.log("token", token);
    let params = {
      id: user_cookies.user.id,
    };
    setInterval(async () => {
      await callApi("POST", TOPEXPORTCYLINDER, params, token).then((res) => {
        const arrTopCylinder = [];
        //console.log(res.data.data.length);
        if (res.data.data.length < 5) {
          for (let i = 0; i < res.data.data.length; i++) {
            arrTopCylinder.push(res.data.data[i]);
          }
        } else {
          for (let i = 0; i < 5; i++) {
            arrTopCylinder.push(res.data.data[i]);
          }
        }
        // console.log("set interval", res.data.data);
        this.setState({
          listTopExportCylinder: arrTopCylinder,
        });
      });
    }, 5000);

    //this.renderDataPieChart()
    //console.log(user_cookies);
    //await this.getReportChart()
    this.apiReportTurnBackInfoAPIFUC();
    this.getChildAndNumberImportFunc();

    this.setDefaultSelectBoxExcel();
  }

  async setDefaultSelectBoxExcel() {
    let { user_current } = this.state;
    this.setState({
      current_input_type: user_current.userType,
      current_input_role: user_current.userRole,
    });
    this.filterParamsSelect(user_current.userType, user_current.userRole);
  }

  async getImportHistory() {
    let historyImport = await getHistoryImportAPI("to", 0);
    let sortHistoryImportDecs = [];
    let j = 0;
    for (let i = historyImport.data.length - 1; i >= 0; i--) {
      sortHistoryImportDecs[j] = historyImport.data[i];
      j++;
    }
    let historyExport = await getHistoryImportAPI("from", 0);
    let sortHistoryExportDecs = [];
    let n = 0;
    for (let m = historyExport.data.length - 1; m >= 0; m--) {
      sortHistoryExportDecs[n] = historyExport.data[m];
      n++;
    }
    let top10DataImport = await this.giveTop10DataExport(sortHistoryImportDecs);
    let top10DataExport = await this.giveTop10DataExport(sortHistoryExportDecs);
    this.setState({
      allDataImport: sortHistoryImportDecs,
      allDataExport: sortHistoryExportDecs,
      historyExport: top10DataExport,
      historyImport: top10DataImport,
    });
  }

  async getAllReports(
    startDate = this.state.startDateSubmit,
    endDate = this.state.endDateSubmit
  ) {
    let resultImport = await getReportByUserAPI({ startDate, endDate });
    if (resultImport.status === 200 || resultImport.status === 201) {
      if (resultImport.data.hasOwnProperty("err_msg")) {
        //let resultExport=await getReportByUserAPI("EXPORT");
        showToast(resultImport.data.err_msg);
      } else {
        this.setState({ resultImport: resultImport.data });
      }
    }
  }

  getChildAndNumberImportFunc = async (
    target_id = "",
    begin = this.state.startDate,
    end = this.state.endDate
  ) => {
    const dataChart = await getChildAndNumberImportAPI(target_id, begin, end);
    const arr = [];
    if (dataChart.status === 200 || dataChart.status === 201) {
      if (dataChart.data.hasOwnProperty("err_msg")) {
        showToast(dataChart.data.err_msg);
      } else {
        for (let itemPieChart in dataChart.data) {
          arr.push({
            name: this.translateReportChart(itemPieChart),
            bình: dataChart.data[itemPieChart],
            amt: 1200,
          });
        }
        this.setState({ dataBarChart: arr });
      }
    }
    // console.log("getChildAndNumberImportFunc", data);
  };
  getTopExportCylinder = async () => {
    var user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let params = {
      id: user_cookies.user.id,
    };
    await callApi("POST", TOPEXPORTCYLINDER, params, token).then((res) => {
      const arrTopCylinder = [];
      for (let i = 0; i < 10; i++) {
        arrTopCylinder.push(res.data.data[i]);
      }
      //  console.log("set interval:",arrTopCylinder);
      this.setState({
        listTopExportCylinder: arrTopCylinder,
      });
    });
  };
  getUser() {
    const { dispatch } = this.props;
    const user = dispatch(getCookie("user"));
    if (typeof user !== "undefined") this.setState({ user: JSON.parse(user) });
  }

  handleChange = (date, params) => {
    let dateFormat = date.format("MM/DD/YYYY");

    const { endDate, startDate } = this.state;
    console.log("aaaaaaaaaaaaa", date);
    console.log("aaaaaaaaaaaaa11111111", startDate);

    if (params === 0) {
      if (date <= endDate || endDate === "") {
        this.setState(
          {
            startDate: date,
            startDateSubmit: dateFormat,
          },
          () => {
            this.handleButtonChangeCalendar();
            this.getAllReports(
              this.state.startDateSubmit,
              this.state.endDateSubmit
            );
          }
        );
        return;
      }
      showToast("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return false;
    } else {
      if (date >= startDate || startDate === "") {
        this.setState(
          {
            endDate: date,
            endDateSubmit: dateFormat,
          },
          () => {
            this.getAllReports(
              this.state.startDateSubmit,
              this.state.endDateSubmit
            );
            this.handleButtonChangeCalendar();
          }
        );
        return;
      }
      showToast("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return false;
    }
  };
  updateAllowReport = async (checked) => {
    const data = await updateAllowReportApi(checked);
    let user_cookies = await getUserCookies();
    const { dispatch } = this.props;
    user_cookies.user.allowReport = data.data.allowReport;
    await dispatch(setCookie("user", user_cookies));
    // console.log(data);
  };

  handleChangeReport = (checked) => {
    // console.log(checked);
    this.setState({ checked }, () => {
      this.updateAllowReport(this.state.checked);
    });
  };

  renderButtonIsPublic() {
    if (!!this.state.user) {
      if (
        this.state.user.user.owner ||
        (this.state.user.user.userType === "Factory" &&
          this.state.user.user.userRole === "SuperAdmin")
      ) {
        return null;
      } else
        return (
          <div
            className="form-group"
            style={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <label style={{ width: 150 }}>Mở cho TNSH xem</label>
            <Switch
              onChange={this.handleChangeReport}
              checked={this.state.checked}
            />
          </div>
        );
    } else {
      return null;
    }
  }

  apiReportTurnBackInfoAPIFUC = async (
    target_id = "",
    factory_id = "",
    startDate = this.state.startDateSubmit,
    endDate = this.state.endDateSubmit
  ) => {
    const data = await apiReportTurnBackInfoAPI(
      target_id,
      factory_id,
      startDate,
      endDate
    );
    this.setState({
      infoReportTurnback: data.data,
    });
    // console.log("apiReportTurnBackInfo", data.data);
  };
  getReportPieChartWhenClick = async (id, parentRoot, type) => {
    const data = await getReportPieChartAPI(id, parentRoot, type);
    console.log("Data getReportPieChartAPI", data);
    const arrPieChart = [];
    const checkArrChart = [];
    console.log("data.data11111111111111111111111", data.data.data);
    for (let itemPieChart in data.data) {
      arrPieChart.push({
        name: this.translateReportChart(itemPieChart),
        value: data.data[itemPieChart],
      });
    }
    arrPieChart.map(async (item) => {
      if (item.value === 0) {
        await checkArrChart.push(item);
      }
    });
    if (checkArrChart.length === arrPieChart.length) {
      this.setState({ checkDataChart: checkArrChart });
    } else {
      this.setState({ checkDataChart: [] });
    }
    console.log("arrPieChart", arrPieChart);
    this.setState({
      dataPieChart: arrPieChart,
      dataTableChart: data.data,
    });
  };

  handleButtonChangeCalendar = async () => {
    if (this.state.user_current.userType === "General") {
      await this.apiReportTurnBackInfoAPIFUC(
        this.state.itemDataObject5.id,
        this.state.itemDataObject5.parentRoot,
        this.state.startDateSubmit,
        this.state.endDateSubmit
      );
    } else {
      if (this.state.dataObjectCheckedID1 === "") {
        await this.apiReportTurnBackInfoAPIFUC(
          this.state.user_current.id,
          this.state.user_current.parentRoot,
          this.state.startDateSubmit,
          this.state.endDateSubmit
        );
      } else if (this.state.dataObjectCheckedIDChild === 0) {
        await this.apiReportTurnBackInfoAPIFUC(
          this.state.itemData.id,
          this.state.itemData.parentRoot,
          this.state.startDateSubmit,
          this.state.endDateSubmit
        );
      } else if (this.state.dataObjectCheckedIDChild !== 0) {
        if (this.state.dataObjectCheckedTNMBFACID === "") {
          await this.apiReportTurnBackInfoAPIFUC(
            this.state.itemData.id,
            this.state.itemData.parentRoot,
            this.state.startDateSubmit,
            this.state.endDateSubmit
          );
        } else {
          if (this.state.dataObjectCheckedIDChild === 1) {
            if (
              this.state.dataObjectCheckedGENARALID === 0 ||
              this.state.dataObjectAgencyGeneralID === ""
            ) {
              await this.apiReportTurnBackInfoAPIFUC(
                this.state.itemDataObject4.id,
                this.state.itemDataObject4.parentRoot,
                this.state.startDateSubmit,
                this.state.endDateSubmit
              );
            } else {
              await this.apiReportTurnBackInfoAPIFUC(
                this.state.itemDataObject5.id,
                this.state.itemDataObject5.parentRoot,
                this.state.startDateSubmit,
                this.state.endDateSubmit
              );
            }
          } else {
            await this.apiReportTurnBackInfoAPIFUC(
              this.state.itemDataObject4.id,
              this.state.itemDataObject4.parentRoot,
              this.state.startDateSubmit,
              this.state.endDateSubmit
            );
          }
        }
      }
    }
  };
  handleButtonFindDataChart = async () => {
    // console.log(
    //   "this.state.dataObjectCheckedIDChild",
    //   this.state.dataObjectCheckedIDChild
    // );
    console.log("startDate", this.state.startDate.toISOString());
    console.log("endDate", this.state.endDate);
    console.log("user_current", this.state.user_current);
    console.log("user_current", this.state.checked);
    console.log("user_current", this.state.userTypeCheck);
    console.log("dataObjectChecked", this.state.dataObjectChecked);
    console.log("dataObject11111111111", this.state.objectData);

    console.log("dataObjectCheckedChild", this.state.dataObjectCheckedChild);
    console.log("itemDataObject5", this.state.itemDataObject5);
    console.log("itemDataObject5", this.state.itemData);
    console.log("itemDataObject511111111111111", this.state.dataChild1);
    //console.log("itemDataObject522222222",this.state.dataObjectChecked1);
    console.log("itemDataObject522222222", this.state.dataObjectCheckedID1);
    //console.log("itemDataObject53333333",this.state.itemData);
    console.log("this.state.startDate", this.state.startDate.toDate());
    // console.log("this.state.startDate",this.state.startDate,typeof this.state.startDate,
    // new Date(this.state.startDate.toUTCString()).setHours(0,0,0,0));
    let startDate = this.state.startDate.toDate().setHours(0, 0, 0, 0);
    let endDate = this.state.endDate.toDate().setHours(23, 59, 59, 999);
    //let target = this.state.objectData;
    // let target= this.state.dataObjectCheckedID1;
    // let statisticalType=this.state.dataObjectChecked.value===0?"byItsChildren" :"byItself";
    let statisticalType =
      this.state.dataObjectChecked.value === 0 &&
      this.state.user_current.userType === "Factory" &&
      this.state.user_current.userRole === "SuperAdmin"
        ? "byItsChildren"
        : this.state.dataObjectChecked.value === 0 &&
          this.state.user_current.userType === "Factory" &&
          this.state.user_current.userRole === "Owner"
        ? "byItself"
        : "byItself";
    // let data = await imexGetStatistics(endDate,startDate,target,statisticalType);
    // this.setState({
    //   dataImexGetStatisticsTotal:data.data.data.createdCylinder.total,
    //   dataImexGetStatisticsTotal_12kg:data.data.data.createdCylinder.total_CYL12KG+data.data.data.createdCylinder.total_CYL12KGCO,
    //   dataImexGetStatisticsTotal_45Kg:data.data.data.createdCylinder.total_CYL45KG,
    //   dataImexGetStatisticsTotal_50Kg:data.data.data.createdCylinder.total_CYL50KG,
    //   dataImexGetStatisticsInventoryCylinder_Total:data.data.data.inventoryCylinder.total,
    //   dataImexGetStatisticsInventoryCylinder_Total_12kg:data.data.data.inventoryCylinder.total_CYL12KG+data.data.data.inventoryCylinder.total_CYL12KGCO,
    //   dataImexGetStatisticsInventoryCylinder_Total_45kg:data.data.data.inventoryCylinder.total_CYL45KG,
    //   dataImexGetStatisticsInventoryCylinder_Total_50kg:data.data.data.inventoryCylinder.total_CYL50KG,
    //   dataImexGetStatisticsOutCylinder_Total :data.data.data.outCylinder.total,
    //   dataImexGetStatisticsOutCylinder_Total_12kg :data.data.data.outCylinder.total_CYL12KG+data.data.data.outCylinder.total_CYL12KGCO,
    //   dataImexGetStatisticsOutCylinder_Total_45kg :data.data.data.outCylinder.total_CYL45KG,
    //   dataImexGetStatisticsOutCylinder_Total_50kg :data.data.data.outCylinder.total_CYL50KG,
    //   dataImexGetStatisticsTurnbackCylinder_Total :data.data.data.turnbackCylinder.total,
    //   dataImexGetStatisticsTurnbackCylinder_Total_12kg :data.data.data.turnbackCylinder.total_CYL12KG+data.data.data.turnbackCylinder.total_CYL12KGCO,
    //   dataImexGetStatisticsTurnbackCylinder_Total_45kg :data.data.data.turnbackCylinder.total_CYL45KG,
    //   dataImexGetStatisticsTurnbackCylinder_Total_50kg :data.data.data.turnbackCylinder.total_CYL50KG,
    // });
    let data = "";
    if (this.state.user_current.userType === "General") {
      await this.getReportPieChartWhenClick(
        this.state.itemDataObject5.id,
        this.state.itemDataObject5.parentRoot,
        1
      );
      this.state.dataObjectChecked.value === 0
        ? await this.getImexBarChart(
            this.state.itemDataObject5.id,
            startDate,
            endDate
          )
        : await this.getImexBarChart1(
            this.state.itemDataObject5.id,
            startDate,
            endDate
          );
      this.state.dataObjectChecked.value === 0
        ? await this.getImexPieChart(this.state.itemDataObject5.id, endDate)
        : await this.getImexPieChart1(this.state.itemDataObject5.id, endDate);

      await imexGetStatistics(
        new Date(endDate).toISOString(),
        new Date(startDate).toISOString(),
        this.state.itemDataObject5.id,
        statisticalType
      );
    } else {
      if (this.state.dataObjectCheckedID === 0) {
        await this.apiReportTurnBackInfoAPIFUC(
          this.state.user_current.id,
          this.state.user_current.parentRoot,
          this.state.startDateSubmit,
          this.state.endDateSubmit
        );
        await this.getChildAndNumberImportFunc(
          this.state.user_current.id,
          this.state.startDate,
          this.state.endDate
        );

        this.state.dataObjectChecked.value === 0 &&
        this.state.user_current.userType === "Factory" &&
        this.state.user_current.userRole === "SuperAdmin"
          ? await this.getImexBarChart(
              this.state.user_current.id,
              startDate,
              endDate
            )
          : this.state.dataObjectChecked.value !== 0 &&
            this.state.user_current.userType === "Factory" &&
            this.state.user_current.userRole === "SuperAdmin"
          ? await this.getImexBarChart1(
              this.state.user_current.id,
              startDate,
              endDate
            )
          : await this.getImexBarChartWarehouse(
              this.state.user_current.id,
              startDate,
              endDate
            );

        this.state.dataObjectChecked.value === 0 &&
        this.state.user_current.userType === "Factory" &&
        this.state.user_current.userRole === "SuperAdmin"
          ? await this.getImexPieChart(this.state.user_current.id, endDate)
          : this.state.dataObjectChecked.value !== 0 &&
            this.state.user_current.userType === "Factory" &&
            this.state.user_current.userRole === "SuperAdmin"
          ? await this.getImexPieChart1(this.state.user_current.id, endDate)
          : await this.getImexPieChartWareHouse(
              this.state.user_current.id,
              endDate
            );
        // this.state.dataObjectChecked.value === 0
        //   ? await this.getImexPieChart(this.state.user_current.id, endDate)
        //   : await this.getImexPieChart1(this.state.user_current.id, endDate);

        data = await imexGetStatistics(
          new Date(endDate).toISOString(),
          new Date(startDate).toISOString(),
          this.state.user_current.id,
          statisticalType
        );
      }
      if (this.state.dataObjectCheckedID1 === "") {
        //gọi chính nó đang đăng nhập
        await this.getReportPieChartWhenClick(
          this.state.user_current.id,
          this.state.user_current.parentRoot,
          1
        );
        await this.getChildAndNumberImportFunc(
          this.state.user_current.id,
          this.state.startDate,
          this.state.endDate
        );
        this.state.dataObjectChecked.value === 0 &&
        this.state.user_current.userType === "Factory" &&
        this.state.user_current.userRole === "SuperAdmin"
          ? await this.getImexBarChart(
              this.state.user_current.id,
              startDate,
              endDate
            )
          : this.state.dataObjectChecked.value !== 0 &&
            this.state.user_current.userType === "Factory" &&
            this.state.user_current.userRole === "SuperAdmin"
          ? await this.getImexBarChart1(
              this.state.user_current.id,
              startDate,
              endDate
            )
          : await this.getImexBarChartWarehouse(
              this.state.user_current.id,
              startDate,
              endDate
            );

        this.state.dataObjectChecked.value === 0 &&
        this.state.user_current.userType === "Factory" &&
        this.state.user_current.userRole === "SuperAdmin"
          ? await this.getImexPieChart(this.state.user_current.id, endDate)
          : this.state.dataObjectChecked.value !== 0 &&
            this.state.user_current.userType === "Factory" &&
            this.state.user_current.userRole === "SuperAdmin"
          ? await this.getImexPieChart1(this.state.user_current.id, endDate)
          : await this.getImexPieChartWareHouse(
              this.state.user_current.id,
              endDate
            );

        // this.state.dataObjectChecked.value === 0
        //   ? await this.getImexBarChart(this.state.user_current.id, startDate, endDate)
        //   : await this.getImexBarChart1(this.state.user_current.id, startDate, endDate);
        // this.state.dataObjectChecked.value === 0
        //   ? await this.getImexPieChart(this.state.user_current.id,endDate)
        //   : await this.getImexPieChart1(this.state.user_current.id, endDate);
        data = await imexGetStatistics(
          new Date(endDate).toISOString(),
          new Date(startDate).toISOString(),
          this.state.user_current.id,
          statisticalType
        );
      } else if (this.state.dataObjectCheckedIDChild === 0) {
        await this.getReportPieChartWhenClick(
          this.state.itemData.id,
          this.state.itemData.parentRoot,
          1
        );
        await this.getChildAndNumberImportFunc(
          this.state.itemData.id,
          this.state.startDate,
          this.state.endDate
        );

        this.state.dataObjectChecked.value === 0
          ? await this.getImexBarChart(
              this.state.itemData.id,
              startDate,
              endDate
            )
          : await this.getImexBarChart1(
              this.state.itemData.id,
              startDate,
              endDate
            );
        this.state.dataObjectChecked.value === 0
          ? await this.getImexPieChart(this.state.itemData.id)
          : await this.getImexPieChart1(this.state.itemData.id, endDate);

        data = await imexGetStatistics(
          new Date(endDate).toISOString(),
          new Date(startDate).toISOString(),
          this.state.itemData.id,
          statisticalType
        );
      } else if (this.state.dataObjectCheckedIDChild !== 0) {
        if (this.state.dataObjectCheckedTNMBFACID === "") {
          await this.getReportPieChartWhenClick(
            this.state.itemData.id,
            this.state.itemData.parentRoot,
            1
          );
          await this.getChildAndNumberImportFunc(
            this.state.itemData.id,
            this.state.startDate,
            this.state.endDate
          );

          this.state.dataObjectChecked.value === 0
            ? await this.getImexBarChart(
                this.state.itemData.id,
                startDate,
                endDate
              )
            : await this.getImexBarChart1(
                this.state.itemData.id,
                startDate,
                endDate
              );
          this.state.dataObjectChecked.value === 0
            ? await this.getImexPieChart(this.state.itemData.id, endDate)
            : await this.getImexPieChart1(this.state.itemData.id, endDate);

          data = await imexGetStatistics(
            new Date(endDate).toISOString(),
            new Date(startDate).toISOString(),
            this.state.itemData.id,
            statisticalType
          );
        } else {
          if (this.state.dataObjectCheckedIDChild === 1) {
            if (
              this.state.dataObjectCheckedGENARALID === 0 ||
              this.state.dataObjectAgencyGeneralID === ""
            ) {
              await this.getReportPieChartWhenClick(
                this.state.itemDataObject4.id,
                this.state.itemDataObject4.parentRoot,
                1
              );
              await this.getChildAndNumberImportFunc(
                this.state.itemDataObject4.id,
                this.state.startDate,
                this.state.endDate
              );
              this.state.dataObjectChecked.value === 0
                ? await this.getImexBarChart(
                    this.state.itemDataObject4.id,
                    startDate,
                    endDate
                  )
                : await this.getImexBarChart1(
                    this.state.itemDataObject4.id,
                    startDate,
                    endDate
                  );
              this.state.dataObjectChecked.value === 0
                ? await this.getImexPieChart(
                    this.state.itemDataObject4.id,
                    endDate
                  )
                : await this.getImexPieChart1(
                    this.state.itemDataObject4.id,
                    endDate
                  );

              data = await imexGetStatistics(
                new Date(endDate).toISOString(),
                new Date(startDate).toISOString(),
                this.state.itemDataObject4.id,
                statisticalType
              );
            } else {
              await this.getReportPieChartWhenClick(
                this.state.itemDataObject5.id,
                this.state.itemDataObject5.parentRoot,
                1
              );

              await this.getChildAndNumberImportFunc(
                this.state.itemDataObject5.id,
                this.state.startDate,
                this.state.endDate
              );

              this.state.dataObjectChecked.value === 0
                ? await this.getImexBarChart(
                    this.state.itemDataObject5.id,
                    startDate,
                    endDate
                  )
                : await this.getImexBarChart1(
                    this.state.itemDataObject5.id,
                    startDate,
                    endDate
                  );

              this.state.dataObjectChecked.value === 0
                ? await this.getImexPieChart(
                    this.state.itemDataObject5.id,
                    endDate
                  )
                : await this.getImexPieChart1(
                    this.state.itemDataObject5.id,
                    endDate
                  );

              data = await imexGetStatistics(
                new Date(endDate).toISOString(),
                new Date(startDate).toISOString(),
                this.state.itemDataObject5.id,
                statisticalType
              );
            }
          } else {
            await this.getReportPieChartWhenClick(
              this.state.itemDataObject4.id,
              this.state.itemDataObject4.parentRoot,
              1
            );
            await this.getChildAndNumberImportFunc(
              this.state.itemDataObject4.id,
              this.state.startDate,
              this.state.endDate
            );
            this.state.dataObjectChecked.value === 0
              ? await this.getImexBarChart(
                  this.state.itemDataObject4.id,
                  startDate,
                  endDate
                )
              : await this.getImexBarChart1(
                  this.state.itemDataObject4.id,
                  startDate,
                  endDate
                );

            this.state.dataObjectChecked.value === 0
              ? await this.getImexPieChart(
                  this.state.itemDataObject4.id,
                  endDate
                )
              : await this.getImexPieChart1(
                  this.state.itemDataObject4.id,
                  endDate
                );

            data = await imexGetStatistics(
              new Date(endDate).toISOString(),
              new Date(startDate).toISOString(),
              this.state.itemDataObject4.id,
              statisticalType
            );
          }
        }
      }
    }
    console.log("this.state.startDate1111111111111111", data);
    this.setState({
      dataImexGetStatisticsTotal: data.data.data.createdCylinder.total,
      dataImexGetStatisticsTotal_12kg:
        data.data.data.createdCylinder.total_CYL12KG +
        data.data.data.createdCylinder.total_CYL12KGCO,
      dataImexGetStatisticsTotal_45Kg:
        data.data.data.createdCylinder.total_CYL45KG,
      dataImexGetStatisticsTotal_50Kg:
        data.data.data.createdCylinder.total_CYL50KG,
      dataImexGetStatisticsInventoryCylinder_Total:
        data.data.data.inventoryCylinder.total,
      dataImexGetStatisticsInventoryCylinder_Total_12kg:
        data.data.data.inventoryCylinder.total_CYL12KG +
        data.data.data.inventoryCylinder.total_CYL12KGCO,
      dataImexGetStatisticsInventoryCylinder_Total_45kg:
        data.data.data.inventoryCylinder.total_CYL45KG,
      dataImexGetStatisticsInventoryCylinder_Total_50kg:
        data.data.data.inventoryCylinder.total_CYL50KG,
      dataImexGetStatisticsOutCylinder_Total: data.data.data.outCylinder.total,
      dataImexGetStatisticsOutCylinder_Total_12kg:
        data.data.data.outCylinder.total_CYL12KG +
        data.data.data.outCylinder.total_CYL12KGCO,
      dataImexGetStatisticsOutCylinder_Total_45kg:
        data.data.data.outCylinder.total_CYL45KG,
      dataImexGetStatisticsOutCylinder_Total_50kg:
        data.data.data.outCylinder.total_CYL50KG,
      dataImexGetStatisticsTurnbackCylinder_Total:
        data.data.data.turnbackCylinder.total,
      dataImexGetStatisticsTurnbackCylinder_Total_12kg:
        data.data.data.turnbackCylinder.total_CYL12KG +
        data.data.data.turnbackCylinder.total_CYL12KGCO,
      dataImexGetStatisticsTurnbackCylinder_Total_45kg:
        data.data.data.turnbackCylinder.total_CYL45KG,
      dataImexGetStatisticsTurnbackCylinder_Total_50kg:
        data.data.data.turnbackCylinder.total_CYL50KG,
    });
  };

  handleButtonExportExcel = async () => {
    let dataList = [];
    //console.log("this.state.dataObjectCheckedIDChild", this.state.dataObjectCheckedIDChild);
    let { dataValueReports } = this.state;
    if (!dataValueReports) {
      showToast("Vui Lòng Chọn Kiểu Xuất Excel!!");
      return;
    }
    // console.log("vaoday");

    if (this.state.user_current.userType === "General") {
      await getReportExcelByTargetAndDateTimeAPI(
        [this.state.itemDataObject5.id],
        this.state.dataValueReports,
        this.state.startDateSubmit,
        this.state.endDateSubmit
      );
      //await this.getReportPieChartWhenClick(this.state.itemDataObject5.id, this.state.itemDataObject5.parentRoot, 1)
    } else {
      if (this.state.dataObjectCheckedID === 0) {
        await getReportExcelByTargetAndDateTimeAPI(
          [this.state.user_current.id],
          this.state.dataValueReports,
          this.state.startDateSubmit,
          this.state.endDateSubmit
        );
        return;
      }
      if (this.state.dataObjectCheckedID1 === "") {
        //chưa chọn cấp 1
        dataList = this.state.dataChild1.map((item) => {
          if (item.value !== "") {
            return item.value;
          }
        });
        dataList = dataList.filter((x) => !!x);
        await getReportExcelByTargetAndDateTimeAPI(
          dataList,
          this.state.dataValueReports,
          this.state.startDateSubmit,
          this.state.endDateSubmit
        );
      } else if (this.state.dataObjectCheckedIDChild === 0) {
        //luc nay đã chọn cấp 1 và chọn cấp 2 tất cả
        await getReportExcelByTargetAndDateTimeAPI(
          [this.state.itemData.id],
          this.state.dataValueReports,
          this.state.startDateSubmit,
          this.state.endDateSubmit
        );
      } else if (this.state.dataObjectCheckedIDChild !== 0) {
        //luc nay da chon cap 1 va cap 2
        if (this.state.dataObjectCheckedTNMBFACID === "") {
          dataList = this.state.dataChild3.map((item) => {
            if (item.value !== "") {
              return item.value;
            }
          });
          dataList = dataList.filter((x) => !!x);
          await getReportExcelByTargetAndDateTimeAPI(
            dataList,
            this.state.dataValueReports,
            this.state.startDateSubmit,
            this.state.endDateSubmit
          );
        } else {
          if (this.state.dataObjectCheckedIDChild === 1) {
            //chon lien tnmb

            if (
              this.state.dataObjectCheckedGENARALID === 0 ||
              this.state.dataObjectCheckedGENARALID === ""
            ) {
              await getReportExcelByTargetAndDateTimeAPI(
                [this.state.dataObjectCheckedTNMBFAC.value],
                this.state.dataValueReports,
                this.state.startDateSubmit,
                this.state.endDateSubmit
              );
            } else {
              if (this.state.dataObjectAgencyGeneralID === "") {
                dataList = this.state.dataChild4.map((item) => {
                  if (item.value !== "") {
                    return item.value;
                  }
                });
                dataList = dataList.filter((x) => !!x);
                await getReportExcelByTargetAndDateTimeAPI(
                  dataList,
                  this.state.dataValueReports,
                  this.state.startDateSubmit,
                  this.state.endDateSubmit
                );
              } else
                await getReportExcelByTargetAndDateTimeAPI(
                  [this.state.itemDataObject5.id],
                  this.state.dataValueReports,
                  this.state.startDateSubmit,
                  this.state.endDateSubmit
                );
            }
          } else {
            if (
              this.state.dataObjectChecked1 === 0 ||
              this.state.dataObjectChecked1 === ""
            ) {
              dataList = this.state.dataChild4.map((item) => {
                if (item.value !== "") {
                  return item.value;
                }
              });
              dataList = dataList.filter((x) => !!x);
              await getReportExcelByTargetAndDateTimeAPI(
                dataList,
                this.state.dataValueReports,
                this.state.startDateSubmit,
                this.state.endDateSubmit
              );
            } else {
              await getReportExcelByTargetAndDateTimeAPI(
                [this.state.itemDataObject4.id],
                this.state.dataValueReports,
                this.state.startDateSubmit,
                this.state.endDateSubmit
              );
            }
          }
        }
      }
    }

    // //selectedId
    // console.log(this.state.selectedId);

    // //valueReports
    // console.log(this.state.dataValueReports);

    // //StartDate
    // console.log(this.state.startDateSubmit);
    // //EndDate

    // console.log(this.state.endDateSubmit);
  };

  //TODO đưa vào lúc select đối tượng.
  filterParamsSelect = async (userType, userRole = "") => {
    let valueReports = [];

    switch (userType) {
      case "Factory":
        if (userRole === "SuperAdmin") {
          valueReports = [...ACTION_REPORT_TYPE];
          // if (!!valueReports) {
          //   valueReports[0].label = "Nhập Vỏ1";
          // }
        } else {
          valueReports = ACTION_REPORT_TYPE.filter(
            (x) =>
              [
                "EXPORT",
                "IMPORT_CELL",
                "FIX",
                "TURN_BACK",
                "CREATE",
                "EXPORT_CELL",
              ].includes(x.value) === true
          );
          valueReports = [...valueReports];
          if (!!valueReports) {
            valueReports[0].label = this.props.t("EXPORT");
            //valueReports[5].label="Xuất vỏ"
            valueReports.push(
              {
                value: "SYNTHESIS_REPORT_CREATE",
                label: "BCT bình đã tạo",
              },
              {
                value: "SYNTHESIS_REPORT_DELIVERY",
                label: "BCT giao nhận bình",
              }
            );
          }
        }
        break;
      case "General":
        valueReports = ACTION_REPORT_TYPE.filter(
          (x) => ["EXPORT", "IMPORT", "TURN_BACK"].includes(x.value) === true
        );
        valueReports = [...valueReports];
        valueReports[0].label = "Nhập Hàng";
        break;
      case "Agency":
        valueReports = ACTION_REPORT_TYPE.filter(
          (x) => ["EXPORT", "IMPORT", "TURN_BACK"].includes(x.value) === true
        );
        valueReports = [...valueReports];
        valueReports[0].label = "Nhập Hàng";
        break;
      case "Fixer":
        valueReports = ACTION_REPORT_TYPE.filter(
          (x) =>
            ["EXPORT_CELL", "IMPORT", "TURN_BACK"].includes(x.value) === true
        );
        valueReports = [...valueReports];
        valueReports[0].label = "Nhập Vỏ";
        break;
      default:
        if (userRole === SuperAdmin) {
          valueReports = [...ACTION_REPORT_TYPE];
        } else {
          valueReports = ACTION_REPORT_TYPE.filter(
            (x) =>
              ["EXPORT", "IMPORT", "FIX", "TURN_BACK"].includes(x.value) ===
              true
          );
        }
        break;
    }
    this.setState({ valueReports });
  };

  //đối tượng 1
  changeDataChoose1 = async (userType = "", user_id) => {
    //{ label: "Chi nhánh trực thuộc", value: "" }
    const arrData = [];
    const data = await getReportChildsAPI(userType, user_id);
    data.data.map((item) => {
      arrData.push({ label: item.name, value: item.id, itemData: item });
    });
    this.setState({ dataChild1: arrData });
    console.log("33333333333333333333333333333333333333333333", data);
  };
  handleObjectPickTypeOfReportExcel = async (value) => {
    this.setState({
      actionTypeReportExcel: value.value,
      dataValueReports: value.value,
    });
  };

  handleObjectData1 = async (langValue) => {
    this.resetData(2);
    this.setState(
      {
        dataObjectChecked1: langValue,
        dataObjectCheckedID1: langValue.value,
        itemData: langValue.itemData,
        dataObjectCheckedIDChild: 0,
        selectedId: langValue.value,
      },
      () => {
        !!this.state.dataObjectChecked1.itemData
          ? this.filterParamsSelect(
              this.state.dataObjectChecked1.itemData.userType,
              this.state.dataObjectChecked1.itemData.userRole
            )
          : "";
      }
    );
  };
  handleObjectData = async (langValue) => {
    this.resetData(1);
    this.setState(
      { dataObjectChecked: langValue, dataObjectCheckedID: langValue.value },
      () => {
        // console.log(this.state.dataObjectCheckedID);
        if (this.state.dataObjectCheckedID !== 0) {
          this.changeDataChoose1(langValue.name, this.state.user_current.id);

          this.filterParamsSelect(langValue.name, null);
        } else {
          this.getReportPieChartWhenClick("", "", 0);
          let { user_current } = this.state;
          this.filterParamsSelect(user_current.userType, user_current.userRole);
        }
      }
    );
  };

  handleObjectDataChild = async (langValue) => {
    this.resetData(3);
    this.setState(
      {
        dataObjectCheckedChild: langValue,
        dataObjectCheckedIDChild: langValue.value,
      },
      () => {
        this.changeDataChoose4(langValue.name, this.state.itemData.id);
        if (langValue.value === 0) {
          this.filterParamsSelect(
            !!this.state.dataObjectChecked
              ? this.state.dataObjectChecked.name
              : "Factory",
            ""
          );
        } else {
          this.filterParamsSelect(langValue.name, null);
        }
      }
    );
  };
  handleObjectDataChildCTC = async (langValue) => {
    this.resetData(2);
    this.setState(
      {
        dataObjectCheckedChild: langValue,
        dataObjectCheckedIDChild: langValue.value,
        //label: "Chi nhánh trực thuộc", value: 0
        dataObjectCheckedTNMBFAC: {},
      },
      () => {
        this.changeDataChoose4(langValue.name, this.state.user_current.id);
        if (langValue.value === 0) {
          this.filterParamsSelect(user_current.userType, user_current.userRole);
        } else {
          this.filterParamsSelect(langValue.name, null);
        }
        //this.filterParamsSelect(langValue.name,null);
      }
    );
  };
  //đối tượng 4

  changeDataChoose4 = async (userType = "", user_id) => {
    //{ label: "Chi nhánh trực thuộc", value: "" }
    const arrData = [];
    const data = await getReportChildsAPI(userType, user_id);
    data.data.map((item) => {
      arrData.push({ label: item.name, value: item.id, itemData: item });
    });
    //dataChild3 cấp 3
    this.setState({ dataChild3: arrData });
  };
  handleObjectDataChildTNMB = async (langValue) => {
    this.resetData(3);
    this.setState(
      {
        dataObjectCheckedTNMBFAC: langValue,
        dataObjectCheckedTNMBFACID: langValue.value,
        itemDataObject4: langValue.itemData,
        selectedId: langValue.value,
      },
      () => {
        !!this.state.dataObjectCheckedTNMBFAC.itemData
          ? this.filterParamsSelect(
              this.state.dataObjectCheckedTNMBFAC.itemData.userType,
              this.state.dataObjectCheckedTNMBFAC.itemData.userRole
            )
          : "";
      }
    );
  };

  //handleObjectDataGENARALFAC
  handleObjectDataGENARALFAC = async (langValue) => {
    this.resetData(3);
    this.setState(
      {
        dataObjectCheckedGENARAL: langValue,
        dataObjectCheckedGENARALID: langValue.value,
      },
      () => {
        this.changeDataChoose5(
          langValue.name,
          this.state.dataObjectCheckedTNMBFACID
        );
        if (langValue.value === 0) {
          this.filterParamsSelect(
            !!this.state.dataObjectCheckedChild
              ? this.state.dataObjectCheckedChild.name
              : "Factory",
            ""
          );
        } else {
          this.filterParamsSelect(langValue.name, null);
        }
      }
    );
  };

  //Genaral login
  handleObjectDataGENARAL = async (langValue) => {
    this.resetData(3);
    this.setState(
      {
        dataObjectCheckedGENARAL: langValue,
        dataObjectCheckedGENARALID: langValue.value,
      },
      () => {
        this.changeDataChoose5(langValue.name, this.state.user_current.id);
        if (langValue.value === 0) {
          this.filterParamsSelect(user_current.userType, user_current.userRole);
        } else {
          this.filterParamsSelect(langValue.name, null);
        }
      }
    );
  };
  changeDataChoose5 = async (userType = "", user_id) => {
    //{ label: "Chi nhánh trực thuộc", value: "" }
    const arrData = [];
    const data = await getReportChildsAPI(userType, user_id);
    data.data.map((item) => {
      arrData.push({ label: item.name, value: item.id, itemData: item });
    });
    //dataChild4 cấp 4
    this.setState({ dataChild4: arrData });
  };
  handleObjectDataAgencyGeneral = async (langValue) => {
    this.setState(
      {
        dataObjectAgencyGeneral: langValue,
        dataObjectAgencyGeneralID: langValue.value,
        itemDataObject5: langValue.itemData,
        selectedId: langValue.value,
        dataValueReports: "",
      },
      () => {
        !!this.state.dataObjectAgencyGeneral.itemData
          ? this.filterParamsSelect(
              this.state.dataObjectAgencyGeneral.itemData.userType,
              this.state.dataObjectAgencyGeneral.itemData.userRole
            )
          : "";
      }
    );
  };
  callDataTurnBackInfo = async (data) => {
    const dataTurnBack = await callDataTurnBackInfoAPI(data);
    if (dataTurnBack.status === 200 || dataTurnBack.status === 201) {
      this.setState({ dataTurnBacks: dataTurnBack.data });
    }
  };

  renderBarChart() {
    // console.log(
    //   "sdasdasd",
    //   this.state.itemData,
    //   this.state.itemDataObject4,
    //   this.state.itemDataObject5
    // );
    if (
      this.state.itemData.userType === Constants.AGENCY ||
      this.state.itemDataObject4.userType === Constants.AGENCY ||
      this.state.itemDataObject5.userType === Constants.AGENCY
    ) {
      return null;
    } else {
      return (
        <div className="card card-body">
          {/* <ShowBarChart dataBarChart={this.state.dataImexBarGetExport} /> */}
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              height={500}
              data={this.state.dataImexBarGetExportWarehouse}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" label={<Text width={30} />} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bình" barSize={15} fill="#1890FF" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <label> {this.props.t("DELIVERY_CHART")} </label>
          </div>
        </div>
      );
    }
  }
  renderImexBarChart() {
    // console.log(
    //   "sdasdasd",
    //   this.state.itemData,
    //   this.state.itemDataObject4,
    //   this.state.itemDataObject5
    // );
    if (
      this.state.itemData.userType === Constants.AGENCY ||
      this.state.itemDataObject4.userType === Constants.AGENCY ||
      this.state.itemDataObject5.userType === Constants.AGENCY
    ) {
      return null;
    } else {
      return (
        <div className="card card-body">
          {/* <ShowBarChart dataBarChart={this.state.dataImexBarGetExport} /> */}
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              height={500}
              data={this.state.dataImexBarGetExport}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide="true"></XAxis>
              <YAxis />
              <Tooltip />
              <Bar dataKey="bình" barSize={15} fill="#1890FF">
                <LabelList dataKey="name" position="bottom" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <label> {this.props.t("DELIVERY_CHART")} </label>
          </div>
        </div>
      );
    }
  }
  render() {
    const { user_current } = this.state;
    const { resultImport, historyExport, historyImport } = this.state;
    // console.log("lich su import",historyImport);
    // console.log("lich su export",historyExport);
    //this._getArrayColor(12)
    return (
      <div>
        <main className="main-container container" id="mainContent">
          <div className="main-content">
            <div className="seednet-header-info allow__btn">
              {this.renderButtonIsPublic()}
            </div>

            <div className="row">
              <div className="card col-lg-12">
                <div className="card-title">
                  <div className="flexbox">
                    <h4> {this.props.t("STATISTICAL")} </h4>
                  </div>
                </div>
                <div className="card-body">
                  <div className="form-row">
                    <div className="start-date-picker-dashboard date__block col-lg-6 form-group row">
                      <label className="col-form-label start-day">
                        {this.props.t("START_DATE")}
                      </label>
                      <DatePicker
                        showPopperArrow={false}
                        selected={this.state.startDate}
                        onChange={(date) => this.handleChange(date, 0)}
                        showMonthDropdown
                        showYearDropdown
                        dateFormat="DD/MM/YYYY"
                        dropdownMode="select"
                        locale="vi"
                      />
                    </div>
                    <div className="end-date-picker-dashboard date__block col-lg-6 form-group row">
                      <label className="start-day col-form-label">
                        {this.props.t("END_DATE")}
                      </label>
                      <DatePicker
                        showPopperArrow={false}
                        selected={this.state.endDate}
                        onChange={(date) => this.handleChange(date, 1)}
                        showMonthDropdown
                        showYearDropdown
                        // dateFormat="YYYY/MM/DD"
                        dropdownMode="select"
                      />
                    </div>
                  </div>
                  <div className="form-row ">
                    {/* <label className="col-form-label">Đối tượng</label> */}
                    <div
                      className="col-lg-6 form-group select-dashboard-input-dashboard"
                      style={{ padding: 0 }}
                    >
                      {user_current.userType === "Factory" &&
                      user_current.userRole === "SuperAdmin" ? (
                        // <div className="select-dashboard-input-dashboard pr-4">

                        <div
                          className="form-group row "
                          style={{ marginLeft: "6px" }}
                        >
                          <label className="col-form-label">
                            {" "}
                            {this.props.t("OBJECT")}
                          </label>
                          <Select
                            options={this.state.objectData}
                            onChange={this.handleObjectData.bind(this)}
                            placeholder={this.props.t("CHOOSE")}
                            value={this.state.dataObjectChecked}
                            style={{ marginLeft: "58px" }}
                          />
                        </div>
                      ) : // </div>

                      user_current.userType === "Factory" &&
                        user_current.userRole !== "SuperAdmin" ? (
                        // < className="select-dashboard-input-dashboard pr-4">
                        <div
                          className="form-group row "
                          style={{ marginLeft: "6px" }}
                        >
                          <label className=" col-form-label">Đối tượng</label>
                          <Select
                            options={this.state.objectDataChild}
                            onChange={this.handleObjectDataChildCTC.bind(this)}
                            placeholder={this.props.t("CHOOSE")}
                            value={this.state.dataObjectCheckedChild}
                            style={{ marginLeft: "58px" }}
                          />
                        </div>
                      ) : null}

                      {this.state.dataObjectCheckedID !== 0 ? (
                        <div className="pr-4">
                          <div
                            className="form-group"
                            style={{ marginLeft: "130px" }}
                          >
                            <label className="col-form-label">Đối tượng</label>
                            <Select
                              options={this.state.dataChild1}
                              onChange={this.handleObjectData1.bind(this)}
                              placeholder={this.props.t("CHOOSE")}
                              value={this.state.dataObjectChecked1}
                            />
                          </div>
                        </div>
                      ) : null}
                      {/* Chọn tên kho(3) và khách hàng(1): cho phép truy xuất xuống chi nhánh */}
                      {(this.state.dataObjectCheckedID === 3 ||
                        this.state.dataObjectCheckedID === 1) &&
                      this.state.dataObjectCheckedID1 !== "" ? (
                        <div className="pr-4">
                          <div
                            className="form-group"
                            style={{ marginLeft: "130px" }}
                          >
                          {/* Delete Object  not .. */}
                            {/*<label className="col-form-label">Đối tượng trực thuộc</label>*/}
                            {/* <Select
                              options={this.state.objectDataChild}
                              onChange={this.handleObjectDataChild.bind(this)}
                              placeholder={this.props.t("CHOOSE")}
                              value={this.state.dataObjectCheckedChild}
                            /> */}
                          </div>
                        </div>
                      ) : null}
                      {this.state.dataObjectCheckedIDChild !== 0 ? (
                        <div className="pr-4">
                          <div
                            className="form-group"
                            style={{ marginLeft: "130px" }}
                          >
                            <label className="col-form-label">
                              Dữ liệu trực thuộc
                            </label>
                            <Select
                              options={this.state.dataChild3}
                              onChange={this.handleObjectDataChildTNMB.bind(
                                this
                              )}
                              placeholder={this.props.t("CHOOSE")}
                              value={this.state.dataObjectCheckedTNMBFAC}
                            />
                          </div>
                        </div>
                      ) : null}
                      {this.state.dataObjectCheckedIDChild === 1 &&
                      this.state.dataObjectCheckedTNMBFACID !== "" ? (
                        <div className="pr-4">
                          <div
                            className="form-group"
                            style={{ marginLeft: "130px" }}
                          >
                            {/*<label className="col-form-label">Lựa chọn đối tượng</label>*/}
                            <Select
                              options={this.state.objectDataChildTNMBFAC}
                              onChange={this.handleObjectDataGENARALFAC.bind(
                                this
                              )}
                              placeholder={this.props.t("CHOOSE")}
                              value={this.state.dataObjectCheckedGENARAL}
                            />
                          </div>
                        </div>
                      ) : null}
                      {user_current.userType === "General" ? (
                        <div className="pr-4">
                          <div
                            className="form-group row "
                            style={{ marginLeft: "6px" }}
                          >
                            {/* <label className="col-form-label">Đối tượng tnmb</label> */}
                            <label className="col-form-label">Đối tượng </label>
                            <Select
                              options={this.state.objectDataChildTNMBFAC}
                              onChange={this.handleObjectDataGENARAL.bind(this)}
                              placeholder={this.props.t("CHOOSE")}
                              value={this.state.dataObjectCheckedGENARAL}
                              style={{ marginLeft: "56px" }}
                            />
                          </div>
                        </div>
                      ) : null}
                      {this.state.dataObjectCheckedGENARALID !== "" ? (
                        <div className="pr-4">
                          <div
                            className="form-group"
                            style={{ marginLeft: "130px" }}
                          >
                            {/*<label className="col-form-label">Đối tượng trực thuộc</label>*/}
                            <Select
                              options={this.state.dataChild4}
                              onChange={this.handleObjectDataAgencyGeneral.bind(
                                this
                              )}
                              placeholder={this.props.t("CHOOSE")}
                              value={this.state.dataObjectAgencyGeneral}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="col-lg-6 form-group select-dashboard-input-dashboard">
                      <div className="form-group row">
                        <label className="col-form-label export-excel">
                          {this.props.t("TYPE_EXCEL")}
                        </label>
                        <Select
                          options={this.state.valueReports}
                          onChange={this.handleObjectPickTypeOfReportExcel.bind(
                            this
                          )}
                          placeholder={this.props.t("SELECT")}
                          value={this.state.dataValueReports}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 form-group select-dashboard-input-dashboard">
                      <div className="form-row view__report">
                        <button
                          className="btn btn-primary"
                          onClick={() => this.handleButtonFindDataChart()}
                          type="submit"
                        >
                          {this.props.t("SEE_STATISTIC")}
                        </button>
                        {/* {
                          (user_current.userType === "Factory" && user_current.userRole === "SuperAdmin") ?
                            <button
                              className="btn btn-warning"
                              data-toggle="modal"
                              data-target="#shoe-piechart"
                            >
                            {this.props.t('SEE_REPORT')}
                        </button> : ""
                        } */}

                        <button
                          className="btn btn-success"
                          onClick={() => this.handleButtonExportExcel()}
                          type="submit"
                        >
                          {this.props.t("EXPORT_TO_EXCEL")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {!(
                user_current.userType === "Factory" &&
                user_current.userRole === "SuperAdmin"
              ) && (
                <div
                  className="chart-dashboard col-lg-12 row"
                  style={{ left: "15px" }}
                >
                  {user_current.userType !== "Agency" &&
                  user_current.userType !== "Fixer" ? (
                    <div
                      className="col-xs-12 col-lg-6"
                      style={{ paddingLeft: 0 }}
                    >
                      {this.renderBarChart()}
                    </div>
                  ) : null}
                  {user_current.userType !== "Agency" &&
                  user_current.userType !== "Fixer" ? (
                    <div
                      className="col-lg-6 block__pie_chart "
                      style={{ paddingRight: 0 }}
                    >
                      <div className="card card-body fix-center">
                        {/* <ShowPieChart
                          checkDataChart={this.state.checkDataChart}
                          dataPieChart={this.state.dataPieChart}
                          dataBarChart={this.state.dataBarChart}
                          data={data}
                          renderCustomizedLabel={this.renderCustomizedLabel}
                          COLORS={COLORS}
                          listTopExportCylinder={this.state.listTopExportCylinder}
                        /> */}
                        <ResponsiveContainer height={500} width="100%">
                          <PieChart>
                            <Pie
                              data={
                                this.state.checkDataChart.length === 0
                                  ? this.state.dataImexPieGetExportWareHouse
                                  : data
                              }
                              labelLine={false}
                              label={this.renderCustomizedLabel}
                              outerRadius={150}
                              cx="50%"
                              cy={180}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {this.state.checkDataChart.length === 0
                                ? // hide  Sell  Genaral.Here
                                  this.state.dataImexPieGetExportWareHouse.map(
                                    (entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                      />
                                    )
                                  )
                                : data.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={COLORS[index % COLORS.length]}
                                    />
                                  ))}
                            </Pie>
                            <Tooltip />
                            <Legend
                              layout="horizontal"
                              verticalAlign="bottom"
                              align="center"
                            />
                          </PieChart>
                        </ResponsiveContainer>

                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <label>{this.props.t("INVENTORY_CHART")}</label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}
              {user_current.userType === "Factory" &&
                user_current.userRole === "SuperAdmin" && (
                  <div
                    className="chart-dashboard col-lg-12 row"
                    style={{ left: "15px" }}
                  >
                    {user_current.userType !== "Agency" &&
                    user_current.userType !== "Fixer" ? (
                      <div
                        className="col-xs-12 col-lg-6"
                        style={{ paddingLeft: 0 }}
                      >
                        {this.renderImexBarChart()}
                      </div>
                    ) : null}
                    {user_current.userType !== "Agency" &&
                    user_current.userType !== "Fixer" ? (
                      <div
                        className="col-lg-6 block__pie_chart "
                        style={{ paddingRight: 0 }}
                      >
                        <div className="card card-body fix-center">
                          {/* <ShowPieChart
                          checkDataChart={this.state.checkDataChart}
                          dataPieChart={this.state.dataPieChart}
                          // dataBarChart={this.state.dataBarChart}
                          data={data}
                          renderCustomizedLabel={this.renderCustomizedLabel}
                          COLORS={COLORS}
                          // listTopExportCylinder={this.state.listTopExportCylinder}
                        /> */}
                          <ResponsiveContainer height={500} width="100%">
                            <PieChart>
                              <Pie
                                data={
                                  this.state.checkDataChart.length === 0
                                    ? this.state.dataImexPieGetExport
                                    : this.state.dataImexPieGetExport
                                }
                                labelLine={false}
                                label={this.renderCustomizedLabelImex}
                                outerRadius={150}
                                cx="50%"
                                cy={180}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {this.state.checkDataChart.length === 0
                                  ? // hide  Sell  Genaral.Here
                                    this.state.dataImexPieGetExport.map(
                                      (entry, index) => (
                                        <Cell
                                          key={`cell-${index}`}
                                          fill={COLORS[index % COLORS.length]}
                                        />
                                      )
                                    )
                                  : this.state.dataImexPieGetExport.map(
                                      (entry, index) => (
                                        <Cell
                                          key={`cell-${index}`}
                                          fill={COLORS[index % COLORS.length]}
                                        />
                                      )
                                    )}
                              </Pie>
                              <Tooltip />
                              <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                              />
                            </PieChart>
                          </ResponsiveContainer>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <label>{this.props.t("INVENTORY_CHART")}1</label>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                )}
            </div>
            <div className="row">
              <div className="row">
                {/*{user_current.userType === "Factory" && (<div className="col-lg-3">*/}
                {/*    <div className="card card-body">*/}
                {/*        <h6 className="text-uppercase-h6">*/}
                {/*            <span className="text-uppercase">Tổng số Trạm Chiết</span>*/}

                {/*        </h6>*/}
                {/*        <br />*/}
                {/*        <p className="fs-28 fw-100">{resultImport.totalStation}</p>*/}
                {/*        <div className="progress">*/}
                {/*            <div className="progress-bar bg-danger" role="progressbar"*/}
                {/*                style={{ width: "35%", height: "4px" }}></div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>)}*/}

                {/* Dữ liệu tổng số khách hàng đúng (xem ở công ty mẹ), nhưng tạm thời ẩn */}
                {/* { user_current.userType === "Factory" &&
                  user_current.userRole !== "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_CUSTOMER')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalGeneral}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "65%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

                {/* {user_current.userType === "Factory" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_AGENCY')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">{resultImport.totalAgency}</p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-warning"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

                {/* Tạm thời ẩn */}
                {/* {user_current.userType === "Factory" && 
                 user_current.userRole !== "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_EX_CUS')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalExportToGeneral}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

                {/* {user_current.userType === "Factory" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_EX_AGENCY')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalExportToAgency}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

                {/* Tạm thời ẩn */}
                {/* Không cho hiện ở tài khoản mẹ SOPET */}
                {/* {user_current.userType === "Factory" &&
                 user_current.userRole !== "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_CYLINDER_CRE')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalCreatedCylinder}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

                {/* Tạm thời ẩn */}
                {/* {user_current.userType === "Factory" &&
                 user_current.userRole !== "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_CYL_RETURN')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalTurnBack}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

                {/* Không cho hiện ở tài khoản mẹ SOPET */}
                {/* {user_current.userType === "Factory" && user_current.userRole === "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_SELL_PARTNER')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalExportSale}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

                {/* Tạm thời ẩn */}
                {/* {user_current.userType === "Factory" &&
                 user_current.userRole !== "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_HIRE_PARTNER')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalExportRent}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

                {/* Tạm thời ẩn */}
                {/* {user_current.userType === "Factory" &&
                 user_current.userRole !== "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_BUY_PARTNER')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalImportSale}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

                {/* Tạm thời ẩn */}
                {/* {user_current.userType === "Factory" &&
                 user_current.userRole !== "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_HIRE_FROM_PART')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalImportRent}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

                {/* Tạm thời ẩn */}
                {/* {user_current.userType === "Factory" &&
                 user_current.userRole !== "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_IMPORT')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalImportCylinder}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

                {/* Tạm thời ẩn */}
                {/* Không cho hiện ở tài khoản mẹ SOPET */}
                {/* {!(user_current.userType === "Factory" && user_current.userRole === "SuperAdmin") && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_IN_SOPET')}
                      </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalExportSale}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

                {user_current.userType === "General" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                          {this.props.t("TOTAL_RETAIL_STORES")}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">{resultImport.totalAgency}</p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-warning"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {user_current.userType === "General" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                          Tổng Số Bình Xuất{" "}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalExports}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                {user_current.userType === "General" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                          Tổng Số Bình Đã Nhập
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalImportCylinder}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                {/* {user_current.userType === "Agency" &&
                  user_current.userRole === "SuperAdmin" && (
                    <div className="col-md-6 col-lg-3" hidden="false">
                      <div className="card card-body">
                        <h6 className="text-uppercase-h6">
                          <span className="text-uppercase">
                            Tổng Số Bình Nhập{" "}
                          </span>
                        </h6>
                        <br />
                        <p className="fs-28 fw-100">
                          {resultImport.totalImportCylinder}
                        </p>
                        <div className="progress">
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: "100%", height: "4px" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )} */}
                {/* {user_current.userType === "Agency" && (
                  <div className="col-md-6 col-lg-3" hidden="false">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                          Tổng Số Bình Xuất Bán Cho Người Dân{" "}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">{resultImport.totalSales}</p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}
                {/* {user_current.userType === "Agency" && (
                  <div className="col-md-6 col-lg-3" hidden="false">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                          Tổng Doanh Thu Đã Bán Cho Người Dân{" "}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {UltiHelper.formatNumber(resultImport.reveneu)}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}
                {/* {user_current.userType === "Agency" &&
                  (user_current.userRole === "SuperAdmin" ||
                    user_current.userRole === "Owner") && (
                    <div className="col-md-6 col-lg-3" hidden="false">
                      <div className="card card-body">
                        <h6 className="text-uppercase-h6">
                          <span className="text-uppercase">
                            Tổng Nhân Viên{" "}
                          </span>
                        </h6>
                        <br />
                        <p className="fs-28 fw-100">
                          {resultImport.totalAgency}
                        </p>
                        <div className="progress">
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: "100%", height: "4px" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )} */}

                {/*{user_current.userType === "Agency" && (<div className="col-md-6 col-lg-4">*/}
                {/*    <div className="card card-body">*/}
                {/*        <h6 className="text-uppercase-h6">*/}
                {/*            <span className="text-uppercase">Tổng Số Bình Đã Nhập</span>*/}

                {/*        </h6>*/}
                {/*        <br/>*/}
                {/*        <p className="fs-28 fw-100">{resultImport.totalImportCylinder}</p>*/}
                {/*        <div className="progress">*/}
                {/*            <div className="progress-bar bg-success" role="progressbar"*/}
                {/*                 style={{width: "100%", height: "4px"}}></div>*/}
                {/*        </div>*/}

                {/*    </div>*/}
                {/*</div>)}*/}

                {user_current.userType === "Agency" &&
                  user_current.parentRoot === "" && (
                    <div className="col-md-6 col-lg-3">
                      <div className="card card-body">
                        <h6 className="text-uppercase-h6">
                          <span className="text-uppercase">
                            Tổng Số Bình Đã Tạo
                          </span>
                        </h6>
                        <br />
                        <p className="fs-28 fw-100">{this.state.data}</p>
                        <div className="progress">
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: "100%", height: "4px" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                {/* 4et_Tổng số bình đã tạo */}
                <div className="col-md-6 col-lg-3">
                  <div className="card card-body">
                    <h6 className="text-uppercase-h6">
                      <span className="text-uppercase">
                        Tổng số bình đã tạo{" "}
                      </span>
                    </h6>

                    <br />
                    <p className="fs-28 fw-100">
                      {this.state.dataImexGetStatisticsTotal}
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%", height: "4px" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* 4et_Loại bình 12KG */}
                <div className="col-md-6 col-lg-3">
                  <div className="card card-body">
                    <h6 className="text-uppercase-h6">
                      <span className="text-uppercase">Loại bình 12KG </span>
                    </h6>
                    <br />
                    <p className="fs-28 fw-100">
                      {this.state.dataImexGetStatisticsTotal_12kg}
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%", height: "4px" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* 4et_Loại bình 45KG */}
                <div className="col-md-6 col-lg-3">
                  <div className="card card-body">
                    <h6 className="text-uppercase-h6">
                      <span className="text-uppercase">Loại bình 45KG </span>
                    </h6>
                    <br />
                    <p className="fs-28 fw-100">
                      {this.state.dataImexGetStatisticsTotal_45Kg}
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%", height: "4px" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* 4et_Loại bình 50KG */}
                <div className="col-md-6 col-lg-3">
                  <div className="card card-body">
                    <h6 className="text-uppercase-h6">
                      <span className="text-uppercase">Loại bình 50KG </span>
                    </h6>
                    <br />
                    <p className="fs-28 fw-100">
                      {this.state.dataImexGetStatisticsTotal_50Kg}
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%", height: "4px" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* 4et_Tổng số bình đã xuất */}
                <div className="col-md-6 col-lg-3">
                  <div className="card card-body">
                    <h6 className="text-uppercase-h6">
                      <span className="text-uppercase">
                        Tổng số bình đã xuất{" "}
                      </span>
                    </h6>
                    <br />
                    <p className="fs-28 fw-100">
                      {this.state.dataImexGetStatisticsOutCylinder_Total}
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%", height: "4px" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* 4et_Loại bình 12KG */}
                <div className="col-md-6 col-lg-3">
                  <div className="card card-body">
                    <h6 className="text-uppercase-h6">
                      <span className="text-uppercase">Loại bình 12KG </span>
                    </h6>
                    <br />
                    <p className="fs-28 fw-100">
                      {this.state.dataImexGetStatisticsOutCylinder_Total_12kg}
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%", height: "4px" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* 4et_Loại bình 45KG */}
                <div className="col-md-6 col-lg-3">
                  <div className="card card-body">
                    <h6 className="text-uppercase-h6">
                      <span className="text-uppercase">Loại bình 45KG </span>
                    </h6>
                    <br />
                    <p className="fs-28 fw-100">
                      {this.state.dataImexGetStatisticsOutCylinder_Total_45kg}
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%", height: "4px" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* 4et_Loại bình 50KG */}
                <div className="col-md-6 col-lg-3">
                  <div className="card card-body">
                    <h6 className="text-uppercase-h6">
                      <span className="text-uppercase">Loại bình 50KG </span>
                    </h6>
                    <br />
                    <p className="fs-28 fw-100">
                      {this.state.dataImexGetStatisticsOutCylinder_Total_50kg}
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%", height: "4px" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* 4et_Tổng số bình hồi lưu */}
                <div className="col-md-6 col-lg-3">
                  <div className="card card-body">
                    <h6 className="text-uppercase-h6">
                      <span className="text-uppercase">
                        Tổng số bình hồi lưu{" "}
                      </span>
                    </h6>
                    <br />
                    <p className="fs-28 fw-100">
                      {this.state.dataImexGetStatisticsTurnbackCylinder_Total}
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%", height: "4px" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* 4et_Loại bình 12KG */}
                <div className="col-md-6 col-lg-3">
                  <div className="card card-body">
                    <h6 className="text-uppercase-h6">
                      <span className="text-uppercase">Loại bình 12KG </span>
                    </h6>
                    <br />
                    <p className="fs-28 fw-100">
                      {
                        this.state
                          .dataImexGetStatisticsTurnbackCylinder_Total_12kg
                      }
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%", height: "4px" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* 4et_Loại bình 45KG */}
                <div className="col-md-6 col-lg-3">
                  <div className="card card-body">
                    <h6 className="text-uppercase-h6">
                      <span className="text-uppercase">Loại bình 45KG </span>
                    </h6>
                    <br />
                    <p className="fs-28 fw-100">
                      {
                        this.state
                          .dataImexGetStatisticsTurnbackCylinder_Total_45kg
                      }
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%", height: "4px" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* 4et_Loại bình 50KG */}
                <div className="col-md-6 col-lg-3">
                  <div className="card card-body">
                    <h6 className="text-uppercase-h6">
                      <span className="text-uppercase">Loại bình 50KG </span>
                    </h6>
                    <br />
                    <p className="fs-28 fw-100">
                      {
                        this.state
                          .dataImexGetStatisticsTurnbackCylinder_Total_50kg
                      }
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%", height: "4px" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* 4et_Tổng số bình tồn kho */}
                <div className="col-md-6 col-lg-3">
                  <div className="card card-body">
                    <h6 className="text-uppercase-h6">
                      <span className="text-uppercase">
                        Tổng số bình tồn kho{" "}
                      </span>
                    </h6>
                    <br />
                    <p className="fs-28 fw-100">
                      {this.state.dataImexGetStatisticsInventoryCylinder_Total}
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%", height: "4px" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* 4et_Loại bình 12KG */}
                <div className="col-md-6 col-lg-3">
                  <div className="card card-body">
                    <h6 className="text-uppercase-h6">
                      <span className="text-uppercase">Loại bình 12KG </span>
                    </h6>
                    <br />
                    <p className="fs-28 fw-100">
                      {
                        this.state
                          .dataImexGetStatisticsInventoryCylinder_Total_12kg
                      }
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%", height: "4px" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* 4et_Loại bình 45KG */}
                <div className="col-md-6 col-lg-3">
                  <div className="card card-body">
                    <h6 className="text-uppercase-h6">
                      <span className="text-uppercase">Loại bình 45KG </span>
                    </h6>
                    <br />
                    <p className="fs-28 fw-100">
                      {
                        this.state
                          .dataImexGetStatisticsInventoryCylinder_Total_45kg
                      }
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%", height: "4px" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* 4et_Loại bình 50KG */}
                <div className="col-md-6 col-lg-3">
                  <div className="card card-body">
                    <h6 className="text-uppercase-h6">
                      <span className="text-uppercase">Loại bình 50KG </span>
                    </h6>
                    <br />
                    <p className="fs-28 fw-100">
                      {
                        this.state
                          .dataImexGetStatisticsInventoryCylinder_Total_50kg
                      }
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%", height: "4px" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="row">
                    {/*Lịch sử nhập hàng trong các tài khoản khác cửa hàng bán lẻ*/}
                    {/*Và ẩn ở tài khoản mẹ SOPET*/}
                    {user_current.userType !== "Agency" &&
                      !(
                        user_current.userType === "Factory" &&
                        user_current.userRole === "SuperAdmin"
                      ) && (
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                          <div className="card">
                            <div className="card-header">
                              <h5 className="card-title">
                                <strong> {this.props.t("HISTORY")} </strong>{" "}
                                {this.props.t("IMPORT")}
                              </h5>
                            </div>

                            <table className="table table-striped table-hover">
                              <thead>
                                <tr>
                                  {/* Nhập từ bị lỗi API không lấy được nơi xuất */}
                                  <th className="">{this.props.t("FROM")}</th>
                                  <th className="">
                                    {this.props.t("DATE_TIME")}
                                  </th>
                                  <th className="">{this.props.t("TYPE")}</th>
                                  <th className="">
                                    {this.props.t("NUM_CYLINDER")}
                                  </th>
                                  <th className="">
                                    {this.props.t("EXPORT_TO_EXCEL")}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {historyImport.map((item) => {
                                  return (
                                    <tr>
                                      <td className="text-muted">
                                        {typeof item.from !== "undefined" &&
                                        item.from !== null
                                          ? item.from.name
                                          : this.props.t("CITIZEN")}
                                      </td>
                                      <td className="text-muted">
                                        {moment(item.createdAt).format(
                                          "DD/MM/YYYY HH:mm"
                                        )}
                                      </td>
                                      <td className="text-muted">
                                        {item.type === "IMPORT"
                                          ? "Nhập Hàng"
                                          : item.type === "TURN_BACK"
                                          ? this.props.t("ENTER_RETURN")
                                          : ""}
                                      </td>
                                      <td className="text-success">
                                        {item.numberOfCylinder}{" "}
                                        {this.props.t("CYLINDER")}
                                      </td>
                                      <td className="text-muted">
                                        <a
                                          className="btn btn-primary"
                                          style={{ color: "white" }}
                                          download
                                          onClick={async () => {
                                            await getCylinderByHistoryId(
                                              item.id,
                                              "Nhap_Hang_" + item.id
                                            );
                                          }}
                                          type="submit"
                                        >
                                          {this.props.t("DOWNLOAD")}
                                        </a>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                            <a href={urlDetailHistoryImport}>
                              {this.props.t("SEE_MORE")}
                            </a>
                          </div>
                        </div>
                      )}
                    {/*Lịch sử xuât hàng trong các tài khoản khác cửa hàng bán lẻ*/}
                    {/*Và ẩn ở tài khoản mẹ SOPET*/}
                    {user_current.userType !== "Agency" &&
                      !(
                        user_current.userType === "Factory" &&
                        user_current.userRole === "SuperAdmin"
                      ) && (
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                          <div className="card">
                            <div className="card-header">
                              <h5 className="card-title">
                                <strong>{this.props.t("HISTORY")}</strong>{" "}
                                {this.props.t("EXPORT")}
                              </h5>
                            </div>

                            <table className="table table-striped table-hover">
                              <thead>
                                <tr>
                                  <th className="">
                                    {this.props.t("DATE_TIME")}
                                  </th>
                                  <th className="">{this.props.t("TYPE")}</th>
                                  <th className="">
                                    {this.props.t("NUM_CYLINDER")}
                                  </th>
                                  <th className="">
                                    {this.props.t("EXPORT_TO_EXCEL")}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {historyExport.map((item) => {
                                  let to_dest = "";
                                  if (
                                    typeof item.to !== "undefined" &&
                                    item.to !== null
                                  ) {
                                    to_dest = item.to.name;
                                  } else {
                                    if (
                                      typeof item.toArray !== "undefined" &&
                                      item.toArray !== null &&
                                      item.toArray.length > 0
                                    ) {
                                      for (
                                        let i = 0;
                                        i < item.toArray.length;
                                        i++
                                      ) {
                                        to_dest +=
                                          item.toArray[i].length > 0
                                            ? item.toArray[i].name +
                                              " " +
                                              item.numberArray[i] +
                                              " bình." +
                                              `\n`
                                            : "";
                                        // console.log("hahahah", to_dest);
                                      }
                                    } else {
                                      if (
                                        typeof item.customer !== "undefined" &&
                                        item.customer !== null
                                      ) {
                                        to_dest =
                                          "Người Dân : " + item.customer.name;
                                      }
                                    }
                                  }

                                  return (
                                    <tr>
                                      {/*<td className="text-muted">{to_dest}</td>*/}
                                      <td className="text-muted">
                                        {moment(item.createdAt).format(
                                          "DD/MM/YYYY HH:mm"
                                        )}
                                      </td>
                                      <td className="text-muted">
                                        {item.type === "EXPORT"
                                          ? this.props.t("EXPORT")
                                          : item.type === "SALE"
                                          ? "Bán Hàng"
                                          : ""}
                                      </td>
                                      <td className="text-success">
                                        {item.numberOfCylinder}{" "}
                                        {this.props.t("CYLINDER")}
                                      </td>
                                      <td className="text-muted">
                                        <a
                                          style={{ color: "white" }}
                                          className="btn btn-create"
                                          download
                                          onClick={async () => {
                                            await getCylinderByHistoryId(
                                              item.id,
                                              "Xuat_Hang_" + item.id
                                            );
                                          }}
                                          type="submit"
                                        >
                                          {this.props.t("DOWNLOAD")}
                                        </a>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                            <a href={urlSeeDetailDataExport}>
                              {this.props.t("SEE_MORE")}
                            </a>
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {user_current.userType === "Agency" && (
                  <div className="col-lg-12">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">
                          <strong> {this.props.t("HISTORY")} </strong>{" "}
                          {this.props.t("IMPORT")}
                        </h5>
                      </div>

                      <table className="table table-striped table-hover">
                        <thead>
                          {/*Lịch sử nhập hàng trong cửa hàng bán lẻ*/}
                          <tr>
                            <th className="">Nhập Từ</th>
                            <th className="">Ngày Giờ</th>
                            <th className="">Loại</th>
                            <th className="">Số Lượng Bình</th>
                            <th className="">Xuất Excel</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historyImport.map((item) => {
                             let length_cylinder = 0;
                            for(let i=0;i < item.cylinders.length;i++)
                            {
                               length_cylinder ++;
                            }
                            
                            return (
                              <tr>
                                <td className="text-muted">
                                  {typeof item.from !== "undefined" &&
                                    item.from !== null
                                    ? item.from.name
                                    : this.props.t("CITIZEN")}
                                </td>
                                <td className="text-muted">
                                  {moment(item.createdAt).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </td>
                                <td className="text-muted">
                                  {/* {item.type === "IMPORT"
                                      ? "Nhập Hàng"
                                      : item.type === "TURN_BACK"
                                      ? this.props.t("ENTER_RETURN")
                                      : ""}*/}
                                  {
                                    length_cylinder > 0 ? item.cylinders[0].cylinderType : ""
                                  }
                                </td>
                                <td className="text-success">
                                  {item.numberOfCylinder}{" "}
                                  {this.props.t("CYLINDER")}
                                </td>
                                <td className="text-muted">
                                  <a
                                    className="btn btn-primary"
                                    style={{ color: "white" }}
                                    download
                                    onClick={async () => {
                                      await getCylinderByHistoryId(
                                        item.id,
                                        "Nhap_Hang_" + item.id
                                      );
                                    }}
                                    type="submit"
                                  >
                                    {this.props.t("DOWNLOAD")}
                                  </a>
                                </td>
                              </tr>
                            );
                          })
                         }
                              </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {user_current.userType === "Agency" && (
                  <div className="col-lg-12">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">
                          Lịch Sử Bán Hàng
                        </h5>
                      </div>

                      <table className="table table-striped table-hover">
                        <thead>
                          <tr>
                            <th className="">Khách Hàng</th>
                            <th className="">Địa Chỉ</th>
                            <th className="">Ngày Giờ</th>
                            <th className="">Loại</th>
                            <th className="">Số Lượng Bình</th>
                            {/*<th className="">Tổng Tiền</th>*/}
                          </tr>
                        </thead>
                        <tbody>
                          {historyExport.map((item) => {
                           
                            let to_dest = "";
                            let length_cylinder = 0;
                            for(let i=0;i < item.cylinders.length;i++)
                            {
                              length_cylinder ++;
                            }
                         
                            if (
                              typeof item.to !== "undefined" &&
                              item.to !== null
                            ) {
                              to_dest = item.to.name;
                            } else {
                              if (
                                typeof item.toArray !== "undefined" &&
                                item.toArray !== null &&
                                item.toArray.length > 0
                              ) {
                                for (let i = 0; i < item.toArray.length; i++) {
                                  to_dest +=
                                    item.toArray[i].name +
                                    " " +
                                    item.numberArray[i] +
                                    " bình." +
                                    `\n`;
                                  // console.log(to_dest);s
                                }
                              } else {
                                if (
                                  typeof item.customer !== "undefined" &&
                                  item.customer !== null
                                ) {
                                  to_dest = "Người Dân : " + item.customer.name;
                                }
                              }
                            }
                            return (
                              <tr>
                                <td className="text-muted">
                                  {typeof item.saler !== "undefined" &&
                                  item.saler !== null
                                    ? item.saler.name
                                    : ""}
                                </td>
                                <td className="text-muted">{to_dest}</td>
                                <td className="text-muted">
                                  {moment(item.createdAt).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </td>
                                <td className="text-muted">
                                 {/* {item.type === "EXPORT"
                                    ? this.props.t("EXPORT")
                                    : item.type
                                    ? "Bán Hàng"
                                    : "" } */} 
                                  {length_cylinder > 0 ? item.cylinders[0].cylinderType : ""}
                                </td>
                                <td className="text-success">
                                  {item.numberOfCylinder}{" "}
                                  {this.props.t("CYLINDER")}
                                </td>
                                {/* 
                                  <td className="text-success">
                                  {UltiHelper.formatNumber(item.amount)}
                                </td>
                                */}
                                
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {!(
                  user_current.userType === "Factory" &&
                  (user_current.userRole === "SuperAdmin" ||
                    user_current.userRole === "Owner")
                ) && (
                  <div className="col-lg-12">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">
                          <strong>{this.props.t("INFO")}</strong>{" "}
                          {this.props.t("IN_WARE")}
                        </h5>
                      </div>
                      <table className="table table-striped table-hover">
                        <thead>
                          <tr>
                            <th className="">
                              {" "}
                              {this.props.t("IS_INVENTORY")}{" "}
                            </th>
                            <th className="">{this.props.t("SELL_GENERAL")}</th>
                            {/* {this.state.userTypeCheck !== "Agency" && <th className="">{this.props.t('IN_OTHER')}</th>} */}
                            {this.state.userTypeCheck !== "Agency" && (
                              <th className="">
                                {this.props.t("IN_CHILD_COMPANY")}
                              </th>
                            )}
                            {this.state.userTypeCheck !== "Agency" && (
                              <th className="">{this.props.t("IN_TRADER")}</th>
                            )}
                            {/* {this.state.userTypeCheck !== "Agency" && <th className="">{this.props.t('IN_AGENCY')}</th>} */}
                            {/* {this.state.userTypeCheck !== "Agency" && <th className="">{this.props.t('IN_PARTNER')}</th>} */}
                            {this.state.userTypeCheck !== "Agency" && (
                              <th className="">{this.props.t("IN_FIXER")}</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-muted">
                              {this.state.dataTableChart.inventoryAtMySelf}
                            </td>
                            <td className="text-muted">
                              {this.state.dataTableChart.atResident}
                            </td>
                            {/* {this.state.userTypeCheck !== "Agency" &&
                            <td className="text-muted">
                              {this.state.dataTableChart.else}
                            </td>} */}
                            {this.state.userTypeCheck !== "Agency" && (
                              <td className="text-muted">
                                {this.state.dataTableChart.atFactoryChilds}
                              </td>
                            )}

                            {this.state.userTypeCheck !== "Agency" && (
                              <td className="text-success">
                                {this.state.dataTableChart.atGeneralChilds}
                              </td>
                            )}
                            {/* {this.state.userTypeCheck !== "Agency" &&
                            <td className="text-success">
                              {this.state.dataTableChart.atAgencyChilds}
                            </td>} */}
                            {/* {this.state.userTypeCheck !== "Agency" && <td className="text-success">
                            {this.state.dataTableChart.atPartners}
                          </td>} */}
                            {this.state.userTypeCheck !== "Agency" && (
                              <td className="text-success">
                                {this.state.dataTableChart.atFixer}
                              </td>
                            )}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              {!(
                user_current.userType === "Factory" &&
                (user_current.userRole === "SuperAdmin" ||
                  user_current.userRole === "Owner")
              ) && (
                <div className="report__footer_block">
                  {user_current.userType === "Factory" && (
                    <div className="col-lg-3" style={{ paddingLeft: 0 }}>
                      <div
                        className="card card-body"
                        data-toggle="modal"
                        data-target="#table-data-info"
                        onClick={() => {
                          this.callDataTurnBackInfo(
                            this.state.infoReportTurnback
                              .listCylindersFromCustomer
                          );
                          this.setState({
                            namePopup: this.props.t("RETURN_CUSTOMER"),
                          });
                        }}
                      >
                        <h6 className="text-uppercase-h6">
                          <span className="text-uppercase">
                            {this.props.t("RETURN_CUSTOMER")}
                          </span>
                        </h6>
                        <br />
                        <p className="fs-28 fw-100">
                          {!!this.state.infoReportTurnback
                            .listCylindersFromCustomer
                            ? this.state.infoReportTurnback
                                .listCylindersFromCustomer.length
                            : 0}
                        </p>
                        <div className="progress">
                          <div
                            className="progress-bar bg-danger"
                            role="progressbar"
                            style={{ width: "35%", height: "4px" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {user_current.userType === "Factory" && (
                    <div className="col-lg-3">
                      <div
                        className="card card-body"
                        style={{ height: 185 }}
                        data-toggle="modal"
                        data-target="#table-data-info"
                        onClick={() => {
                          this.callDataTurnBackInfo(
                            this.state.infoReportTurnback.listCylindersFromFixer
                          );
                          this.setState({
                            namePopup: this.props.t("RETURN_FIXER"),
                          });
                        }}
                      >
                        <h6 className="text-uppercase-h6">
                          <span className="text-uppercase">
                            {this.props.t("RETURN_FIXER")}
                          </span>
                        </h6>
                        <br />
                        <p className="fs-28 fw-100">
                          {!!this.state.infoReportTurnback
                            .listCylindersFromFixer
                            ? this.state.infoReportTurnback
                                .listCylindersFromFixer.length
                            : 0}
                        </p>
                        <div className="progress">
                          <div
                            className="progress-bar bg-danger"
                            role="progressbar"
                            style={{ width: "35%", height: "4px" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {user_current.userType === "Factory" && (
                    <div className="col-lg-3">
                      <div
                        className="card card-body"
                        style={{ height: 185 }}
                        data-toggle="modal"
                        data-target="#table-data-info"
                        onClick={() => {
                          this.callDataTurnBackInfo(
                            this.state.infoReportTurnback.listCylindersFromRent
                          );
                          this.setState({
                            namePopup: this.props.t("RETURN_HIRE"),
                          });
                        }}
                      >
                        <h6 className="text-uppercase-h6">
                          <span className="text-uppercase">
                            {this.props.t("RETURN_HIRE")}
                          </span>
                        </h6>
                        <br />
                        <p className="fs-28 fw-100">
                          {!!this.state.infoReportTurnback.listCylindersFromRent
                            ? this.state.infoReportTurnback
                                .listCylindersFromRent.length
                            : 0}
                        </p>
                        <div className="progress">
                          <div
                            className="progress-bar bg-danger"
                            role="progressbar"
                            style={{ width: "35%", height: "4px" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {user_current.userType === "Factory" && (
                    <div className="col-lg-3" style={{ paddingRight: 0 }}>
                      <div
                        className="card card-body"
                        style={{ height: 185 }}
                        data-toggle="modal"
                        data-target="#table-data-info"
                        onClick={() => {
                          this.callDataTurnBackInfo(
                            this.state.infoReportTurnback.listCylindersFromSale
                          );
                          this.setState({
                            namePopup: this.props.t("RETURN_SELL"),
                          });
                        }}
                      >
                        <h6 className="text-uppercase-h6">
                          <span className="text-uppercase">
                            {this.props.t("RETURN_SELL")}
                          </span>
                        </h6>
                        <br />
                        <p className="fs-28 fw-100">
                          {!!this.state.infoReportTurnback.listCylindersFromSale
                            ? this.state.infoReportTurnback
                                .listCylindersFromSale.length
                            : 0}
                        </p>
                        <div className="progress">
                          <div
                            className="progress-bar bg-danger"
                            role="progressbar"
                            style={{ width: "35%", height: "4px" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <TableDataInfo
              dataProducts={this.state.dataTurnBacks}
              name={this.state.namePopup}
            />
          </div>
        </main>
        <PopupLogOut />
      </div>
    );
  }
}

export default withNamespaces()(connect()(DashBoard));
