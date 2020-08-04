import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { loadNews, updateNews, newsSelector } from '../../actions/news';
import { loadUsers, userListSelector } from '../../actions/users';

import { isLoading } from '../../actions/loading';

import { newsValidationSchema } from "../../helpers/validationSchemas";
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
import {CustomButton} from '../../component/buttons'

import { useTranslate } from "react-translate";
import moment from 'moment';

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

function EditNews({
    getNews,
    loadNews,
    updateNews,
    loadUsers,
    userList,
    match,
    loading,
    lang
}) {
    const classes = useStyles();
    let t = useTranslate("News");

    const [selectedNewsDate, setSelectedNewsDate] = React.useState(new Date);
    const id = match.params.id;
    useEffect(()=>{
        loadUsers();
        loadNews(id);
    },[]);
    const emptyNews = {
        title: ''
    };
    const news = getNews(id) || emptyNews;
    var members = [];
    var users = localStorage.getItem('org_id') === "-1" ? userList : userList.filter(user => user.org_id === localStorage.getItem('org_id'));

    for(var i=0; i<users.length; i++) {
        members[i] = {
            id: users[i].id,
            value: users[i].name
        }
    }
    useEffect(()=>{
        setSelectedNewsDate(moment(news.created_at).format(lang==="en" ? "YYYY-MM-DD" : "MM.DD.YYYY"));
    }, news);
    const handleNewsDateChange = date => {
        setSelectedNewsDate(date);
    };
    return (
        <div className={classes.grow}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <Formik
                        initialValues={news}
                        validationSchema={newsValidationSchema}
                        onSubmit={async (values, actions) => {
                            actions.setSubmitting(true);
                            await updateNews({
                                ...news,
                                ...values
                            });
                            await loadNews(id);
                            actions.setSubmitting(false);
                        }}
                        render={props => (
                            <form className={classes.container} noValidate autoComplete="off" onSubmit={props.handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item md={9} xs={9}>
                                        <div className={classes.label}>
                                            <span>{t(`news_title-${lang}`)} - {props.values.title}</span>
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
                                                        id="title"
                                                        name="title"
                                                        label={t(`title-${lang}`)+'*'}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={Boolean(props.touched.title && props.errors.title)}
                                                        helperText={props.touched.title ? props.errors.title : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.title}
                                                    />
                                                </Grid>
                                                <Grid item md={6} xs={6}>
                                                    <TextField
                                                        select
                                                        id="author"
                                                        name="author"
                                                        label={t(`author-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        disabled
                                                        error={Boolean(props.touched.author && props.errors.author)}
                                                        helperText={props.touched.author ? props.errors.author : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.author}
                                                    >
                                                        {members.map(member => (
                                                            <MenuItem key={member.id} value={member.id}>
                                                                {member.value}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={3}>
                                                <Grid item md={6} xs={6}>
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <KeyboardDatePicker
                                                                id="created_at"
                                                                label={t(`created_at-${lang}`)}
                                                                className={classes.textField}
                                                                disableToolbar
                                                                autoOk
                                                                variant="inline"
                                                                format="MM/dd/yyyy"
                                                                margin="normal"
                                                                KeyboardButtonProps={{
                                                                    'aria-label': 'change date',
                                                                }}
                                                                value={selectedNewsDate}
                                                                onChange={handleNewsDateChange}
                                                            />
                                                    </MuiPickersUtilsProvider>
                                                </Grid>
                                                <Grid item md={6} xs={6}>
                                                    <FormControlLabel
                                                        value="show_dashboard"
                                                        name="show_dashboard"
                                                        label={t(`show_dashboard-${lang}`)}
                                                        className={classes.textField}
                                                        control={
                                                            <Checkbox 
                                                                color="primary" 
                                                                onChange={props.handleChange}
                                                                onBlur={props.handleBlur}
                                                                checked={props.values.show_dashboard}
                                                            />
                                                        }
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={3}>
                                                <Grid item md={12} xs={12}>
                                                    <TextField
                                                        id="text"
                                                        name="text"
                                                        label={t(`text-${lang}`)}
                                                        multiline
                                                        rows="4"
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={Boolean(props.touched.text && props.errors.text)}
                                                        helperText={props.touched.text ? props.errors.text : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.text}
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
    getNews(id) {
        return newsSelector(id)(state)
    },
    userList: userListSelector(state),
    loading: isLoading(loadNews)(state)
});

const mapDispatchToProps = {
    loadNews,
    updateNews,
    loadUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(EditNews);