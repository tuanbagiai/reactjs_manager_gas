
import React, { Component } from 'react';
import { CREATEORDER, GETALLORDER, GETORDERHISTORIES } from "./../../../config/config";
import { Row, Col, Input, Button, Table, Icon, Dropdown, Badge, Menu, Switch, Radio, Form, DatePicker, } from "antd";
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
import openNotificationWithIcon from "./../../../helpers/notification";
import { withNamespaces } from 'react-i18next';
import ReactToPrint from 'react-to-print';
import getExportDataPrint from '../../../../api/getExportDataPrint';

class formListReturn extends React.Component
{

render(){
     return(
        <div className="main-content">
          <div className="ant-row" style ={{"margin-top": "20px"}}>
            <div className="ant-col ant-col-xs-22">
              <h4>Danh Sách Hồi Lưu</h4>
              
            </div>
          </div>
          <div className="ant-spin-container">
            <div className="ant-table ant-table-default ant-table-bordered ant-table-fixed-header ant-table-layout-fixed ant-table-scroll-position-left">
              <div className="ant-table-content">
                <div className="ant-table-scroll">
                  <div className="ant-table-header ant-table-hide-scrollbar" style={{"margin-bottom": "-17px", "padding-bottom": "0px", "min-width": "17px" ,"overflow": "scroll", "textAlign": "center"}}>
                    <table className="ant-table-fixed" style={{"width": "1000px"}}>
                     <thead className="ant-table-thead">
                        <tr>

                          <th className="ant-table-expand-icon-th" title rowspan="1"></th>
                          <th className="ant-table-column-has-actions ant-table-column-has-filters">
                            <span class="ant-table-header-column">
                              <div>
                                 <span class="ant-table-column-title">Mã khách hàng</span>
                              </div>
                            </span>
                            <i aria-label="icon: search" title="Filter menu" tabindex="-1" class="anticon anticon-search ant-table-filter-icon ant-dropdown-trigger">
                            <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="search" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                            <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path></svg></i>
                          </th>

                          <th className="ant-table-column-has-actions ant-table-column-has-filters">
                            <span class="ant-table-header-column">
                              <div>
                                <span class="ant-table-column-title">Agency_id</span>
                              </div>
                            </span>
                            <i aria-label="icon: search" title="Filter menu" tabindex="-1" class="anticon anticon-search ant-table-filter-icon ant-dropdown-trigger">
                            <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="search" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                            <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path></svg></i>
                          </th>

                          <th className="ant-table-column-has-actions ant-table-column-has-filters">
                            <span class="ant-table-header-column">
                              <div>
                                <span class="ant-table-column-title">Mã kho</span>                   
                             </div>
                             </span>
                             <i aria-label="icon: search" title="Filter menu" tabindex="-1" class="anticon anticon-search ant-table-filter-icon ant-dropdown-trigger">
                             <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="search" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                             <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path></svg></i>                        
                          </th>

                          <th className="ant-table-column-has-actions ant-table-column-has-filters ant-table-column-has-sorters">
                              <span className="ant-table-header-column">
                                <div className="ant-table-column-sorters">
                                  <span className="ant-table-column-title">
                                      Ngày tạo
                                  </span>
                                  <span class="ant-table-column-sorter">
                                  <div title="Sort" class="ant-table-column-sorter-inner ant-table-column-sorter-inner-full">
                                  <i aria-label="icon: caret-up" class="anticon anticon-caret-up ant-table-column-sorter-up off">
                                  <svg viewBox="0 0 1024 1024" focusable="false" class="" data-icon="caret-up" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"></path></svg></i>
                                  <i aria-label="icon: caret-down" class="anticon anticon-caret-down ant-table-column-sorter-down off">
                                  <svg viewBox="0 0 1024 1024" focusable="false" class="" data-icon="caret-down" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path></svg></i></div></span>
                                </div>
                              </span>
                                <i aria-label="icon: search" title="Filter menu" tabindex="-1" class="anticon anticon-search ant-table-filter-icon ant-dropdown-trigger"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="search" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path></svg></i>
                           </th>

                        </tr>
                     </thead>
                    </table>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       
     );
}

}
export default formListReturn;