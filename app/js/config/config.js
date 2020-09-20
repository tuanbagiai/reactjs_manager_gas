
//const SERVERAPI='https://api.4te.vn/';
//const SERVERAPI = 'http://api-4te.crmdvs.vn/';
const SERVERAPI = 'http://14.161.1.28:1337/';
// const SERVERAPI = 'http://45.119.84.155:1337/';
//const SERVERAPI = "http://192.168.1.26:1337/";

const GETDETAILEXPORTORDER = SERVERAPI + "order/getDetailExportOrder";
const GETALLRENTEREXPORTCELL = SERVERAPI + "user/getAllRenterExportCell";
const GETALLFIXEREXPORTCELL = SERVERAPI + "user/getAllFixerExportCell";
const GETEXPORTDATAPRINT = SERVERAPI + "print/getExportDataPrint";
const REMOVEAGENCY = SERVERAPI + "user/removeAgency";
const ADDNEWAGENCY = SERVERAPI + "user/addAgency";
const UPDATEAGENCYINFOR = SERVERAPI + "user/updateAgencyInfor";
const GETLISTFIXEREXCEL = SERVERAPI + "report/getExcelFixer";
const GETORDERHISTORIES = SERVERAPI + "order/getOrderHistories";
const CREATEEXPORTORDERHISTORY = SERVERAPI + "history/createExportOrderHistory";
const CHECKCYLINDERSFORORDER = SERVERAPI + "order/getCylinderInformationForOrder";
const GETLISTDRIVEREXCEL = SERVERAPI + "report/getExcelDriver";
const GETLISTTRUCKEXCEL = SERVERAPI + "report/getExcelTruck";
const GETLISTRENTALPARTNEREXCEL = SERVERAPI + "report/getExcelRentalPartners";
const GETLISTCUSTOMEREXCEL = SERVERAPI + "report/getExcelCustomer";
const GETLISTWAREHOUSEEXCEL = SERVERAPI + "report/getExcelWarehouse";
const AUTOCREATECYLYNDER = SERVERAPI + "cylinder/autoGenerateCylinder";
const GETALLCHILD = SERVERAPI + 'user/getAllChild';
const GETLISTMANUFACTURE = SERVERAPI + 'manufacture/listManufacture';
const GETTYPECUSTOMER = SERVERAPI + 'user/getListByCustomerType';
const GETLISTBRANCH = SERVERAPI + 'user/getListBranch';
const GETRENTALPARTNER = SERVERAPI + 'rentalPartners/getListRentalPartners';
const ADDRENTALPARTNER = SERVERAPI + 'rentalPartners/createRentalPartners';
const ADDCUSTOMER = SERVERAPI + 'user/createCustomer';
const GETLISTSCHEDULE = SERVERAPI + 'schedule/getListSchedule';
const GETUSERINFOR = SERVERAPI + 'user/getInforById';
const ACCEPTREQUEST = SERVERAPI + 'cylinder/confirmReqImport';
const DELETEREQUEST = SERVERAPI + 'cylinder/removeReqImport';
const TOPEXPORTCYLINDER = SERVERAPI + 'report/getTopExport';
const GETREQIMPORT = SERVERAPI + "cylinder/getReqImport";
const IMPORTCYLINDERBYEXCEL = SERVERAPI + "cylinder/createReqImport";
const GETCOMPANYTOFIX = SERVERAPI + 'user/getAllCompanyToFix';
const GETDRIVERIMPORTCYLINDER = SERVERAPI + 'user/getDriverImport';
const UPDATEORDER = SERVERAPI + 'order/changeOrderStatus';
const GETORDERFACTORY = SERVERAPI + 'order/getOrdersOfFactory';
const CREATECALENDERINSPECTOR = SERVERAPI + 'schedule/createSchedule';
const GETALLORDER = SERVERAPI + 'order/getOrders';
const CREATEORDER = SERVERAPI + 'order/setOrder';
const GETSTAFF = SERVERAPI + 'inspector/getStaff';
const GETINSPECTOR = SERVERAPI + 'inspector/getInspector';
const NAMEDRIVE = SERVERAPI + 'user/listNameDriver';
const GETSTOCKGAS = SERVERAPI + "report/getListChild";
const GETDRIVE = SERVERAPI + "user/getDriver";
const URLSERVERIMAGE = SERVERAPI + "images/";
const GETAVATARUSER = SERVERAPI + "user/getAvatar";
const CHANGEPASSWORD = SERVERAPI + "user/change_password";
const CHANGINFOREUSER = SERVERAPI + "user/updateInformationUser";
const UPDATEBRANDINFORMATION = SERVERAPI + "manufacture/updateBrandInformation";
const LOGINURL = SERVERAPI + "user/login";
const REGISTERURL = SERVERAPI + "user/create";
const GETALLUSERURL = SERVERAPI + "user";
const GETDESTINATIONURL = SERVERAPI + "user/getDestination";
const GETALLCYLINDER = SERVERAPI + "cylinder/?limit=500";
const GETALLREPORT = SERVERAPI + "report";
const GETALLREPORTNEW = SERVERAPI + "report/getCustomerReport";
const ADDPRODUCTURL = SERVERAPI + "cylinder/create";
const UPDATEPRODUCT = SERVERAPI + "cylinder/updateCylinder";
const ADDREPORTURL = SERVERAPI + "report";
const GETCYLINDERBYID = SERVERAPI + "cylinder/?product_id";
const IMPORTPRODUCT = SERVERAPI + "cylinder/import";
const IMPORTPRODUCTWAREHOUSE = SERVERAPI + "cylinder/importFromWarehouse";
const ADDUSERURL = SERVERAPI + "user/addUser";
const UPDATEUSERURL = SERVERAPI + "user/updateChild";
const SEARCHSERIAL =
  SERVERAPI + 'cylinder/?where={"serial":{"contains":"?keyword"}, "current":"?id"}&limit=50&skip=?skip';
const SEARCHCYLINDER =
  SERVERAPI + "manufacture/find?type=1&cylinder_serial=[$serial]";
const CREATEHISTORY = SERVERAPI + "history/importCylinder";
const DELETEUSER = SERVERAPI + "user/$user_id";
const DELETEPRODUCTURL = SERVERAPI + "cylinder/$cylinder_id";
const GETALLMANUFACTURER = SERVERAPI + "manufacture/list";
const DELETEMANUFACTURER = SERVERAPI + "manufacture/$manufacture";
const ADDMANUFACTURER = SERVERAPI + "manufacture/create";
const GETINFORMATIONCYLINDERS = SERVERAPI + "cylinder/getInfomation";
const GETINFORMATIONCYLINDERSEXCEL = SERVERAPI + "cylinder/getInfomationExcel";
const GETREPORTIMPORTOREXPORTURL = SERVERAPI + "report/reportCylinder";
const GETHISTORYIMPORTURL =
  SERVERAPI +
  'history/?where={"$to_or_from":"$id_user","type":{"in":["IMPORT","TURN_BACK"]}}&limit=9999999999';
const GETHISTORYIMPORTURLUPDATEFOREXPORT =
  SERVERAPI +
  'history/?where={"$to_or_from":"$id_user","type":{"in":["EXPORT","SALE"]}}&limit=9999999999';
const GETHISTORYIMPORTURLUPDATEFOREXPORTFORSALE =
  SERVERAPI +
  'history/?where={"$to_or_from":"$id_user","saler":"$id_saler","type":{"in":["EXPORT","SALE"]}}&limit=9999999999';
const UPDATEPRICEURL = SERVERAPI + "cylinder/updatePrice";
const LISTHISTORYPRICE =
  SERVERAPI +
  "cylinder/searchCylinder?cylinder_serial=$cylinder_serial&page=$page&limit=$limit";
const PRICEHISTORY = SERVERAPI + "priceHistory?cylinder_id=$cylinder_id";
const GETLISTCUSTOMER = SERVERAPI + "report/getCustomers?page=$page&limit=10";
const GETALLFACTORY = SERVERAPI + "user/getAllFactory";
const PARTNER = SERVERAPI + "partner/relationship";
const FIXER_PARTNER = SERVERAPI + "partner/getFixersRelationship";
const FIXER = SERVERAPI + "partner/getAllFixerM";
const UPDATE_VERIFIED_DATES = SERVERAPI + "cylinder/updateVerifiedDates";
const UPDATE_VERIFIED_DATES_EXCELL = SERVERAPI + 'cylinder/updateCylinderInformationExcel';
const EXPORT_PLACE = SERVERAPI + "exportPlace";
const REPORT_CHART = SERVERAPI + "report/reportChartData";
const REPORT_PIE_CHART = SERVERAPI + "report/getInventoryInfo";
const GET_REPORT_CHILD = SERVERAPI + "user/getReportChilds";
const REPORT_TURN_BACK_INFO = SERVERAPI + "report/getTurnBackInfo";
const CALL_DATA_TURN_BACK_INFO = SERVERAPI + "report/getTurnBackCylinders";
const GET_CHILD_END_NUMBER_IMPORT =
  SERVERAPI + "report/getChildAndNumberImportByDateTime";
const EXPORT_CYLINDER_BY_HISTORY =
  SERVERAPI + "report/getCylinderHistoryExcels";
const EXPORT_REPORT_BY_TARGET_AND_DATETIME =
  SERVERAPI + "report/getReportExcels";
const ADDTRUCK = SERVERAPI + "truck/createTruck";
const GETTRUCK = SERVERAPI + 'truck/getListTruck';
const UPDATETRUCK = SERVERAPI + 'truck/updateTruck';
const IMEXGETEXPORT = SERVERAPI +'imex/getExport';
const IMEXGETCURRENTINVENTORY=SERVERAPI +'imex/getCurrentInventory';
const IMEXGETSTATISTICS =SERVERAPI +'imex/getStatistics';
const GETEXPORTBYITSELF=SERVERAPI +'imex/getExportByItSelf'
const IMEXGETCURRENTINVENTORYBYITSELF = SERVERAPI +'imex/getCurrentInventoryByItSelf';
export {
  GETDETAILEXPORTORDER,
  GETALLRENTEREXPORTCELL,
  GETALLFIXEREXPORTCELL,
  GETEXPORTDATAPRINT,
  REMOVEAGENCY,
  ADDNEWAGENCY,
  UPDATEAGENCYINFOR,
  GETLISTFIXEREXCEL,
  GETLISTWAREHOUSEEXCEL,
  GETORDERHISTORIES,
  CREATEEXPORTORDERHISTORY,
  CHECKCYLINDERSFORORDER,
  AUTOCREATECYLYNDER,
  GETALLCHILD,
  UPDATE_VERIFIED_DATES_EXCELL,
  FIXER,
  GETUSERINFOR,
  GETDRIVERIMPORTCYLINDER,
  IMPORTCYLINDERBYEXCEL,
  ACCEPTREQUEST,
  TOPEXPORTCYLINDER,
  GETREQIMPORT,
  GETCOMPANYTOFIX,
  GETORDERFACTORY,
  UPDATEORDER,
  GETSTAFF,
  GETALLORDER,
  CREATEORDER,
  CREATECALENDERINSPECTOR,
  GETINSPECTOR,
  NAMEDRIVE,
  GETSTOCKGAS,
  GETDRIVE,
  URLSERVERIMAGE,
  GETAVATARUSER,
  CHANGEPASSWORD,
  CHANGINFOREUSER,
  UPDATEBRANDINFORMATION,
  GETHISTORYIMPORTURLUPDATEFOREXPORTFORSALE,
  UPDATEPRICEURL,
  GETHISTORYIMPORTURLUPDATEFOREXPORT,
  GETHISTORYIMPORTURL,
  GETREPORTIMPORTOREXPORTURL,
  SEARCHSERIAL,
  ADDUSERURL,
  ADDREPORTURL,
  GETALLREPORT,
  ADDPRODUCTURL,
  IMPORTPRODUCT,
  IMPORTPRODUCTWAREHOUSE,
  GETALLCYLINDER,
  GETALLUSERURL,
  LOGINURL,
  UPDATE_VERIFIED_DATES,
  REGISTERURL,
  GETCYLINDERBYID,
  CREATEHISTORY,
  DELETEUSER,
  GETDESTINATIONURL,
  GETALLMANUFACTURER,
  DELETEMANUFACTURER,
  ADDMANUFACTURER,
  GETINFORMATIONCYLINDERS,
  DELETEPRODUCTURL,
  SEARCHCYLINDER,
  LISTHISTORYPRICE,
  UPDATEPRODUCT,
  PRICEHISTORY,
  GETLISTCUSTOMER,
  GETALLFACTORY,
  PARTNER,
  FIXER_PARTNER,
  EXPORT_PLACE,
  REPORT_CHART,
  REPORT_PIE_CHART,
  GET_REPORT_CHILD,
  REPORT_TURN_BACK_INFO,
  CALL_DATA_TURN_BACK_INFO,
  GET_CHILD_END_NUMBER_IMPORT,
  EXPORT_CYLINDER_BY_HISTORY,
  UPDATEUSERURL,
  EXPORT_REPORT_BY_TARGET_AND_DATETIME,
  GETALLREPORTNEW,
  GETLISTSCHEDULE,
  GETINFORMATIONCYLINDERSEXCEL,
  ADDCUSTOMER,
  ADDRENTALPARTNER,
  GETRENTALPARTNER,
  GETLISTBRANCH,
  GETTYPECUSTOMER,
  GETLISTMANUFACTURE,
  ADDTRUCK,
  GETTRUCK,
  UPDATETRUCK,
  DELETEREQUEST,
  GETLISTCUSTOMEREXCEL,
  GETLISTDRIVEREXCEL,
  GETLISTTRUCKEXCEL,
  GETLISTRENTALPARTNEREXCEL,
  IMEXGETEXPORT,
  IMEXGETCURRENTINVENTORY,
  IMEXGETSTATISTICS,
  GETEXPORTBYITSELF,
  IMEXGETCURRENTINVENTORYBYITSELF
}