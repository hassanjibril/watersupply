import React from "react";

import PeopleIcon from '@material-ui/icons/People';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListIcon from '@material-ui/icons/List';
import EuroIcon from '@material-ui/icons/Euro';
import OpacityIcon from '@material-ui/icons/Opacity';
import PaymentIcon from '@material-ui/icons/Payment';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AvTimerIcon from '@material-ui/icons/AvTimer';
import SettingsIcon from '@material-ui/icons/Settings';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PollIcon from '@material-ui/icons/Poll';

const iconStyle = { fontSize: "1.4rem" };

export const sidebarLinks = [
  {
    icon: null,
    name: "your_data",
    linkTo: null,
    title: "Your Data",
    role: [0, 1, 2, 3]
  },
  {
    icon: <DashboardIcon style={iconStyle} />,
    name: "Dashboard",
    linkTo: "/dashboard",
    title: "Dashboard",
    parent: 0,
    role: [0, 1, 2, 3] // 0: admin, 1: manager, 2: member, 3: admin for admin app
  },
  {
    icon: <ListIcon style={iconStyle} />,
    name: "Readings",
    linkTo: "/readings",
    title: "Readings",
    parent: 0,
    role: [0, 1, 2, 3]
  },
  {
    icon: <EuroIcon style={iconStyle} />,
    name: "Invoices",
    linkTo: "/invoices",
    title: "Invoices",
    parent: 0,
    role: [0, 1, 2, 3]
  },
  {
    icon: null,
    name: "administration",
    linkTo: null,
    title: "Administration",
    role: [0, 1, 3]
  },
  {
    icon: <PeopleIcon style={iconStyle} />,
    name: "Organization",
    linkTo: "/organization",
    title: "Organization",
    parent: 1,
    role: [0, 1, 3]
  },
  {
    icon: <PermContactCalendarIcon style={iconStyle} />,
    name: "Member",
    linkTo: "/member",
    title: "Member",
    parent: 1,
    role: [0, 1, 3]
  },
  {
    icon: <OpacityIcon style={iconStyle} />,
    name: "Water Access",
    linkTo: "/wateraccess",
    title: "Water Access",
    parent: 1,
    role: [0, 1, 3]
  },
  {
    icon: <PollIcon style={iconStyle} />,
    name: "Water Analysis",
    linkTo: "/wateranalysis",
    title: "Water Analysis",
    parent: 1,
    role: [0, 1, 3]
  },
  {
    icon: <PaymentIcon style={iconStyle} />,
    name: "Billing",
    linkTo: "/billing",
    title: "Billing",
    parent: 1,
    role: [0, 1, 3]
  },
  {
    icon: <AssignmentIcon style={iconStyle} />,
    name: "News",
    linkTo: "/news",
    title: "News",
    parent: 1,
    role: [0, 1, 3]
  },
  {
    icon: null,
    name: "settings",
    linkTo: null,
    title: "Settings",
    role: [0, 1, 2, 3]
  },
  {
    icon: <CreditCardIcon style={iconStyle} />,
    name: "Equipment",
    linkTo: "/equipment",
    title: "Equipment",
    parent: 2,
    role: [0, 1, 3]
  },
  {
    icon: <AvTimerIcon style={iconStyle} />,
    name: "Gauges",
    linkTo: "/gauges",
    title: "Gauges",
    parent: 2,
    role: [0, 1, 3]
  },
  {
    icon: <PaymentIcon style={iconStyle} />,
    name: "Payment Terms",
    linkTo: "/paymentterms",
    title: "Payment Terms",
    parent: 2,
    role: [0, 1, 3]
  },
  {
    icon: <PeopleIcon style={iconStyle} />,
    name: "Organization Settings",
    linkTo: "/organizationsettings",
    title: "Organization Settings",
    parent: 2,
    role: [0, 1, 3]
  },
  {
    icon: <PollIcon style={iconStyle} />,
    name: "Analysis Template",
    linkTo: "/analysisTemplate",
    title: "Analysis Template",
    parent: 2,
    role: [0, 1, 3]
  },
  {
    icon: <SettingsIcon style={iconStyle} />,
    name: "Languages",
    linkTo: "/language",
    title: "language",
    parent: 2,
    role: [0, 1, 2, 3]
  },
  {
    icon: <ExitToAppIcon style={iconStyle} />,
    name: "Log Out",
    linkTo: "/",
    title: "Log Out",
    parent: null,
    role: [0, 1, 2, 3]
  }
];
