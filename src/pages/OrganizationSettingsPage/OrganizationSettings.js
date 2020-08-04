import React, { useEffect } from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { loadOrg, updateOrg, orgSelector } from '../../actions/orgs';
import { loadUsers, userListSelector } from '../../actions/users';
import { isLoading } from '../../actions/loading';
import { Formik } from 'formik';
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { orgValidationSchema } from '../../helpers/validationSchemas';

import { CustomButton } from '../../component/buttons/index';
import moment from 'moment';
import { useTranslate } from "react-translate"

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
    textTelephoneField: {
        margin: theme.spacing(1,1,1,0),
        width: "50%",
        fontSize: '2.4rem',
    },
    textMobileField: {
        margin: theme.spacing(1,1,1,0),
        width: "40%",
        fontSize: '2.4rem'
    },
    textSelectField: {
        margin: theme.spacing(1,1,1,0),
        width: "40%",
        fontSize: '2.4rem'
    },
    label: {
        color: "black",
        fontWeight: 800,
        fontSize: "1.5rem",
        padding: theme.spacing(1, 1, 1, 1),
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
          width: "100%"
        }
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    button: {
        paddingBottom: theme.spacing(1, 1, 1, 1),
        float: 'right'
    }
}));


const emptyOrg = {
    name: '',
    s_name: '',
    address1: '',
    address2: '',
    city: '',
    plz: '',
    email: '',
    telephone: '',
    mobile: '',
    fax: '',
    weburl: '',
    subscription: '',
    chairman: '',
    deputy_chairman: ''
};

function OrganizationSettings({
    loadOrg,
    getOrg,
    updateOrg,
    userList,
    loadUsers,
    loading,
    lang
}) {
    const classes = useStyles();
    let t = useTranslate("OrganizationSettings");

    const id = localStorage.getItem('org_id');
    const org = getOrg(id) || emptyOrg;
    const memberList = userList.filter(user=>user.org_id===id)
    useEffect(() => {
        loadOrg(id);
        loadUsers();
    }, []);
    return (
        <div className={classes.grow}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Formik
                    initialValues={org}
                    validationSchema={orgValidationSchema}
                    onSubmit={async (values, actions) => {
                        actions.setSubmitting(true);
                        values.updated_at = moment().format('YYYY-MM-DD')
                        await updateOrg({
                            ...org,
                            ...values
                        });
                        await loadOrg(id);
                        actions.setSubmitting(false);
                    }}
                    render={props => (
                        <form className={classes.container} noValidate autoComplete="off" onSubmit={props.handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item md={9} xs={9}>
                                    <div className={classes.label}>
                                        <span>{t(`org_setting_title-${lang}`)} - {props.values.name}</span>
                                    </div>
                                </Grid>
                                <Grid item md={3} xs={3}>
                                    <div className={classes.button}>
                                        <CustomButton
                                            text={t(`update_btn-${lang}`)}
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
                                            label={t(`name-${lang}`)+'*'}
                                            margin="normal"
                                            variant="outlined"
                                            className={classes.textField}
                                            error={Boolean(props.touched.name && props.errors.name)}
                                            helperText={props.touched.name ? props.errors.name : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.name}
                                        />
                                        <TextField
                                            id="s_name"
                                            name="s_name"
                                            label={t(`s_name-${lang}`)}
                                            margin="normal"
                                            variant="outlined"
                                            className={classes.textField}
                                            error={Boolean(props.touched.s_name && props.errors.s_name)}
                                            helperText={props.touched.s_name ? props.errors.s_name : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.s_name}
                                        />
                                        <TextField
                                            id="address1"
                                            name="address1"
                                            label={t(`address1-${lang}`)}
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                            error={Boolean(props.touched.address1 && props.errors.address1)}
                                            helperText={props.touched.address1 ? props.errors.address1 : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.address1}
                                        />
                                        <TextField
                                            id="address2"
                                            name="address2"
                                            label={t(`address2-${lang}`)}
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                            error={Boolean(props.touched.address2 && props.errors.address2)}
                                            helperText={props.touched.address2 ? props.errors.address2 : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.address2}
                                        />
                                        <TextField
                                            id="city"
                                            name="city"
                                            label={t(`city-${lang}`)}
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                            error={Boolean(props.touched.city && props.errors.city)}
                                            helperText={props.touched.city ? props.errors.city : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.city}
                                        />
                                        <TextField
                                            id="plz"
                                            name="plz"
                                            label={t(`plz-${lang}`)}
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                            error={Boolean(props.touched.plz && props.errors.plz)}
                                            helperText={props.touched.plz ? props.errors.plz : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.plz}
                                        />
                                    </Paper>
                                </Grid>
                                <Grid item md={6} xs={6}>
                                    <Paper className={classes.paper}>
                                        <TextField
                                            id="email"
                                            name="email"
                                            label={t(`email-${lang}`)}
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                            error={Boolean(props.touched.email && props.errors.email)}
                                            helperText={props.touched.email ? props.errors.email : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.email}
                                        />
                                        <TextField
                                            id="telephone"
                                            name="telephone"
                                            label={t(`telephone-${lang}`)}
                                            className={classes.textTelephoneField}
                                            margin="normal"
                                            variant="outlined"
                                            error={Boolean(props.touched.telephone && props.errors.telephone)}
                                            helperText={props.touched.telephone ? props.errors.telephone : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.telephone}
                                        />
                                        <TextField
                                            id="mobile"
                                            name="mobile"
                                            label={t(`mobile-${lang}`)}
                                            className={classes.textMobileField}
                                            margin="normal"
                                            variant="outlined"
                                            error={Boolean(props.touched.mobile && props.errors.mobile)}
                                            helperText={props.touched.mobile ? props.errors.mobile : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.mobile}
                                        />
                                        <TextField
                                            id="fax"
                                            name="fax"
                                            label={t(`fax-${lang}`)}
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                            error={Boolean(props.touched.fax && props.errors.fax)}
                                            helperText={props.touched.fax ? props.errors.fax : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.fax}
                                        />                                       
                                        <TextField
                                            id="weburl"
                                            name="weburl"
                                            label={t(`web_url-${lang}`)}
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                            error={Boolean(props.touched.weburl && props.errors.weburl)}
                                            helperText={props.touched.weburl ? props.errors.weburl : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.weburl}
                                        />
                                        <TextField
                                            id="subscription"
                                            name="subscription"
                                            label={t(`subscription-${lang}`)}
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                            disabled={true}
                                            error={Boolean(props.touched.subscription && props.errors.subscription)}
                                            helperText={props.touched.subscription ? props.errors.subscription : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.subscription}
                                        />
                                        <TextField
                                            select
                                            id="chairman"
                                            name="chairman"
                                            label={t(`chairman-${lang}`)}
                                            className={classes.textSelectField}
                                            margin="normal"
                                            variant="outlined"
                                            error={Boolean(props.touched.chairman && props.errors.chairman)}
                                            helperText={props.touched.chairman ? props.errors.chairman : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.chairman || ''}
                                        >
                                            {memberList.map(user => (
                                                <MenuItem key={user.id} value={user.name}>
                                                    {user.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <TextField
                                            select
                                            id="deputy_chairman"
                                            name="deputy_chairman"
                                            label={t(`deputy_chairman-${lang}`)}
                                            className={classes.textSelectField}
                                            margin="normal"
                                            variant="outlined"
                                            error={Boolean(props.touched.deputy_chairman && props.errors.deputy_chairman)}
                                            helperText={props.touched.deputy_chairman ? props.errors.deputy_chairman : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.deputy_chairman || ''}
                                        >
                                            {memberList.map(user => (
                                                <MenuItem key={user.id} value={user.name}>
                                                    {user.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                />
            )}
        </div>
    )   
    
};

const mapStateToProps = state => ({
    getOrg(id) {
        return orgSelector(id)(state)
    },
    loading: isLoading(loadOrg)(state),
    userList: userListSelector(state)
});

const mapDispatchToProps = {
    updateOrg,
    loadOrg,
    loadUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OrganizationSettings));
