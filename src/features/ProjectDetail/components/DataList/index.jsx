import React, { useEffect, useState } from 'react';
import "./styles.css"
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import projectDetailSlide from '../../projectDetailSlice';
import { Modal, Table, Form, Input } from "antd";
import UploadImages from "./../UploadImages";
import { googleLoginSelector, accessTokenSelector } from "../../../../redux/selectors";
import { useSelector } from "react-redux";

function DataList(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectDetail } = props;
  const driveParentId = projectDetail.driveParent;
  const annotationFileId = projectDetail.urlData;
  const [fileItems, setFileItems] = useState([]);
  const [dataTable, setDataTable] = useState([]);

  const [isChangeOwner, setChangeOwner] = useState(false);

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
            if (!annotationContent) {
              annotationContent = [];
              dataResponse.data.response.data.files.map((fileItem) => {
                if (
                  !fileItem.name.includes("json") &&
                  fileItem.name !== "Result"
                ) {
                  if (!fileItem.hasOwnProperty("annotationData")) {
                    fileItem.annotationData = {
                      bounding_box: [],
                      polygon: [],
                    };
                  }
                  annotationContent.push(fileItem);
                }
              });
            } else {
              dataResponse.data.response.data.files.map((fileItem) => {
                if (
                  !fileItem.name.includes("json") &&
                  fileItem.name !== "Result" &&
                  Array.isArray(annotationContent) &&
                  !annotationContent.some((item) => item.id === fileItem.id)
                ) {
                  if (!fileItem.hasOwnProperty("annotationData")) {
                    fileItem.annotationData = {
                      "bounding_box": [],
                      "polygon": []
                    };
                  }
                  annotationContent.push(fileItem);
                }
              });
            }
        }
      }

      if (annotationFileId && annotationContent && annotationContent.length > 0) {
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
          if (!annotationContent) {
            annotationContent = [];
            dataResponse.data.response.data.files.map((fileItem) => {
              if (
                !fileItem.name.includes("json") &&
                fileItem.name !== "Result"
              ) {
                fileItem.annotationData = {
                  bounding_box: [],
                  polygon: [],
                };
                annotationContent.push(fileItem);
              }
            });
          }
          else {
            dataResponse.data.response.data.files.map((fileItem) => {
              if (
                !fileItem.name.includes("json") &&
                fileItem.name !== "Result" &&
                Array.isArray(annotationContent) &&
                !annotationContent.some((item) => item.id === fileItem.id)
              ) {
                if (!fileItem.hasOwnProperty("annotationData")) {
                  fileItem.annotationData = {
                    bounding_box: [],
                    polygon: [],
                  }
                }
                annotationContent.push(fileItem);
              }
            });
          }
        }
      }

      if (annotationFileId && annotationContent.length > 0) {
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
    Modal.info({"title": "Notice", "content": "Refresh done!"})
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => (
        <div className="id-item-container">
          <p className="id-item">{id}</p>
        </div>
      ),
      width: 50,
    },
    {
      title: "IMAGE",
      dataIndex: "image",
      render: (imageSrc) => (
        <img
          src={imageSrc}
          alt="Image"
          style={{ width: "150px", height: "150px" }}
        />
      ),
      width: 200,
    },
    {
      title: "FILE NAME",
      dataIndex: "name",
      width: 50,
    },
    {
      title: "CREATED AT",
      dataIndex: "createdAt",
      render: (createdTime) => {
        const dateObject = new Date(createdTime);
        const localDateString = dateObject.toLocaleString();
        return <p className='created-time-item'>{localDateString}</p>;
      },
      width: 150,
    },
    {
      title: "UPDATED AT",
      dataIndex: "updatedAt",
      render: (updatedAt) => {
        const dateObject = new Date(updatedAt);
        const localDateString = dateObject.toLocaleString();
        return <p className='modified-time-item'>{localDateString}</p>;
      },
      width: 150,
    },
  ];

  useEffect(() => {
    if (fileItems.length > 0) {
      const dataTableTmp = [];
      fileItems.map(async (fileItem) => {
        if (fileItem.name !== "Result" && !fileItem.name.includes(".json")) {
          const tableItem = {
            key: fileItem.id,
            id: fileItem.id,
            name: fileItem.name,
            image: `https://drive.google.com/uc?export=view&id=${fileItem.id}`,
            createdAt: fileItem.createdTime,
            updatedAt: fileItem.modifiedTime,
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

  const popupChangeOwner = (e) => {
    setChangeOwner(true);
  };

  const handleChangeOwnerShip = async (e) => {
    const newOwnerEmail = e.ownerEmail;
    const responseChangeOwnership = await fetch(
      "http://localhost:5000/drive/change-ownership",
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          Connection: "keep-alive",
          "Content-Type": "application/json",
          "user-agent": "Chrome",
        },
        body: JSON.stringify({
          ownerEmail: newOwnerEmail,
          projectId: projectDetail._id,
          folderId: projectDetail.driveParent,
        }),
      }
    );
    if (!responseChangeOwnership.ok) {
      Modal.error({
        title: "ERROR",
        content: "Server error when trying to get annotation file.",
      });
    } else {
      const dataResponseJson = await responseChangeOwnership.json();
    }
    setChangeOwner(false);
  };

  return (
    <div className="data-manager-region">
      <div className="data-manager-above">
        <h3 className="data-title">Data Manager</h3>
        <div className="buttons-data-manager">
          {isChangeOwner ? (
            <Modal
              title="Change Project Owner"
              open={isChangeOwner}
              onCancel={() => setChangeOwner(false)}
              footer={null}
            >
              <Form onFinish={handleChangeOwnerShip}>
                <Form.Item label="Email" name="ownerEmail" required>
                  <Input type="text" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          ) : (
            <></>
          )}
          <Button className="button-change-owner" onClick={popupChangeOwner}>
            Change Owner
          </Button>
          <UploadImages projectDetail={projectDetail} />
          <Button name="Refresh" onClick={refresh} className="button-refresh">
            <img src="/icons/refresh.svg" width="10px" height="10px" />
            <span className="button-refresh-text">Refresh</span>
          </Button>
        </div>
      </div>
      <Table
        key={projectDetail._id}
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
