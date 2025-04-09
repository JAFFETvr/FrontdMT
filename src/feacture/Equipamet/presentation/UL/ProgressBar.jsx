import React from 'react';

/**
 * @param {object} 
 * @param {number}
 * @param {number} [props.max=100] .
 */
const ProgressBar = ({ value = 0, max = 100 }) => {
    const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

    let barColorClass = "bg-gradient-to-r from-green-400 to-green-600";
    if (percentage < 50) {
        barColorClass = "bg-gradient-to-r from-yellow-400 to-yellow-600"; 
    }
    if (percentage < 20) {
        barColorClass = "bg-gradient-to-r from-red-400 to-red-600"; 
    }


    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden dark:bg-gray-700">
            <div
                className={`${barColorClass} h-2.5 rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin="0"
                aria-valuemax={max}
                aria-label="Progress"
            ></div>
        </div>
    );
};

export default ProgressBar;