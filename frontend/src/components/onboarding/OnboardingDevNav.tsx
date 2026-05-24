import { Link } from "react-router-dom";
import { ONBOARDING_ROUTES } from "@/routes/onboardingRouteMap";

const OnboardingDevNav = () => {
    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            // left: '50%',
            // transform: 'translateX(-50%)',
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            padding: '12px 24px',
            borderRadius: '999px',
            color: 'white',
            zIndex: 10000, // High z-index to stay on top
            display: 'flex',
            gap: '12px',
            fontSize: '13px',
            alignItems: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
        }}>
            <span style={{ fontWeight: '700', color: '#f59e0b', paddingRight: '4px' }}>Dev Nav:</span>

            {/* Role Selection */}
            <Link style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '500' }} to={ONBOARDING_ROUTES.ROLE_SELECTION}>Role</Link>

            <span style={{ color: '#475569' }}>|</span>

            {/* Student Links */}
            <div style={{ display: 'flex', gap: '10px' }}>
                <Link style={{ color: '#60a5fa', textDecoration: 'none' }} to={ONBOARDING_ROUTES.STUDENT_EDUCATION}>Edu</Link>
                <Link style={{ color: '#60a5fa', textDecoration: 'none' }} to={ONBOARDING_ROUTES.STUDENT_SKILLS}>Skill</Link>
                <Link style={{ color: '#60a5fa', textDecoration: 'none' }} to={ONBOARDING_ROUTES.STUDENT_LOCATION}>Loc</Link>
            </div>

            <span style={{ color: '#475569' }}>|</span>

            {/* Recruiter Links */}
            <div style={{ display: 'flex', gap: '10px' }}>
                <Link style={{ color: '#c084fc', textDecoration: 'none' }} to={ONBOARDING_ROUTES.RECRUITER_PROFESSIONAL}>Prof</Link>
                <Link style={{ color: '#c084fc', textDecoration: 'none' }} to={ONBOARDING_ROUTES.RECRUITER_COMPANY}>Comp</Link>
                <Link style={{ color: '#c084fc', textDecoration: 'none' }} to={ONBOARDING_ROUTES.RECRUITER_DESCRIPTION}>Desc</Link>
            </div>
        </div>
    );
};

export default OnboardingDevNav;
