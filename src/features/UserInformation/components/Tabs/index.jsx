import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Form, Input } from "antd";
import "./styles.css";

VerticalTab.propTypes = {

};

function VerticalTab(props) {
  const [form] = Form.useForm();
  const { topBarWidth, name, email, familyName, givenName, picture } = props;
  const { TabPane } = Tabs;

  useEffect(() => {
    form.setFieldsValue({ givenName: givenName });
    form.setFieldsValue({ familyName: familyName });
    form.setFieldsValue({ email: email });
    console.log("This is familyName", familyName);
    console.log("This is givenName", givenName);
    console.log("This is email", email);
  }, [email, familyName, givenName]);

  return (
    <div
      className="vertical-tab-block"
      style={{ height: `calc(100vh - ${topBarWidth}px - 60px)` }}
    >
      <Tabs tabPosition="left">
        <TabPane tab="User Info" key="1">
          <div className="user-info-block">
            <div className="first-line-wrapper line-item">
              <div className="avatar-image">
                <img src={picture} alt="avatar" width="100%" height="100%" />
              </div>
              <div className="name-container">
                <h2 className="name">{name}</h2>
              </div>
            </div>
            <div className="second-line-wrapper line-item">
              <Form
                className="form-item item-left"
                initialValues={{ givenName: `${givenName}` }}
                form={form}
              >
                <Form.Item
                  label="Given Name"
                  name="givenName"
                  className="form-item"
                >
                  <Input
                    disabled={true}
                    className="input"
                  />
                </Form.Item>
              </Form>
              <Form form={form} className="form-item item-right">
                <Form.Item
                  label="Family Name"
                  name="familyName"
                  className="form-item"
                >
                  <Input disabled={true} className="input" />
                </Form.Item>
              </Form>
            </div>
            <div className="third-line-wrapper line-item">
              <Form form={form} initialValues={{ email: `${email}` }}>
                <Form.Item label="Email" name="email" className="form-item">
                  <Input disabled={true} className="input" />
                </Form.Item>
              </Form>
            </div>
          </div>
        </TabPane>
        <TabPane tab="Settings" key="2">
          <div className="settings-block"></div>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default VerticalTab;
