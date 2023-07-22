import React from 'react';

function ProjectsText(props) {
  const { text } =props;
  return (
    <div className="project-text" style={{background:"white", color:"black"}}>
      <h1 className="text" style={{
        textAlign:"left",
        paddingLeft:"50px"
        }}>
        {text}
      </h1>
    </div>
  );
}

export default ProjectsText;
