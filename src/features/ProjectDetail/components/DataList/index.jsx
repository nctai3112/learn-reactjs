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
  // const [annotationContent, setAnnotationContent] = useState([]);
// DEBUGGING ZONE!!!
  useEffect(() => {

    const fetchData = async() => {
      let annotationContent = [];
      console.log("Running Use Effect!!!");
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
        console.log('111');
        if (dataResponse.data.response.data.files.length > 1) {
          setFileItems(dataResponse.data.response.data.files);
          // Input information files data to annotation.json.
          if (
            annotationFileId !== "" &&
            annotationFileId !== null &&
            annotationFileId !== undefined
          ) {
            console.log("222");
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
            console.log("333");
            console.log(dataResponseJson);
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
        console.log("update json last time!");
        console.log(dataUpdateJson);
      }

      // Old code running with wrong order.
      // -------------------------------------------------------------
        // .then(async (response) => {
        //   console.log("22222222222222222222222222");
        //   const dataResponse = await response.json();
        //   let annotationContent = [];
        //   if (dataResponse.data.response.data.files.length > 1) {
        //     console.log("File list return  first time: ");
        //     console.log(dataResponse.data.response.data.files);
        //     setFileItems(dataResponse.data.response.data.files);
        //     // Input information files data to annotation.json.
        //     if (
        //       annotationFileId !== "" &&
        //       annotationFileId !== null &&
        //       annotationFileId !== undefined
        //     ) {
        //       console.log("Get file annotation.json");
        //       console.log("3333333333333333333333333333");
        //       fetch(
        //         `http://localhost:5000/drive/get-json/${annotationFileId}`,
        //         {
        //           method: "GET",
        //           headers: {
        //             Accept: "*/*",
        //             Connection: "keep-alive",
        //             "Content-Type": "application/json",
        //             "user-agent": "Chrome",
        //           },
        //         }
        //       )
        //         .then(async (response) => {
        //           // Handle the response
        //           const jsonRes = await response.json();
        //           let data = jsonRes.data;
        //           console.log("44444444444444");
        //           console.log("Get JSON file first time response...");
        //           console.log(data.response.data);
        //           annotationContent = data.response.data;
        //         })
        //         .catch((error) => {
        //           // Handle the error
        //           console.log("Error get json data:");
        //           console.log(error);
        //           annotationContent = [];
        //         });
        //       console.log(
        //         "BEFORE checking condition to update annotation.json!!!"
        //       );
        //       console.log("annotationContent");
        //       console.log(annotationContent);
        //       console.log("listOfFilesInGoogleDrive");
        //       console.log(dataResponse.data.response.data.files);
        //       console.log("5555555555555555555555");
        //       dataResponse.data.response.data.files.map((fileItem) => {
        //         if (
        //           !fileItem.name.includes("json") &&
        //           !annotationContent.some((item) => item.id === fileItem.id)
        //         ) {
        //           annotationContent.push(fileItem);
        //         }
        //       });
        //       console.log("AFTER");
        //       console.log(annotationContent);
        //       if (annotationContent.length > 0) {
        //         console.log("6666666666666666666666");
        //         fetch("http://localhost:5000/drive/update-json", {
        //           method: "POST",
        //           headers: {
        //             Accept: "*/*",
        //             Connection: "keep-alive",
        //             "Content-Type": "application/json",
        //             "user-agent": "Chrome",
        //           },
        //           body: JSON.stringify({
        //             annotationFileId: annotationFileId,
        //             fileContent: JSON.stringify(annotationContent),
        //           }),
        //         })
        //           .then(async (response) => {
        //             // Handle the response
        //             const jsonRes = await response.json();
        //             let data = jsonRes.data;
        //             console.log("77777777777777777");
        //             console.log("Update annotation.json success!");
        //           })
        //           .catch((error) => {
        //             // Handle the error
        //             console.log("Error update annotation.json");
        //             console.log(error);
        //           });
        //       }
        //     }
        //   }
        // })
        // .catch((error) => {
        //   console.log("This this error getting files from folder");
        //   console.log(error);
        // });
      }
    }
    fetchData();

  }, [driveParentId]);
// DEBUGGING ZONE!!!-----------------------------------
  const chooseAnnotateImage = (fileId) => {
    dispatch(projectDetailSlide.actions.CurrentProject(projectDetail));
    navigate(`/annotation/${fileId}`);
  }

  const refresh = async () => {
    let annotationContent = [];
    console.log("Running Use Effect!!!");
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
      console.log("111");
      if (dataResponse.data.response.data.files.length > 1) {
        setFileItems(dataResponse.data.response.data.files);
        // Input information files data to annotation.json.
        if (
          annotationFileId !== "" &&
          annotationFileId !== null &&
          annotationFileId !== undefined
        ) {
          console.log("222");
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
          console.log("333");
          console.log(dataResponseJson);
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
        console.log("update json last time!");
        console.log(dataUpdateJson);
      }
    }
    // let annotationContent = [];
    // if (
    //   driveParentId !== undefined &&
    //   driveParentId !== null &&
    //   driveParentId !== ""
    // ) {
    //   fetch("http://localhost:5000/drive/folder", {
    //     method: "POST",
    //     headers: {
    //       Accept: "*/*",
    //       Connection: "keep-alive",
    //       "Content-Type": "application/json",
    //       "user-agent": "Chrome",
    //     },
    //     body: JSON.stringify({
    //       driveParent: driveParentId,
    //     }),
    //   })
    //     .then(async (response) => {
    //       const dataResponse = await response.json();
    //       console.log("Response getting files from folder: ");
    //       console.log(dataResponse);
    //       if (dataResponse.data.response.data.files.length > 1) {
    //         console.log("HEHE");
    //         console.log(dataResponse.data.response.data.files);
    //         setFileItems(dataResponse.data.response.data.files);
    //         if (
    //           annotationFileId !== "" &&
    //           annotationFileId !== null &&
    //           annotationFileId !== undefined
    //         ) {
    //           fetch(
    //             `http://localhost:5000/drive/get-json/${annotationFileId}`,
    //             {
    //               method: "GET",
    //               headers: {
    //                 Accept: "*/*",
    //                 Connection: "keep-alive",
    //                 "Content-Type": "application/json",
    //                 "user-agent": "Chrome",
    //               },
    //             }
    //           )
    //             .then(async (response) => {
    //               // Handle the response
    //               console.log("Get file json data success");
    //               const jsonRes = await response.json();
    //               let data = jsonRes.data;
    //               annotationContent = data.response.data;
    //             })
    //             .catch((error) => {
    //               // Handle the error
    //               console.log("Error get json data:");
    //               console.log(error);
    //               annotationContent = [];
    //             });
    //             console.log("DEBUGGING...................")
    //           // console.log("DEBUGGING1... ANNOTATION CONTENT...")
    //           // console.log(annotationContent);
    //           dataResponse.data.response.data.files.map((fileItem) => {
    //             console.log(fileItem)
    //               if (
    //                 !fileItem.name.includes("json") &&
    //                 !(annotationContent.some((item) => item.id === fileItem.id))
    //               ) {
    //                 console.log("Push " + fileItem.name);
    //                 annotationContent.push(fileItem);
    //               }
    //           });
    //           // console.log("DEBUGGING1... ANNOTATION CONTENT AFTER LOADING FILES...");
    //           // console.log(annotationContent);
    //           if (annotationContent.length > 0) {
    //             fetch("http://localhost:5000/drive/update-json", {
    //               method: "POST",
    //               headers: {
    //                 Accept: "*/*",
    //                 Connection: "keep-alive",
    //                 "Content-Type": "application/json",
    //                 "user-agent": "Chrome",
    //               },
    //               body: JSON.stringify({
    //                 annotationFileId: annotationFileId,
    //                 fileContent: JSON.stringify(annotationContent),
    //               }),
    //             })
    //               .then(async (response) => {
    //                 // Handle the response
    //                 const jsonRes = await response.json();
    //                 let data = jsonRes.data;
    //                 console.log("Update annotation.json success!");
    //               })
    //               .catch((error) => {
    //                 // Handle the error
    //                 console.log("Error update annotation.json");
    //                 console.log(error);
    //               });
    //           }
    //         }
    //       }
    //     })
    //     .catch((error) => {
    //       console.log("This this error getting files from folder");
    //       console.log(error);
    //     });
    //   }
  }

  return (
    <div>
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
