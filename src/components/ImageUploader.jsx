import React, { useRef, useState } from "react";
import "../styles/uploader.css";
import uploadLogo from "../assets/uploadLogo.png";

const ImageUploader = ({ onImageSelect }) => {
  const fileInput = useRef();
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageSelect(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageSelect(null);
    fileInput.current.value = null;
  };

  return (
    <div className="uploader-box">
      {/* Uploader box will only show if you doesn't have image upload yet */}
      {!preview ? (
        <div className="upload-area" onClick={() => fileInput.current.click()}>
          <img src={uploadLogo} alt="Upload Icon" width="50" />
          <p>Click to Upload Chicken Image</p>
        </div>
      ) : (
        <div className="preview-wrapper">
          <button className="remove-btn" onClick={removeImage}>
            ×
          </button>
          <img src={preview} alt="Preview" className="preview-image" />
        </div>
      )}

      {/* Hidden File Input */}
      <input type="file" accept="image/*" ref={fileInput} style={{ display: "none" }} onChange={handleFileChange} />
    </div>
  );
};

export default ImageUploader;
