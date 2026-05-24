import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoute";
import OnboardingRoutes from "./OnboardingRoutes";
import ProtectedRoute from "./ProtectedRoute";
import DashboardRoutes from "./DashboardRoutes";
import ProfileRoutes from "./ProfileRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/onboarding/*" element={<OnboardingRoutes />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/*"
        element={
          <ProtectedRoute>
            <ProfileRoutes />
          </ProtectedRoute>
        }
      />
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
}
