import React from "react";
import './styles.css'
import { useNavigate, Link } from "react-router-dom";

function ProjectList({ projectList, inviteProject = false}) {
  const navigate = useNavigate();
  // const accessProjectDetail = (projectItem) => {
  //   navigate(`/project/${projectItem._id}`);
  // }

  return (
    <div className="projects-list">
      {(Array.isArray(projectList)) && projectList.map((project) => {
        console.log("Checking rendering")
        console.log(project)
        return (
          <Link className="link-project" to={`/project/${project._id}`} state={{inviteProject: inviteProject}}>
            <div
              className="project-item"
              id={project._id}
              key={project._id}
              // onClick={() => accessProjectDetail(project)}
            >
              <div className="project-title-region">
                <h4 className="project-title">{project.title}</h4>
              </div>

              <div className="project-description-region">
                <p className="project-description">{project.description}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default ProjectList;
