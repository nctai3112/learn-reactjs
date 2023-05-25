import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, Input } from "antd";
import ProjectList from "./components/ProjectList";
import { googleLoginSelector } from "../../redux/selectors";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

Project.propTypes = {};

function Project(props) {
  const navigate = useNavigate();
  const googleLoginData = useSelector(googleLoginSelector);
  const [isProjectVisible, setProjectVisible] = useState(false);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    getProjectListFromDB(googleLoginData.email);
  }, []);

  const onClickCreateProject = (e) => {
    setProjectVisible(true);
  };

  const getProjectListFromDB = (email) => {
    let data = [];
    fetch("http://localhost:5000/projects/author", {
      method: "POST",
      headers: {
        Accept: "*/*",
        Connection: "keep-alive",
        "Content-Type": "application/json",
        "user-agent": "Chrome",
      },
      body: JSON.stringify({
        author: email,
      }),
    })
      .then(async (response) => {
        // Handle the response
        const jsonRes = await response.json();
        data = jsonRes.data;
        if (data.projects !== null && data.projects !== undefined) {
          setProjectList(data.projects)
        }
      })
      .catch((error) => {
        // Handle the error
        console.log("Error get project:");
        console.log(error);
      });
  }

  const submitCreateProject = (submitData) => {
    let data = [];

    const email = googleLoginData.email;
    // If exists  email -> create project!
    if (email) {
      fetch("http://localhost:5000/projects", {
        method: "POST",
        headers: {
          Accept: "*/*",
          Connection: "keep-alive",
          "Content-Type": "application/json",
          "user-agent": "Chrome",
        },
        body: JSON.stringify({
          title: projectTitle,
          description: projectDescription,
          urlData: "",
          author: email
        }),
      })
        .then(async (response) => {
          // Handle the response
          const jsonRes = await response.json();
          data = jsonRes.data;

          getProjectListFromDB(email);

          if (
            data.project._id !== null &&
            data.project._id !== "" &&
            data.project._id !== undefined
          ) {
            fetch("http://localhost:5000/drive", {
              method: "POST",
              headers: {
                Accept: "*/*",
                Connection: "keep-alive",
                "Content-Type": "application/json",
                "user-agent": "Chrome",
              },
              body: JSON.stringify({
                folderName: data.project._id,
                email_permission: email,
              }),
            })
              .then(async (response) => {
                const dataResponse = await response.json();
                console.log("Create folder success!");
                console.log("Start update db with parent folder id")
                console.log(dataResponse);
                fetch("http://localhost:5000/projects/update-project", {
                  method: "POST",
                  headers: {
                    Accept: "*/*",
                    Connection: "keep-alive",
                    "Content-Type": "application/json",
                    "user-agent": "Chrome",
                  },
                  body: JSON.stringify({
                    project_id: data.project._id,
                    parent_drive_folder: dataResponse.data.responseFolder.data.id,
                    json_id: dataResponse.data.responseFile.data.id,
                  }),
                })
                  .then(async (response) => {
                    const dataResponse = await response.json();
                    // Update project list after create a new project
                    getProjectListFromDB(email);
                    // End
                    console.log("Response update project info: ");
                    console.log(dataResponse);
                  })
                  .catch((error) => {
                    console.log("This this error update project info");
                    console.log(error);
                  });
              })
              .catch((error) => {
                console.log("This this error creating folder");
                console.log(error);
              });
          }
        })
        .catch((error) => {
          // Handle the error
          console.log("Error creating project!");
          console.log(error);
        });
    }
    else {
      navigate('/login');
    }
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
      <h2>Projects Page</h2>
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
