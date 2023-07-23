import React, { useEffect } from 'react';
import { Modal } from 'antd';
import useDrivePicker from "react-google-drive-picker";
import { Button } from "antd";
import './styles.css';

import { useSelector } from 'react-redux';
import { accessTokenSelector } from "../../../../redux/selectors";

function UploadImages(props) {
  const accessTokenData = useSelector(accessTokenSelector);
  const {projectDetail} = props;
  const [openPicker, data, authResponse] = useDrivePicker();
  // const customViewsArray = [new google.picker.DocsView()]; // custom view
  const handleOpenPicker = () => {
    try {
      console.log("here");
      console.log(data);
      console.log(authResponse);
      console.log("open picker");
      console.log(accessTokenData.access_token);
      openPicker({
        token: accessTokenData.access_token,
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
          console.log("data callback")
          console.log(data);
          if (data && data.action === "picked") {
            Modal.info({
              title: "Notice",
              content:
                "Please click 'refresh' button after you upload your images to fetch your data",
            });
          }
        },
      });
    } catch(err) {
      console.log("Error open Picker: " + err);
    }
  };

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
