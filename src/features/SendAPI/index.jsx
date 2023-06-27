import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';

SendAPI.propTypes = {

};

function SendAPI(props) {
  const [sendAPIStatus, setAPIStatus] = useState(false);

  const sendingAPI = async () => {
    console.log("Click button and sending API");

    const responseFromSendingAPI = await fetch(
      "http://localhost:5000/demo/send-api",
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          Connection: "keep-alive",
          "Content-Type": "application/json",
          "user-agent": "Chrome",
        },
        body: JSON.stringify({
          name: "Nguyen Cong Tai",
        }),
      }
    );
    if (!responseFromSendingAPI.ok) {
      Modal.error({
        title: "ERROR_SENDING_API",
        content: "Send API failed!",
      });
    }
    const dataResponse = await responseFromSendingAPI.json();
    console.log("Debugging...")
    console.log(dataResponse);
    if (dataResponse !== null) {
      console.log("Receive response from request!")
      setAPIStatus(true);
    }
  }
  return (
    <div className="component-sending-api">
      <Button
        className="button-send-api"
        onClick={
          (e) => {sendingAPI();}
        }
      >Send API</Button>
      {sendAPIStatus ? (<div className="response-text">send success</div>) : ("")}
    </div>
  );
}

export default SendAPI;
