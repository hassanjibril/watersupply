import React from "react";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
// import CircularProgress from '@material-ui/core/CircularProgress';

const StyledButton = withStyles(theme => ({
  root: {
    borderRadius: "5px",
    fontColor: "white",
    color: "white",
    height: "40px",
    minWidth: "100px"
  }
}))(Button);

const CustomButton = ({ text, icon, spinner, ...props }) => {
  return (
    <StyledButton variant="contained" color="primary" {...props}>
      {spinner ? spinner : ''}
      {icon == "prev" ? <NavigateBeforeIcon /> : ""}
      {text}
      {icon == "next" ? <NavigateNextIcon /> : ""}
    </StyledButton>
  )
};

export default CustomButton;
