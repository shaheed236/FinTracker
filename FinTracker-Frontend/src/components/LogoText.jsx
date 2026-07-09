import React from 'react';

export default function LogoText({ className = "" }) {
    return (
        <span className={`font-extrabold tracking-tight text-foreground ${className}`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500">
                FinTracker
            </span>
        </span>
    );
}
