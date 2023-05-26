import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import UploadImages from './components/UploadImages';
import DataList from './components/DataList';

ProjectDetail.propTypes = {

};

function ProjectDetail(props) {
  const { id } = useParams();
  const [projectDetail, setProjectDetail] = useState([]);
  useEffect(() => {
    let data = [];
    try {
      fetch(`http://localhost:5000/projects/${id}`, {
        method: "GET",
        headers: {
          Accept: "*/*",
          Connection: "keep-alive",
          "Content-Type": "application/json",
          "user-agent": "Chrome",
        },
      })
        .then(async (response) => {
          // Handle the response
          const jsonRes = await response.json();
          data = jsonRes.data;
          if (data.project !== null && data.project !== undefined) {
            setProjectDetail(data.project);
          }
        })
        .catch((error) => {
          // Handle the error
          console.log("Error get project:");
          console.log(error);
        });
    } catch {}
  }, [id]);

  return (
    <div>
      <h2>
        Project Detail Page
      </h2>
      <div className="project-detail">
        <h2>{projectDetail.title}</h2>
        <p>{projectDetail.description}</p>
      </div>
      <UploadImages projectDetail={projectDetail} />
      <DataList projectDetail={projectDetail} id={projectDetail._id}/>
    </div>
  );
}

export default ProjectDetail;
