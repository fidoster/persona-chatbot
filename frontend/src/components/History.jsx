import React, { useState, useEffect } from "react";
import axios from "axios";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch chat history from the backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL; // Use the environment variable
        const response = await axios.get(`${backendUrl}/history`); // Backend API endpoint
        setHistory(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch history.");
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <p>Loading history...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Chat History</h2>
      {history.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {history.map((entry, index) => (
            <li
              key={index}
              style={{
                marginBottom: "15px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <p>
                <strong>Q:</strong> {entry.question}
              </p>
              <p>
                <strong>A:</strong> {entry.answer}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No history found.</p>
      )}
    </div>
  );
}

export default History;
