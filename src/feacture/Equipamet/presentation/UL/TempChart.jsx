// components/CuyoDashboard/TempChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FaThermometerHalf } from 'react-icons/fa';

const TempChart = ({ temperatureData }) => {
    // The data is now formatted in usePetViewModel, passed as temperatureData prop
    // Ensure temperatureData is an array before proceeding
    const formattedData = Array.isArray(temperatureData) ? temperatureData : [];

    if (formattedData.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10 border border-gray-200 rounded-lg h-[300px] flex flex-col justify-center items-center">
                 <FaThermometerHalf className="mx-auto text-3xl mb-2 text-gray-400"/>
                 Esperando datos de temperatura...
             </div>
        );
    }

    // Calculate Y-axis domain based on the received data
    const temps = formattedData.map(d => d.temp).filter(t => typeof t === 'number' && !isNaN(t)); // Filter out non-numeric temps
    const minTemp = temps.length > 0 ? Math.min(...temps) : 15; // Default min if no data
    const maxTemp = temps.length > 0 ? Math.max(...temps) : 30; // Default max if no data
    const yDomainMargin = 1;
    // Ensure domain is valid numbers
    const yDomain = [
        isNaN(minTemp) ? 15 : Math.floor(minTemp - yDomainMargin),
        isNaN(maxTemp) ? 30 : Math.ceil(maxTemp + yDomainMargin)
    ];
    // Prevent domain from being identical [n, n] which causes errors
    if (yDomain[0] === yDomain[1]) {
        yDomain[0] -= 1;
        yDomain[1] += 1;
    }


    return (
        <div className="w-full border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center flex items-center justify-center gap-2">
                 <FaThermometerHalf className="text-blue-500"/>
                 Temperatura Ambiente (°C)
            </h2>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}> {/* Adjusted left margin */}
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                        dataKey="time" // Uses 'time' field from formattedData
                        tick={{ fontSize: 11, fill: '#666' }}
                        axisLine={{ stroke: '#ccc' }}
                        tickLine={{ stroke: '#ccc' }}
                        // Optional: Add more ticks if needed, or format time differently
                        // interval={'preserveStartEnd'} // Example: Show first and last ticks
                    />
                    <YAxis
                        domain={yDomain} // Dynamic domain based on data
                        tick={{ fontSize: 12, fill: '#666' }}
                        axisLine={{ stroke: '#ccc' }}
                        tickLine={{ stroke: '#ccc' }}
                        tickFormatter={(value) => `${value}°`}
                        allowDecimals={false} // No decimal ticks on Y axis
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', borderColor: '#ccc', padding: '8px 12px' }}
                        labelStyle={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}
                        itemStyle={{ color: '#3182CE' }}
                        formatter={(value, name, props) => [`${value.toFixed(1)}°C`, "Temperatura"]} // Format value in tooltip
                        // labelFormatter={(label) => `Time: ${label}`} // Customize label if needed
                    />
                     <Legend verticalAlign="top" height={36} iconType="line"/>
                    <Line
                        type="monotone"
                        dataKey="temp" // Uses 'temp' field from formattedData
                        name="Temperatura" // Name for Legend and Tooltip
                        stroke="#3182CE"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#3182CE', strokeWidth: 1, stroke: '#fff' }} // Smaller dots
                        activeDot={{ r: 5, strokeWidth: 0 }}
                        isAnimationActive={false} // Disable animation for real-time feel, enable if preferred
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TempChart;