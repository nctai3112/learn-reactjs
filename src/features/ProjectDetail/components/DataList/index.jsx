import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import "./styles.css"
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import projectDetailSlide from '../../projectDetailSlice';

DataList.propTypes = {


};

function DataList(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectDetail } = props;
  const driveParentId = projectDetail.driveParent;
  const annotationFileId = projectDetail.urlData;
  const [fileItems, setFileItems] = useState([]);

  useEffect(() => {

    const fetchData = async() => {
      let annotationContent = [];
      if (
        driveParentId !== undefined &&
        driveParentId !== null &&
        driveParentId !== ""
      ) {
        const responseFilesFromFolder = await fetch(
          "http://localhost:5000/drive/folder",
          {
            method: "POST",
            headers: {
              Accept: "*/*",
              Connection: "keep-alive",
              "Content-Type": "application/json",
              "user-agent": "Chrome",
            },
            body: JSON.stringify({
              driveParent: driveParentId,
            }),
          }
        );
        const dataResponse = await responseFilesFromFolder.json();
        if (dataResponse.data.response.data.files.length > 1) {
          setFileItems(dataResponse.data.response.data.files);
          // Input information files data to annotation.json.
          if (
            annotationFileId !== "" &&
            annotationFileId !== null &&
            annotationFileId !== undefined
          ) {
            const responseJsonData = await fetch(
              `http://localhost:5000/drive/get-json/${annotationFileId}`,
              {
                method: "GET",
                headers: {
                  Accept: "*/*",
                  Connection: "keep-alive",
                  "Content-Type": "application/json",
                  "user-agent": "Chrome",
                },
              }
            );
            const dataResponseJson = await responseJsonData.json();
            annotationContent = dataResponseJson.data.response.data;
            dataResponse.data.response.data.files.map((fileItem) => {
            if (
              !fileItem.name.includes("json") &&
              !annotationContent.some((item) => item.id === fileItem.id)
            ) {
              annotationContent.push(fileItem);
            }
          });
        }
      }

      if (annotationFileId) {
        const responseUpdateJson = await fetch("http://localhost:5000/drive/update-json", {
          method: "POST",
          headers: {
            Accept: "*/*",
            Connection: "keep-alive",
            "Content-Type": "application/json",
            "user-agent": "Chrome",
          },
          body: JSON.stringify({
            annotationFileId: annotationFileId,
            fileContent: JSON.stringify(annotationContent),
          }),
        });
        const dataUpdateJson = await responseUpdateJson.json();
      }
      }
    }
    fetchData();

  }, [driveParentId]);

  const chooseAnnotateImage = (fileId) => {
    dispatch(projectDetailSlide.actions.CurrentProject(projectDetail));
    navigate(`/annotation/${fileId}`);
  }

  const refresh = async () => {
    let annotationContent = [];
    if (
      driveParentId !== undefined &&
      driveParentId !== null &&
      driveParentId !== ""
    ) {
      const responseFilesFromFolder = await fetch(
        "http://localhost:5000/drive/folder",
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            Connection: "keep-alive",
            "Content-Type": "application/json",
            "user-agent": "Chrome",
          },
          body: JSON.stringify({
            driveParent: driveParentId,
          }),
        }
      );
      const dataResponse = await responseFilesFromFolder.json();
      if (dataResponse.data.response.data.files.length > 1) {
        setFileItems(dataResponse.data.response.data.files);
        // Input information files data to annotation.json.
        if (
          annotationFileId !== "" &&
          annotationFileId !== null &&
          annotationFileId !== undefined
        ) {
          const responseJsonData = await fetch(
            `http://localhost:5000/drive/get-json/${annotationFileId}`,
            {
              method: "GET",
              headers: {
                Accept: "*/*",
                Connection: "keep-alive",
                "Content-Type": "application/json",
                "user-agent": "Chrome",
              },
            }
          );
          const dataResponseJson = await responseJsonData.json();
          annotationContent = dataResponseJson.data.response.data;
          dataResponse.data.response.data.files.map((fileItem) => {
            if (
              !fileItem.name.includes("json") &&
              !annotationContent.some((item) => item.id === fileItem.id)
            ) {
              annotationContent.push(fileItem);
            }
          });
        }
      }

      if (annotationFileId) {
        const responseUpdateJson = await fetch(
          "http://localhost:5000/drive/update-json",
          {
            method: "POST",
            headers: {
              Accept: "*/*",
              Connection: "keep-alive",
              "Content-Type": "application/json",
              "user-agent": "Chrome",
            },
            body: JSON.stringify({
              annotationFileId: annotationFileId,
              fileContent: JSON.stringify(annotationContent),
            }),
          }
        );
        const dataUpdateJson = await responseUpdateJson.json();
      }
    }
  }

  return (
    <div >
      <Button type="primary" name="Refresh" onClick={refresh}>Refresh</Button>
      <h1>This is list of files</h1>
      {fileItems.map((fileItem) => {

        return (
          !fileItem.name.includes(".json") ?
          <div
            className="file-item"
            key={fileItem.id}
            onClick={() => chooseAnnotateImage(fileItem.id)}
          >
            <img
              src={`https://drive.google.com/uc?export=view&id=${fileItem.id}`}
              alt="invalid"
              className="file-image"
            />
            <div className="file-content">
              <h2 className="file-title">{fileItem.name}</h2>
            </div>
          </div> : <></>
        );
      })}
    </div>
  );
}

export default DataList;
