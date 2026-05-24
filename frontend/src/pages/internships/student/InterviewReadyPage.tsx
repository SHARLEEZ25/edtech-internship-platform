import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '@/styles/internships/student/interview-ready.css';

interface InterviewReadyData {
    role: string;
    company: string;
    date: string;
    platform: string;
}

export default function InterviewReadyPage() {
    const { id } = useParams<{ id: string }>();
    const [interview, setInterview] = useState<InterviewReadyData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch - ignores ID for now
        fetch('/data/student/interview-ready.json')
            .then(res => res.json())
            .then(data => {
                setInterview(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load interview', err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="interview-ready-container flex items-center justify-center" style={{ minHeight: '100vh', background: '#fff' }}>
                <p>Loading session...</p>
            </div>
        );
    }

    if (!interview) {
        return (
            <div className="interview-ready-container flex items-center justify-center" style={{ minHeight: '100vh', background: '#fff' }}>
                <p>Interview session not found.</p>
            </div>
        );
    }

    return (
        <div className="interview-ready-container">
            <div className="ready-content-wrapper">

                {/* Header */}
                <div className="ready-header">
                    <h1 className="ready-title">Interview — Ready to Join?</h1>
                    <p className="ready-subtitle">Please ensure you have a stable internet connection & camera access enabled.</p>
                </div>

                {/* Info Card */}
                <div className="ready-card">
                    <div className="ready-info-list">

                        {/* Role */}
                        <div className="ready-info-item">
                            <span className="material-symbols-outlined ready-icon">work</span>
                            <div className="ready-text-col">
                                <span className="ready-label">Interview role:</span>
                                <span className="ready-value">{interview.role}</span>
                            </div>
                        </div>

                        {/* Company */}
                        <div className="ready-info-item">
                            <span className="material-symbols-outlined ready-icon">apartment</span>
                            <div className="ready-text-col">
                                <span className="ready-label">Company name:</span>
                                <span className="ready-value">{interview.company}</span>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="ready-info-item">
                            <span className="material-symbols-outlined ready-icon">calendar_month</span>
                            <div className="ready-text-col">
                                <span className="ready-label">Date & Time:</span>
                                <span className="ready-value">{interview.date}</span>
                            </div>
                        </div>

                        {/* Platform */}
                        <div className="ready-info-item">
                            <span className="material-symbols-outlined ready-icon">videocam</span>
                            <div className="ready-text-col">
                                <span className="ready-label">Platform:</span>
                                <span className="ready-value">{interview.platform}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="ready-actions">
                    <button className="btn-join-now" onClick={() => window.open('https://meet.google.com', '_blank')}>
                        Join Interview Now
                    </button>
                    <button className="link-test-mic">
                        Test Microphone & Camera
                    </button>
                </div>

            </div>
        </div>
    );
}
