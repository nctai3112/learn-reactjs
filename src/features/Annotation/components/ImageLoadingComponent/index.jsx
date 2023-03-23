import React from "react";
import PropTypes from "prop-types";

ImageLoadingComponent.propTypes = {};

function ImageLoadingComponent(props) {
  const src =
    "https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

  const alt = "text-image";

  return (
    <div className="image-loading">
      <img src={src} alt={alt}></img>
    </div>
  );
}

export default ImageLoadingComponent;
