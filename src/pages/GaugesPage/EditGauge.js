import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { isLoading } from '../../actions/loading';
import { loadGauge, updateGauge, gaugeSelector } from '../../actions/gauges';
import { loadAccesses, accessListSelector } from '../../actions/accesses';
import { createReading, loadReadings, readingListSelector } from '../../actions/readings';

import { GaugesValidationSchema, newReadingValidationSchema } from "../../helpers/validationSchemas";
import { Formik } from 'formik';
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import { CustomButton } from '../../component/buttons/index';
import { ReadingTable } from "../../component/table";
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
    textHalfField: {
        margin: theme.spacing(1,1,1,0),
        width: "50%",
        fontSize: '2.4rem'
    },
    reading_dateField: {
        marginLeft: "10%",
        fontSize: '2.4rem'
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
    button: {
        padding: theme.spacing(1, 1, 1, 1),
        paddingRight: 0,
        float: "right"
    },
    table: {
        padding: theme.spacing(1, 1, 1, 1),
    },
    action: {
        cursor: "pointer"
    }
}));

function EditGauge({
    loadGauge,
    getGauge,
    updateGauge,
    loadAccesses,
    accessList,
    createReading,
    loadReadings,
    readingList,
    loading,
    match,
    history,
    lang
}) {
    const classes = useStyles();
    let t = useTranslate("Gauges");
    let t1 = useTranslate("Readings");

    const emptyFormGauges = {
        serial: "",
        type: "",
        initial_count: "",
        current_count: "",
        state: "",
        install_date: "",
        next_calibration: "",
        used_gauge: ""
    };
    
    const emptyReading = {
        reading_date: '',
        value: ''
    };
    
    const states = [
        {
            id: 0,
            value: 'Active'
        },
        {
            id: 1,
            value: 'In stock'
        },
        {
            id: 2,
            value: 'Removed'
        }
    ];

    const id = match.params.id;

    useEffect(() => {
        loadAccesses();
        loadReadings();
        loadGauge(id);
    }, []);
    
    const [selectedReadingDate, setSelectedReadingDate] = React.useState(new Date());
    const [selectedInstallDate, setSelectedInstallDate] = React.useState(null);
    const [selectedCalibrationDate, setSelectedCalibrationDate] = React.useState(null);
    const [isSetNextCalibrationDate, setIsSetNextCalibrationDate] = React.useState(true);

    const gauge = getGauge(id) || emptyFormGauges;
    useEffect(() => {
        setSelectedInstallDate(gauge.install_date ? moment(gauge.install_date).format("MM/DD/YYYY") : null);
        setSelectedCalibrationDate(gauge.next_calibration ? moment(gauge.next_calibration).format("MM/DD/YYYY") : null);
    }, [gauge]);
    
    const readings = readingList.filter(reading=>reading.gauge === id).sort((a,b) => parseInt(b.new_value) - parseInt(a.new_value));
    var data = [];
    for(var i=0; i<readings.length; i++) {
        data[i] = {
            id: readings[i].id,
            reading_date: moment(readings[i].reading_date).format(lang==="en" ? "YYYY-MM-DD" : "MM.DD.YYYY"),
            gauge: gauge.serial,
            old_value: readings[i].old_value,
            new_value: readings[i].new_value,
            difference: parseInt(readings[i].new_value) - parseInt(readings[i].old_value),
            billed: readings[i].billed
        }
    }
    useEffect(() => {
        setSelectedReadingDate(readings[0] ? moment(readings[0].reading_date).format("MM/DD/YYYY") : new Date());
    }, [readingList]);

    const billedLookup = {
        0: "yes",
        1: "no"
    }
    const columns = [
        { title: t1(`date-${lang}`), field: 'reading_date', editable: "never" },
        { title: t1(`gauge-${lang}`), field: 'gauge', editable: "never" },
        { title: t1(`old_value-${lang}`), field: 'old_value', editable: "never" },
        { title: t1(`new_value-${lang}`), field: 'new_value', type: 'numeric', cellStyle:{textAlign: "center"}, headerStyle: {textAlign: "center"} },
        { title: t1(`difference-${lang}`), field: 'difference', editable: "never" },
        { title: t1(`billed-${lang}`), field: 'billed', lookup: billedLookup, editable: "never" }
    ];

    const handleReadingDateChange = date => {
        setSelectedReadingDate(date);
    };
    const handleInstallDateChange = date => {
        setSelectedInstallDate(date);
    };
    const handleCalibrationDateChange = date => {
        setIsSetNextCalibrationDate(false);
        setSelectedCalibrationDate(date);
    };
    return (
        <div className={classes.grow}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <Formik
                        initialValues={{
                            ...gauge, 
                            state: states.find(state=>state.id===gauge.state) ? states.find(state=>state.id===gauge.state).value : "",
                        }}
                        validationSchema={GaugesValidationSchema}
                        onSubmit={async (values, actions) => {
                            actions.setSubmitting(true);
                            values.install_date = selectedInstallDate;
                            values.next_calibration = selectedCalibrationDate;
                            await updateGauge({
                                ...gauge,
                                ...values,
                                state: states.find(state=>state.value===values.state).id
                            });
                            isSetNextCalibrationDate(true);
                            await loadGauge(id);
                            actions.setSubmitting(false);
                        }}
                        render={props => (
                            <form className={classes.container} noValidate autoComplete="off" onSubmit={props.handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item md={9} xs={9}>
                                        <div className={classes.label}>
                                            <span>{t(`gauge_span-${lang}`)} - {props.values.serial}</span>
                                        </div>
                                    </Grid>
                                    <Grid item md={3} xs={3}>
                                        <div className={classes.button}>
                                            {props.values.state !== "Removed" ? <CustomButton
                                                text={t(`update_btn-${lang}`)}
                                                type="submit"
                                                disabled={props.isSubmitting || !props.isValid && isSetNextCalibrationDate}
                                            /> : ""}
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item md={6} xs={6}>
                                        <Paper className={classes.paper}>
                                            <TextField
                                                id="serial"
                                                name="serial"
                                                label={t(`serial-${lang}`)+'*'}
                                                className={classes.textField}
                                                margin="normal"
                                                variant="outlined"
                                                disabled={props.values.state === "Removed"}
                                                error={Boolean(props.touched.serial && props.errors.serial)}
                                                helperText={props.touched.serial ? props.errors.serial : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.serial}
                                            />
                                            <TextField
                                                id="type"
                                                name="type"
                                                label={t(`type-${lang}`)}
                                                className={classes.textField}
                                                margin="normal"
                                                variant="outlined"
                                                disabled={props.values.state === "Removed"}
                                                error={Boolean(props.touched.type && props.errors.type)}
                                                helperText={props.touched.type ? props.errors.type : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.type}
                                            />
                                            <TextField
                                                id="initial_count"
                                                name="initial_count"
                                                label={t(`initial_count-${lang}`)}
                                                className={classes.textField}
                                                margin="normal"
                                                variant="outlined"
                                                disabled={props.values.state === "Removed" || props.values.state !== "In stock"}
                                                error={Boolean(props.touched.initial_count && props.errors.initial_count)}
                                                helperText={props.touched.initial_count ? props.errors.initial_count : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.initial_count}
                                            />
                                            <TextField
                                                id="current_count"
                                                name="current_count"
                                                label={t(`current_count-${lang}`)}
                                                className={classes.textField}
                                                margin="normal"
                                                variant="outlined"
                                                disabled={true}
                                                error={Boolean(props.touched.current_count && props.errors.current_count)}
                                                helperText={props.touched.current_count ? props.errors.current_count : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.current_count}
                                            />
                                        </Paper>
                                    </Grid>
                                    <Grid item md={6} xs={6}>
                                        <Paper className={classes.paper}>
                                            <TextField
                                                id="state"
                                                name="state"
                                                label={t(`state-${lang}`)}
                                                className={classes.textField}
                                                disabled={true}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.state && props.errors.state)}
                                                helperText={props.touched.state ? props.errors.state : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.state}
                                            />
                                            {props.values.state !== "In stock" ? <TextField
                                                id="used_gauge"
                                                name="used_gauge"
                                                label={t(`wateracess-${lang}`)}
                                                className={classes.textField}
                                                disabled={true}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.used_gauge && props.errors.used_gauge)}
                                                helperText={props.touched.used_gauge ? props.errors.used_gauge : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.used_gauge}
                                            /> : "" }
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                        id="install_date"
                                                        name="install_date"
                                                        label={t(`install_date-${lang}`)}
                                                        className={classes.textField}
                                                        disableToolbar
                                                        autoOk
                                                        variant="inline"
                                                        format="MM/dd/yyyy"
                                                        margin="normal"
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                        }}
                                                        disabled={true}
                                                        value={selectedInstallDate}
                                                        onChange={handleInstallDateChange}
                                                    />
                                            </MuiPickersUtilsProvider>    
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                        id="next_calibration"
                                                        name="next_calibration"
                                                        label={t(`next_calibration-${lang}`)}
                                                        className={classes.textField}
                                                        disableToolbar
                                                        autoOk
                                                        variant="inline"
                                                        format="MM/dd/yyyy"
                                                        margin="normal"
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                        }}
                                                        disabled={props.values.state === "Removed"}
                                                        value={selectedCalibrationDate}
                                                        onChange={handleCalibrationDateChange}
                                                    />
                                            </MuiPickersUtilsProvider>                                                                   
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    />
                    <Formik
                        initialValues={emptyReading}
                        validationSchema={newReadingValidationSchema}
                        onSubmit={async (values, actions) => {
                            actions.setSubmitting(true);
                            var new_value = 0;
                            var old_value = 0;
                            if(readings[0]) {
                                new_value = values.value;
                                old_value = readings[0].new_value;
                            } else {
                                new_value = values.value;
                                old_value = gauge.initial_count;
                            }
                            if(parseInt(new_value) <= parseInt(old_value)) {
                                alert(`The new value must be bigger than old value ${old_value}.`)
                            } else {
                                await createReading({
                                    gauge: id,
                                    new_value: new_value,
                                    old_value: old_value,
                                    reading_date: selectedReadingDate,
                                    billed: 1
                                })
                                await updateGauge({
                                    ...gauge,
                                    current_count: new_value
                                });
                                await loadGauge(id);
                                await loadReadings();
                            }
                            actions.setSubmitting(false);
                        }}
                        render={props => (
                            <form className={classes.container} noValidate autoComplete="off" onSubmit={props.handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item md={12} xs={12}>
                                        <Paper className={classes.paper}>
                                            {gauge.state === 0 ? 
                                                (<><span className={classes.label}>{t1(`new_reading_title-${lang}`)}</span>
                                                <Grid container spacing={3}>
                                                    <Grid item md={3} xs={3}>
                                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                            <KeyboardDatePicker
                                                                    id="reading_date"
                                                                    label={t1(`new_reading_date-${lang}`)}
                                                                    className={classes.reading_dateField}
                                                                    disableToolbar
                                                                    autoOk
                                                                    variant="inline"
                                                                    format="MM/dd/yyyy"
                                                                    margin="normal"
                                                                    minDate={readings[0] ? moment(readings[0].reading_date).format("MM/DD/YYYY") : null}
                                                                    KeyboardButtonProps={{
                                                                        'aria-label': 'change date',
                                                                    }}
                                                                    value={selectedReadingDate}
                                                                    onChange={handleReadingDateChange}
                                                                />
                                                        </MuiPickersUtilsProvider>
                                                    </Grid>
                                                    <Grid item md={6} xs={6}>
                                                        <TextField
                                                            id="value"
                                                            name="value"
                                                            label={t1(`value-${lang}`)+'*'}
                                                            className={classes.textField}
                                                            margin="normal"
                                                            variant="outlined"
                                                            type="number"
                                                            error={Boolean(props.touched.value && props.errors.value)}
                                                            helperText={props.touched.value ? props.errors.value : ''}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                            value={props.values.value}
                                                        />
                                                    </Grid>
                                                    <Grid item md={3} xs={3}>
                                                        <div className={classes.button}>
                                                            <CustomButton
                                                                text={t1(`new_reading_btn-${lang}`)}
                                                                type="submit"
                                                                disabled={props.isSubmitting || !props.isValid}
                                                            />
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </>): (<span className={classes.label}>{t1(`reading_title-${lang}`)}</span>)}
                                            <Grid container spacing={3}>
                                                <Grid item md={12} xs={12}>
                                                    <ReadingTable
                                                        data={data}
                                                        columns={columns}
                                                        gauge={id}
                                                        current_gauge = {gauge}
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
};

const mapStateToProps = state => ({
    getGauge(id) {
        return gaugeSelector(id)(state)
    },
    accessList: accessListSelector(state),
    readingList: readingListSelector(state),
    loading: isLoading(loadGauge)(state),
});

const mapDispatchToProps = {
    loadAccesses,
    updateGauge,
    loadGauge,
    createReading,
    loadReadings
};

export default connect(mapStateToProps, mapDispatchToProps)(EditGauge);
