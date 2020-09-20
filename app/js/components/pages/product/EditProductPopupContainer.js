import React from 'react';
import EditProductPopup from "./EditProductPopup";

import getAllUserApi from 'getAllUserApi';
import {push} from "react-router-redux";
import showToast from "showToast";
import editProductAPI from "editProductAPI";
import UpdateProduct from "UpdateProduct"
import {connect} from "react-redux";
import Constants from "Constants";
import getCylinderByIdAPI from 'getCylinderByIdAPI';
import getAllManufacturer from "getAllManufacturer";


class EditProductPopupContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            company_profile: {images: [], featured_image_url: null},
            categories_list: [],
            uploadLogoResult: false,
            image_link: null,
            listUsers: [],
            productDetail: {},
            listUserIds: [],
            listFactoryUser: [],
            listGeneralUser: [],
            listAgencyUser: [],
            listFactoryUserIds: [],
            listGeneralUserIds: [],
            listAgencyUserIds: [],
            listManufacturers: [],
            listManufacturerIds: [],
        };
    }

    componentDidMount() {
        this.getAllUser();
        this.getAllManufacturer();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.product_id !== this.props.product_id && this.props.product_id !== null) {
            this.getProductByProductId(this.props.product_id);
        }
    }

    async getAllManufacturer() {
        const dataUsers = await getAllManufacturer(Constants.GENERAL);
        if (dataUsers) {
            if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {

                let listManufacturerIds = [];
                for (var i = 0; i < dataUsers.data.length; i++) {
                    listManufacturerIds.push(dataUsers.data[i].id);
                }

                this.setState({listManufacturers: dataUsers.data, listManufacturerIds: listManufacturerIds});
            } else {
                showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
            }

            //this.setState({image_link: profile.data.company_logo});
        } else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }
    }

    async getProductByProductId(product_id) {
        const dataProduct = await getCylinderByIdAPI(product_id);
        if (dataProduct) {
            if (dataProduct.status === Constants.HTTP_SUCCESS_BODY) {
                // console.log("dataProduct",dataProduct);
                this.setState({productDetail: dataProduct.data});

            } else {
                showToast(dataProduct.data.message ? dataProduct.data.message : dataProduct.data.err_msg, 2000);
            }

            //this.setState({image_link: profile.data.company_logo});
        } else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }

    }

    async getAllUser() {
        //const jobMetaData = await this.getJobMetaData();

        const dataUsers = await getAllUserApi();
        // console.log("dataUsers",dataUsers);
        if (dataUsers) {
            if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
                this.setState({listUsers: dataUsers.data});
                var listUserIds = [];
                var listFactoryIds = [];
                var listGeneralIds = [];
                var listAgencyIds = [];

                let userLists = dataUsers.data;
                let userFactory = dataUsers.data.filter(x => x.userType === Constants.FACTORY);
                let userAgency = dataUsers.data.filter(x => x.userType === Constants.AGENCY);
                let userGeneral = dataUsers.data.filter(x => x.userType === Constants.GENERAL);

                for (var i = 0; i < userLists.length; i++) {
                    listUserIds.push(userLists[i].id);
                }
                for (var i = 0; i < userFactory.length; i++) {
                    listFactoryIds.push(userFactory[i].id);
                }
                for (var i = 0; i < userAgency.length; i++) {
                    listAgencyIds.push(userAgency[i].id);
                }
                for (var i = 0; i < userGeneral.length; i++) {
                    listGeneralIds.push(userGeneral[i].id);
                }


                this.setState({
                    listUserIds: listUserIds,
                    listFactoryUser: userFactory,
                    listGeneralUser: userGeneral,
                    listAgencyUser: userAgency,
                    listFactoryUserIds: listFactoryIds,
                    listGeneralUserIds: listGeneralIds,
                    listAgencyUserIds: listAgencyIds
                });


            } else {
                showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
            }

            //this.setState({image_link: profile.data.company_logo});
        } else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }

    }


    async editProduct(serial, color, checkedDate, weight, placeStatus, status, currentImportPrice, manufactureId, selectedFile, cylinderType, valve) {
        // console.log("manufactureId", manufactureId);
        // Call api
        this.setState({isLoading: true});
        const product = await UpdateProduct(serial, color, checkedDate, weight, placeStatus, status, this.props.product_id, currentImportPrice, manufactureId, selectedFile, cylinderType, valve);
        this.setState({isLoading: false});
        //console.log('register',user);
        // console.log(product);
        if (product.status === Constants.HTTP_SUCCESS_BODY && !product.hasOwnProperty("err_msg")) {
            showToast('Cập nhật thành công!', 3000);
            this.props.refresh();
        } else {
            showToast(product.data !== "" ? product.data : "", 2000);
        }
        //this.setState({registerSuccessful: false});
    }


    render() {
        return (
            <EditProductPopup
                parentRoot={this.props.parentRoot}
                listUsers={this.state.listUsers}
                editProduct={this.editProduct.bind(this)}
                productDetail={this.state.productDetail}
                listUserIds={this.state.listUserIds}
                listFactoryUser={this.state.listFactoryUser}
                listFactoryUserIds={this.state.listFactoryUserIds}
                listAgencyUser={this.state.listAgencyUser}
                listAgencyUserIds={this.state.listAgencyUserIds}
                listGeneralUser={this.state.listGeneralUser}
                listGeneralUserIds={this.state.listGeneralUserIds}
                listManufacturerIds={this.state.listManufacturerIds}
                listManufacturers={this.state.listManufacturers}
                store={this.props.store}
            />
        );
    }
}

export default connect()(EditProductPopupContainer);
;
