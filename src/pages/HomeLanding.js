import React from 'react';

import { Formik } from 'formik';
import { contactusValidationSchema } from '../helpers/validationSchemas';
import { withRouter } from "react-router";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslate } from "react-translate";

function HomeLanding({
    history,
    lang
}) {
    const emptyFormData = {
        name: '',
        email: '',
        message: '',
    };
    let t = useTranslate("Landing");

    return (
        <div>
            <section className="hme_ftur_section" id="feature">
                <div className="wrapper">
                    <h2>{t(`hme_ftur_section_h2-${lang}`)}</h2>
                    <Slider 
                        dots={true}
                        arrows={false}
                        autoplay={true}
                        autoplaySpeed={4000}
                        infinite={true}
                        speed={500}
                        slidesToShow={3}
                        slidesToScroll={3}
                        responsive={[
                            {
                                breakpoint: 767,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                    infinite: true,
                                    dots: true,
                                    arrows: false,
                                    autoplay: false
                                }
                            }
                        ]}
                    >
                        <div className="hme-ftr_li_wrpr">
                            <span className="hme_ftr_icon"><img src="assets/static/images/glass-i.png" alt="glass" /></span>
                            <span className="hme_ftr_h">{t(`hme-ftr_li_wrpr_span_1-${lang}`)}</span>
                            <p>{t(`hme-ftr_li_wrpr_p_1-${lang}`)}</p>
                        </div>
                        <div className="hme-ftr_li_wrpr">
                            <span className="hme_ftr_icon"><img src="assets/static/images/box-i.png" alt="glass" /></span>
                            <span className="hme_ftr_h">{t(`hme-ftr_li_wrpr_span_2-${lang}`)}</span>
                            <p>{t(`hme-ftr_li_wrpr_p_2-${lang}`)}</p>
                        </div>
                        <div className="hme-ftr_li_wrpr">
                            <span className="hme_ftr_icon"><img src="assets/static/images/drop-i.png" alt="glass" /></span>
                            <span className="hme_ftr_h">{t(`hme-ftr_li_wrpr_span_3-${lang}`)}</span>
                            <p>{t(`hme-ftr_li_wrpr_p_3-${lang}`)}</p>
                        </div>
                        <div className="hme-ftr_li_wrpr">
                            <span className="hme_ftr_icon"><img src="assets/static/images/drop-i.png" alt="glass" /></span>
                            <span className="hme_ftr_h">{t(`hme-ftr_li_wrpr_span_4-${lang}`)}</span>
                            <p>{t(`hme-ftr_li_wrpr_p_4-${lang}`)}</p>
                        </div>
                        <div className="hme-ftr_li_wrpr">
                            <span className="hme_ftr_icon"><img src="assets/static/images/drop-i.png" alt="glass" /></span>
                            <span className="hme_ftr_h">{t(`hme-ftr_li_wrpr_span_5-${lang}`)}</span>
                            <p>{t(`hme-ftr_li_wrpr_p_5-${lang}`)}</p>
                        </div>
                        <div className="hme-ftr_li_wrpr">
                            <span className="hme_ftr_icon"><img src="assets/static/images/drop-i.png" alt="glass" /></span>
                            <span className="hme_ftr_h">{t(`hme-ftr_li_wrpr_span_6-${lang}`)}</span>
                            <p>{t(`hme-ftr_li_wrpr_p_6-${lang}`)}</p>
                        </div>
                        <div className="hme-ftr_li_wrpr">
                            <span className="hme_ftr_icon"><img src="assets/static/images/drop-i.png" alt="glass" /></span>
                            <span className="hme_ftr_h">{t(`hme-ftr_li_wrpr_span_7-${lang}`)}</span>
                            <p>{t(`hme-ftr_li_wrpr_p_7-${lang}`)}</p>
                        </div>
                        <div className="hme-ftr_li_wrpr">
                            <span className="hme_ftr_icon"><img src="assets/static/images/drop-i.png" alt="glass" /></span>
                            <span className="hme_ftr_h">{t(`hme-ftr_li_wrpr_span_8-${lang}`)}</span>
                            <p>{t(`hme-ftr_li_wrpr_p_8-${lang}`)}</p>
                        </div>
                    </Slider>
                </div>
            </section>
            <section className="hme_pricing_sec" id="pricing">
                <div className="wrapper">
                    <h2 className="hme_h2">{t(`hme_pricing_sec_h2-${lang}`)}</h2>
                    <ul className="hme_prc_ul">
                        <li>
                            <span className="hme_prc_packg">{t(`hme_prc_packg_1-${lang}`)}</span>
                            <ul className="hme_prc_sub_ul">
                                <li>{t(`hme_prc_packg_li_1-${lang}`)}</li>
                                <li>{t(`hme_prc_packg_li_2-${lang}`)}</li>
                                <li>{t(`hme_prc_packg_li_3-${lang}`)}</li>
                                <li>{t(`hme_prc_packg_li_4-${lang}`)}</li>
                                <li>{t(`hme_prc_packg_li_5-${lang}`)}</li>
                            </ul>
                            <a href="#">{t(`hme_prc_packg_a_1-${lang}`)}</a>
                            <span className="hme_prc_ul_price hme_prc_ul_price_1">ab 0 €<span>{t(`hme_prc_ul_price_span_1-${lang}`)}</span></span>
                        </li>
                        <li>
                            <span className="hme_prc_packg">{t(`hme_prc_packg_2-${lang}`)}</span>
                            <ul className="hme_prc_sub_ul">
                                <li>{t(`hme_prc_packg_li_21-${lang}`)}</li>
                                <li>{t(`hme_prc_packg_li_22-${lang}`)}</li>
                                <li>{t(`hme_prc_packg_li_23_1-${lang}`)} <br />{t(`hme_prc_packg_li_23_2-${lang}`)}</li>
                                <li>{t(`hme_prc_packg_li_24-${lang}`)}</li>
                                <li>{t(`hme_prc_packg_li_25-${lang}`)}</li>
                                <li>{t(`hme_prc_packg_li_26-${lang}`)}</li>
                                <li>{t(`hme_prc_packg_li_27-${lang}`)}</li>
                            </ul>
                            <a href="#contact">{t(`hme_prc_packg_a_2-${lang}`)}</a>
                            <span className="hme_prc_ul_price hme_prc_ul_price_1">ab 1 €<span>{t(`hme_prc_ul_price_span_2-${lang}`)}</span></span>
                        </li>
                        <li>
                            <span className="hme_prc_packg">{t(`hme_prc_packg_3-${lang}`)}</span>
                            <ul className="hme_prc_sub_ul">
                                <li>{t(`hme_prc_packg_li_31-${lang}`)}</li>
                                <li>{t(`hme_prc_packg_li_32-${lang}`)}</li>
                                <li>{t(`hme_prc_packg_li_33_1-${lang}`)} <br />{t(`hme_prc_packg_li_33_2-${lang}`)}</li>
                                <li>{t(`hme_prc_packg_li_34-${lang}`)}</li>
                                <li>{t(`hme_prc_packg_li_35-${lang}`)}</li>
                                <li>{t(`hme_prc_packg_li_36-${lang}`)}</li>
                                <li>{t(`hme_prc_packg_li_37-${lang}`)}</li>
                                <li>{t(`hme_prc_packg_li_38-${lang}`)}</li>
                            </ul>
                            <a href="#contact">{t(`hme_prc_packg_a_3-${lang}`)}</a>
                            <span className="hme_prc_ul_price hme_prc_ul_price_1">25 €<span>{t(`hme_prc_ul_price_span_3-${lang}`)}</span></span>
                        </li>
                    </ul>
                </div>
            </section>
            <section className="hem_team_sec" id="team">
                <div className="wrapper">
                    <h2 className="hme_h2">{t(`hem_team_sec_h2-${lang}`)}</h2>
                    <Slider
                        className="hme_our_team"
                        autoplay={true}
                        autoplaySpeed={2000}
                        infinite={true}
                        speed={3000}
                        slidesToShow={4}
                        slidesToScroll={1}
                        cssEase="linear"
                        responsive={[
                            {
                                breakpoint: 767,
                                settings: {
                                    autoplay: true,
                                    autoplaySpeed: 2000,
                                    infinite: true,
                                    speed: 3000,
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                }
                            }
                        ]}
                    >
                        <a className="hme_tm_inner">
                            <span className="hme_team_img"><img src="assets/static/images/li1.png" alt="team" /></span>
                            <span className="hme_team_name">{t(`hme_tm_inner_span_1-${lang}`)}</span>
                            <span className="hme_team_loc"><i className="fa fa-map-marker" aria-hidden="true"></i>{t(`hme_tm_inner_span_2-${lang}`)}</span>
                        </a>
                        <a className="hme_tm_inner">
                            <span className="hme_team_img"><img src="assets/static/images/li2.png" alt="team" /></span>
                            <span className="hme_team_name">{t(`hme_tm_inner_span_3-${lang}`)}</span>
                            <span className="hme_team_id">{t(`hme_tm_inner_span_4-${lang}`)}</span>
                            <span className="hme_team_loc"><i className="fa fa-map-marker" aria-hidden="true"></i>{t(`hme_tm_inner_span_5-${lang}`)}</span>
                        </a>
                        <a className="hme_tm_inner">
                            <span className="hme_team_img"><img src="assets/static/images/l3.png" alt="team" /></span>
                            <span className="hme_team_name">{t(`hme_tm_inner_span_6-${lang}`)}</span>
                            <span className="hme_team_id">{t(`hme_tm_inner_span_7-${lang}`)}</span>
                            <span className="hme_team_loc"><i className="fa fa-map-marker" aria-hidden="true"></i>{t(`hme_tm_inner_span_8-${lang}`)}</span>
                        </a>
                        <a className="hme_tm_inner">
                            <span className="hme_team_img"><img src="assets/static/images/l4.png" alt="team" /></span>
                            <span className="hme_team_name">{t(`hme_tm_inner_span_9-${lang}`)}</span>
                            <span className="hme_team_id">{t(`hme_tm_inner_span_10-${lang}`)}</span>
                            <span className="hme_team_loc"><i className="fa fa-map-marker" aria-hidden="true"></i>{t(`hme_tm_inner_span_11-${lang}`)}</span>
                        </a>
                        <a className="hme_tm_inner">
                            <span className="hme_team_img"><img src="assets/static/images/l3.png" alt="team" /></span>
                            <span className="hme_team_name">{t(`hme_tm_inner_span_12-${lang}`)}</span>
                            <span className="hme_team_id">{t(`hme_tm_inner_span_13-${lang}`)}</span>
                            <span className="hme_team_loc"><i className="fa fa-map-marker" aria-hidden="true"></i>{t(`hme_tm_inner_span_14-${lang}`)}</span>
                        </a>
                    </Slider>
                </div>
            </section>
            <section className="hme_contct_sec" id="contact" >
                <div className="wrapper">
                    <div className="hme_cnct_frm_div">
                        <Formik
                            initialValues={emptyFormData}
                            validationSchema={contactusValidationSchema}
                            onSubmit={async (values, actions) => {
                                actions.setSubmitting(true);
                                console.log("contact us", values)
                                actions.setSubmitting(false);
                            }}
                            render={props => (
                                <form className="hme_cnct_frm" noValidate autoComplete="off" onSubmit={props.handleSubmit} >
                                    <input 
                                        type="text" 
                                        name="name" 
                                        placeholder={t(`hme_contct_sec_name-${lang}`)+'*'}
                                        error={(props.touched.name && props.errors.name)}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.name}
                                    />
                                    <span className='helperText'>{props.touched.name ? props.errors.name : ''}</span>
                                    <input 
                                        type="text" 
                                        name="email" 
                                        placeholder={t(`hme_contct_sec_email-${lang}`)+'*'}
                                        error={(props.touched.email && props.errors.email)}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.email}
                                    />
                                    <span className='helperText'>{props.touched.email ? props.errors.email : ''}</span>
                                    <textarea 
                                        name="message"
                                        placeholder={t(`hme_contct_sec_message-${lang}`)+'*'}
                                        error={(props.touched.message && props.errors.message)}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.message}
                                    />
                                    <span className='helperText'>{props.touched.message ? props.errors.message : ''}</span>
                                    <button 
                                        type="submit"
                                        className="contact_us_btn"
                                        disabled={props.isSubmitting || !props.isValid}
                                    >{t(`hme_contct_sec_contact_us_btn-${lang}`)}</button>
                                </form>
                            )}
                        />
                    </div>
                    <div className="hme_cnct_right">
                        <h2 className="hme_h2">{t(`hme_cnct_right_h2-${lang}`)}</h2>
                        <p>{t(`hme_cnct_right_p-${lang}`)}</p>
                        <ul className="hme_cnct_ul">
                            <li>
                                <div className="hme_cnct_dtl">
                                    <h3>{t(`hme_cnct_right_h3_1-${lang}`)}</h3>
                                    <span>{t(`hme_cnct_right_span_1-${lang}`)}</span>
                                </div>
                            </li>
                            <li>
                                <div className="hme_cnct_dtl">
                                    <h3>{t(`hme_cnct_right_h3_2-${lang}`)}</h3>
                                    <span>{t(`hme_cnct_right_span_2-${lang}`)}</span>
                                </div>
                            </li>
                            <li>
                                <div className="hme_cnct_dtl">
                                    <h3>{t(`hme_cnct_right_h3_3-${lang}`)}</h3>
                                    <span>{t(`hme_cnct_right_span_3_1-${lang}`)} <br />{t(`hme_cnct_right_span_3_2-${lang}`)}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default withRouter(HomeLanding);