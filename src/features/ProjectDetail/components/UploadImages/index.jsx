import React from 'react'
import PropTypes from 'prop-types'

function UploadImages(props) {

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit function")
    console.log(e.target.files);
    // e.target.files();
  }

  const handleFileChange = (e) => {

  }

  return (
    <div className="upload-images">
      <h2>Upload data in project</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

UploadImages.propTypes = {}

export default UploadImages
