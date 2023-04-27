import React from "react";
import PropTypes from "prop-types";

ProjectList.propTypes = {};

function ProjectList({ projectList }) {
  console.log("Debug");
  console.log(
    "🚀 ~ file: index.jsx:7 ~ ProjectList ~ projectList:",
    projectList
  );
  return (
    <div>
      {projectList.map((projectItem) => {
        console.log("Debuggggg");
        console.log(projectItem);
        return (
          <div className="project-item">
            <h1 className="project-title">{projectItem.projectTitle}</h1>
            <h2 className="project-description">
              {projectItem.projectDescription}
            </h2>
          </div>
        );
      })}
    </div>
  );
}

export default ProjectList;
