import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Task {
  _id: string;
  content: string;
  createdAt: string;
}

const SavedTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/gemini-api/display`,
        );
        setTasks(res.data);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="saved-tasks-container">
      <style>{`
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', sans-serif;
          background-color: #f0f2f5;
        }

        .saved-tasks-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
        }

        .card {
          background-color: #ffffff;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 700px;
        }

        h2 {
          text-align: center;
          margin-bottom: 24px;
          font-size: 28px;
          color: #333;
        }

        .back-link {
          display: block;
          text-align: center;
          margin-bottom: 30px;
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.3s ease;
        }

        .back-link:hover {
          background-color: #0056b3;
        }

        .task-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .task-card {
          background-color: #f9f9f9;
          padding: 16px 20px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          margin-bottom: 15px;
          animation: fadeIn 0.3s ease-in-out;
        }

        .task-card strong {
          display: block;
          font-size: 16px;
          color: #212529;
          margin-bottom: 6px;
        }

        .task-card small {
          color: #6c757d;
          font-size: 13px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .card {
            padding: 25px 20px;
          }

          h2 {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="card">
        <h2>Saved Tasks</h2>
        <Link to="/prompt" className="back-link">
          ⬅ Back to Prompt Page
        </Link>

        {tasks.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>No tasks found.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id} className="task-card">
                <strong>{task.content}</strong>
                <small>
                  Saved at: {new Date(task.createdAt).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SavedTasksPage;
