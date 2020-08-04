import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";

import LoginForm from '../../component/LoginForm';
import SignupForm from '../../component/SignupForm';

import Modal from 'react-modal';
import { useMediaQuery } from 'react-responsive';
import { useTranslate } from "react-translate";

function Header({
    history
}) {
    let t = useTranslate("Header");
    const lang = localStorage.getItem("lang") ?  localStorage.getItem("lang") : "de";
    const [isLoginOpenModal, setIsLoginOpenModal] = useState(false);
    const [isSignupOpenModal, setIsSignupOpenModal] = useState(false);
    const [isExpand, setIsExpand] = useState(false);
    const [isMenuBar, setIsMenuBar] = useState(true);

    const isTabletOrMobileDevice = useMediaQuery({
        query: '(max-device-width: 767px)'
    });

    useEffect(() => {
        Modal.setAppElement('body');
    }, []);

    const openLoginModal = () => {
        if(localStorage.getItem('jwt') !== null) {
            history.push('/dashboard')
        }
        else {
            setIsSignupOpenModal(false);
            setIsLoginOpenModal(true);
        }
    }

    const openSignupModal = () => {
        setIsLoginOpenModal(false);
        setIsSignupOpenModal(true);
    }

    return(
        <header className="header_bg" id="header">
            <div className="header_main">
                <div className="wrapper">
                    <Link to="/" className="logo"><img src="assets/static/images/logo.png" alt="logo" /></Link>
                    <span className="menu" onClick={()=>setIsMenuBar(!isMenuBar)}>
                        {isMenuBar ? 
                            <div>
                                <i className="fa fa-bars" aria-hidden="true"></i>
                                {t(`MENU-${lang}`)}
                            </div>
                        :   <div>
                                <i className="fa fa-close" aria-hidden="true"></i>
                                {t(`CLOSE-${lang}`)}
                            </div> 
                        }
                    </span>
                    {!isTabletOrMobileDevice || !isMenuBar ? 
                        <nav className="header_nav">
                            <ul className="navbar_ul">
                                <li><a href="#header">{t(`HOME-${lang}`)}</a></li>
                                <li><a href="#about">{t(`SOLUTION-${lang}`)}</a></li>
                                <li><a href="#feature">{t(`FEATURES-${lang}`)}</a></li>
                                <li><a href="#pricing">{t(`OFFER & PRICES-${lang}`)}</a></li>
                                <li><a href="#team">{t(`OUR CUSTOMERS-${lang}`)}</a></li>
                                <li><a href="#contact">{t(`CONTACT-${lang}`)}</a></li>
                                <li>
                                    <select value={lang ? lang : 'de'} onChange={(e)=>{
                                        localStorage.setItem("lang", e.target.value);
                                        window.location.reload(); 
                                    }}>
                                        <option value="de">de</option>
                                        <option value="en">en</option>
                                    </select>
                                </li>
                            </ul>
                            <span className="header_nav_span"></span>
                        </nav>
                    : 
                        ''
                    }
                </div>
            </div>
            <div className="wrapper">
                <div className="banner_abut_main" >
                    <h1 className="banner_heading">{t(`banner_heading-${lang}`)}</h1>
                    <p className="banner_hd_p">{t(`banner_hd_p-${lang}`)}</p>
                    <span className="banner_link">
                        <a id="loginBtn" onClick={()=>openLoginModal()}>{t(`loginBtn-${lang}`)}</a>
                        <a id="signupBtn" onClick={()=>openSignupModal()}>{t(`signupBtn-${lang}`)}</a>
                    </span>
                    <div className="bnr_outer">
                        <div className="banner_about_div" id="about" >
                            <h2>{t(`banner_about_h2-${lang}`)}</h2>
                            <p>
                                <span>
                                    {t(`banner_about_span_1-${lang}`)}
                                </span>
                                {isExpand ? <span>
                                    <br /><br />{t(`banner_about_span_2-${lang}`)}
                                    <br /><br />{t(`banner_about_span_3-${lang}`)}
                                </span> : ''}
                            </p>
                            <a id="p_read" onClick={()=>setIsExpand(!isExpand)}>{isExpand ? t(`p_read_btn_expand-${lang}`) : t(`p_read_btn-${lang}`)}</a>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                className="modal"
                isOpen={isLoginOpenModal}
            >
                <LoginForm closeModal={isLoginCloseModal => setIsLoginOpenModal(isLoginCloseModal)} openSignupModal={openSignupModal} />
            </Modal>
            <Modal
                className="modal"
                isOpen={isSignupOpenModal}
            >
                <SignupForm closeModal={isSignupCloseModal => setIsSignupOpenModal(isSignupCloseModal)} openLoginModal={openLoginModal} />
            </Modal>
        </header>
    )
}

export default withRouter(Header);