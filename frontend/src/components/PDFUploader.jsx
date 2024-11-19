import React from "react";
import axios from "axios";

function PDFUploader({ setContextId }) {
  const handleUpload = async (e) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL; // Use the environment variable
      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      const response = await axios.post(`${backendUrl}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure correct content type for file upload
        },
      });
      setContextId(response.data.context_id);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Failed to upload the PDF. Please try again.");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      />
    </div>
  );
}

export default PDFUploader;
