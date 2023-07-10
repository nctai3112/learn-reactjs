import React from "react";
import PropTypes from "prop-types";
import "./styles.css"
// import { Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Button, Divider, Dropdown, Space, theme } from "antd";


IconInformation.propTypes = {};

function IconInformation(props) {
  const {pictureUrl} = props;

  const { useToken } = theme;
  const { token } = useToken();
  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };
  const menuStyle = {
    boxShadow: "none",
  };

  const items = [
    {
      key: "1",
      label: (
        <a
          rel="noopener noreferrer"
          href="/user"
        >
          User information
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          Logout
        </a>
      ),
      disabled: false,
    },
  ];

  return (
    <div className="icon-information">
      <Dropdown
        menu={{
          items,
        }}
        dropdownRender={(menu) => (
          <div style={contentStyle}>
            {React.cloneElement(menu, {
              style: menuStyle,
            })}
            <Divider
              style={{
                margin: 0,
              }}
            />
            <Space
              style={{
                padding: 8,
              }}
            >
              <Button type="primary">Log out</Button>
            </Space>
          </div>
        )}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <div className="avatar-wrapper">
              <img src={pictureUrl} alt="avatar" width="40px" height="40px" />
            </div>

            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
      {/* <div className="border-text">
        <h1 className="text">IC</h1>
      </div> */}
    </div>
  );
}

export default IconInformation;
