import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getMe, logout as apiLogout } from "../api/auth.api";

/* ============================
   TYPES
============================ */

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: "STUDENT" | "RECRUITER" | null;
  onboardingStep: string;
  onboardingCompleted: boolean;
  // Student fields
  degree?: string;
  collegeName?: string;
  graduationYear?: number;
  skills?: string[];
  city?: string;
  state?: string;
  // Recruiter fields
  recruiterProfile?: any; // Contains the full nested object
  companyName?: string;
  professionalTitle?: string;
  companyDescription?: string;
  companyWebsite?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authLoaded: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

/* ============================
   CONTEXT
============================ */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ============================
   PROVIDER
============================ */

export const AuthContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ============================
     CHECK AUTH (auth/me)
  ============================ */
  const refreshAuth = async () => {
    try {
      const res = await getMe();
      const raw = res.data;

      // Normalize backend snake_case to frontend camelCase
      // This ensures we catch keys even if backend returns them in snake_case
      const normalizedUser: AuthUser = {
        ...raw,
        id: raw.id || raw._id, // Just in case
        fullName: raw.fullName || raw.full_name,
        // Ensure boolean is captured from any variant
        // Log confirms: raw.isOnboarded matches backend
        onboardingCompleted:
          raw.isOnboarded ??
          raw.onboardingCompleted ??
          raw.onboarding_completed ??
          raw.is_onboarding_completed ??
          false,
        onboardingStep: raw.onboardingStep || raw.onboarding_step,
        role: raw.role,
        email: raw.email,
        // Student fields (defensive mapping for flat or nested structures)
        degree: raw.degree || raw.student?.degree || raw.studentProfile?.degree,
        collegeName: raw.collegeName || raw.college_name || raw.student?.collegeName || raw.student?.college_name || raw.studentProfile?.collegeName,
        graduationYear: raw.graduationYear || raw.graduation_year || raw.student?.graduationYear || raw.student?.graduation_year,
        skills: (raw.skills || raw.student?.skills || raw.studentProfile?.skills || []).map((s: any) => typeof s === 'object' ? s.name : s),
        city: raw.city || raw.student?.city || raw.studentProfile?.city || raw.recruiter?.city || raw.recruiterProfile?.city,
        state: raw.state || raw.student?.state || raw.studentProfile?.state || raw.recruiter?.state || raw.recruiterProfile?.state,
        // Recruiter fields
        companyName: raw.companyName || raw.company_name || raw.recruiter?.companyName || raw.recruiter?.company_name || raw.recruiterProfile?.companyName,
        professionalTitle: raw.professionalTitle || raw.professional_title || raw.recruiter?.professionalTitle || raw.recruiter?.professional_title || raw.recruiterProfile?.professionalTitle,
        companyDescription: raw.companyDescription || raw.company_description || raw.recruiter?.companyDescription || raw.recruiter?.company_description || raw.recruiter?.description || raw.recruiterProfile?.companyDescription || raw.recruiterProfile?.description,
        companyWebsite: raw.companyWebsite || raw.company_website || raw.recruiter?.companyWebsite || raw.recruiter?.company_website || raw.recruiterProfile?.companyWebsite
      };

      setUser(normalizedUser);
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /* ============================
     LOGOUT
  ============================ */
  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  /* ============================
     RUN ON APP LOAD
  ============================ */
  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authLoaded: !isLoading,
        refreshAuth,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ============================
   HOOK
============================ */

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthContextProvider");
  }
  return ctx;
};
