import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, Input } from "antd";
import ProjectList from "./components/ProjectList";

Project.propTypes = {};

function Project(props) {
  const [isProjectVisible, setProjectVisible] = useState(false);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [projectList, setProjectList] = useState([]);

  const onClickCreateProject = (e) => {
    setProjectVisible(true);
  };

  const submitCreateProject = (submitData) => {
    setProjectList([
      ...projectList,
      {
        projectTitle: projectTitle,
        projectDescription: projectDescription,
      },
    ]);
    setProjectTitle("");
    setProjectDescription("");
    setProjectVisible(false);
  };

  const handleInputProjectDescription = (e) => {
    setProjectDescription(e.target.value);
  };

  const handleInputProjectTitle = (e) => {
    setProjectTitle(e.target.value);
  };

  return (
    <div>
      <Button onClick={onClickCreateProject}>Create Project</Button>
      <Modal
        title="Create Project"
        open={isProjectVisible}
        onCancel={() => setProjectVisible(false)}
        footer={null}
      >
        <Form>
          <Form.Item label="Project Title" name="project-title" required>
            <Input
              type="text"
              value={projectTitle}
              onChange={handleInputProjectTitle}
            />
          </Form.Item>
          <Form.Item label="Description" name="project-description">
            <Input.TextArea
              placeholder="Optional description of your project"
              value={projectDescription}
              onChange={handleInputProjectDescription}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={submitCreateProject}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <ProjectList projectList={projectList} />
    </div>
  );
}

export default Project;
