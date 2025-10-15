
import React from 'react';

const Shape: React.FC<{ style: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div className="absolute animate-float text-white" style={style}>
    {children}
  </div>
);

const Star = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

const Circle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" />
    </svg>
);

const Triangle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21z" />
    </svg>
);

const shapes = [
    { component: <Star />, color: 'rgba(255, 255, 255, 0.5)' },
    { component: <Circle />, color: 'rgba(251, 146, 60, 0.7)' },
    { component: <Triangle />, color: 'rgba(59, 130, 246, 0.6)' },
    { component: <Star />, color: 'rgba(236, 72, 153, 0.7)' },
    { component: <Circle />, color: 'rgba(139, 92, 246, 0.6)' }
];

export const AnimatedBackground: React.FC = () => {
    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => {
                const shape = shapes[i % shapes.length];
                const size = Math.random() * 40 + 20;
                const style = {
                    left: `${Math.random() * 100}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    animationDelay: `${Math.random() * 10}s`,
                    animationDuration: `${Math.random() * 10 + 10}s`,
                    color: shape.color
                };
                return <Shape key={i} style={style}>{shape.component}</Shape>;
            })}
        </div>
    );
};
