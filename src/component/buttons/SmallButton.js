import React from "react";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const StyledButton = withStyles(theme => ({
  root: {
    paddingTop: "6px",
    lineHeight: 1.5
  }
}))(Button);

const SmallButton = ({ text, ...props }) => (
  <StyledButton size="small" variant="contained" color="primary" {...props}>
    {text}
  </StyledButton>
);

export default SmallButton;
