import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PromptPage from "./Pages/prompt";
import SavedTasksPage from "./Pages/savedTask";
import SignUpPage from "./Pages/SignUpPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/prompt" element={<PromptPage />} />
        <Route path="/saved" element={<SavedTasksPage />} />
      </Routes>
    </Router>
  );
};

export default App;
