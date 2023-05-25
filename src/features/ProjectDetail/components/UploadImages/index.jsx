import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import useDrivePicker from "react-google-drive-picker";

function UploadImages(props) {
  const {projectDetail} = props;
  const [openPicker, data, authResponse] = useDrivePicker();
  // const customViewsArray = [new google.picker.DocsView()]; // custom view
  const handleOpenPicker = () => {
    console.log("Uploading to: ");
    console.log(projectDetail.driveParent);
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
          if (data.action === "cancel") {
            console.log("User clicked cancel/close button");
          }
          console.log(data);
        },
      });
    } catch(err) {
      console.log("Error open Picker: " + err);
    }
  };

  useEffect(() => {
    // do anything with the selected/uploaded files
    // if (data) {
    //   console.log(data);
    //   data.docs.map((i) => console.log(i));
    // }
  }, [data]);

  return (
    <div>
      <button onClick={() => handleOpenPicker()}>Open Picker</button>
    </div>
  );
}

UploadImages.propTypes = {}

export default UploadImages
