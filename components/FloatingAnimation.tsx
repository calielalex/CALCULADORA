
import React from 'react';

interface FloatingAnimationProps {
    children: React.ReactNode;
    style: React.CSSProperties;
}

const Sparkle: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute animate-sparkle" style={style}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z" />
        </svg>
    </div>
);

export const FloatingAnimation: React.FC<FloatingAnimationProps> = ({ children, style }) => {
    const sparkles = Array.from({ length: 3 }).map((_, i) => {
        const size = Math.random() * 15 + 10;
        return {
            id: i,
            style: {
                top: `${Math.random() * 100 - 50}%`,
                left: `${Math.random() * 100 - 50}%`,
                width: `${size}px`,
                height: `${size}px`,
                color: `hsla(${Math.random() * 60 + 200}, 100%, 70%, 0.8)`,
                animationDelay: `${Math.random() * 0.5}s`,
            }
        };
    });

    return (
        <div 
            className="absolute font-fredoka text-6xl drop-shadow-lg animate-floating-number flex items-center justify-center" 
            style={style}
        >
            {children}
            {sparkles.map(s => <Sparkle key={s.id} style={s.style} />)}
        </div>
    );
};
