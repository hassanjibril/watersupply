import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { isLoading } from '../../actions/loading';

import { loadUsers, userListSelector } from '../../actions/users';
import { loadGauges, gaugeSelector, gaugeListSelector } from '../../actions/gauges';
import { loadAccesses, accessListSelector } from '../../actions/accesses';
import { createReading, loadReadings, readingListSelector } from '../../actions/readings';
import { loadNewses, newsListSelector } from '../../actions/news';

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
    action: {
        cursor: "pointer"
    }
}));

function Dashboard({
    loadUsers,
    userList,
    loadAccesses,
    accessList,
    loadReadings,
    readingList,
    gaugeList,
    loadGauges,
    getGauge,
    loadNewses,
    newsList,
    loading,
    lang
}) {
    const classes = useStyles();
    let t1 = useTranslate("Dashboard");
    const userName = localStorage.getItem("username");

    const [selectedReadingDate, setSelectedReadingDate] = React.useState(new Date());
    const [disabledNextBtn, setDisabledNextBtn] = React.useState(false);
    const [disabledPrevBtn, setDisabledPrevBtn] = React.useState(false);
    const [index, setIndex] = React.useState(0);
    const [gauge, setGauge] = React.useState("");
    const [access, setAccess] = React.useState("");

    useEffect(()=>{
        loadAccesses();
        loadReadings();
        loadGauges();
        loadUsers();
        loadNewses();
    }, [])

    var accesses = [];
    const userId = userList.find(user=>user.email === localStorage.getItem("email")) ? userList.find(user=>user.email === localStorage.getItem("email")).id : "";
    const newses = localStorage.getItem('org_id') === "-1" ? newsList : newsList.filter(news=>news.org_id === localStorage.getItem('org_id') && news.show_dashboard);
    const readings = readingList.filter(reading=>reading.gauge === gauge).sort((a,b) => parseInt(b.new_value) - parseInt(a.new_value));
    useEffect(()=>{
        if(index === 0) {
            accesses = accessList.filter(access=>access.member === userId);
            setGauge(accesses[index] ? accesses[index].gauge : "");
            setAccess(accesses[index] ? accesses[index].name : "");
            setSelectedReadingDate(moment(readings[0] ? readings[0].reading_date : new Date()).format("MM-DD-YYYY"));
            if(accesses.length === 1) {
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
            setSelectedReadingDate(moment(readings[0] ? readings[0].reading_date : new Date()).format("MM-DD-YYYY"));
        }
        
    },[userId, accessList, gaugeList, readings]);

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
    return (
        <div className="dashboard">
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
                        <Grid container spacing={3}>
                            <Grid item md={3} xs={3}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                            id="reading_date"
                                            label={t1(`last_reading_date-${lang}`)}
                                            className={classes.reading_dateField}
                                            disableToolbar
                                            autoOk
                                            disabled
                                            variant="inline"
                                            format="MM/dd/yyyy"
                                            margin="normal"
                                            value={selectedReadingDate}
                                        />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item md={6} xs={6}>
                                <TextField
                                    id="last_reading"
                                    name="last_reading"
                                    label={t1(`last_reading-${lang}`)}
                                    className={classes.textField}
                                    disabled
                                    margin="normal"
                                    variant="outlined"
                                    value={readings[0] ? readings[0].new_value : 0}
                                />
                            </Grid>
                        </Grid>              
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                    <Paper className={classes.paper}>
                        <Grid container spacing={3}>
                            <Grid item md={6} xs={6}>
                                <div className={classes.label}>
                                    <span>News</span>
                                </div>
                                <br/>
                                {newses.map(news=>(
                                    <div>
                                        <h2>{news.title}</h2>
                                        <p>{news.text}</p>
                                    </div>
                                ))}
                            </Grid>
                            <Grid item md={6} xs={6}>
                            <a href="#">Lastes water analysis</a>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
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
    newsList: newsListSelector(state),
    loading: isLoading(loadReadings)(state),
});

const mapDispatchToProps = {
    loadUsers,
    loadAccesses,
    loadGauges,
    loadReadings,
    createReading,
    loadNewses
};
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);