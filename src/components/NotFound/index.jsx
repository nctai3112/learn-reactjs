import React from "react";
import PropTypes from "prop-types";

function NotFound(props) {
  return (
    <div className="not-found-component">
      <h1 className="not-found-code">404!</h1>
      <h2 className="not-found-text">
        The page you are looking for is not found!
      </h2>
    </div>
  );
}

NotFound.propTypes = {};

export default NotFound;
