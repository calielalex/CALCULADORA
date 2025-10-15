
import React from 'react';

interface CalculatorButtonProps {
  label: string;
  onClick: () => void;
  isOperator?: boolean;
  isClear?: boolean;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({ label, onClick, isOperator, isClear }) => {
  const baseClasses = "font-fredoka text-2xl rounded-2xl shadow-md border-b-4 active:border-b-2 active:translate-y-px transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  let colorClasses = "bg-white/80 border-gray-300 text-emerald-700 hover:bg-white focus:ring-emerald-500";
  if (isOperator) {
    colorClasses = "bg-amber-400 border-amber-600 text-white hover:bg-amber-500 focus:ring-amber-400";
  }
  if (isClear) {
    colorClasses = "bg-rose-500 border-rose-700 text-white hover:bg-rose-600 focus:ring-rose-500";
  }
  
  const sizeClasses = (label === '=' || label === 'C') ? 'col-span-1 h-16' : 'col-span-1 h-16';
  if (label === '=') {
    colorClasses += " col-span-2";
  }


  return (
    <button onClick={onClick} className={`${baseClasses} ${colorClasses} ${sizeClasses}`}>
      {label}
    </button>
  );
};
