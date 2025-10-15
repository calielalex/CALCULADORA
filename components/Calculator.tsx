
import React from 'react';

interface CalculatorProps {
  displayValue: string;
  isSpeaking: boolean;
  isCelebrating: boolean;
  isBlinking: boolean;
  isLoading: boolean;
}

export const Calculator: React.FC<CalculatorProps> = ({ displayValue, isSpeaking, isCelebrating, isBlinking, isLoading }) => {
    const mouthPath = isSpeaking ? "M 120 195 Q 150 220 180 195" : "M 120 200 Q 150 210 180 200";

    return (
        <div className="relative">
            <svg 
                viewBox="0 0 300 350" 
                className={`w-72 h-84 transition-transform duration-500 ${isCelebrating ? 'animate-celebrate-bounce' : ''}`}
            >
                <defs>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="5" dy="10" stdDeviation="5" floodColor="#000000" floodOpacity="0.3"/>
                    </filter>
                    <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#86efac" />
                        <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                    <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d1fae5" />
                        <stop offset="100%" stopColor="#a7f3d0" />
                    </linearGradient>
                </defs>

                {/* Body */}
                <path d="M 30 20 Q 30 0 50 0 L 250 0 Q 270 0 270 20 L 270 330 Q 270 350 250 350 L 50 350 Q 30 350 30 330 Z" fill="url(#bodyGradient)" filter="url(#shadow)" />
                <path d="M 35 20 Q 35 5 50 5 L 250 5 Q 265 5 265 20 L 265 330 Q 265 345 250 345 L 50 345 Q 35 345 35 330 Z" fill="none" stroke="#ffffff" strokeWidth="3" strokeOpacity="0.5"/>


                {/* Screen */}
                <rect x="50" y="30" width="200" height="80" rx="10" fill="url(#screenGradient)" stroke="#10b981" strokeWidth="4" />
                <text x="150" y="80" fontFamily="'Fredoka One', cursive" fontSize="40" fill="#064e3b" textAnchor="middle" dominantBaseline="middle">
                    {displayValue.slice(0, 12)}
                </text>
                {isLoading && (
                    <text x="150" y="80" fontFamily="'Fredoka One', cursive" fontSize="20" fill="#064e3b" textAnchor="middle" dominantBaseline="middle" className="animate-pulse">
                      ...
                    </text>
                )}


                {/* Eyes */}
                <g>
                    {/* Left Eye */}
                    <circle cx="100" cy="150" r="25" fill="white" />
                    <circle cx="100" cy="150" r="12" fill="black" />
                    <circle cx="105" cy="145" r="4" fill="white" />
                    <path d="M 75 125 C 90 115, 110 115, 125 125" stroke="black" strokeWidth="4" fill="none" />
                    {isBlinking && <path d="M 75 150 Q 100 140 125 150" stroke="black" strokeWidth="4" fill="none" />}

                    {/* Right Eye */}
                    <circle cx="200" cy="150" r="25" fill="white" />
                    <circle cx="200" cy="150" r="12" fill="black" />
                    <circle cx="205" cy="145" r="4" fill="white" />
                    <path d="M 175 125 C 190 115, 210 115, 225 125" stroke="black" strokeWidth="4" fill="none" />
                    {isBlinking && <path d="M 175 150 Q 200 140 225 150" stroke="black" strokeWidth="4" fill="none" />}
                </g>

                {/* Mouth */}
                <path d={mouthPath} stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
                
                {/* Cheeks */}
                <circle cx="70" cy="180" r="10" fill="#fca5a5" opacity="0.7" />
                <circle cx="230" cy="180" r="10" fill="#fca5a5" opacity="0.7" />
            </svg>
        </div>
    );
};
