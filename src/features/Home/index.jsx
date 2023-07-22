import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import "./styles.css";

function Home(props) {
  const navigate = useNavigate();
  const handleOnClickLogin = () => {
    navigate('/');
  }
  return (
    <div className="home-page">
      <div className="background-image"></div>
      <div className="content">
        <div className="text-box">
          <h2 className="title">Login to continue?</h2>
          <button className="login-button" onClick={handleOnClickLogin}>
            GET STARTED
          </button>
        </div>
      </div>
    </div>
    // <div>
    //   <Button
    //     type='primary'
    //     name="login"
    //     onClick={handleOnClickLogin}
    //   >
    //     Login
    //   </Button>
    // </div>
  );
}

export default Home;
