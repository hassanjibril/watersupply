import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { isLoading } from '../../actions/loading';

import { loadUsers, userListSelector } from '../../actions/users';
import { loadGauges, gaugeSelector, gaugeListSelector, loadGauge, updateGauge } from '../../actions/gauges';
import { loadAccesses, accessListSelector } from '../../actions/accesses';
import { createReading, loadReadings, readingListSelector } from '../../actions/readings';

import { newReadingValidationSchema } from "../../helpers/validationSchemas";
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
import { CustomButton } from '../../component/buttons';
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
    prevBtn: {
        padding: theme.spacing(1, 1, 1, 1),
        margin: theme.spacing(2, 1, 1, 1)
    },
    nextBtn: {
        padding: theme.spacing(1, 1, 1, 1),
        margin: theme.spacing(2, 1, 1, 1)
    },
    table: {
        padding: theme.spacing(1, 1, 1, 1),
    },
    action: {
        cursor: "pointer"
    }
}));

function Readings({
    loadUsers,
    userList,
    loadAccesses,
    accessList,
    loadReadings,
    readingList,
    gaugeList,
    loadGauges,
    getGauge,
    loading,
    lang
}) {
    const classes = useStyles();
    let t1 = useTranslate("Readings");
    const [selectedReadingDate, setSelectedReadingDate] = React.useState(new Date());
    const [disabledNextBtn, setDisabledNextBtn] = React.useState(false);
    const [disabledPrevBtn, setDisabledPrevBtn] = React.useState(false);
    const [index, setIndex] = React.useState(0);
    const [gauge, setGauge] = React.useState("");
    const [access, setAccess] = React.useState("");

    const emptyReading = {
        reading_date: '',
        value: ''
    };

    useEffect(()=>{
        loadAccesses();
        loadReadings();
        loadGauges();
        loadUsers();
    }, [])

    var accesses = [];
    const userName = localStorage.getItem("username");
    const userId = userList.find(user=>user.email === localStorage.getItem("email")) ? userList.find(user=>user.email === localStorage.getItem("email")).id : "";
    
    useEffect(()=>{
        if(index === 0) {
            accesses = accessList.filter(access=>access.member === userId);
            setGauge(accesses[index] ? accesses[index].gauge : "");
            setAccess(accesses[index] ? accesses[index].name : "");
            setSelectedReadingDate(moment(readings[0] ? readings[0].reading_date : new Date()).format("MM-DD-YYYY"));
            if(accesses.length < 2) {
                setDisabledNextBtn(true);
                setDisabledPrevBtn(true);
            } else {
                setDisabledPrevBtn(true);
                setDisabledNextBtn(false);
            }
        } else {
            accesses = accessList.filter(access=>access.member === userId);
            setGauge(accesses[index] ? accesses[index].gauge : "");
            setAccess(accesses[index] ? accesses[index].name : "");
        }
        
    },[userId, accessList, gaugeList]);

    const handleReadingDateChange = date => {
        setSelectedReadingDate(date);
    };

    const prevAccess = () => {
        accesses = accessList.filter(access=>access.member === userId);
        setIndex(index - 1);
        if(index === 1) {
            setDisabledPrevBtn(true);
            setDisabledNextBtn(false);
        } 
        setGauge(accesses[index-1] ? accesses[index-1].gauge : "");
        setAccess(accesses[index-1] ? accesses[index-1].name : "");
        setSelectedReadingDate(moment(readings[0] ? readings[0].reading_date : new Date()).format("MM-DD-YYYY"));
    }

    const nextAccess = () => {
        accesses = accessList.filter(access=>access.member === userId);
        setIndex(index + 1);
        if(index === accesses.length-2) {
            setDisabledNextBtn(true);
            setDisabledPrevBtn(false);
        } 
        setGauge(accesses[index+1] ? accesses[index+1].gauge : "");
        setAccess(accesses[index+1] ? accesses[index+1].name : "");
        setSelectedReadingDate(moment(readings[0] ? readings[0].reading_date : new Date()).format("MM-DD-YYYY"));
    }
    const readings = readingList.filter(reading=>reading.gauge === gauge).sort((a,b) => parseInt(b.new_value) - parseInt(a.new_value));
    var data = [];
    for(var i=0; i<readings.length; i++) {
        data[i] = {
            id: readings[i].id,
            reading_date: moment(readings[i].reading_date).format(lang==="en" ? "YYYY-MM-DD" : "MM.DD.YYYY"),
            gauge: getGauge(gauge) ? getGauge(gauge).serial : "",
            old_value: readings[i].old_value,
            new_value: readings[i].new_value,
            difference: parseInt(readings[i].new_value) - parseInt(readings[i].old_value),
            billed: readings[i].billed
        }
    }

    useEffect(() => {
        setSelectedReadingDate(readings[0] ? moment(readings[0].reading_date).format("MM/DD/YYYY") : new Date());
    }, [readings[0]]);

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
    
    return (
        <div className="readings">
            <Grid container spacing={3}>
                <Grid item md={9} xs={9}>
                    <div className={classes.label}>
                        <span>{userName}</span>
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                    <Paper className={classes.paper}>
                        <Grid container spacing={3}>
                            <Grid item md={6} xs={6}>
                                <TextField
                                    id="water_access_point"
                                    name="water_access_point"
                                    label={t1(`water_access_point-${lang}`)}
                                    className={classes.textField}
                                    disabled
                                    margin="normal"
                                    variant="outlined"
                                    value={access}
                                />
                            </Grid>
                            <Grid item md={6} xs={6}>
                                <CustomButton
                                    icon="prev"
                                    text={t1(`prev_btn-${lang}`)}
                                    color="primary"
                                    className={classes.prevBtn}
                                    onClick={prevAccess}
                                    disabled={disabledPrevBtn}
                                />
                                <CustomButton
                                    icon="next"
                                    text={t1(`next_btn-${lang}`)}
                                    color="secondary"
                                    className={classes.nextBtn}
                                    onClick={nextAccess}
                                    disabled={disabledNextBtn}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item md={6} xs={6}>
                                <TextField
                                    id="gauge"
                                    name="gauge"
                                    label={t1(`gauge-${lang}`)}
                                    className={classes.textField}
                                    disabled
                                    margin="normal"
                                    variant="outlined"
                                    value={gauge && getGauge(gauge) ? getGauge(gauge).serial : ""}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            {loading ? (
                <div>Loading...</div>
            ) : (
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
                            old_value = getGauge(gauge).initial_count ? getGauge(gauge).initial_count : 0;
                        }
                        if(parseInt(new_value) <= parseInt(old_value)) {
                            alert(`The new value must be bigger than old value ${old_value}.`)
                        } else {
                            await createReading({
                                gauge: gauge,
                                new_value: new_value,
                                old_value: old_value,
                                reading_date: selectedReadingDate,
                                billed: 1
                            })
                            await updateGauge({
                                ...getGauge(gauge),
                                current_count: new_value
                            })
                            await loadAccesses();
                            await loadGauges();
                            await loadReadings();
                        }
                        actions.setSubmitting(false);
                    }}
                    render={props => (
                        <form className={classes.container} noValidate autoComplete="off" onSubmit={props.handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item md={12} xs={12}>
                                    <Paper className={classes.paper}>
                                        {gauge && gauge.state !== 2 ? 
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
                                                    gauge={gauge}
                                                    current_gauge = {getGauge(gauge)}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                />
            )}
        </div>
    )
}

const mapStateToProps = state => ({
    getGauge(id) {
        return gaugeSelector(id)(state)
    },
    gaugeList: gaugeListSelector(state),
    userList: userListSelector(state),
    accessList: accessListSelector(state),
    readingList: readingListSelector(state),
    loading: isLoading(loadReadings)(state),
});

const mapDispatchToProps = {
    loadUsers,
    loadAccesses,
    loadGauges,
    loadReadings,
    createReading
};

export default connect(mapStateToProps, mapDispatchToProps)(Readings);