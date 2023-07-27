import React from 'react';
import './styles.css'

function ProjectsText(props) {
  const { classWrapper, text } = props;
  return (
    <div
      className={`project-text ${classWrapper}`}
      style={{ background: "white", color: "black" }}
    >
      <h2
        className="text"
        style={{
          textAlign: "left",
          paddingLeft: "50px",
        }}
      >
        {text}
      </h2>
    </div>
  );
}

export default ProjectsText;
