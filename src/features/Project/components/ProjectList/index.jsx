import React from "react";
import PropTypes from "prop-types";
import './styles.css'
import { useNavigate } from "react-router-dom";

ProjectList.propTypes = {};

function ProjectList({ projectList }) {
  const navigate = useNavigate();

  const accessProjectDetail = (projectItem) => {
    navigate(`/project/${projectItem._id}`);
  }

  return (
    <div className="project-list">
      {projectList.map((projectItem) => {
        return (
          <div id={projectItem._id}
            key={projectItem._id}
            className="project-item grey-section"
            onClick={() => accessProjectDetail(projectItem)}>
            <h2 className="project-title">{projectItem.title}</h2>
            <p className="project-description">{projectItem.description}</p>
          </div>
        );
      })}
    </div>
  );
}

export default ProjectList;
