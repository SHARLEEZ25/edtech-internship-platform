import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const InternshipDevNav = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [position, setPosition] = useState({ x: window.innerWidth - 560, y: window.innerHeight - 80 });
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only trigger drag on the "handle" or background, but not on links
        if ((e.target as HTMLElement).tagName === 'A') return;

        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragOffset.current.x,
                    y: e.clientY - dragOffset.current.y
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // Update position if window replaces
    useEffect(() => {
        const handleResize = () => {
            setPosition(prev => ({
                x: Math.min(prev.x, window.innerWidth - 100),
                y: Math.min(prev.y, window.innerHeight - 50)
            }));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                left: `${position.x}px`,
                top: `${position.y}px`,
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                padding: '10px 20px',
                borderRadius: '999px',
                color: 'white',
                zIndex: 10000,
                display: 'flex',
                gap: '12px',
                fontSize: '13px',
                alignItems: 'center',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                transition: isDragging ? 'none' : 'transform 0.1s ease, background-color 0.2s',
            }}
            onMouseDown={handleMouseDown}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    gap: '8px',
                    padding: '2px 4px'
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                }}
            >
                <span style={{ fontWeight: '800', color: '#f59e0b', whiteSpace: 'nowrap' }}>
                    {isExpanded ? 'Internship Nav' : 'Dev'}
                </span>
                <span style={{ fontSize: '10px', opacity: 0.7 }}>{isExpanded ? '◀' : '▶'}</span>
            </div>

            {isExpanded && (
                <>
                    <span style={{ color: 'rgba(255,255,255,0.2)', height: '14px', borderLeft: '1px solid white' }}></span>

                    {/* Recruiter Links */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ color: '#c084fc', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase' }}>Rec:</span>
                        <Link style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: '500' }} to="/dashboard/recruiter/internships">All</Link>
                        <Link style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: '500' }} to="/dashboard/recruiter/internships/new">Post</Link>
                        <Link style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: '500' }} to="/dashboard/recruiter/applications">Apps</Link>
                    </div>

                    <span style={{ color: 'rgba(255,255,255,0.2)', height: '14px', borderLeft: '1px solid white' }}></span>

                    {/* Student Links */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ color: '#60a5fa', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase' }}>Stu:</span>
                        <Link style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: '500' }} to="/dashboard/student/internships">Find</Link>
                        <Link style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: '500' }} to="/dashboard/student/saved-internships">Saved</Link>
                        <Link style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: '500' }} to="/dashboard/student/applications">My Apps</Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default InternshipDevNav;

