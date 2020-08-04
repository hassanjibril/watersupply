import React, {useState} from 'react';
import { Auth } from 'aws-amplify';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { isLoading } from '../actions/loading';
import { loadUsers, userListSelector } from '../actions/users';

import CircularProgress from '@material-ui/core/CircularProgress';
import { Formik } from 'formik';
import { signInValidationSchema } from '../helpers/validationSchemas';
import { useTranslate } from "react-translate";

function LoginForm({
    userList,
    loadUsers,
    loading,
    closeModal,
    openSignupModal,
    history
}) {
    let t = useTranslate("Login");
    const lang = localStorage.getItem("lang") ?  localStorage.getItem("lang") : "de";
    const [loginErrorText, setLoginErrorText] = useState('');
    const [userData, setUserData] = useState({});
    const [newPassword, setNewPassword] = useState('');
    const [openNewPasswordModal, setOpenNewPasswordModal] = useState(false);

    const emptyFormData = {
        username: '',
        password: '',
    };

    const handleChangeNewPassword = (e) => {
        setNewPassword(e.target.value);
    }

    const confirmNewPassword = () => {
        Auth.completeNewPassword(userData, newPassword)
            .then(data => {
                console.log('data', data)
            })
            .catch(err => {
                console.log('err', err)
            })
        setOpenNewPasswordModal(false);
    }

    return(
        <div>
            {!openNewPasswordModal ? (
                <div className="modal-content">
                    <span className="close" onClick={()=>closeModal(false)}>&times;</span>
                    <span className="popup_heading">{t(`popup_heading-${lang}`)}</span>
                    <Formik
                        initialValues={emptyFormData}
                        validationSchema={signInValidationSchema}
                        onSubmit={async (values, actions) => {
                            actions.setSubmitting(true);
                            Auth.signIn({
                                username: values.username,
                                password: values.password,
                            })
                            .then(async data => {
                                if(data.challengeName == "NEW_PASSWORD_REQUIRED") {
                                    setOpenNewPasswordModal(true);
                                    setUserData(data);
                                }
                                else {
                                    const res = await loadUsers();
                                    const user = res.value.find(user=>user.email === data.username);
                                    if(user == undefined) {
                                        localStorage.setItem('role', 3);
                                        localStorage.setItem('org_id', -1);
                                    }
                                    else {
                                        localStorage.setItem('role', user.role);
                                        localStorage.setItem('org_id', user.org_id);                         
                                    }
                                    if(!user.can_login) {
                                        alert(t(`unavailable_user-${lang}`));
                                        Auth.signOut();
                                    }
                                    else {
                                        localStorage.setItem('jwt', data.signInUserSession.accessToken.jwtToken);
                                        localStorage.setItem('username', user.name);
                                        localStorage.setItem('email', data.attributes.email);
                                        history.push('/dashboard');
                                    }
                                }
                            })
                            .catch(error => {
                                setLoginErrorText(error.message);
                            });
                            actions.setSubmitting(false);
                        }}
                        render={props => (
                        <form className="login_form" noValidate autoComplete="off" onSubmit={props.handleSubmit} >
                                <span className='helperText'>{loginErrorText}</span>
                                <input 
                                    type="text" 
                                    id="username"
                                    name="username" 
                                    placeholder={t(`email-${lang}`)+'*'}
                                    error={(props.touched.username && props.errors.username)}
                                    onChange={(e)=>{
                                        setLoginErrorText('');
                                        return props.handleChange(e)
                                    }}
                                    onBlur={props.handleBlur}
                                    value={props.values.username}
                                />
                                <span className='helperText'>{props.touched.username ? props.errors.username : ''}</span>
                                <input 
                                    type="password" 
                                    id="password"
                                    name="password" 
                                    placeholder={t(`password-${lang}`)+'*'}
                                    error={(props.touched.password && props.errors.password)}
                                    onChange={(e)=>{
                                        setLoginErrorText('');
                                        return props.handleChange(e)
                                    }}
                                    onBlur={props.handleBlur}
                                    value={props.values.password}
                                />
                                <span className='helperText'>{props.touched.password ? props.errors.password : ''}</span>
                                <br/>
                                <span className="check_span">
                                    <input 
                                        type="checkbox" 
                                        id="remember"
                                        name="remember" 
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.remember}
                                    />
                                </span><label>{t(`check_span-${lang}`)}</label>                     
                                <button 
                                    type="submit"
                                    className="login_btn"
                                    disabled={props.isSubmitting || !props.isValid}
                                >{ loading && <CircularProgress color="inherit" size={16} className="circularProgress" />}{t(`login_btn-${lang}`)}</button>
                            </form>
                        )}
                    />
                    <span className="already_ac">{t(`already_ac-${lang}`)} ? <a href="#" id="dontAc" onClick={openSignupModal}>{t(`already_ac_a-${lang}`)}</a></span>
                </div>) : 
            ('')}
            {openNewPasswordModal ? 
                (<div className="modal-content">
                    <div className="login_form">
                        <input 
                            type="password" 
                            id="new password"
                            placeholder={t(`confirm_password-${lang}`)}
                            onChange={handleChangeNewPassword}
                            value={newPassword}
                            onKeyUp={(e)=>{
                                if(e.keyCode === 13) {
                                    e.preventDefault();
                                    confirmNewPassword();
                                }
                            }}
                        />
                        <button 
                            type="button"
                            className="login_btn"
                            onClick={confirmNewPassword}
                        >{t(`confirm_btn-${lang}`)}</button>
                    </div>
                </div>
                ) : 
            ('')}
        </div> 
    )
}

const mapStateToProps = state => ({
    userList: userListSelector(state),
    loading: isLoading(loadUsers)(state)
});

const mapDispatchToProps = {
    loadUsers
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginForm));