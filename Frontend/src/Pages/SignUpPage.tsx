import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/signUp`,
        formData,
      );
      setMessage(res.data.message);
      setFormData({ name: "", email: "", password: "" });

      setTimeout(() => {
        navigate("/prompt");
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-card">
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          {message && <p className="message success">{message}</p>}
          {error && <p className="message error">{error}</p>}
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          height: 100%;
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(to right, #6a11cb, #2575fc);
        }

        .signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
        }

        .signup-card {
          background: #fff;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          width: 90%;
          max-width: 400px;
          animation: fadeIn 0.6s ease-in-out;
        }

        .signup-card h2 {
          text-align: center;
          margin-bottom: 25px;
          color: #333;
        }

        .signup-card input {
          width: 100%;
          padding: 12px 14px;
          margin-bottom: 16px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          transition: 0.3s border-color;
        }

        .signup-card input:focus {
          border-color: #2575fc;
          outline: none;
        }

        .signup-card button {
          width: 100%;
          padding: 12px;
          background-color: #2575fc;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .signup-card button:disabled {
          background-color: #a5c5f9;
          cursor: not-allowed;
        }

        .signup-card button:hover:not(:disabled) {
          background-color: #1b5cd5;
        }

        .message {
          text-align: center;
          margin-top: 15px;
          font-weight: bold;
        }

        .message.success {
          color: green;
        }

        .message.error {
          color: red;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 500px) {
          .signup-card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </>
  );
};

export default SignUp;
