import React from "react";
import './styles.css'
import { useNavigate } from "react-router-dom";

function ProjectList({ projectList }) {
  const navigate = useNavigate();

  const accessProjectDetail = (projectItem) => {
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

  // return (
  //   <div className="project-list">
  //     {projectList.map((projectItem) => {
  //       return (
  //         <div
  //           id={projectItem._id}
  //           key={projectItem._id}
  //           className="project-item grey-section"
  //           onClick={() => accessProjectDetail(projectItem)}
  //         >
  //           <h2 className="project-title">{projectItem.title}</h2>
  //           <p className="project-description">
  //             {projectItem.description}
  //           </p>
  //         </div>
  //       );
  //     })}
  //   </div>
  // );
}

export default ProjectList;
