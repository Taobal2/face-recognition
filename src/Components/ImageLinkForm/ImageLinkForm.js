import React from "react";
import "./Link.css";

const ImageLinkForm = ({ onInputChange, onSubmit }) => {
  return (
    <div className="container">
      <p className="f3">{"This is a face detection magic brain"}</p>
      <div className="center">
        <div className="input_container center">
          <input
            type="text"
            onChange={onInputChange}
            placeholder="Enter your image address"
          />
          <button onClick={onSubmit}>Detect</button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
