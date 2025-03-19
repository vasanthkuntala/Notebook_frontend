import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UploadPage.css";

const UploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate(); // Redirect function

  /** 📂 Handle File Selection */
  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  /** 📤 Upload PDFs */
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one PDF to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    for (let file of selectedFiles) {
      formData.append("files", file);
    }

    try {
      await axios.post("https://notebook-backend-boss.onrender.com/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ PDFs uploaded successfully! Redirecting to chat...");
      navigate("/chat"); // Redirect to chat page
    } catch (error) {
      console.error("Error uploading PDFs:", error);
      alert("❌ Error uploading PDFs. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>📂 Upload PDFs</h2>
      <input type="file" multiple accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading} className="upload-button">
        {uploading ? "Uploading..." : "Upload & Proceed to Chat"}
      </button>
    </div>
  );
};

export default UploadPage;
