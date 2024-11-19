import React, { useState } from "react";
import axios from "axios";

function Chatbot({ contextId }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(null);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful assistant."
  ); // Default prompt

  const prompts = [
    { label: "Helpful", value: "You are a helpful assistant." },
    {
      label: "Funny",
      value: "You are a funny assistant who makes people laugh.",
    },
    {
      label: "Sarcastic",
      value: "You are a sarcastic assistant who answers with wit.",
    },
  ];

  const askQuestion = async () => {
    setError(null);
    setAnswer(""); // Clear previous answer
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL; // Use the environment variable for the backend URL
      const response = await axios.post(`${backendUrl}/ask`, {
        question,
        context_id: contextId || null,
        system_prompt: systemPrompt, // Pass the selected system prompt
      });
      setAnswer(response.data.answer);
      setQuestion(""); // Clear the question input
    } catch (err) {
      setError("Failed to get a response. Please try again.");
    }
  };

  return (
    <div style={{ margin: "20px 0", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#333", marginBottom: "15px" }}>Chat with the Bot</h2>

      {/* Prompt Selection */}
      <label
        htmlFor="prompt-select"
        style={{ display: "block", marginBottom: "10px" }}
      >
        Choose a Personality:
      </label>
      <select
        id="prompt-select"
        value={systemPrompt}
        onChange={(e) => setSystemPrompt(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        {prompts.map((prompt) => (
          <option key={prompt.value} value={prompt.value}>
            {prompt.label}
          </option>
        ))}
      </select>

      {/* Question Input */}
      <textarea
        style={{
          width: "100%",
          height: "100px",
          marginBottom: "10px",
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question here..."
      />
      <button
        onClick={askQuestion}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginRight: "10px",
        }}
      >
        Ask
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "15px", fontWeight: "bold" }}>
          {error}
        </p>
      )}
      {answer && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <p style={{ fontWeight: "bold", color: "#007bff" }}>Answer:</p>
          <p style={{ fontSize: "16px" }}>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
