import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router";

// import Loading from '../../components/Loading'
import Toolbox from "./components/Toolbox/index";
import RenderComponent from "./components/Stage/index";
// import ThumbnailSlider from './components/ThumbnailSlider'
// import PlayControl from "./components/PlayControl/index";
import PropagationControl from "./components/PropagationControl/index";
import ModeController from "./components/ModeController/index";
import Sidebar from "./components/Sidebar/index";
import TopNav from "./components/TopNav/index";
import Prediction from "./components/Prediction/index";
import KeyboardHandler from "./components/KeyboardHandler/index";

import annotationEventCenter from "./EventCenter";
import {
  useDatasetStore,
  useGeneralStore,
  useAnnotationStore,
} from "./stores/index";
import useQuery from "../../utils/useQuery";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    flexDirection: "column",
    overflow: "hidden",
  },
  annotationWrapper: {
    display: "flex",
    flexDirection: "row",
    width: "100vw",
    flex: 1,
    overflow: "hidden",
  },
  annotatorContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflowX: "hidden",
    height: "100%",
    boxSizing: "border-box",
    // paddingBottom: 10,
    background: theme.palette.primary.dark,
  },
  toolboxContainer: {
    height: "100%",
  },
  sidebarWrapper: {
    width: "25%",
  },
}));

const Annotation = (props) => {
  const classes = useStyles();
  // const { datasetId } = useParams();
  const { datasetId } = 1;

  const query = useQuery();
  const page = JSON.parse(query.get("page") || 1);

  const instanceId = useDatasetStore((state) => state.instanceId);
  const getDatasetInfo = useDatasetStore((state) => state.getDatasetInfo);
  const getDataInstances = useDatasetStore((state) => state.getDataInstances);
  const setInstanceId = useDatasetStore((state) => state.setInstanceId);

  const loadAnnotationLabels = useAnnotationStore(
    (state) => state.loadAnnotationLabels
  );
  const loadAnnotationObjects = useAnnotationStore(
    (state) => state.loadAnnotationObjects
  );
  const loadAnnotations = useAnnotationStore((state) => state.loadAnnotations);

  useEffect(() => {
    if (datasetId) {
      setInstanceId(null);
      getDatasetInfo(datasetId);
      loadAnnotationLabels(datasetId);
    }
  }, [datasetId]);

  useEffect(() => {
    getDataInstances(datasetId, page);
  }, [datasetId, page]);

  useEffect(() => {
    if (instanceId) {
      loadAnnotationObjects(instanceId);
      loadAnnotations(instanceId);
    }
  }, [instanceId]);

  // const isGeneralLoading = useGeneralStore((state) => state.isLoading);
  // const isDatasetLoading = useDatasetStore((state) => state.isLoading);
  // const isAnnotationLoading = useAnnotationStore((state) => state.isLoading);

  return (
    <div className={classes.root}>
      {/* TODO: loading by component  */}
      {/* <Loading isLoading={{ ...isGeneralLoading, ...isDatasetLoading, ...isAnnotationLoading }} /> */}
      This is topnav
      <TopNav />
      {/* <div className={classes.annotationWrapper}> */}
      <div className={classes.toolboxContainer}>
        <Toolbox eventCenter={annotationEventCenter} />
      </div>
      <div className={classes.annotatorContainer}>
        This is render component.
        <RenderComponent />
        This is propagation control.
        <PropagationControl />
        {/* <PlayControl /> */}
        {/* <ThumbnailSlider/> */}
        {/* Non-UI elements */}
        <ModeController />
        <KeyboardHandler />
        <Prediction />
      </div>
      <div className={classes.sidebarWrapper}>
        <Sidebar />
      </div>
      {/* </div> */}
    </div>
  );
};

export default Annotation;
