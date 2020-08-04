import React, { useEffect } from 'react';
import { API } from 'aws-amplify';
import { connect } from 'react-redux';
import { isLoading } from '../../actions/loading';
import { loadAccess, updateAccess, accessSelector } from '../../actions/accesses';
import { loadUsers, userListSelector } from '../../actions/users';
import { loadGauges, gaugeListSelector, updateGauge } from '../../actions/gauges';
import { createReading, loadReadings, readingListSelector } from '../../actions/readings';

import { waterAccessValidationSchema, newReadingValidationSchema } from "../../helpers/validationSchemas";
import { Formik } from 'formik';
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { ReadingTable } from "../../component/table";
import { CustomButton } from '../../component/buttons/index';
import moment from 'moment';
import { useTranslate } from "react-translate";
import Modal from 'react-modal';

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
    textactiveField: {
        margin: theme.spacing(1,1,1,0),
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
    gaugeChangeButton: {
        padding: theme.spacing(1, 1, 1, 1),
        paddingRight: 0,
        margin: theme.spacing(2, 1, 1, 1)
    },
    table: {
        padding: theme.spacing(1, 1, 1, 1),
    },
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'papayawhip'
    },
    customUI: {
        padding: '30px'
    },
    Overlay: {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'grey',
        zIndex: '999',
      }
}));

const emptyFormWaterAccess = {
    name: "",
    member: "",
    drain_access: false,
    active: false,
    gps_coord: "",
    plz: "",
    city: "",
    gauge: ""
};

const emptyReading = {
    date: '',
    value: ''
};

function EditWaterAccess({
    loadAccess,
    getAccess,
    updateAccess,
    gaugeList,
    loadGauges,
    updateGauge,
    userList,
    loadUsers,
    createReading,
    loadReadings,
    readingList,
    loading,
    match,
    lang
}) {
    const classes = useStyles();
    let t = useTranslate("waterAccess");
    let t1 = useTranslate("Readings");

    const [selectedReadingDate, setSelectedReadingDate] = React.useState(new Date());
    const [openModal, setOpenModal] = React.useState(false);
    const [lastReading, setLastReading] = React.useState(0);
    const [initialCount, setInitialCount] = React.useState(0);
    const [newGauge, setNewGauge] = React.useState("");

    const id = match.params.id;
    useEffect(() => {
        Modal.setAppElement('body');
        loadUsers();
        loadGauges();
        loadReadings();
        loadAccess(id);
    }, []);
    var users = localStorage.getItem('org_id') === "-1" ? userList : userList.filter(user => user.org_id === localStorage.getItem('org_id'));
    var gaugeInstockArray = localStorage.getItem('org_id') === "-1" ? gaugeList : gaugeList.filter(gauge => gauge.org_id === localStorage.getItem('org_id') && gauge.state === 1);
    var members = [];
    var gauges = [];

    for(var i=0; i<users.length; i++) {
        members[i] = {
            id: users[i].id,
            value: users[i].name
        }
    }
    for(var i=0; i<gaugeInstockArray.length; i++) {
        gauges[i] = {
            id: gaugeInstockArray[i].id,
            value: gaugeInstockArray[i].serial
        }
    }
    const handleReadingDateChange = date => {
        setSelectedReadingDate(date);
    };
    const handleLastReadingChange = e => {
        setLastReading(parseInt(e.target.value));
    }
    const handleInitialCountChange = e => {
        setInitialCount(parseInt(e.target.value));
    }
    const handleGaugeChange = e => {
        var initialCount = gaugeInstockArray.find(gauge => gauge.id === e.target.value).initial_count;
        initialCount ? setInitialCount(parseInt(initialCount)) : setInitialCount(0);
        setNewGauge(e.target.value);
    }
    const waterAccess = getAccess(id) || emptyFormWaterAccess;
    const currentGauge = gaugeList.find(gauge=>gauge.id === waterAccess.gauge) || {id: ''};
    const readings = readingList.filter(reading=>reading.gauge === currentGauge.id).sort((a,b) => parseInt(b.new_value) - parseInt(a.new_value));
    var data = [];
    for(var i=0; i<readings.length; i++) {
        data[i] = {
            id: readings[i].id,
            reading_date: moment(readings[i].reading_date).format(lang==="en" ? "YYYY-MM-DD" : "MM.DD.YYYY"),
            gauge: currentGauge.serial,
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
    return (
        <div className={classes.grow}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <Formik
                        initialValues={waterAccess}
                        validationSchema={waterAccessValidationSchema}
                        onSubmit={async (values, actions) => {
                            actions.setSubmitting(true);
                            await updateAccess({
                                ...waterAccess,
                                ...values
                            });
                            await loadAccess(id);
                            actions.setSubmitting(false);
                        }}
                        render={props => (
                            <form className={classes.container} noValidate autoComplete="off" onSubmit={props.handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item md={9} xs={9}>
                                        <div className={classes.label}>
                                            <span>{t(`access_point_title-${lang}`)} - {props.values.name}</span>
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
                                            <FormControlLabel
                                                value="drain_access"
                                                name="drain_access"
                                                label={t(`drain_access_checkbox-${lang}`)}
                                                className={classes.textHalfField}
                                                control={
                                                    <Checkbox 
                                                        color="primary" 
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        checked={props.values.drain_access}
                                                    />
                                                }
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
                                                select
                                                id="member"
                                                name="member"
                                                label={t(`member-${lang}`)}
                                                className={classes.textField}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.member && props.errors.member)}
                                                helperText={props.touched.member ? props.errors.member : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.member}
                                            >
                                                {members.map(member => (
                                                    <MenuItem key={member.id} value={member.id}>
                                                        {member.value}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            <TextField
                                                id="gps_coord"
                                                name="gps_coord"
                                                label={t(`gps_coord-${lang}`)}
                                                className={classes.textField}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.gps_coord && props.errors.gps_coord)}
                                                helperText={props.touched.gps_coord ? props.errors.gps_coord : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.gps_coord}
                                            />
                                            <TextField
                                                select
                                                id="gauge"
                                                name="gauge"
                                                label={t(`gauge-${lang}`)}
                                                className={classes.textHalfField}
                                                disabled
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.gauge && props.errors.gauge)}
                                                helperText={props.touched.gauge ? props.errors.gauge : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.gauge}
                                            >
                                                {currentGauge && currentGauge.state !== 1 ? 
                                                    <MenuItem value={currentGauge.id} disabled={true}>
                                                        {currentGauge.serial}
                                                    </MenuItem>
                                                : null}
                                                {gauges.map(gauge => (
                                                    <MenuItem key={gauge.id} value={gauge.id}>
                                                        {gauge.value}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            <CustomButton
                                                text={t(`change_gauge_btn-${lang}`)}
                                                className={classes.gaugeChangeButton}
                                                color="secondary"
                                                onClick={()=>{
                                                    setLastReading(currentGauge.id !== "" ? parseInt(currentGauge.current_count ? currentGauge.current_count : 0) : 0);
                                                    setOpenModal(true);
                                                }}
                                            />
                                            <Modal
                                                isOpen={openModal}
                                                className={classes.modal}
                                                overlayClassName={classes.Overlay}
                                            >
                                                <Paper className={classes.customUI}>
                                                    <h1>{t(`modal_h1-${lang}`)}</h1>
                                                    <p>{t(`modal_p-${lang}`)}</p>
                                                    <TextField
                                                        select
                                                        id="gauge"
                                                        name="gauge"
                                                        label={t(`gauge-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        onChange={handleGaugeChange}
                                                        value={newGauge}
                                                    >
                                                        {gaugeInstockArray.map(gauge => (
                                                            <MenuItem key={gauge.id} value={gauge.id}>
                                                                {gauge.serial}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                    <TextField
                                                        id="last_reading"
                                                        label={t(`last_reading-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        type="number"
                                                        onChange={handleLastReadingChange}
                                                        value={lastReading}
                                                    />
                                                    <TextField
                                                        id="initial_count"
                                                        label={t(`initial_count-${lang}`)}
                                                        className={classes.textField}
                                                        type="number"
                                                        margin="normal"
                                                        variant="outlined"
                                                        onChange={handleInitialCountChange}
                                                        value={initialCount}
                                                    />

                                                    <CustomButton 
                                                        text="Cancel" 
                                                        onClick={()=>setOpenModal(false)} />
                                                    <CustomButton
                                                        text="Yes, Change it"
                                                        color="secondary"
                                                        style={{marginLeft: "10px"}}
                                                        onClick={async () => {
                                                            if(newGauge) {
                                                                if(currentGauge.id !== "" && lastReading) {
                                                                    var old_value = readings[0] ? readings[0].new_value : currentGauge.initial_count ? currentGauge.initial_count : 0;
                                                                    if(lastReading > old_value) {
                                                                        await createReading({
                                                                            gauge: currentGauge.id,
                                                                            new_value: lastReading,
                                                                            old_value: old_value,
                                                                            reading_date: moment().format("YYYY-MM-DD"),
                                                                            billed: 1
                                                                        })
                                                                    } else {
                                                                        alert(`Last reading value should be bigger than ${old_value}`);
                                                                        return;
                                                                    }
                                                                }
                                                                
                                                                await updateAccess({
                                                                    ...waterAccess,
                                                                    gauge: newGauge
                                                                });
                                                                
                                                                if(currentGauge.id !== "") {
                                                                    await updateGauge({
                                                                        ...currentGauge,
                                                                        state: 2,
                                                                        used_gauge: waterAccess.name,
                                                                        used_in: id
                                                                    });
                                                                }
                                
                                                                await updateGauge({
                                                                    ...gaugeInstockArray.find(gauge=>gauge.id===newGauge),
                                                                    state: 0,
                                                                    used_gauge: waterAccess.name,
                                                                    install_date: moment().format("YYYY-MM-DD"),
                                                                    used_in: id,
                                                                    initial_count: initialCount
                                                                });
                                                                setOpenModal(false)
                                                                await loadAccess(id);
                                                            } else {
                                                                alert("You should select the new gauge.")
                                                            }
                                                        }}
                                                    />
                                                </Paper>
                                            </Modal>
                                            <TextField
                                                id="created_year"
                                                name="created_year"
                                                label={t(`created_year-${lang}`)}
                                                className={classes.textField}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.created_year && props.errors.created_year)}
                                                helperText={props.touched.created_year ? props.errors.created_year : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.created_year}
                                            />                                                                       
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
                            if(currentGauge.id === "") {
                                alert("You must add the Gauge before adding new reading...")
                            } else {
                                var new_value = 0;
                                var old_value = 0;
                                if(readings[0]) {
                                    new_value = values.value;
                                    old_value = readings[0].new_value;
                                } else {
                                    new_value = values.value;
                                    old_value = currentGauge.initial_count ? currentGauge.initial_count : 0;
                                }
                                if(parseInt(new_value) <= parseInt(old_value)) {
                                    alert(`The new value must be bigger than old value ${old_value}.`)
                                } else {
                                    await createReading({
                                        gauge: currentGauge.id,
                                        new_value: new_value,
                                        old_value: old_value,
                                        reading_date: selectedReadingDate,
                                        billed: 1
                                    })
                                    await updateGauge({
                                        ...currentGauge,
                                        current_count: new_value
                                    });
                                    await loadReadings();
                                }
                            }
                            actions.setSubmitting(false);
                        }}
                        render={props => (
                            <form className={classes.container} noValidate autoComplete="off" onSubmit={props.handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item md={12} xs={12}>
                                        <Paper className={classes.paper}>
                                            <span className={classes.label}>{t1(`new_reading_title-${lang}`)}</span>
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
                                            <Grid container spacing={3}>
                                                <Grid item md={12} xs={12}>
                                                    <ReadingTable
                                                        data={data}
                                                        columns={columns}
                                                        gauge={currentGauge ? currentGauge.id : ""}
                                                        current_gauge = {currentGauge}
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
    getAccess(id) {
        return accessSelector(id)(state)
    },
    userList: userListSelector(state),
    gaugeList: gaugeListSelector(state),
    readingList: readingListSelector(state),
    loading: isLoading(loadAccess)(state),
});

const mapDispatchToProps = {
    updateAccess,
    loadAccess,
    loadGauges,
    updateGauge,
    loadUsers,
    createReading,
    loadReadings
};

export default connect(mapStateToProps, mapDispatchToProps)(EditWaterAccess);