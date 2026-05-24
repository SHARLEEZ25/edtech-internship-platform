import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecruiterApplication } from '@/hooks/internships/recruiter/useRecruiterApplication';
import { useInterviewActions } from '@/hooks/interviews/useInterviewActions';
import RecruiterSidebar from '@/components/dashboard/recruiter/RecruiterSidebar';

const ScheduleInterviewPage: React.FC = () => {
    const { applicationId } = useParams<{ applicationId: string }>();
    const navigate = useNavigate();

    // Fetch application details for context
    const { application, loading: appLoading, error: appError } = useRecruiterApplication(applicationId);

    const { scheduleInterview, isLoading: isScheduling } = useInterviewActions();

    // Form State
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [mode, setMode] = useState<'VIRTUAL' | 'IN_PERSON' | 'PHONE'>('VIRTUAL');
    const [linkOrLocation, setLinkOrLocation] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        document.title = 'Schedule Interview - Thozhil';
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!application) return;

        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            alert("Invalid date or time");
            return;
        }

        if (end <= start) {
            alert("End time must be after start time");
            return;
        }

        const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);

        try {
            await scheduleInterview({
                applicationId: application.id,
                date: start.toISOString(),
                duration: durationMinutes,
                mode,
                link: linkOrLocation,
                notes
            });
            // Redirect to interviews list or application details
            navigate('/dashboard/recruiter/interviews');
        } catch (err) {
            console.error(err);
            alert("Failed to schedule interview");
        }
    };

    if (appLoading) return <div className="loading-state">Loading application details...</div>;
    if (appError) return <div className="error-state">Error: {appError}</div>;
    if (!application) return <div className="error-state">Application not found</div>;

    const candidateName = application.student?.user?.fullName || "Candidate";
    const candidateRole = application.internship?.title || "Internship Applicant";

    return (
        <div className="recruiter-dashboard-container">
            <RecruiterSidebar />

            <main className="recruiter-main">
                <div className="dashboard-wrapper max-w-3xl mx-auto">

                    {/* Header */}
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm font-medium mb-4 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            Back
                        </button>
                        <h1 className="text-2xl font-bold text-slate-900">Schedule Interview</h1>
                        <p className="text-slate-500 mt-1">Set interview details for the selected applicant</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                        {/* Candidate Warning Context */}
                        <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                    {candidateName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{candidateName}</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                        <span className="material-symbols-outlined text-[14px]">code</span>
                                        <span>{candidateRole}</span>
                                    </div>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                                {application.status}
                            </span>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-8">

                            {/* Section 1: Timing */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Timing</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Interview Date</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Start Time</label>
                                        <input
                                            type="time"
                                            required
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">End Time</label>
                                        <input
                                            type="time"
                                            required
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Logistics */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Logistics</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Interview Mode</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">videocam</span>
                                            <select
                                                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white text-sm appearance-none"
                                                value={mode}
                                                onChange={(e) => setMode(e.target.value as any)}
                                            >
                                                <option value="VIRTUAL">Virtual (Video Call)</option>
                                                <option value="IN_PERSON">In-Person Meeting</option>
                                                <option value="PHONE">Phone Call</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">
                                            {mode === 'VIRTUAL' ? 'Meeting Link' : mode === 'PHONE' ? 'Phone Number' : 'Address'}
                                        </label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">link</span>
                                            <input
                                                type="text"
                                                required
                                                placeholder={mode === 'VIRTUAL' ? 'https://meet.google.com/...' : 'Enter details...'}
                                                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                                value={linkOrLocation}
                                                onChange={(e) => setLinkOrLocation(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Notes */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Additional Info</h4>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">
                                        Notes for Candidate <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder="Enter any specific instructions..."
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-sm placeholder:text-slate-400"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    disabled={isScheduling}
                                    className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isScheduling}
                                    className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isScheduling ? 'Scheduling...' : (
                                        <>
                                            Schedule Interview
                                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ScheduleInterviewPage;
