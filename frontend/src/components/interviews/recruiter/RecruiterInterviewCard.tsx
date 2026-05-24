import React from 'react';
import type { Interview } from '@/api/interviews.api';
import { getPlatformFromUrl } from '@/utils/platformUtils';

interface RecruiterInterviewCardProps {
    interview: Interview;
}

export const RecruiterInterviewCard: React.FC<RecruiterInterviewCardProps> = ({ interview }) => {
    // Determine status color/badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'SCHEDULED': return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Scheduled</span>;
            case 'COMPLETED': return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Completed</span>;
            case 'CANCELLED': return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Cancelled</span>;
            default: return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">{status}</span>;
        }
    };

    // Format date and time
    const interviewDate = new Date(interview.date);
    const dateStr = interviewDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = interviewDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Extract Display Info
    const studentName = interview.studentName || interview.application?.student?.user?.fullName || 'Unknown Candidate';
    const studentPic = interview.studentProfilePic || interview.application?.student?.user?.profilePic;
    const internshipTitle = interview.internshipTitle || interview.application?.internship?.title || 'Internship Interview';
    const studentInitial = studentName.charAt(0).toUpperCase();

    // Platform Display
    const platformDisplay = getPlatformFromUrl(interview.link, interview.mode.toLowerCase().replace('_', ' '));

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    {studentPic ? (
                        <img src={studentPic} alt={studentName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            {studentInitial}
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-lg text-slate-800">{studentName}</h3>
                        <p className="text-sm text-slate-500">{internshipTitle}</p>
                    </div>
                </div>
                {getStatusBadge(interview.status)}
            </div>

            <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-slate-400">calendar_month</span>
                    <span>{dateStr} • {timeStr}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-slate-400">videocam</span>
                    <span className="capitalize">{platformDisplay}</span>
                </div>

                {interview.notes && (
                    <div className="flex items-start gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        <span className="material-symbols-outlined text-slate-400 text-[18px] mt-0.5">info</span>
                        <p>{interview.notes}</p>
                    </div>
                )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
                {interview.link ? (
                    <a
                        href={interview.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-[18px]">login</span>
                        Join Interface
                    </a>
                ) : (
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">link_off</span>
                        No link provided
                    </div>
                )}
            </div>
        </div>
    );
};
