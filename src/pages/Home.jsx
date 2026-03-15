import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ImageUploader from "../components/ImageUploader";
import ScanResult from "../components/ScanResult";
import UserGuide from "../components/UserGuide";
import "../styles/home.css";
import { Client } from "@gradio/client";

const Home = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleScanClick = async (file) => {
    if (!file) return;

    setShowModal(true);

    // Normalize to a File/Blob object
    let imageFile;
    if (file instanceof File) {
      imageFile = file;
    } else {
      const response = await fetch(file);
      const blob = await response.blob();
      imageFile = new File([blob], "sample.jpg", { type: blob.type });
    }

    try {
      setScanResult(null);
      setLoading(true);

      const startTime = Date.now();

      // Connect to your HF Space using the official Gradio JS client
      const client = await Client.connect("cLoudstone99/chicken-scan");

      // predict() handles upload + inference in one call
      const result = await client.predict("/predict", {
        img: imageFile,
      });

      // result.data[0] is the raw string: "#1 Breed — 94.30%\n#2 ..."
      const raw = result.data[0] || "";
      const lines = raw.split("\n").filter(Boolean);

      const top_results = lines.map((line, i) => {
        const match = line.match(/#\d+\s(.+)\s—\s([\d.]+)%/);
        return {
          rank: i + 1,
          breed: match ? match[1] : "Unknown",
          confidence: match ? parseFloat(match[2]) / 100 : 0,
        };
      });

      const elapsed = Date.now() - startTime;
      const remaining = 3000 - elapsed;
      if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));

      setScanResult({ top_results });
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
