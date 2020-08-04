import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { useTranslate } from "react-translate";

const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(3),
    },
}));

export default function Language() {
    const classes = useStyles();
    const lang = localStorage.getItem("lang") ?  localStorage.getItem("lang") : "de";
    let t = useTranslate("Language");
    return(
        <div>
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">{t(`language-${lang}`)}</FormLabel>
                <RadioGroup aria-label="language" name="language" value={lang ? lang : 'de'} onChange={(e)=>{
                    localStorage.setItem("lang", e.target.value);
                    window.location.reload(); 
                }}>
                    <FormControlLabel value="de" control={<Radio />} label={t(`germany-${lang}`)} />
                    <FormControlLabel value="en" control={<Radio />} label={t(`english-${lang}`)} />
                </RadioGroup>
            </FormControl>
        </div>
    )
}