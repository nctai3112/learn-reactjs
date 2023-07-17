import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import useDrivePicker from "react-google-drive-picker";
import { Button } from "antd";
import './styles.css'

function UploadImages(props) {
  const {projectDetail} = props;
  const [openPicker, data, authResponse] = useDrivePicker();
  // const customViewsArray = [new google.picker.DocsView()]; // custom view
  const handleOpenPicker = () => {
    try {
      openPicker({
        clientId:
          "482831900623-fvngfj4petn48ms9a9jqvmod19iglr5r.apps.googleusercontent.com",
        developerKey: "AIzaSyA7rgtJ--DxBcvZLl2xLFQP_rGfsE709KA",
        viewId: "DOCS",
        showUploadView: true,
        showUploadFolders: true,
        supportDrives: true,
        multiselect: true,
        setParentFolder: projectDetail.driveParent,
        customScopes: ['https://www.googleapis.com/auth/drive'],
        callbackFunction: (data) => {
          console.log(data);
          if (data.action === "cancel") {

          }
        },
      });
    } catch(err) {
      console.log("Error open Picker: " + err);
    }
  };

  useEffect(() => {
    // do anything with the selected/uploaded files
    if (data) {
      console.log("Drive Picker: data:")
      console.log(data);
    }
  }, [data]);

  return (
    <Button onClick={() => handleOpenPicker()} className="button-upload-drive">
      <img src="/icons/upload_cloud.svg" width="10px" height="10px"/>
      <span className="button-upload-drive-text">
        Upload Drive
      </span>
    </Button>
  );
}

UploadImages.propTypes = {}

export default UploadImages
