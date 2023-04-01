import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import { find } from "lodash";
// import { useParams, useHistory } from 'react-router'
import { useParams, useHistory } from "react-router";
import { get } from "lodash";

import { useDatasetStore } from "../../../../stores/index";
import useQuery from "../../../../../../utils/useQuery";

import { IMAGES_PER_PAGE } from "../../../../constants";
import ArrowRightIcon from "@material-ui/icons/ChevronRightRounded";
import ArrowDownIcon from "@material-ui/icons/ExpandMoreRounded";

import DataInstanceInfo from "./DataInstanceInfo";
import DataPagination from "./Pagination";

const useStyles = makeStyles((theme) => ({
  header: {
    cursor: "pointer",
    background: theme.palette.primary.dark,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  title: {
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 12,
    color: theme.palette.primary.contrastText,
  },
  titleCount: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 5,
    minWidth: 30,
    fontSize: 12,
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  divider: {
    background: theme.palette.secondary.main,
  },
  listContainer: {
    width: "100%",
    padding: 0,
    background: theme.palette.primary.light,
  },
}));

const ObjectInfoPanel = (props) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(true);

  const { datasetId } = useParams();
  let query = useQuery();
  // let history = useHistory()

  const page = JSON.parse(query.get("page") || 1);

  const dataset = useDatasetStore((state) => state.dataset);
  const dataInstances = useDatasetStore((state) => state.dataInstances);
  const instanceId = useDatasetStore((state) => state.instanceId);
  const setInstanceId = useDatasetStore((state) => state.setInstanceId);

  const instances = get(dataset, "instances", 0);
  const maxPage = Number.parseInt(
    instances / IMAGES_PER_PAGE + Boolean(instances % IMAGES_PER_PAGE)
  );
  const handlePageChange = (val) => {
    let newPage = page + val;

    newPage = Math.max(Math.min(maxPage, newPage), 1);

    // if (newPage !== page) {
    //   history.replace(`/annotations/dataset=${datasetId}?page=${newPage}`)
    // }
  };

  return (
    <Grid container>
      <Grid
        container
        item
        xs={12}
        direction="row"
        alignItems="center"
        className={classes.header}
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      >
        <Grid container item direction="row" alignItems="center" xs={2}>
          {isOpen ? (
            <ArrowDownIcon color="secondary" />
          ) : (
            <ArrowRightIcon color="secondary" />
          )}
        </Grid>
        <Grid container item xs={8} direction="row" alignItems="center">
          <Grid item className={classes.title}>
            Data instances
          </Grid>
          <Grid item className={classes.titleCount}>
            {dataset.instances}
          </Grid>
        </Grid>
        <Grid container item xs={2} justifyContent="flex-start">
          {/* <Divider orientation="vertical" flexItem className={classes.divider} /> */}
        </Grid>
      </Grid>
      <Grid container item xs={12}>
        <Collapse in={isOpen} className={classes.listContainer}>
          <List className={classes.listContainer}>
            <DataPagination
              page={page}
              count={maxPage}
              handlePageChange={handlePageChange}
            />
            {dataInstances.map((instance) => {
              return (
                <DataInstanceInfo
                  key={instance.id}
                  dataInstance={instance}
                  isSelected={instance.id === instanceId}
                  setSelectedInstanceId={setInstanceId}
                />
              );
            })}
          </List>
        </Collapse>
      </Grid>
    </Grid>
  );
};

export default ObjectInfoPanel;
