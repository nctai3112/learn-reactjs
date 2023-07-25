import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import DataList from './components/DataList';
import { Modal, Divider, Button, Input, Form } from "antd";
import TopBar from '../../components/TopBar';
import Footer from "../../components/Footer";
import "./styles.css"

function ProjectDetail(props) {
  const { id } = useParams();
  const [projectDetail, setProjectDetail] = useState([]);

  const [isChangeOwner, setChangeOwner] = useState(false)

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
            setProjectDetail(data.project);
          }
        })
        .catch((error) => {
          // Handle the error
          Modal.error({
            title: "ERROR",
            content: "Server error when trying to get project detail.",
          });
        });
    } catch(error) {
      console.log("Error get information project");
      console.log(error);
    }
  }, [id]);

  const popupChangeOwner = (e) => {
    setChangeOwner(true);
  };

  const handleChangeOwnerShip = async (e) => {
    const newOwnerEmail = e.ownerEmail;
    const responseChangeOwnership = await fetch(
      "https://be-express.vercel.app/drive/change-ownership",
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          Connection: "keep-alive",
          "Content-Type": "application/json",
          "user-agent": "Chrome",
        },
        body: JSON.stringify({
          ownerEmail: newOwnerEmail,
          projectId: id,
          folderId: projectDetail.driveParent,
        }),
      }
    );
    if (!responseChangeOwnership.ok) {
      Modal.error({
        title: "ERROR",
        content: "Server error when trying to get annotation file.",
      });
    }
    else {
      const dataResponseJson = await responseChangeOwnership.json();
    }
    setChangeOwner(false);
  }

  return (
    <div className="project-detail-page-wrapper">
      <TopBar topText={`Projects / ${projectDetail.title}`} backButton={true}/>
      <Divider className="divider-custom" />
      {
        projectDetail.description ? (
          <div className="project-description-wrapper">
            <p className="project-description-text">{projectDetail.description}</p>
          </div>
        ) : ("")
      }

      {isChangeOwner ? (
        <Modal
          title="Change Project Owner"
          open={isChangeOwner}
          onCancel={() => setChangeOwner(false)}
          footer={null}
        >
          <Form onFinish={handleChangeOwnerShip}>
            <Form.Item label="Email" name="ownerEmail" required>
              <Input type="text" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      ) : (
        <></>
      )}
      <Button className="button-change-owner" onClick={popupChangeOwner}>
        Change Owner
      </Button>
      <DataList projectDetail={projectDetail} id={projectDetail._id} />
      <Footer />
    </div>
  );
}

export default ProjectDetail;
