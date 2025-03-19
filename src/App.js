import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPage from "./UploadPage";
import ChatBot from "./ChatBot";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />   {/* PDF Upload Page */}
        <Route path="/chat" element={<ChatBot />} />  {/* Chat Page */}
      </Routes>
    </Router>
  );
};

export default App;
