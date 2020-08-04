import React,{useEffect} from "react";
import { loadOrg, orgSelector } from '../../../../actions/orgs';
import { loadUsers, userListSelector} from '../../../../actions/users';

import { connect } from 'react-redux';

import clsx from "clsx";
import { Link } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
} from "@material-ui/core";
import Logo from "./logo.png";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  inputRoot: {
    color: "inherit"
  },
  appTitle: {
    backgroundColor: "transparent",
    color: "white",
    fontSize: "1.5rem",
    fontWeight: 600,
    padding: theme.spacing(1, 1, 1, 3),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 600
    }
  },
  inputInput: {
    backgroundColor: "transparent",
    color: "white",
    fontSize: "1rem",
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  },
  sectionDesktop: {
    display: "none",
    width: "100%",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      width: 250
    }
  },
  logo: {
    width: "250px",
    height: "60px"
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    }
  },
  appBar: {
    // backgroundColor: 'white' ,
    // color: '#c1c1c1',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    "& a": {
      color: "inherit"
    }
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  }
}));

const StyledToolbar = withStyles(theme => ({
  regular: {
    minHeight: "60px"
  }
}))(Toolbar);

function Appbar({
  loadOrg,
  loadUsers,
  userList,
  getOrg
}) {
  const classes = useStyles();
  useEffect(() => {
    loadOrg(localStorage.getItem('org_id'));
    loadUsers();
  }, []);
  const org_name = getOrg(localStorage.getItem('org_id')) ? getOrg(localStorage.getItem('org_id')).name : '';
  const name = " - " + localStorage.getItem('username');
  return (
    <div className={classes.grow}>
      <AppBar position="fixed" className={clsx(classes.appBar)}>
        <StyledToolbar>
          <div className={classes.appTitle}>
            <span>{"Headwater -  "+ org_name + name}</span>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Link to="/organization">
                <img src={Logo} className={classes.logo} alt='Logo'/>
            </Link>
          </div>
        </StyledToolbar>
      </AppBar>
    </div>
  );
}

const mapStateToProps = state => ({
  getOrg(id) {
      return orgSelector(id)(state)
  },
  userList: userListSelector(state)
});

const mapDispatchToProps = {
  loadOrg,
  loadUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);