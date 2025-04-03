import React from 'react';

const ProgressBar = ({ value, max = 100 }) => { 
    const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0; 

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden dark:bg-gray-700">
            <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full transition-all duration-500 ease-out" // Gradiente y transición
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;