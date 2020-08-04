import React, {useEffect} from 'react';

import { connect } from 'react-redux';
import { loadPayment, updatePayment, paymentSelector } from '../../actions/payment';
import { isLoading } from '../../actions/loading';

import { paymentTermsValidationSchema } from "../../helpers/validationSchemas";
import { Formik } from 'formik';
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {CustomButton} from '../../component/buttons'

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
    button: {
        padding: theme.spacing(1, 1, 1, 1),
        paddingRight: 0,
        float: "right"
    }
}));

function EditPayment({
    getPayment,
    loadPayment,
    updatePayment,
    match,
    loading,
    lang
}) {
    const classes = useStyles();
    let t = useTranslate("PaymentTerms");
    const id = match.params.id;
    useEffect(()=>{
        loadPayment(id);
    },[])
    const emptyPaymentTerms = {
        name: '',
        description: '',
    }
    const periods = [
        {
            value: 0,
            label: t(`monthly-${lang}`),
          },
          {
            value: 1,
            label: t(`quarterly-${lang}`),
          },
          {
            value: 2,
            label: t(`half-${lang}`),
          },
          {
            value: 3,
            label: t(`annually-${lang}`),
          }
    ];
    const payables = [
        {
            value: 0,
            label: t(`first_invoice_year-${lang}`),
          },
          {
            value: 1,
            label: t(`split_to_parts-${lang}`),
          }
    ];
    const paymentTerms = getPayment(id) || emptyPaymentTerms;
    return (
        <div className={classes.grow}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <Formik
                        initialValues={paymentTerms}
                        validationSchema={paymentTermsValidationSchema}
                        onSubmit={async (values, actions) => {
                            actions.setSubmitting(true);
                            await updatePayment({
                                ...paymentTerms,
                                ...values
                            });
                            await loadPayment(id);
                            actions.setSubmitting(false);
                        }}
                        render={props => (
                            <form className={classes.container} noValidate autoComplete="off" onSubmit={props.handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item md={9} xs={9}>
                                        <div className={classes.label}>
                                            <span>{t(`payment_title-${lang}`)} - {props.values.name}</span>
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
                                    <Grid item md={12} xs={12}>
                                        <Paper className={classes.paper}>
                                            <Grid container spacing={3}>
                                                <Grid item md={6} xs={6}>
                                                    <TextField
                                                        id="name"
                                                        name="name"
                                                        label={t(`name-${lang}`)+'*'}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        disabled={props.values.state === "Removed"}
                                                        error={Boolean(props.touched.name && props.errors.name)}
                                                        helperText={props.touched.name ? props.errors.name : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.name}
                                                    />
                                                    <TextField
                                                        id="terms"
                                                        name="terms"
                                                        label={t(`terms-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        disabled={props.values.state === "Removed"}
                                                        error={Boolean(props.touched.terms && props.errors.terms)}
                                                        helperText={props.touched.terms ? props.errors.terms : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.terms}
                                                    />
                                                    <TextField
                                                        id="basic_fee"
                                                        name="basic_fee"
                                                        label={t(`basic_fee-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        disabled={props.values.state === "Removed"}
                                                        error={Boolean(props.touched.basic_fee && props.errors.basic_fee)}
                                                        helperText={props.touched.basic_fee ? props.errors.basic_fee : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.basic_fee}
                                                    />
                                                </Grid>
                                                <Grid item md={6} xs={6}>
                                                    <TextField
                                                        select
                                                        id="period"
                                                        name="period"
                                                        label={t(`period-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={Boolean(props.touched.period && props.errors.period)}
                                                        helperText={props.touched.period ? props.errors.period : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.period}
                                                    >
                                                        {periods.map(period => (
                                                            <MenuItem key={period.value} value={period.value}>
                                                                {period.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                    <TextField
                                                        id="includes"
                                                        name="includes"
                                                        label={t(`includes-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={Boolean(props.touched.includes && props.errors.includes)}
                                                        helperText={props.touched.includes ? props.errors.includes : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.includes}
                                                    />
                                                    <TextField
                                                        id="description"
                                                        name="description"
                                                        label={t(`description-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={Boolean(props.touched.description && props.errors.description)}
                                                        helperText={props.touched.description ? props.errors.description : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.description}
                                                    />
                                                    <TextField
                                                        select
                                                        id="payable"
                                                        name="payable"
                                                        label={t(`payable-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={Boolean(props.touched.payable && props.errors.payable)}
                                                        helperText={props.touched.payable ? props.errors.payable : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.payable}
                                                    >
                                                        {payables.map(payable => (
                                                            <MenuItem key={payable.value} value={payable.value}>
                                                                {payable.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item md={6} xs={6}>
                                                    <TextField
                                                        id="water_fee_1"
                                                        name="water_fee_1"
                                                        label={t(`water_fee-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={Boolean(props.touched.water_fee_1 && props.errors.water_fee_1)}
                                                        helperText={props.touched.water_fee_1 ? props.errors.water_fee_1 : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.water_fee_1}
                                                    />
                                                    <TextField
                                                        id="water_fee_2"
                                                        name="water_fee_2"
                                                        label={t(`water_fee-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={Boolean(props.touched.water_fee_2 && props.errors.water_fee_2)}
                                                        helperText={props.touched.water_fee_2 ? props.errors.water_fee_2 : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.water_fee_2}
                                                    />
                                                    <TextField
                                                        id="water_fee_3"
                                                        name="water_fee_3"
                                                        label={t(`water_fee-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={Boolean(props.touched.water_fee_3 && props.errors.water_fee_3)}
                                                        helperText={props.touched.water_fee_3 ? props.errors.water_fee_3 : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.water_fee_3}
                                                    />
                                                </Grid>
                                                <Grid item md={3} xs={3}>
                                                    <TextField
                                                        id="from_1"
                                                        name="from_1"
                                                        label={t(`from-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={Boolean(props.touched.from_1 && props.errors.from_1)}
                                                        helperText={props.touched.from_1 ? props.errors.from_1 : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.from_1}
                                                    />
                                                    <TextField
                                                        id="from_2"
                                                        name="from_2"
                                                        label={t(`from-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={Boolean(props.touched.from_2 && props.errors.from_2)}
                                                        helperText={props.touched.from_2 ? props.errors.from_2 : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.from_2}
                                                    />
                                                    <TextField
                                                        id="from_3"
                                                        name="from_3"
                                                        label={t(`from-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={Boolean(props.touched.from_3 && props.errors.from_3)}
                                                        helperText={props.touched.from_3 ? props.errors.from_3 : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.from_3}
                                                    />
                                                </Grid>
                                                <Grid item md={3} xs={3}>
                                                    <TextField
                                                        id="to_1"
                                                        name="to_1"
                                                        label={t(`to-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={Boolean(props.touched.to_1 && props.errors.to_1)}
                                                        helperText={props.touched.to_1 ? props.errors.to_1 : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.to_1}
                                                    />
                                                    <TextField
                                                        id="to_2"
                                                        name="to_2"
                                                        label={t(`to-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={Boolean(props.touched.to_2 && props.errors.to_2)}
                                                        helperText={props.touched.to_2 ? props.errors.to_2 : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.to_2}
                                                    />
                                                    <TextField
                                                        id="to_3"
                                                        name="to_3"
                                                        label={t(`to-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={Boolean(props.touched.to_3 && props.errors.to_3)}
                                                        helperText={props.touched.to_3 ? props.errors.to_3 : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.to_3}
                                                    />
                                                </Grid>
                                                <Grid item md={12} xs={12}>
                                                    <FormControlLabel
                                                        value="use_previous_usable"
                                                        name="use_previous_usable"
                                                        label={t(`checkbox_span-${lang}`)}
                                                        className={classes.textactiveField}
                                                        control={
                                                            <Checkbox 
                                                                color="primary" 
                                                                onChange={props.handleChange}
                                                                onBlur={props.handleBlur}
                                                                checked={props.values.use_previous_usable}
                                                            />
                                                        }
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    />
                </div>
            )}
        </div>
    )
}

const mapStateToProps = state => ({
    getPayment(id) {
        return paymentSelector(id)(state)
    },
    loading: isLoading(loadPayment)(state)
});

const mapDispatchToProps = {
    loadPayment,
    updatePayment
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPayment);