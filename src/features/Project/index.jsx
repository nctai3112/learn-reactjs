import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Divider, Space } from "antd";
import ProjectList from "./components/ProjectList";
import { googleLoginSelector } from "../../redux/selectors";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from './../../components/Footer';
import TopBar from "./../../components/TopBar";
import './styles.css'
import { ClimbingBoxLoader } from "react-spinners";

function Project(props) {
  const [isLoading, setLoading] = useState(false);
  const [isLoadingProjectList, setLoadingProjectList] = useState(false);
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
    setLoadingProjectList(true);
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
          console.log("Getting information projects");
          console.log(data.projects)
          setProjectList(data.projects)
        }
        setLoadingProjectList(false);
      })
      .catch((error) => {
        console.log(error);
        console.log("Error when trying to get projects from author");
        Modal.error({title:"ERROR", content: "Error when trying to get projects from user. Please, try again by reloading this page."});
        setLoadingProjectList(false);
      });
  }

  const submitCreateProject = (submitData) => {
    let data = [];

    const email = googleLoginData.email;
    // If exists  email -> create project!
    setLoading(true);
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
                    setLoading(false);
                  })
                  .catch((error) => {
                    Modal.error({title:"ERROR", content: "Error when trying to update project information"});
                    setLoading(false);
                  });
              })
              .catch((error) => {
                setLoading(false);
                Modal.error({title:"ERROR", content: "Error when creating drive folder for project."});
              });
          }
        })
        .catch((error) => {
          setLoading(false);
          Modal.error({title:"ERROR", content: "Server error when creating a project. Please try again!"});

        });
    }
    else {
      navigate('/');
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
    <div className="outer-wrapper">
      {(isLoading || isLoadingProjectList) ? (
        <ClimbingBoxLoader size={30} color={"#000"} loading={isLoading || isLoadingProjectList} />
      ) : (
        <div
          className="project-page"
          style={{ display: "flex", flexDirection: "column", width: "100%",height: "100vh" }}
        >
          <header>
            <TopBar topText="Projects" />
          </header>
          <Divider className="custom-divider" />
          <div className="project-wrapper" style={{ flex: 1 }}>
            <Space
              className="project-section"
              direction="vertical"
              size="large"
              style={{ width: "100%", height: "100%" }}
            >
              <div className="project-above-section">
                <div className="left-section">
                  <img src="/images/all-projects.png" />
                  <h3 className="all-project-text">All Projects</h3>
                </div>
                <div className="right-section">
                  <Button
                    className="button-create-project"
                    onClick={onClickCreateProject}
                  >
                    Create Project
                  </Button>
                </div>
              </div>
              <Modal
                title="Create Project"
                open={isProjectVisible}
                onCancel={() => setProjectVisible(false)}
                footer={null}
              >
                <Form layout="vertical">
                  <Form.Item
                    label="Project Title"
                    name="project-title"
                    required
                  >
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
            </Space>
          </div>
          <footer>
            <Footer />
          </footer>
        </div>
      )}
    </div>
  );
}

export default Project;
