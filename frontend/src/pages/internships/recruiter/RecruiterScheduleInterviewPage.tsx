import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RecruiterSidebar from '@/components/dashboard/recruiter/RecruiterSidebar';
import '@/styles/dashboard/recruiter-dashboard.css';
import '@/styles/internships/recruiter/recruiter-schedule-interview.css';
import { useRecruiterApplication } from '@/hooks/internships/recruiter/useRecruiterApplication';
import { useInterviews } from '@/hooks/interviews/useInterviews';
import { LoadingState } from '@/components/common/LoadingState';
import { toast } from 'react-hot-toast';

export default function RecruiterScheduleInterviewPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const applicationId = searchParams.get('applicationId');

    const { application, loading: appLoading } = useRecruiterApplication(applicationId || '');
    const { scheduleInterview, loading: schedulingLoading } = useInterviews();

    const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
    const [startTime, setStartTime] = useState('10:00');
    const [endTime, setEndTime] = useState('11:00');
    const [mode, setMode] = useState<'ONLINE' | 'OFFLINE'>('ONLINE');
    const [link, setLink] = useState('');
    const [notes, setNotes] = useState('');

    // Calendar logic
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, now.getMonth() + 1, 0).getDate();
    const startDayOfWeek = new Date(currentYear, now.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handleSchedule = async () => {
        if (!applicationId) return;

        // Construct UTC date
        const dateObj = new Date(currentYear, now.getMonth(), selectedDate);
        const [hours, minutes] = startTime.split(':');
        dateObj.setHours(parseInt(hours), parseInt(minutes));

        // Calculate duration in minutes
        const [endH, endM] = endTime.split(':');
        let endDate = new Date(dateObj);
        endDate.setHours(parseInt(endH), parseInt(endM));

        // If end time is before start time, assume it's the next day
        if (endDate < dateObj) {
            endDate.setDate(endDate.getDate() + 1);
        }

        const duration = Math.round((endDate.getTime() - dateObj.getTime()) / (1000 * 60));

        if (duration <= 0) {
            toast.error('Duration must be at least 1 minute');
            return;
        }

        if (duration > 1440) {
            toast.error('Interview cannot exceed 24 hours');
            return;
        }

        try {
            await scheduleInterview({
                applicationId,
                date: dateObj.toISOString(),
                duration,
                mode,
                link: link || (mode === 'ONLINE' ? 'Google Meet Link' : 'Office Address'),
                notes
            });
            toast.success('Interview scheduled successfully');
            navigate(`/dashboard/recruiter/applications/${applicationId}`);
        } catch (err: any) {
            toast.error(err.message || 'Failed to schedule');
        }
    };

    if (appLoading) {
        return <LoadingState fullPage />;
    }

    if (!application) {
        return (
            <div className="recruiter-dashboard-container">
                <RecruiterSidebar />
                <main className="recruiter-main">
                    <div className="p-8 text-center">
                        <h2 className="text-xl font-bold">Applicant not found</h2>
                        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 underline">Go Back</button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="recruiter-dashboard-container">
            <RecruiterSidebar />

            <main className="recruiter-main">
                <div className="recruiter-schedule-container">

                    <div className="schedule-header">
                        <h1 className="sch-title">Schedule Interview</h1>
                        <p className="sch-subtitle">Set interview details for {application.fullName}</p>
                    </div>

                    <div className="schedule-card">
                        <div className="applicant-header">
                            <div className="applicant-info">
                                <img src={application.student?.user?.profilePicture || '/default-avatar.png'} alt={application.fullName || 'Candidate'} className="applicant-avatar" />
                                <div className="applicant-details">
                                    <div className="applicant-name-row">
                                        <h3 className="applicant-name">{application.fullName}</h3>
                                        <span className="badge-shortlisted">{application.status}</span>
                                    </div>
                                    <p className="applicant-role">{application.internship?.title} • {application.student?.collegeName}</p>
                                </div>
                            </div>
                        </div>

                        <div className="schedule-body">
                            <div className="schedule-col-left">
                                <label className="section-label">Select Date ({currentMonth})</label>
                                <div className="custom-calendar">
                                    <div className="cal-header">
                                        <span className="cal-month">{currentMonth} {currentYear}</span>
                                    </div>
                                    <div className="cal-grid">
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, id) => (
                                            <div key={id} className="cal-day-name">{d}</div>
                                        ))}

                                        {Array.from({ length: startDayOfWeek }).map((_, i) => (
                                            <div key={`empty-${i}`} className="cal-date empty"></div>
                                        ))}

                                        {days.map(d => (
                                            <div
                                                key={d}
                                                className={`cal-date ${selectedDate === d ? 'selected' : ''}`}
                                                onClick={() => setSelectedDate(d)}
                                            >
                                                {d}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="schedule-col-right">
                                <div className="time-row">
                                    <div className="form-group">
                                        <label className="section-label">Start Time</label>
                                        <div className="input-wrapper">
                                            <span className="material-symbols-outlined input-icon">schedule</span>
                                            <input
                                                type="time"
                                                className="form-input"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="section-label">End Time</label>
                                        <div className="input-wrapper">
                                            <span className="material-symbols-outlined input-icon">schedule</span>
                                            <input
                                                type="time"
                                                className="form-input"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="section-label">Interview Mode</label>
                                    <div className="input-wrapper">
                                        <span className="material-symbols-outlined input-icon">videocam</span>
                                        <select
                                            className="form-select"
                                            value={mode}
                                            onChange={(e) => setMode(e.target.value as any)}
                                        >
                                            <option value="ONLINE">Online Interview</option>
                                            <option value="OFFLINE">In-Person Office</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="section-label">{mode === 'ONLINE' ? 'Meeting Link' : 'Location / Address'}</label>
                                    <div className="input-wrapper">
                                        <span className="material-symbols-outlined input-icon">{mode === 'ONLINE' ? 'link' : 'location_on'}</span>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder={mode === 'ONLINE' ? "Paste meeting URL here..." : "Enter office address..."}
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="section-label">Notes <span style={{ fontWeight: 400, color: '#94a3b8' }}>(Optional)</span></label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Add any instructions for the candidate..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="schedule-footer">
                            <button className="btn-cancel" onClick={() => navigate(-1)} disabled={schedulingLoading}>Cancel</button>
                            <button className="btn-schedule" onClick={handleSchedule} disabled={schedulingLoading}>
                                {schedulingLoading ? 'Scheduling...' : 'Schedule Interview'}
                                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>arrow_forward</span>
                            </button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
