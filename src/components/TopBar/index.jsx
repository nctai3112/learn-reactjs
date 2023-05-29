import React from 'react';
import PropTypes from 'prop-types';
import ProjectsText from './subcomponents/ProjectsText';
import IconInformation from './subcomponents/IconInformation';
import { Col, Row } from "antd";

TopBar.propTypes = {

};

function TopBar(props) {
  const { topText } = props
  return (
    <Row justify="center" align="middle">
      <Col span={12}>
        <ProjectsText text = {topText} />
      </Col>
      <Col span={12}>
        <IconInformation />
      </Col>
    </Row>
  );
}

export default TopBar;
