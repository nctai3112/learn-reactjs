import React from "react";
import { makeStyles } from "@material-ui/core";

import ObjectInfoPanel from "./components/ObjectInfoPanel/index";
import LabelInfoPanel from "./components/LabelInfoPanel/index";
import DataInstanceListPanel from "./components/DataInstanceListPanel/index";

const useStyles = makeStyles((theme) => ({
  sideBarWrapper: {
    boxSizing: "border-box",
    height: "100%",
    background: theme.palette.primary.darker,
    padding: 10,
    overflowY: "scroll",
  },
}));

const SideBar = () => {
  const classes = useStyles();
  return (
    <div className={classes.sideBarWrapper}>
      This is sidebar
      {/* <ObjectInfoPanel/>
      <DataInstanceListPanel/>
      <LabelInfoPanel/> */}
    </div>
  );
};

export default SideBar;
