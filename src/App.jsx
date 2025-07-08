import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ResumeBuilder from "./components/ResumeBuilder";
import ResumePreview from "./components/ResumePreview";
import "./app.css"; // Import global styles

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder" element={<ResumeBuilder />} />
        <Route path="/preview" element={<ResumePreview />} />
      </Routes>
    </Router>
  );
}

export default App;
