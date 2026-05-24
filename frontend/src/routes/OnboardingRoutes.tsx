import { Routes, Route, Navigate } from "react-router-dom";
import OnboardingGuard from "@/components/auth/OnboardingGuard";
import RoleSelectionPage from "@/pages/onboarding/RoleSelectionPage";

// Student Pages
import EducationPage from "@/pages/onboarding/student/EducationPage";
import SkillsPage from "@/pages/onboarding/student/SkillsPage";
import LocationPage from "@/pages/onboarding/student/LocationPage";

// Recruiter Pages
import ProfessionalPage from "@/pages/onboarding/recruiter/ProfessionalPage";
import CompanyPage from "@/pages/onboarding/recruiter/CompanyPage";
import DescriptionPage from "@/pages/onboarding/recruiter/DescriptionPage";

export default function OnboardingRoutes() {
  return (
    <Routes>
      <Route element={<OnboardingGuard />}>
        {/* Root Onboarding - Role Selection */}
        <Route path="/" element={<RoleSelectionPage />} />

        {/* Student Onboarding Flow */}
        <Route path="student">
          <Route path="education" element={<EducationPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="location" element={<LocationPage />} />
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Route>

        {/* Recruiter Onboarding Flow */}
        <Route path="recruiter">
          <Route path="professional" element={<ProfessionalPage />} />
          <Route path="company" element={<CompanyPage />} />
          <Route path="description" element={<DescriptionPage />} />
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Route>
    </Routes>
  );
}
