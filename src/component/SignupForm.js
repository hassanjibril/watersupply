import React, {useState, useEffect} from 'react';
import { Auth } from 'aws-amplify';
import { connect } from 'react-redux';
import { createUser } from '../actions/users';
import { loadDemoOrgs, demoOrgListSelector } from '../actions/settings';
import { withRouter } from "react-router";

import { Formik } from 'formik';
import { signupValidationSchema } from '../helpers/validationSchemas';
import moment from 'moment';
import { useTranslate } from "react-translate";

function SignupForm({
    createUser,
    loadDemoOrgs,
    demoOrgList,
    history,
    closeModal,
    openLoginModal
}) {
    let t = useTranslate("Signup");
    const lang = localStorage.getItem("lang") ?  localStorage.getItem("lang") : "de";
    const emptyFormData = {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        c_password: ''
    };
    const [user, setUser] = useState({});
    const [verification, setVerification] = useState(false);

    useEffect(() => {
        loadDemoOrgs();
    }, [])

    const resend = (username) => {
        Auth.resendSignUp(username).then(() => {
            console.log('code resent successfully');
        }).catch(e => {
            console.log(e);
        });
    }

    return(
        <div>
            {!verification ? 
                <div id="signup" className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={()=>closeModal(false)}>&times;</span>
                        <span className="popup_heading">{t(`popup_heading-${lang}`)}</span>
                        <Formik
                            initialValues={emptyFormData}
                            validationSchema={signupValidationSchema}
                            onSubmit={async (values, actions) => {
                                actions.setSubmitting(true);
                                if(values.password !=values.c_password) {
                                    alert(t(`pwd_unmatched-${lang}`))
                                }
                                else {
                                    Auth.signUp({
                                        username: values.email,
                                        password: values.password,
                                        attributes: {
                                            email: values.email,
                                            // other custom attributes 
                                        }
                                    })
                                    .then(data => {
                                        setUser({
                                            name: values.first_name + " " + values.last_name,
                                            username: values.email,
                                            password: values.password,
                                            email: values.email
                                        });
                                        setVerification(true);
                                    })
                                    .catch(err => console.log(err));
                                }
                                actions.setSubmitting(false);
                            }}
                            render={props => (
                                <form className="signup_form" noValidate autoComplete="off" onSubmit={props.handleSubmit}>
                                    {/* <input type="hidden" name="_token" value="7ySUv5mcDtKFf71nSUJCU38xoMR1M4rtVNzoWm6Y" /> */}
                                    <input 
                                        type="text" 
                                        id="first_name"
                                        name="first_name" 
                                        placeholder={t(`first_name-${lang}`)+'*'} 
                                        error={(props.touched.first_name && props.errors.first_name)}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.first_name}
                                    />
                                    <span className='helperText'>{props.touched.first_name ? props.errors.first_name : ''}</span>
                                    <input 
                                        type="text" 
                                        id="last_name"
                                        name="last_name" 
                                        placeholder={t(`last_name-${lang}`)+'*'} 
                                        error={(props.touched.last_name && props.errors.last_name)}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.last_name}
                                    />
                                    <span className='helperText'>{props.touched.last_name ? props.errors.last_name : ''}</span>
                                    <input 
                                        type="text" 
                                        id="email"
                                        name="email" 
                                        placeholder={t(`email-${lang}`)+'*'} 
                                        error={(props.touched.email && props.errors.email)}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.email}
                                    />
                                    <span className='helperText'>{props.touched.email ? props.errors.email : ''}</span>
                                    <input 
                                        type="password" 
                                        id="password"
                                        name="password" 
                                        placeholder={t(`password-${lang}`)+'*'} 
                                        error={(props.touched.password && props.errors.password)}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.password}
                                    />
                                    <span className='helperText'>{props.touched.password ? props.errors.password : ''}</span>
                                    <input 
                                        type="password" 
                                        id="c_password"
                                        name="c_password" 
                                        placeholder={t(`re_password-${lang}`)+'*'}
                                        error={(props.touched.c_password && props.errors.c_password)}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.c_password}
                                    />
                                    <span className='helperText'>{props.touched.c_password ? props.errors.c_password : ''}</span>
                                    <button 
                                        type="submit"
                                        className="signup_btn"
                                        disabled={props.isSubmitting || !props.isValid}
                                    >{t(`signup_btn-${lang}`)}</button>
                                </form>
                            )}
                        />
                            
                        <span className="already_ac">{t(`already_ac-${lang}`)} ? <a href="#" id="alreadyAc" onClick={openLoginModal}>{t(`already_ac_a-${lang}`)}</a> </span>
                    </div>
                </div>
                : ''
            }
            {verification ? 
                <div id="verification" className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={()=>setVerification(false)}>&times;</span>
                        <span className="popup_heading">{t(`verification_popup_heading-${lang}`)}</span>
                        <Formik
                            initialValues={emptyFormData}
                            onSubmit={async (values, actions) => {
                                actions.setSubmitting(true);
                                // After retrieving the confirmation code from the user
                                Auth.confirmSignUp(user.username, values.code, {
                                    // Optional. Force user confirmation irrespective of existing alias. By default set to True.
                                    forceAliasCreation: true    
                                }).then(async data => {
                                    setVerification(false);
                                    await Auth.signIn({
                                        username: user.username,
                                        password: user.password,
                                    })
                                    .then(data => {
                                        localStorage.setItem('jwt', data.signInUserSession.accessToken.jwtToken);
                                        localStorage.setItem('username', data.username);
                                        localStorage.setItem('email', data.attributes.email);
                                        localStorage.setItem('role', 0);
                                        localStorage.setItem('org_id', demoOrgList[0].demo_organization)
                                        history.push('/dashboard')
                                    })
                                    .catch(error => {
                                        console.log("user does not exist", error)
                                    });
                                    var newData = {
                                        name: user.name,
                                        password: user.password,
                                        email: user.email,
                                        role: 0,
                                        can_login: true,
                                        org_id: demoOrgList[0].demo_organization,
                                        created_at: moment().format('YYYY-MM-DD')
                                    }
                                    await createUser(newData);
                                })
                                .catch(err => console.log(err));
                                actions.setSubmitting(false);
                            }}
                            render={props => (
                                <form className="verification_form" noValidate autoComplete="off" onSubmit={props.handleSubmit}>
                                    <input 
                                        type="text" 
                                        id="code"
                                        name="code" 
                                        placeholder="Verification Code*"
                                        onChange={props.handleChange}
                                        value={props.values.code || ''}
                                    />
                                    <button 
                                        type="submit"
                                        className="signup_btn"
                                        disabled={props.isSubmitting || !props.isValid}
                                    >{t(`verify_btn-${lang}`)}</button>
                                </form>
                            )}
                        />
                        <span className="already_ac">{t(`send_again_span-${lang}`)} ? <a id="alreadyAc" onClick={()=>resend(user.username)}>{t(`resend_a-${lang}`)}</a></span>
                    </div>
                </div>
                : ''
            }
        </div>
    )
}
const mapStateToProps = state => ({
    demoOrgList: demoOrgListSelector(state)
});

const mapDispatchToProps = {
    createUser,
    loadDemoOrgs
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignupForm));