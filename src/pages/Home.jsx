import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ImageUploader from "../components/ImageUploader";
import ScanResult from "../components/ScanResult";
import UserGuide from "../components/UserGuide";
import "../styles/home.css";

const Home = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleScanClick = async (file) => {
    if (!file) return;

    setShowModal(true);

    const formData = new FormData();

    if (file instanceof File) {
      formData.append("file", file);
    } else {
      const response = await fetch(file);
      const blob = await response.blob();
      formData.append("file", new File([blob], "sample.jpg", { type: blob.type }));
    }

    try {
      setScanResult(null);
      setLoading(true);

      const startTime = Date.now();

      const res = await fetch(`${API_URL}/analyze-image`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const elapsed = Date.now() - startTime;
      const remaining = 3000 - elapsed;

      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }
      setScanResult(data);
    } catch (err) {
      console.error("Scan failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className={`home-container ${showModal ? "blur-background" : ""}`}>
        <div className="left-section">
          <ImageUploader onImageSelect={setUploadedImage} uploadedImage={uploadedImage} />

          <button className="scan-btn" disabled={!uploadedImage} onClick={() => handleScanClick(uploadedImage)}>
            Scan Chicken
          </button>
        </div>

        <div className="right-section">
          <UserGuide onSampleClick={handleScanClick} />
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <ScanResult result={scanResult} loading={loading} closeModal={() => setShowModal(false)} />
        </div>
      )}
    </div>
  );
};

export default Home;
