import React, {useEffect} from "react";
import { Auth } from 'aws-amplify';
import { withRouter } from "react-router";

import { nope } from 'lodash';
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Tooltip,
  Zoom
} from "@material-ui/core";

import { sidebarLinks } from "./constants";
import { useTranslate } from "react-translate";

const drawerWidth = 240;

const StyledTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: "#262f35",
    boxShadow: theme.shadows[2],
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 500,
    marginLeft: theme.spacing(-1),
    padding: theme.spacing(0.75),
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5)
  }
}))(Tooltip);

const useStyles = makeStyles(theme => {
  return {
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    paper: {
      backgroundColor: "#181E22"
    },
    drawerOpen: {
      width: drawerWidth,
      paddingTop: '60px',
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      overflowX: "hidden",
      paddingTop: '60px',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1
      }
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar
    },
    list: {
      padding: 0
    },
    navLink: {
      display: "block",
      textDecoration: 'unset',
      "&.active, &:hover": {
        backgroundColor: "#262f35"
      },
      "&[disabled]": {
        pointerEvents: "none"
      }
    },
    listItem: {
      height: "60px",
      padding: 10
    },
    listRoot: {
      height: "60px",
      padding: 10,
      cursor: "pointer",
      "&.active, &:hover": {
        backgroundColor: "#262f35"
      }
    },
    listLogo: {
      color: "yellow",
      minWidth: "26px"
    },
    listItemIcon: {
      color: "white",
      minWidth: "22px",
      padding: 10
    },
    title: {
      color: "white"
    }
  };
});

function Sidebar({
  match
}) {
  const classes = useStyles();
  let t = useTranslate("SideBarMenu");
  var selectedParent = -1;
  const [openYourData, setOpenYourData] = React.useState(true);
  const [openAdministrator, setOpenAdministrator] = React.useState(false);
  const [openSettings, setOpenSettings] = React.useState(false);
  useEffect(()=>{
    switch(selectedParent) {
      case 0:
        setOpenYourData(true);
        setOpenAdministrator(false);
        setOpenSettings(false);
        return;
      case 1:
        setOpenYourData(false);
        setOpenAdministrator(true);
        setOpenSettings(false);
        return;
      case 2:
        setOpenYourData(false);
        setOpenAdministrator(false);
        setOpenSettings(true);
        return;
    }
  }, [selectedParent, match.path])
  const handleClick = (title) => {
    if(title === "Your Data") {
      setOpenYourData(!openYourData);
      setOpenAdministrator(false);
      setOpenSettings(false);
    }
    if(title === "Administration") {
      setOpenAdministrator(!openAdministrator);
      setOpenYourData(false);
      setOpenSettings(false);
    }
    if(title === "Settings") {
      setOpenSettings(!openSettings);
      setOpenYourData(false);
      setOpenAdministrator(false);
    }
  };

  const getStatusByTitle = (title) => {
    if(title === "Your Data") {
      return openYourData;
    }
    if(title === "Administration") {
      return openAdministrator;
    }
    if(title === "Settings") {
      return openSettings;
    }
  }

  const getStatusByParent = (parent) => {
    if(parent === 0) {
      return openYourData;
    }
    if(parent === 1) {
      return openAdministrator;
    }
    if(parent === 2) {
      return openSettings;
    }
  }

  const lang = localStorage.getItem("lang") ?  localStorage.getItem("lang") : "de";
  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, classes.drawerOpen)}
      classes={{
        paper: clsx(classes.paper, classes.drawerOpen)
      }}
    >
        <List className={classes.list}>
          {sidebarLinks.map(({ disabled, icon, linkTo, title, role, name, parent }) => {
            if(linkTo && linkTo!=="/" && match.path.toLowerCase().includes(linkTo.toLowerCase().replace('/',''))) selectedParent = parent;
            return (
              role.includes(parseInt(localStorage.getItem('role'))) ? (         
                linkTo === null ?
                <ListItem key={title} button className={classes.listRoot} onClick={()=>handleClick(title)}>
                  <ListItemText className={classes.title} primary={ t(`${name}-${lang}`)} />
                  {getStatusByTitle(title) ? <ExpandLess className={classes.title}/> : <ExpandMore className={classes.title}/>}
                </ListItem> :
                <NavLink
                  to={linkTo}
                  exact
                  key={title}
                  className={(linkTo!=="/" && match.path.toLowerCase().includes(linkTo.toLowerCase().replace('/',''))) ? classes.navLink + " active" : classes.navLink}
                  disabled={disabled}
                >
                  <div onClick={
                    linkTo==="/" ? () => {
                      Auth.signOut();
                      localStorage.removeItem('jwt');
                      localStorage.removeItem('username');
                      localStorage.removeItem('email');
                      localStorage.removeItem('role');
                      localStorage.removeItem('org_id');
                      localStorage.removeItem('lang');
                    } 
                    : nope}>
                    <StyledTooltip
                      title={linkTo === "/" ? t(`logout-${lang}`) : t(`${linkTo.replace('/','')}-${lang}`)}
                      placement="right"
                      TransitionComponent={Zoom}
                    >
                      <Collapse in={linkTo === "/" ? true : getStatusByParent(parent)} timeout="auto" unmountOnExit>
                        <ListItem className={classes.listItem} disabled={disabled}>
                          <ListItemIcon className={classes.listItemIcon}>
                            {icon}
                          </ListItemIcon>
                          <ListItemText className={classes.title}>{linkTo === "/" ? t(`logout-${lang}`) : t(`${linkTo.replace('/','')}-${lang}`)}</ListItemText>
                        </ListItem>
                      </Collapse>
                    </StyledTooltip>
                  </div>
                </NavLink> ) : ('')
            )})}
        </List>
    </Drawer>
  );
};
export default withRouter(Sidebar)
