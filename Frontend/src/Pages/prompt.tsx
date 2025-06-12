import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Sentence {
  id: number;
  text: string;
  isEditing: boolean;
}

const PromptPage: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/gemini-api/generate`,
        { prompt },
      );
      const raw: string = res.data.content ?? "";

      const parsed: Sentence[] = raw
        .split(".")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s, idx) => ({
          id: Date.now() + idx,
          text: s + ".",
          isEditing: false,
        }));

      setSentences(parsed);
    } catch (err) {
      console.error("Generation error:", err);
    }
  };

  const handleDelete = (id: number) => {
    setSentences((prev) => prev.filter((s) => s.id !== id));
  };

  const handleEditToggle = (id: number) => {
    setSentences((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEditing: !s.isEditing } : s)),
    );
  };

  const handleSave = async (id: number) => {
    const sentenceToSave = sentences.find((s) => s.id === id);
    if (!sentenceToSave) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/gemini-api/add`, {
        content: sentenceToSave.text,
      });
      alert("Task saved!");
      setSentences((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isEditing: false } : s)),
      );
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save task.");
    }
  };

  const handleSentenceChange = (id: number, value: string) => {
    setSentences((prev) =>
      prev.map((s) => (s.id === id ? { ...s, text: value } : s)),
    );
  };

  return (
    <>
      <div className="prompt-container">
        <div className="prompt-card">
          <div className="prompt-header">
            <h2>Ask Gemini</h2>
            <button onClick={() => navigate("/saved")}>View Saved Tasks</button>
          </div>

          <div className="prompt-input">
            <input
              type="text"
              placeholder="Enter your prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button onClick={handleGenerate}>Generate</button>
          </div>

          {sentences.length > 0 && (
            <div className="response-section">
              <h3>Response:</h3>
              {sentences.map((sentence) => (
                <div key={sentence.id} className="sentence-card">
                  {sentence.isEditing ? (
                    <input
                      type="text"
                      value={sentence.text}
                      onChange={(e) =>
                        handleSentenceChange(sentence.id, e.target.value)
                      }
                    />
                  ) : (
                    <span>{sentence.text}</span>
                  )}
                  <button onClick={() => handleEditToggle(sentence.id)}>
                    {sentence.isEditing ? "Cancel" : "Edit"}
                  </button>
                  {sentence.isEditing && (
                    <button onClick={() => handleSave(sentence.id)}>
                      Save
                    </button>
                  )}
                  <button onClick={() => handleDelete(sentence.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(to right, #6a11cb, #2575fc);
        }

        .prompt-container {
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .prompt-card {
          background: white;
          padding: 30px 40px;
          border-radius: 16px;
          max-width: 800px;
          width: 100%;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          animation: fadeIn 0.6s ease-in-out;
        }

        .prompt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .prompt-header h2 {
          margin: 0;
          font-size: 26px;
          color: #333;
        }

        .prompt-header button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
        }

        .prompt-header button:hover {
          background-color: #0056b3;
        }

        .prompt-input {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
        }

        .prompt-input input {
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
        }

        .prompt-input button {
          align-self: flex-start;
          padding: 10px 18px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .prompt-input button:hover {
          background-color: #218838;
        }

        .response-section h3 {
          margin-bottom: 10px;
        }

        .sentence-card {
          background: #f8f9fa;
          padding: 12px;
          margin-bottom: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sentence-card input[type="text"] {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .sentence-card span {
          flex: 1;
        }

        .sentence-card button {
          background-color: #6c757d;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .sentence-card button:hover {
          background-color: #5a6268;
        }

        .sentence-card button:last-child {
          background-color: #dc3545;
        }

        .sentence-card button:last-child:hover {
          background-color: #c82333;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .prompt-card {
            padding: 25px 20px;
          }

          .prompt-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default PromptPage;
