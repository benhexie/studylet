// ./src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Auth from "./pages/auth";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import MainApp from "./pages/app";
import Dashboard from "./pages/app/dashboard";
import Profile from "./pages/app/profile";
import Assessments from "./pages/app/assessments";
import Redirects from "./components/Redirects";
import Upload from "./pages/app/assessment/upload";
import Practice from "./pages/app/assessment/practice";
import Start from "./pages/app/assessment/start";
import Assessment from "./pages/app/assessment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/app" element={<MainApp />}>
          <Route index element={<Redirects to="/app/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="*" element={<Redirects to="/app/dashboard" />} />
        </Route>
        <Route path="/assessment" element={<Assessment />}>
          <Route path="upload" element={<Upload />} />
          <Route path="start/:id" element={<Start />} />
        </Route>
        <Route path="/assessment/practice/:id" element={<Practice />} />
      </Routes>
    </Router>
  );
}

export default App;
