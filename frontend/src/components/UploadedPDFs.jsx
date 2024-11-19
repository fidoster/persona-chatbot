import React, { useState, useEffect } from "react";
import axios from "axios";

function UploadedPDFs({ setContextId }) {
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL; // Use the environment variable
        const response = await axios.get(`${backendUrl}/contexts`);
        setPdfs(response.data);
      } catch (err) {
        console.error("Error fetching PDFs:", err);
        setError("Failed to fetch uploaded PDFs. Please try again.");
      }
    };

    fetchPdfs();
  }, []);

  return (
    <div>
      <h3 style={{ color: "#555" }}>Uploaded PDFs</h3>
      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {pdfs.map((pdf) => (
          <li
            key={pdf._id}
            style={{
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <span style={{ fontWeight: "bold" }}>{pdf.filename}</span>
            <button
              onClick={() => setContextId(pdf._id)}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Use This PDF
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UploadedPDFs;
