import React, { useState, useEffect } from "react";
import axios from "axios";
import helpfulImg from "./assets/personas/Helpful.webp";
import funnyImg from "./assets/personas/Funny.webp";
import sarcasticImg from "./assets/personas/Sarcastic.webp";
import wiseImg from "./assets/personas/Wise.webp";
import motivationalImg from "./assets/personas/Motivational.webp";
import promptExpertImg from "./assets/personas/Prompt.webp";

function App() {
  const [selectedPersona, setSelectedPersona] = useState("Helpful"); // Default persona
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const personas = [
    {
      name: "Helpful",
      prompt: "You are a helpful assistant.",
      image: helpfulImg,
    },
    {
      name: "Funny",
      prompt: "You are a funny assistant who makes people laugh.",
      image: funnyImg,
    },
    {
      name: "Sarcastic",
      prompt: "You are a sarcastic assistant who answers with wit.",
      image: sarcasticImg,
    },
    {
      name: "Wise",
      prompt: "You are a wise assistant who speaks with deep wisdom.",
      image: wiseImg,
    },
    {
      name: "Motivational",
      prompt: "You are a motivational assistant who inspires people.",
      image: motivationalImg,
    },
    {
      name: "Prompt Expert",
      prompt: `
        You are a world-class prompt expert specializing in refining vague or unclear ideas into precise, effective, and creative prompts for AI systems like GPT.
        Your primary goal is to understand the user’s intent, clarify ambiguous concepts, and structure the input into a well-crafted, actionable prompt that is ready for immediate use.
      `,
      image: promptExpertImg,
    },
  ];

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(history));
  }, [history]);

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
    setAnswer("");
    setError(null);
  };

  const askQuestion = async () => {
    setError(null);
    setAnswer("");
    try {
      const response = await axios.post(`${backendUrl}/ask`, {
        question,
        system_prompt: personas.find((p) => p.name === selectedPersona).prompt,
      });
      const newAnswer = response.data.answer;
      setAnswer(newAnswer);

      setHistory((prevHistory) => [
        ...prevHistory,
        {
          id: Date.now(),
          persona: selectedPersona,
          question,
          answer: newAnswer,
        },
      ]);

      setQuestion("");
    } catch (err) {
      setError("Failed to get a response. Please try again.");
    }
  };

  const deleteMessage = (id) => {
    setHistory((prevHistory) => prevHistory.filter((entry) => entry.id !== id));
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f2f2f2",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#333", fontSize: "2.5em" }}>Persona Chatbot</h1>
        <p style={{ color: "#555" }}>
          Select a persona by clicking on the image and ask your question!
        </p>
      </header>

      {/* Persona Buttons */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        {personas.map((persona) => (
          <button
            key={persona.name}
            onClick={() => handlePersonaSelect(persona.name)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0",
              outline:
                selectedPersona === persona.name ? "4px solid #007bff" : "none",
              borderRadius: "50%",
              transition: "all 0.3s ease",
            }}
          >
            <img
              src={persona.image}
              alt={persona.name}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                border:
                  selectedPersona === persona.name
                    ? "4px solid #007bff"
                    : "3px solid #ccc",
                transition: "border 0.3s ease",
              }}
            />
          </button>
        ))}
      </section>

      {/* Chat Section */}
      <section
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "#ffffff",
          marginBottom: "20px",
          width: "100%",
          maxWidth: "600px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          boxSizing: "border-box",
        }}
      >
        <textarea
          style={{
            width: "100%",
            height: "120px",
            padding: "15px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginBottom: "15px",
            backgroundColor: "#f7f7f7",
            boxSizing: "border-box",
          }}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={`Ask your question from Mr. ${selectedPersona}...`}
        />
        <button
          onClick={askQuestion}
          style={{
            padding: "10px 25px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "block",
            margin: "0 auto",
          }}
        >
          Send
        </button>
      </section>

      {/* Display Answer */}
      {error && (
        <p style={{ color: "red", marginTop: "15px", fontWeight: "bold" }}>
          {error}
        </p>
      )}
      {answer && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#ffffff",
            width: "100%",
            maxWidth: "600px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            boxSizing: "border-box",
          }}
        >
          <p style={{ fontWeight: "bold", color: "#007bff" }}>Answer:</p>
          <p style={{ fontSize: "16px" }}>{answer}</p>
        </div>
      )}

      {/* Chat History */}
      {history.length > 0 && (
        <div
          style={{
            marginTop: "30px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
            width: "100%",
            maxWidth: "600px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            boxSizing: "border-box",
          }}
        >
          <h3 style={{ marginBottom: "15px" }}>Chat History</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {history.map((entry) => (
              <li
                key={entry.id}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <p>
                  <strong>Persona:</strong> {entry.persona}
                </p>
                <p>
                  <strong>Q:</strong> {entry.question}
                </p>
                <p>
                  <strong>A:</strong> {entry.answer}
                </p>
                <button
                  onClick={() => deleteMessage(entry.id)}
                  style={{
                    marginTop: "10px",
                    padding: "5px 10px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
