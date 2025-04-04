// components/CuyoDashboard/ProgressBar.jsx
import React from 'react';

/**
 * A simple progress bar component.
 * @param {object} props - Component props.
 * @param {number} props.value - The current value.
 * @param {number} [props.max=100] - The maximum value.
 */
const ProgressBar = ({ value = 0, max = 100 }) => {
    // Calculate percentage, ensuring it's between 0 and 100
    const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

    // Choose color based on percentage (example)
    let barColorClass = "bg-gradient-to-r from-green-400 to-green-600"; // Default green
    if (percentage < 50) {
        barColorClass = "bg-gradient-to-r from-yellow-400 to-yellow-600"; // Yellow if less than 50%
    }
    if (percentage < 20) {
        barColorClass = "bg-gradient-to-r from-red-400 to-red-600"; // Red if less than 20%
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
                aria-label="Progress" // Add accessibility label
            ></div>
        </div>
    );
};

export default ProgressBar;