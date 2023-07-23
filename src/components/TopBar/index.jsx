import React, {useRef, useEffect} from 'react';
import ProjectsText from './subcomponents/ProjectsText';
import IconInformation from './subcomponents/IconInformation';
import { Col, Row } from "antd";
import "./styles.css"
import { googleLoginSelector } from "../../redux/selectors";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TopBar = ({ sendDataToParent = () => {}, topText, backButton = false }) => {
  // const { sendDataToParent, topText } = props;
  const navigate = useNavigate();

  const topBarWrapperRef = useRef(null);

  const googleLoginData = useSelector(googleLoginSelector);

  useEffect(() => {
    if (topBarWrapperRef) {
      sendDataToParent(topBarWrapperRef.current.clientHeight);
    }
  }, [topBarWrapperRef, sendDataToParent]);

  const handleGoBack = (e) => {
    navigate(-1);
  }

  return (
    <div className="top-bar-block" ref={topBarWrapperRef}>
      <Row justify="center" align="middle" className="top-bar-container">
        <Col span={20} className="top-bar-left">
          {backButton ? (
            <div className="child child-home">
              <button onClick={handleGoBack} className="home-button">
                Back
              </button>
            </div>
          ) : (
            ""
          )}
          <ProjectsText classWrapper="child" text={topText} />
        </Col>
        <Col span={4}>
          <IconInformation pictureUrl={googleLoginData.picture} />
        </Col>
      </Row>
    </div>
  );
};

export default TopBar;
