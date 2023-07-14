import React, {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import ProjectsText from './subcomponents/ProjectsText';
import IconInformation from './subcomponents/IconInformation';
import { Col, Row } from "antd";
import "./styles.css"
import { googleLoginSelector } from "../../redux/selectors";
import { useSelector } from "react-redux";

const TopBar = ({ sendDataToParent = () => {
  console.log("sendDataToParent");
}, topText }) => {
  // const { sendDataToParent, topText } = props;

  const topBarWrapperRef = useRef(null);

  const googleLoginData = useSelector(googleLoginSelector);

  useEffect(() => {
    if (topBarWrapperRef) {
      console.log(
        "Debugging get top bar height: ",
        topBarWrapperRef.current.clientHeight
      );
      sendDataToParent(topBarWrapperRef.current.clientHeight);
    }
  }, [topBarWrapperRef]);

  return (
    <div className="top-bar-block" ref={topBarWrapperRef}>
      <Row justify="center" align="middle" className="top-bar-container">
        <Col span={12}>
          <ProjectsText text={topText} />
        </Col>
        <Col span={12}>
          <IconInformation pictureUrl={googleLoginData.picture} />
        </Col>
      </Row>
    </div>
  );
};

export default TopBar;
