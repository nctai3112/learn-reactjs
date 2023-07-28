import React from "react";
import './styles.css'
import { useNavigate } from "react-router-dom";

function ProjectList({ projectList, inviteProject = false }) {
  const navigate = useNavigate();

  const accessProjectDetail = (projectItem) => {
    if (inviteProject) {
      
    }
    navigate(`/project/${projectItem._id}`);
  }

  return (
    <div className="projects-list">
      {projectList.map((project) => {
        return (
          <div
            className="project-item"
            id={project._id}
            key={project._id}
            onClick={() => accessProjectDetail(project)}
          >
            <div className="project-title-region">
              <h4 className="project-title">{project.title}</h4>
            </div>

            <div className="project-description-region">
              <p className="project-description">{project.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProjectList;
