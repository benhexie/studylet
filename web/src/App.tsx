// ./src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import ForgotPassword from "./pages/auth/forgot-password";
import Results from "./pages/app/assessment/results";
import EditProfile from "./pages/app/profile/edit";
import Stats from "./pages/app/stats";
import { Provider } from "react-redux";
import { store } from "./store/store";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./store/slices/authSlice";
import AppLayout from "./layouts/AppLayout";
import AdminLogin from "./pages/admin/login";
import AdminDashboard from "./pages/admin/dashboard";
import CreateAssessment from "./pages/admin/create-assessment";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import ResetPassword from "./pages/auth/reset-password";

const AppRoutes = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />}>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="assessment">
          <Route path="upload" element={<Upload />} />
          <Route path="start/:id" element={<Start />} />
          <Route path="practice" element={<Practice />} />
          <Route path=":id" element={<Assessment />} />
          <Route path="results" element={<Results />} />
        </Route>
        <Route path="profile" element={<Profile />} />
        <Route path="profile/edit" element={<EditProfile />} />
        <Route path="stats" element={<Stats />} />
      </Route>
      <Route path="/admin">
        <Route path="login" element={<AdminLogin />} />
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="create-assessment" element={<CreateAssessment />} />
          </Route>
        </Route>
      </Route>
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/app" : "/"} />}
      />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
        <ToastContainer position="top-right" />
      </Router>
    </Provider>
  );
}

export default App;
