import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ImageUploader from "../components/ImageUploader";
import ScanResult from "../components/ScanResult";
import UserGuide from "../components/UserGuide";
import "../styles/home.css";
import { scanChicken } from "../services/chickenService";

const Home = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleScanClick = async (file) => {
    if (!file) return;

    setShowModal(true);
    setScanResult(null);
    setLoading(true);

    try {
      const result = await scanChicken(file);
      setScanResult(result);
    } catch (err) {
      console.error("Scan failed:", err);
      setScanResult({ error: err.message });
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
            Scan Photo
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
