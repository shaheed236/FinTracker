import React from 'react';

export default function LogoIcon({ className = "w-8 h-8", ...props }) {
    return (
        <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className={className}
            {...props}
        >
            <defs>
                <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
                <linearGradient id="gradient-secondary" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.4" />
                </linearGradient>
                <filter id="glow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            {/* Background Glow */}
            <circle cx="50" cy="50" r="35" fill="url(#gradient-primary)" opacity="0.15" filter="url(#glow)" />
            
            {/* Primary Arrow / A caret */}
            <path 
                d="M50 15L85 75H65L50 48L35 75H15L50 15Z" 
                fill="url(#gradient-primary)" 
                className="transition-all duration-300 hover:scale-105 origin-center"
            />
            {/* Secondary Layer overlapping */}
            <path 
                d="M50 38L70 75H58L50 58L42 75H30L50 38Z" 
                fill="url(#gradient-secondary)" 
                opacity="0.9"
            />
            
            {/* Center Core dot */}
            <circle cx="50" cy="65" r="4" fill="#06B6D4" filter="url(#glow)" />
        </svg>
    );
}
