import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createUser, loadUser, updateUser, userSelector } from '../../actions/users';
import { loadOrgs, orgListSelector } from '../../actions/orgs';
import { loadDemoOrgs, demoOrgListSelector } from '../../actions/settings';
import { loadAccesses, accessListSelector } from '../../actions/accesses';
import { loadGauges, gaugeListSelector } from '../../actions/gauges';
import { loadPayments, paymentListSelector } from '../../actions/payment';

import { API } from 'aws-amplify';

import { isLoading } from '../../actions/loading';
import CustomTable from '../../component/table/customTable';
import { userValidationSchema } from '../../helpers/validationSchemas';
import { Formik } from 'formik';
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';

import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import { CustomButton } from '../../component/buttons/index';
import moment from 'moment';
import { useTranslate } from "react-translate";

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
        width: "100%",
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        paddingBottom: "40px"
    },
    textField: {
        margin: theme.spacing(1,1,1,0),
        width: "100%",
        fontSize: '2.4rem'
    },
    textHalfField: {
        margin: theme.spacing(1,1,1,0),
        width: "50%",
        fontSize: '2.4rem'
    },
    textPhoneNumberField: {
        margin: theme.spacing(1,1,1,0),
        width: "50%",
        fontSize: '2.4rem',
    },
    textactiveField: {
        margin: theme.spacing(1,1,1,0),
        fontSize: '2.4rem'
    },
    textplzField: {
        margin: theme.spacing(1,1,1,0),
        width: "70%",
        fontSize: '2.4rem',
    },
    textRoleField: {
        margin: theme.spacing(1,1,1,0),
        width: "20%",
        fontSize: '2.4rem'
    },
    textEmailField: {
        margin: theme.spacing(1,1,1,0),
        width: "50%",
        fontSize: '2.4rem',
    },
    textPasswordField: {
        margin: theme.spacing(1,1,1,0),
        width: "45%",
        fontSize: '2.4rem'
    },
    textVoteField: {
        margin: theme.spacing(1,1,1,0),
        width: "50%",
        fontSize: '2.4rem',
    },
    textMemberDateField: {
        marginLeft: "10%",
        fontSize: '2.4rem'
    },
    textNoteField: {
        margin: theme.spacing(1,1,1,0),
        width: '100%',
        fontSize: '2.4rem',
    },
    selectField: {
        margin: theme.spacing(1,1,1,0),
        width: "40%",
        fontSize: '2.4rem',
    },
    label: {
        color: "black",
        fontWeight: 800,
        fontSize: "1.5rem",
        padding: theme.spacing(1, 1, 1, 1),
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
          width: 600
        }
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    notesPaper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
        marginTop: "10px"
    },
    button: {
        padding: theme.spacing(1, 1, 1, 1),
        paddingRight: 0,
        float: "right"
    },
    table: {
        padding: theme.spacing(1, 1, 1, 1),
    }
}));

function EditMember({
    loadUser,
    getUser,
    updateUser,
    createUser,
    orgList,
    loadOrgs,
    loadDemoOrgs,
    demoOrgList,
    loadAccesses,
    accessList,
    loadGauges,
    gaugeList,
    loadPayments,
    paymentList,
    match,
    loading,
    lang
}) {
    const classes = useStyles();
    let t = useTranslate("Member");
    const emptyUser = {
        name: '',
        address: '',
        plz: '',
        role: 0,
        email: '',
        password: '',
        phone_number: '',
        active: false,
        iban: '',
        bic: '',
        bankname: '',
        terms: '',
        votes: 0,
        created_at: moment().format('MM/DD/YYYY'),
        can_login: false,
        notes: ''
    };
    
    const roles = [
        {
          value: 0,
          label: t(`admin-${lang}`),
        },
        {
          value: 1,
          label: t(`manager-${lang}`),
        },
        {
          value: 2,
          label: t(`member-${lang}`),
        },
    ];
    const [selectedMemberDate, setSelectedMemberDate] = React.useState(new Date());
    const [isLoginAvailability, setIsLoginAvailability] = React.useState(false);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const handleMemberDateChange = date => {
        setSelectedMemberDate(date);
    };
    const id = match.params.id;
    const user = id==="new" ? {
        name: '', 
        role: 0, 
        votes: 0, 
        created_at: moment().format('MM/DD/YYYY'), 
        can_login: false} 
    : getUser(id) || emptyUser;
    user.created_at = moment(user.created_at).format('MM/DD/YYYY');

    useEffect(() => {
        loadOrgs();
        loadDemoOrgs();
        loadGauges();
        loadAccesses();
        loadPayments();
        loadUser(id);
    }, []);
    useEffect(() => {
        setSelectedMemberDate(moment(user.created_at));
        user.can_login ? setIsLoginAvailability(true) : setIsLoginAvailability(false);
    }, [loadOrgs]);
    useEffect(() => {
        setIsUpdating(false);
    }, [user])
    const demo_org_id = demoOrgList[0] ? demoOrgList[0].demo_organization : '';
    const accesses = accessList.filter(access=>access.member === id);
    var data=[];

    for(var i=0; i<accesses.length; i++) {
        data[i]={
            id: accesses[i].id,
            name: accesses[i].name,
            gauge: gaugeList.find(gauge=>gauge.id===accesses[i].gauge) ? gaugeList.find(gauge=>gauge.id===accesses[i].gauge).serial : '',
            last_usage: accesses[i].last_usage
        }
    }
    const columns = [
        { title: t(`id-${lang}`), field: 'name', disableClick: true },
        { title: t(`gauge-${lang}`), field: 'gauge', disableClick: true },
        { title: t(`last_usage-${lang}`), field: 'last_usage', disableClick: true },
    ];
    const payments = paymentList.filter(payment=>payment.org_id === localStorage.getItem("org_id"));
    return (
        <div className={classes.grow}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <Formik
                        initialValues={user}
                        validationSchema={userValidationSchema}
                        onSubmit={async (values, actions) => {
                            actions.setSubmitting(true);
                            setIsUpdating(true);
                            var isInValid = false;
                            if(id == 'new') {
                                values.created_at = moment().format('YYYY-MM-DD');
                                if(values.can_login) {
                                    if(values.email == undefined || values.password == undefined || values.email == "" || values.password == "")
                                    {
                                        alert("Email and Temp Password must be required for login user.");
                                        isInValid = true;
                                    }
                                    else {
                                        API.post('headwater', `/user/create`, {
                                            body: {
                                                username: values.email,
                                                email: values.email,
                                                password: values.password
                                            }
                                        });
                                    }
                                }

                                if(!isInValid) {
                                    await createUser({org_id: localStorage.getItem('org_id'), ...values});
                                    await loadUser(id);
                                }
                            } else {
                                values.created_at = moment(selectedMemberDate).format('YYYY-MM-DD');
                                values.updated_at = moment().format('YYYY-MM-DD');
                                
                                if(values.can_login) {
                                    if(values.email === undefined || values.email === null) {
                                        alert("Email and Password must be required for login user.");
                                    }
                                    else {
                                        API.post('headwater', '/user/get', {
                                            body: {
                                                email: values.email
                                            }
                                        }).then(async data=>{
                                            const message = data.error ? data.error.message : '';
                                            if(message === 'User does not exist.') {
                                                if(values.password === undefined || values.password === null) {
                                                    alert("Email and Password must be required for login user.");
                                                } else {
                                                    await API.post('headwater', `/user/create`, {
                                                        body: {
                                                            username: values.email,
                                                            email: values.email,
                                                            password: values.password
                                                        }
                                                    });
                                                    await updateUser({
                                                        ...user,
                                                        ...values
                                                    });
                                                    await loadUser(id);
                                                }
                                            } else {
                                                await updateUser({
                                                    ...user,
                                                    ...values
                                                });
                                                await loadUser(id);
                                            }
                                        })
                                    }
                                }
                                else {
                                    await updateUser({
                                        ...user,
                                        ...values
                                    });
                                    await loadUser(id);
                                }
                            }
                            actions.setSubmitting(false);
                        }}
                        render={props => (
                            <form className={classes.container} noValidate autoComplete="off" onSubmit={props.handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item md={9} xs={9}>
                                        <div className={classes.label}>
                                            <span>{t(`member_span-${lang}`)} - {props.values.name}</span>
                                        </div>
                                    </Grid>
                                    <Grid item md={3} xs={3}>
                                        <div className={classes.button}>
                                            <CustomButton
                                                spinner={isUpdating && !loading ? <CircularProgress color="inherit" size={16} className="circularProgress" /> : ''}
                                                text={id==="new" ? t(`create_member_btn-${lang}`) : t(`update_member_btn-${lang}`)}
                                                type="submit"
                                                disabled={props.isSubmitting || !props.isValid}
                                            />
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item md={6} xs={6}>
                                        <Paper className={classes.paper}>
                                            <TextField
                                                id="name"
                                                name="name"
                                                label={t(`member_name-${lang}`)+'*'}
                                                className={classes.textField}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.name && props.errors.name)}
                                                helperText={props.touched.name ? props.errors.name : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.name}
                                            />
                                            <TextField
                                                id="address"
                                                name="address"
                                                label={t(`address-${lang}`)}
                                                className={classes.textField}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.address && props.errors.address)}
                                                helperText={props.touched.address ? props.errors.address : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.address}
                                            />
                                            <TextField
                                                id="plz"
                                                name="plz"
                                                label={t(`plz-${lang}`)}
                                                className={classes.textplzField}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.plz && props.errors.plz)}
                                                helperText={props.touched.plz ? props.errors.plz : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.plz}
                                            />
                                            <TextField
                                                select
                                                id="role"
                                                name="role"
                                                label={t(`role-${lang}`)+'*'}
                                                className={classes.textRoleField}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.role && props.errors.role)}
                                                helperText={props.touched.role ? props.errors.role : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.role}
                                            >
                                                {roles.map(role => (
                                                    <MenuItem key={role.value} value={role.value}>
                                                        {role.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            <TextField
                                                id="email"
                                                name="email"
                                                label={t(`email-${lang}`)}
                                                className={isLoginAvailability || id==="new" ? classes.textEmailField : classes.textField}
                                                disabled={user.password !== undefined}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.email && props.errors.email)}
                                                helperText={props.touched.email ? props.errors.email : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.email}
                                            />
                                            {isLoginAvailability || id==="new" ? <TextField
                                                id="password"
                                                name="password"
                                                label={t(`temp_password-${lang}`)}
                                                type="password"
                                                className={classes.textPasswordField}
                                                disabled={user.email !== undefined}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.password && props.errors.password)}
                                                helperText={props.touched.password ? props.errors.password : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.password}
                                            /> : ''}
                                            <TextField
                                                id="phone_number"
                                                name="phone_number"
                                                label={t(`p_number-${lang}`)}
                                                className={classes.textPhoneNumberField}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.phone_number && props.errors.phone_number)}
                                                helperText={props.touched.phone_number ? props.errors.phone_number : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.phone_number}
                                            />
                                            <FormControlLabel
                                                value="active"
                                                name="active"
                                                label={t(`active_checkbox-${lang}`)}
                                                className={classes.textactiveField}
                                                control={
                                                    <Checkbox 
                                                        color="primary" 
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        checked={props.values.active}
                                                    />
                                                }
                                            />
                                        </Paper>
                                    </Grid>
                                    <Grid item md={6} xs={6}>
                                        <Paper className={classes.paper}>
                                            <TextField
                                                id="iban"
                                                name="iban"
                                                label={t(`iban-${lang}`)}
                                                className={classes.textField}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.iban && props.errors.iban)}
                                                helperText={props.touched.iban ? props.errors.iban : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.iban}
                                            />
                                            <TextField
                                                id="bic"
                                                name="bic"
                                                label={t(`bic-${lang}`)}
                                                className={classes.textField}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.bic && props.errors.bic)}
                                                helperText={props.touched.bic ? props.errors.bic : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.bic}
                                            />
                                            <TextField
                                                id="bankname"
                                                name="bankname"
                                                label={t(`bank_name-${lang}`)}
                                                className={classes.textField}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.bankname && props.errors.bankname)}
                                                helperText={props.touched.bankname ? props.errors.bankname : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.bankname}
                                            />
                                            <TextField
                                                select
                                                id="terms"
                                                name="terms"
                                                label={t(`terms-${lang}`)}
                                                className={classes.textField}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.terms && props.errors.terms)}
                                                helperText={props.touched.terms ? props.errors.terms : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.terms}
                                            >
                                                {payments.map(payment => (
                                                    <MenuItem key={payment.id} value={payment.id}>
                                                        {payment.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            <TextField
                                                id="votes"
                                                name="votes"
                                                label={t(`votes-${lang}`)}
                                                type="number"
                                                className={classes.textVoteField}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.votes && props.errors.votes)}
                                                helperText={props.touched.votes ? props.errors.votes : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.votes}
                                            />
                                            {id !== "new" ? <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                        id="created_at"
                                                        label={t(`member_since-${lang}`)}
                                                        className={classes.textcreated_atField}
                                                        disableToolbar
                                                        autoOk
                                                        variant="inline"
                                                        format="MM/dd/yyyy"
                                                        margin="normal"
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                        }}
                                                        value={selectedMemberDate}
                                                        onChange={handleMemberDateChange}
                                                    />
                                            </MuiPickersUtilsProvider> : "" }
                                            <FormControlLabel
                                                value="can_login"
                                                name="can_login"
                                                label={t(`login_availability_checkbox-${lang}`)}
                                                disabled={localStorage.getItem('org_id')===demo_org_id}
                                                className={classes.textactiveField}
                                                control={
                                                    <Checkbox 
                                                        color="primary" 
                                                        onChange={(e) => {
                                                            setIsLoginAvailability(!isLoginAvailability)
                                                            return props.handleChange(e)
                                                        }}
                                                        onBlur={
                                                            props.handleBlur
                                                        }
                                                        checked={
                                                            props.values.can_login
                                                        }
                                                    />
                                                }
                                            />
                                        </Paper>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item md={12} xs={12}>
                                        <Paper className={classes.notesPaper}>
                                            <TextField
                                                id="notes"
                                                name="notes"
                                                label={t(`notes-${lang}`)}
                                                multiline
                                                className={classes.textNoteField}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.notes && props.errors.notes)}
                                                helperText={props.touched.notes ? props.errors.notes : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.notes}
                                            />
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    />
                    {id!=="new" ? 
                        <Grid container spacing={3}>
                            <Grid item md={12} xs={12}>
                                <CustomTable 
                                    columns={columns}
                                    data={data} 
                                    isGauge={false}
                                    memberAccess={true}
                                    lang={lang}
                                />
                            </Grid>
                        </Grid>
                    : ""}
                </div>
            )}
        </div>
    )   
};

const mapStateToProps = state => ({
    getUser(id) {
        return userSelector(id)(state)
    },
    loading: isLoading(loadUser)(state),
    orgList: orgListSelector(state),
    demoOrgList: demoOrgListSelector(state),
    accessList: accessListSelector(state),
    gaugeList: gaugeListSelector(state),
    paymentList: paymentListSelector(state),
});

const mapDispatchToProps = {
    updateUser,
    createUser,
    loadUser,
    loadOrgs,
    loadDemoOrgs,
    loadAccesses,
    loadGauges,
    loadPayments
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMember);
