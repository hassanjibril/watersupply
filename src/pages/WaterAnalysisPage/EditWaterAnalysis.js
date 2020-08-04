import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { loadAnalysis, updateAnalysis, analysisSelector } from '../../actions/analysis';
import { loadTemplateLists, templateListSelector } from '../../actions/templateLists';
import { loadAnalysisTemplates, analysisTemplateListSelector } from '../../actions/analysisTemplate';

import { useTranslate } from "react-translate";
import { isLoading } from '../../actions/loading';
import { analysiValidationSchema } from "../../helpers/validationSchemas";
import { PDFExport } from '@progress/kendo-react-pdf';
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
import { CustomButton } from '../../component/buttons/index';

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
        margin: "10px",
        float: "right"
    }
}));

const emptyAnalysis = {
    date: '',
    description: '',
    lab_name: ''
};

function EditWaterAnalysis({
    loadAnalysis,
    loadTemplateLists,
    templateList,
    loadAnalysisTemplates,
    analysis,
    analysisTemplateList,
    loading,
    match,
    lang
}) {
    const classes = useStyles();
    const id = match.params.id;
    let resume;
    let t = useTranslate("WaterAnalysis");
    let t1 = useTranslate("AnalysisTemplate");

    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [selectedTemplate, setSelectedTemplate] = React.useState([]);
    const [values, setValues] = React.useState({});
    const [isValueChange, setIsValueChange] = React.useState(true);
    const handleDateChange = date => {
        setSelectedDate(date);
    };

    useEffect(() => {
        loadAnalysis(id);
        loadTemplateLists();
        loadAnalysisTemplates();
    }, []);
    var templates = localStorage.getItem('org_id') === "-1" ? templateList : templateList.filter(analysisTemplate => analysisTemplate.org_id === localStorage.getItem('org_id'));
    useEffect(() => {
        setSelectedDate(moment(analysis.created_at).format("MM/DD/YYYY"));
        setValues(analysis.value ? analysis.value.reduce((previousValue, e) => {
            previousValue[e.templateId] = e.value
            return previousValue
        }, {}) : {});
        setSelectedTemplate(analysisTemplateList.filter(template=>template.template_id === analysis.template));
    }, [analysis, analysisTemplateList]);

    const handleValueChange = (temp_id, e) => {
        setIsValueChange(false);
        setValues({
            ...values,
            [temp_id]: e.target.value
        })
    }
    return (
        <div className={classes.grow}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <Formik
                        initialValues={analysis}
                        validationSchema={analysiValidationSchema}
                        onSubmit={async (vals, actions) => {
                            actions.setSubmitting(true);
                            await updateAnalysis({
                                ...analysis,
                                ...vals,
                                value: Object.keys(values).map(key => ({
                                    templateId: key,
                                    value: values[key]
                                }))
                            });
                            setTimeout(async () => {
                                await loadAnalysis(id);
                            }, 1000);
                            setIsValueChange(true);
                            actions.setSubmitting(false);
                        }}
                        render={props => (
                            <form className={classes.container} noValidate autoComplete="off" onSubmit={props.handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item md={9} xs={9}>
                                        <div className={classes.label}>
                                            <span>{t(`analysis_title-${lang}`)}</span>
                                        </div>
                                    </Grid>
                                    <Grid item md={3} xs={3}>
                                        <div className={classes.button}>
                                            <CustomButton
                                                text={t(`export-${lang}`)}
                                                className={classes.button}
                                                onClick={()=>resume.save()}
                                                disabled={!props.values.template || !props.values.value}
                                            />
                                            <CustomButton
                                                text={t(`update_btn-${lang}`)}
                                                type="submit"
                                                className={classes.button}
                                                disabled={props.isSubmitting || !props.isValid && isValueChange}
                                            />
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item md={12} xs={12}>
                                        <Paper className={classes.paper}>
                                            <Grid container spacing={3}>
                                                <Grid item md={6} xs={6}>
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <KeyboardDatePicker
                                                                id="created_at"
                                                                label={t(`date-${lang}`)}
                                                                className={classes.textField}
                                                                disableToolbar
                                                                autoOk
                                                                variant="inline"
                                                                format="MM/dd/yyyy"
                                                                margin="normal"
                                                                KeyboardButtonProps={{
                                                                    'aria-label': 'change date',
                                                                }}
                                                                value={selectedDate}
                                                                onChange={handleDateChange}
                                                            />
                                                    </MuiPickersUtilsProvider>
                                                </Grid>
                                                <Grid item md={6} xs={6}>
                                                    <TextField
                                                        id="lab_name"
                                                        name="lab_name"
                                                        label={t(`lab_name-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={Boolean(props.touched.lab_name && props.errors.lab_name)}
                                                        helperText={props.touched.lab_name ? props.errors.lab_name : ''}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.lab_name}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={3}>
                                                <Grid item md={6} xs={6}>
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
                                                </Grid>
                                                <Grid item md={6} xs={6}>
                                                    <TextField
                                                        select
                                                        id="template"
                                                        name="template"
                                                        label={t(`template-${lang}`)}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={Boolean(props.touched.template && props.errors.template)}
                                                        helperText={props.touched.template ? props.errors.template : ''}
                                                        onChange={(e)=>{
                                                            setSelectedTemplate(analysisTemplateList.filter(template=>template.template_id === e.target.value))
                                                            return props.handleChange(e);
                                                        }}
                                                        onBlur={props.handleBlur}
                                                        value={props.values.template}
                                                    >
                                                        {templates.map(template => (
                                                            <MenuItem key={template.id} value={template.id}>
                                                                {template.name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>                                           
                                            </Grid>
                                            {selectedTemplate && selectedTemplate.find(template=>template.category === "physical") && <h2>{t(`physical-${lang}`)}</h2>}
                                            {selectedTemplate && selectedTemplate.filter(template=>template.category === "physical").map((template, index) => 
                                                <Grid container spacing={3} key={index}>
                                                    <Grid item md={4} xs={4}>
                                                        <TextField
                                                            label={t1(`name-${lang}`)}
                                                            className={classes.textField}
                                                            margin="normal"
                                                            variant="outlined"
                                                            disabled
                                                            value={template.name}
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={4}>
                                                        <TextField
                                                            key={"physical" + index}
                                                            label={t(`value-${lang}`)}
                                                            className={classes.textField}
                                                            margin="normal"
                                                            variant="outlined"
                                                            type="number"
                                                            onChange={(e)=>handleValueChange(template.id, e)}
                                                            value={values[template.id] ? values[template.id] : 0}
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={4}>
                                                        <TextField
                                                            label={t1(`unit-${lang}`)}
                                                            className={classes.textField}
                                                            margin="normal"
                                                            variant="outlined"
                                                            disabled
                                                            value={template.unit === 0 ? "mg/l" : "°dH"}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            )}
                                            {selectedTemplate && selectedTemplate.find(template=>template.category === "chemical") && <h2>{t(`chemical-${lang}`)}</h2>}
                                            {selectedTemplate && selectedTemplate.filter(template=>template.category === "chemical").map((template, index) => 
                                                <Grid container spacing={3} key={index}>
                                                    <Grid item md={4} xs={4}>
                                                        <TextField
                                                            label={t1(`name-${lang}`)}
                                                            className={classes.textField}
                                                            margin="normal"
                                                            variant="outlined"
                                                            disabled
                                                            value={template.name}
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={4}>
                                                        <TextField
                                                            key={"chemical" + index}
                                                            label={t(`value-${lang}`)}
                                                            className={classes.textField}
                                                            margin="normal"
                                                            variant="outlined"
                                                            type="number"
                                                            onChange={(e)=>handleValueChange(template.id, e)}
                                                            value={values[template.id] ? values[template.id] : 0}
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={4}>
                                                        <TextField
                                                            label={t1(`unit-${lang}`)}
                                                            className={classes.textField}
                                                            margin="normal"
                                                            variant="outlined"
                                                            disabled
                                                            value={template.unit === 0 ? "mg/l" : "°dH"}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            )}
                                            {selectedTemplate && selectedTemplate.find(template=>template.category !== "physical" && template.category !== "chemical") && <h2>{t(`other_category-${lang}`)}</h2>}
                                            {selectedTemplate && selectedTemplate.filter(template=>template.category !== "physical" && template.category !== "chemical").map((template, index) => 
                                                <Grid container spacing={3} key={index}>
                                                    <Grid item md={4} xs={4}>
                                                        <TextField
                                                            label={t1(`name-${lang}`)}
                                                            className={classes.textField}
                                                            margin="normal"
                                                            variant="outlined"
                                                            disabled
                                                            value={template.name}
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={4}>
                                                        <TextField
                                                            key={"other" + index}
                                                            label={t(`value-${lang}`)}
                                                            className={classes.textField}
                                                            margin="normal"
                                                            variant="outlined"
                                                            type="number"
                                                            onChange={(e)=>handleValueChange(template.id, e)}
                                                            value={values[template.id] ? values[template.id] : 0}
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={4}>
                                                        <TextField
                                                            label={t1(`unit-${lang}`)}
                                                            className={classes.textField}
                                                            margin="normal"
                                                            variant="outlined"
                                                            disabled
                                                            value={template.unit === 0 ? "mg/l" : "°dH"}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            )}
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    />
                    {selectedTemplate && <h2>PDF Preview</h2>}
                    {selectedTemplate && <PDFExport paperSize={'A3'}
                        fileName="analysis.pdf"
                        title=""
                        subject=""
                        keywords=""
                        ref={(r) => resume = r}>
                            <div style={{
                                height: 792,
                                width: 812,
                                padding: '20px',
                                backgroundColor: 'white',
                                boxShadow: '5px 5px 5px black',
                                margin: 'auto',
                                overflowX: 'hidden',
                                overflowY: 'hidden'}}>
                                    <table className="pdf-export">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Laboratory Name</th>
                                                <th>Text / Description</th>
                                                <th>Template Name</th>
                                                <th>Category</th>
                                                <th>Unit</th>
                                                <th>Comment</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedTemplate.map((template, index) => 
                                                <tr key={index}>
                                                    <td>{analysis.created_at}</td>
                                                    <td>{analysis.lab_name}</td>
                                                    <td>{analysis.description}</td>
                                                    <td>{template.name}</td>
                                                    <td>{template.category}</td>
                                                    <td>{template.unit === 0 ? "mg/l" : "°dH"}</td>
                                                    <td>{template.comment}</td>
                                                    <td>{values[template.id] ? values[template.id] : 0}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                            </div>
                    </PDFExport>}
                </div>
            )}
        </div>
    )
}
const mapStateToProps = (state, ownProps) => ({
    analysis: analysisSelector(ownProps.match.params.id)(state) || emptyAnalysis,
    templateList: templateListSelector(state),
    analysisTemplateList: analysisTemplateListSelector(state),
    loading: isLoading(loadAnalysis)(state),
});

const mapDispatchToProps = {
    loadAnalysis,
    loadTemplateLists,
    loadAnalysisTemplates
};

export default connect(mapStateToProps, mapDispatchToProps)(EditWaterAnalysis);