import React, { useState } from "react";
import "../styles/guide.css";
import sample1 from "../assets/sample1.jpg";
import sample2 from "../assets/sample2.jpg";
import sample3 from "../assets/sample3.jpg";

const CLASS_NAMES = [
  "Gilmore",
  "Golden Boy",
  "Golden Boy x Gilmore",
  "Golden Boy x Harold Brown",
  "Harold Brown",
  "Kearny",
];

const UserGuide = () => {
  const [popupImage, setPopupImage] = useState(null);

  const samples = [sample1, sample2, sample3];

  const openPopup = (src) => setPopupImage(src);
  const closePopup = () => setPopupImage(null);

  return (
    <div className="guide-container">
      <h2>User Guide</h2>
      <p>Follow these steps to identify your chicken breed:</p>

      <div className="guide-step">
        <h4>1. Upload Your Image</h4>
        <p>Take or upload a clear photo of a chicken.</p>
      </div>

      <div className="guide-step">
        <h4>2. Acceptable Breeds</h4>
        <p>This scanner can identify the following chicken breeds:</p>
        <div className="breeds-list">
          {CLASS_NAMES.map((breed, index) => (
            <span key={index} className="breed-tag">
              {breed}
            </span>
          ))}
        </div>
      </div>

      <div className="guide-step">
        <h4>3. Recommended Photo Samples</h4>
        <div className="sample-images">
          {samples.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Sample ${index + 1}`}
              onClick={() => openPopup(src)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
      </div>

      <div className="guide-step">
        <h4>4. Tips for Best Results</h4>
        <p>• Use clear, well-lit photos</p>
        <p>• Ensure the chicken is visible and centered</p>
        <p>• Avoid blurry or distant images</p>
      </div>

      {popupImage && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopup}>
              ×
            </button>
            <img src={popupImage} alt="Popup Sample" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserGuide;
