import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from "react-router-dom";
import DataList from './components/DataList';
import { Modal, Divider, Button, Input, Form } from "antd";
import TopBar from '../../components/TopBar';
import Footer from "../../components/Footer";
import "./styles.css"
import { useSelector } from 'react-redux';
import { googleLoginSelector } from '../../redux/selectors';

function ProjectDetail(props) {
  const { id } = useParams();
  const [projectDetail, setProjectDetail] = useState([]);

  useEffect(() => {
    let data = [];
    try {
      fetch(`https://be-express.vercel.app/projects/${id}`, {
        method: "GET",
        headers: {
          Accept: "*/*",
          Connection: "keep-alive",
          "Content-Type": "application/json",
          "user-agent": "Chrome",
        },
      })
        .then(async (response) => {
          // Handle the response
          const jsonRes = await response.json();
          data = jsonRes.data;
          if (data.project !== null && data.project !== undefined) {
            Modal.info({ title: "Notice", content: "Load data successfully" });
            setProjectDetail(data.project);
          }else {
            Modal.error({ title: "ERROR", content: "Error load data from server" });
          }
        })
        .catch((error) => {
          // Handle the error
          Modal.error({
            title: "ERROR",
            content: "Server error when trying to get project information.",
          });
        });
    } catch(error) {
      Modal.error({
        title: "ERROR",
        content: "Server error when trying to get project information.",
      });
      console.log("Error get information project");
      console.log(error);
    }
  }, [id]);

  const googleLoginData = useSelector(googleLoginSelector);

  const location = useLocation();
  const [isInviteProject, setInviteProject] = useState(false);
  useEffect(() => {
    if (location.state.inviteProject !== undefined) {
      setInviteProject(location.state.inviteProject);
    } else {
      const ownerProject = projectDetail.author;
      const loginUser = googleLoginData.email;
      if (ownerProject === loginUser) {
        setInviteProject(false);
      }
      else {
        setInviteProject(true);
      }
    }
  }, [location, projectDetail, googleLoginData]);

  const [isInvite, setInvite] = useState(false);
  const [inputInviteEmail , setInputInviteEmail] = useState("");
  const invitePeople = (e) => {
    setInvite(true);
  }

  const submitInvitePerson = (e) => {
    const emailOwner = googleLoginData.email;

    if (emailOwner && inputInviteEmail) {
      try {
        fetch("https://be-express.vercel.app/projects/invite-people", {
        method: "POST",
        headers: {
          Accept: "*/*",
          Connection: "keep-alive",
          "Content-Type": "application/json",
          "user-agent": "Chrome",
        },
        body: JSON.stringify({
          emailOwner: emailOwner,
          inviteEmail: inputInviteEmail,
          projectId: id
        }),
      })
        .then(async (response) => {
          // Handle the response
          const jsonRes = await response.json();
          let data = jsonRes.data;
          console.log(data);
          Modal.info({title: "Notice", content: "Share project successfully"})
        })
        .catch((error) => {
          // Handle the error
          Modal.error({
            title: "Error",
            content: "Error share project try again later.",
          });
          console.log("Error invite people");
          console.log(error);
        });
      }
      catch (e) {
        Modal.error({
          title: "Error",
          content: "Error share project try again later.",
        });
        console.log("Error invite people");
      }
    }
    setInputInviteEmail("");
    setInvite(false);
  }

  const handleChangeInputInviteEmail = (e) => {
    setInputInviteEmail(e.target.value);
  }

  return (
    <div className="project-detail-page-wrapper">
      <TopBar
        topText={`Projects / ${projectDetail.title}`}
        backButton={true}
      />
      <Divider className="divider-custom" />
      {projectDetail.description ? (
        <div className="project-description-wrapper">
          <p className="project-description-text">
            {projectDetail.description}
          </p>
        </div>
      ) : (
        ""
      )}

      {isInvite ? (
        <Modal
          title="Share Project"
          open={isInvite}
          onCancel={() => setInvite(false)}
          footer={null}
        >
          <Form layout="vertical">
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input
                value={inputInviteEmail}
                onChange={handleChangeInputInviteEmail}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={submitInvitePerson}
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      ) : (
        ""
      )}
      {isInviteProject ? (
        ""
      ) : (
        <Button className="button-share-project" onClick={invitePeople}>
          Share Project
        </Button>
      )}
      <DataList
        projectDetail={projectDetail}
        id={projectDetail._id}
        isInviteProject={isInviteProject}
      />
      <Footer />
    </div>
  )
}

export default ProjectDetail;
