import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import "./styles.css"
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import projectDetailSlide from '../../projectDetailSlice';
import { Modal, Table } from "antd";
import UploadImages from "./../UploadImages";
import { googleLoginSelector, accessTokenSelector } from "../../../../redux/selectors";
import { useSelector } from "react-redux";

DataList.propTypes = {

};

function DataList(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectDetail } = props;
  const driveParentId = projectDetail.driveParent;
  const annotationFileId = projectDetail.urlData;
  const [fileItems, setFileItems] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const accessTokenData = useSelector(accessTokenSelector);

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
        if (!responseFilesFromFolder.ok) {
          Modal.error({
            title: "ERROR",
            content: "Server error when trying to files from drive folder.",
          });
        }
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
            if (!responseJsonData.ok) {
              Modal.error({
                title: "ERROR",
                content: "Server error when trying to get annotation file.",
              });
            }
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
        if (!responseUpdateJson.ok) {
          Modal.error({
            title: "ERROR",
            content: "Server error when trying to update annotation file.",
          });
        }
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
      if (!responseFilesFromFolder.ok) {
        Modal.error({
          title: "ERROR",
          content:
            "Server error when trying to files from drive folder.",
        });
      }
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
          if (!responseJsonData.ok) {
            Modal.error({
              title: "ERROR",
              content:
                "Server error when trying to get annotation file.",
            });
          }
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
        if (!responseUpdateJson.ok) {
          Modal.error({
            title: "ERROR",
            content: "Server error when trying to update annotation file.",
          });
        }
        const dataUpdateJson = await responseUpdateJson.json();
      }
    }
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,
    },
    {
      title: "FILE NAME",
      dataIndex: "name",
      width: 100,
    },
    {
      title: "IMAGE",
      dataIndex: "image",
      render: (imageSrc) => (
        <img
          src={imageSrc}
          alt="Image"
          style={{ width: "100px", height: "100px" }}
        />
      ),
      width: 200,
    },
  ];

  useEffect(() => {
    if (fileItems.length > 0) {
      console.log("Getting file items...!")
      const dataTableTmp = [];
      fileItems.map(async (fileItem) => {
        if (!fileItem.name.includes(".json")) {
          // const metadataResponse = await fetch(
          //   `https://www.googleapis.com/drive/v3/files/${fileItem.id}?fields=webContentLink`,
          //   {
          //     headers: {
          //       Authorization: `Bearer ${accessTokenData.access_token}`,
          //     },
          //   }
          // );

          // const metadata = await metadataResponse.json();
          // console.log("metadata: ..")
          // console.log(metadata);

          const tableItem = {
            id: fileItem.id,
            name: fileItem.name,
            image: `https://drive.google.com/uc?export=view&id=${fileItem.id}`,
          };
          dataTableTmp.push(tableItem);
        }
      });
      if (dataTableTmp.length > 0) {
        setDataTable(dataTableTmp);
      }
    }
  }, [fileItems]);

  const rowProps = (record) => ({
    onClick: () => chooseAnnotateImage(record.id),
  });

  return (
    <div className="data-manager-region">
      <div className="data-manager-above">
        <h3 className="data-title">Data Manager</h3>
        <div className="buttons-data-manager">
          <UploadImages projectDetail={projectDetail} />
          <Button name="Refresh" onClick={refresh} className="button-refresh">
            <img src="/icons/refresh.svg" width="10px" height="10px" />
            <span className="button-refresh-text">Refresh</span>
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={dataTable}
        onRow={rowProps}
        className="custom-table"
        rowClassName="custom-table-row"
      />
    </div>
  );
}

export default DataList;
