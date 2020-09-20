import React, { Suspense } from 'react';
import {Link} from 'react-router';
import FormContainer from './FormContainer.js';
import './main.scss';

//Change language
import i18n from '../../../helpers/i18n';
import { withNamespaces } from 'react-i18next';

class Main extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const changeLanguage = (lng) => {
            i18n.changeLanguage(lng);
        }

        return (
            <main className="main-container">
                <div className="language">
                    <img onClick={() => changeLanguage("en")} style={{height: 20, width: 30, margin: 5}} src="https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Us_flag_large_38_stars.png/1200px-Us_flag_large_38_stars.png" alt="English"/>
                    <img onClick={() => changeLanguage("vi")} style={{height: 20, width: 30, margin: 5}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1280px-Flag_of_Vietnam.svg.png" alt="Vietnamese"/>
                </div>
                <div className="row no-gutters min-h-fullscreen bg-white">
                    <div className="col-md-6 col-lg-7 col-xl-8 d-none d-md-block bg-img"
                        style={{backgroundImage: 'url(assets/img/sopet-logo.jpg)',backgroundSize: '45%',
                            backgroundPositionY: 'center'}}>
    
                        <div className="row h-100 pl-50">
                        </div>
                    </div>
    
                    <div className="col-md-6 col-lg-5 col-xl-4 align-top" style={{position:"relative"}}>
                        <div className="login">
                            <h2 style={{fontWeight: 'bold'}}> {this.props.t('LOGIN')} </h2>
                            <p>
                                <small> {this.props.t('LOGIN_INTO_SYSTEM')} </small>
                            </p>
    
                            <FormContainer />
    
                            <div className="divider"></div>
    
    
                            {/*<p className="text-center text-muted fs-13 mt-20">Bạn chưa có tài khoản? <Link to='/register'><a
        className="text-primary fw-500" >Đăng kí ngay</a></Link></p>*/}
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default withNamespaces()(Main);
