import axios from 'axios';
import {IMEXGETSTATISTICS} from 'config';
import getUserCookies from 'getUserCookies'
import Constants from "Constants";
import { type } from 'jquery';
import { isNull } from 'lodash';
async function imexGetStatistics( endDate="",startDate="",target = "",statisticalType="") {
    var user_cookies = await getUserCookies();
    if(startDate=="" 
        && endDate=="" 
        && target=="" 
        && statisticalType==""
        && user_cookies.user.userType==='Factory' 
        && user_cookies.user.userRole==='Owner'
    ){
        startDate=new Date(0).toISOString();
        endDate=new Date().toISOString();
        statisticalType="byItself";
        target=user_cookies.user.id;
    }else if(startDate=="" 
    && endDate=="" 
    && target=="" 
    && statisticalType==""
    && user_cookies.user.userType==='Factory' 
    && user_cookies.user.userRole==='SuperAdmin'){
        startDate=new Date(0).toISOString();
        endDate=new Date().toISOString();
        statisticalType="byItsChildren";
        target=user_cookies.user.id;
    } else if (startDate == ""
        && endDate == ""
        && target == ""
        && statisticalType == ""
        && user_cookies.user.userType === 'Agency'
        && user_cookies.user.userRole === 'SuperAdmin') {
        startDate = new Date(0).toISOString();
        endDate = new Date().toISOString();
        statisticalType = "byItself";
        target = user_cookies.user.id;
    }
    console.log("dddddddddddddddd",statisticalType);
    // console.log("user_cookies", user_cookies.user.parentRoot);
    let data;
    if (user_cookies) {
        let url = IMEXGETSTATISTICS + `?target=${ target}&startDate=${startDate}&endDate=${endDate}&statisticalType=${statisticalType}`
        //console.log("user_cookies",user_cookies);
        await axios.get(
            url,
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token
                    /*"Authorization": "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
                }
            }
        )
            .then(function (response) {
                data = response;
            })
            .catch(function (err) {
                data = err.response;
            });

        return data;
        console("dataStatic00000000000000000000000000",data);
    } else {
        return "Expired Token API";
    }
}

export default imexGetStatistics;