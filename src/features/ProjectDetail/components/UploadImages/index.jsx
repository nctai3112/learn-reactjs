import React from 'react';
import { Modal } from 'antd';
import useDrivePicker from "react-google-drive-picker";
import { Button } from "antd";
import './styles.css';

import { useSelector } from 'react-redux';
import { accessTokenSelector } from "../../../../redux/selectors";

function UploadImages(props) {
  const accessTokenData = useSelector(accessTokenSelector);
  const {projectDetail} = props;
  const [openPicker] = useDrivePicker();
  const handleOpenPicker = () => {
    try {
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
      <img src="/icons/upload_cloud.svg" width="10px" height="10px" alt="Upload Drive"/>
      <span className="button-upload-drive-text">
        Import Data
      </span>
    </Button>
  );
}

UploadImages.propTypes = {}

export default UploadImages
