import { Routes, Route } from "react-router-dom";
import RecruiterProfilePage from "@/pages/profile/RecruiterProfilePage";
import RecruiterPersonalProfile from "@/pages/profile/RecruiterPersonalProfile";

export default function ProfileRoutes() {
    return (
        <Routes>
            <Route path="recruiter" element={<RecruiterProfilePage />} />
            <Route path="user" element={<RecruiterPersonalProfile />} /> {/* New Personal Profile Route */}
            <Route path="/" element={<RecruiterPersonalProfile />} />{/* Default to Personal Profile if /profile is hit directly, or maybe redirect? */}
        </Routes>
    );
}
