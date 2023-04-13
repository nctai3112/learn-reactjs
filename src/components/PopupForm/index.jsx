import React, { useState } from "react";

function PopupForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({});
  const [color, setColor] = useState("#000000");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="popup-form">
      <form onSubmit={handleSubmit}>
        <label>
          Labelling Information:
          <input type="text" name="label" onChange={handleInputChange} />
          <input
            id="color-picker"
            name="color"
            type="color"
            value={color}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </form>
    </div>
  );
}
export default PopupForm;
