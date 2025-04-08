// src/components/TempChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FaThermometerHalf } from 'react-icons/fa';

const TempChart = ({ temperatureData }) => {
    const formattedData = Array.isArray(temperatureData) ? temperatureData : [];
    if (formattedData.length === 0) { return ( <div className="text-center text-gray-500 py-10 border rounded-lg h-[300px] flex flex-col justify-center items-center bg-gray-50"><FaThermometerHalf className="mx-auto text-3xl mb-2 text-gray-400"/> Esperando datos...</div> ); }
    const temps = formattedData.map(d => d.temp).filter(t => typeof t === 'number' && !isNaN(t));
    const minTemp = temps.length > 0 ? Math.min(...temps) : 15;
    const maxTemp = temps.length > 0 ? Math.max(...temps) : 30;
    const yDomainMargin = 1;
    const calculatedMin = isNaN(minTemp) ? 15 : Math.floor(minTemp - yDomainMargin);
    const calculatedMax = isNaN(maxTemp) ? 30 : Math.ceil(maxTemp + yDomainMargin);
    let yDomain = [calculatedMin, calculatedMax];
    if (yDomain[0] === yDomain[1]) { yDomain = [yDomain[0] - 1, yDomain[1] + 1]; }

    return (
        <div className="w-full border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center flex items-center justify-center gap-2"><FaThermometerHalf className="text-blue-500"/> Temperatura Ambiente (°C)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#666' }} axisLine={{ stroke: '#ccc' }} tickLine={{ stroke: '#ccc' }} />
                    <YAxis domain={yDomain} tick={{ fontSize: 12, fill: '#666' }} axisLine={{ stroke: '#ccc' }} tickLine={{ stroke: '#ccc' }} tickFormatter={(value) => `${value}°`} allowDecimals={false} width={40} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', borderColor: '#ccc', padding: '8px 12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} labelStyle={{ fontWeight: 'bold', color: '#333', marginBottom: '4px', borderBottom: '1px solid #eee', paddingBottom: '4px' }} itemStyle={{ color: '#3182CE' }} formatter={(value) => [`${value.toFixed(1)}°C`, "Temperatura"]} labelFormatter={(label) => `Registro: ${label}`} />
                     <Legend verticalAlign="top" height={36} iconType="line"/>
                    <Line type="monotone" dataKey="temp" name="Temperatura" stroke="#3182CE" strokeWidth={2} dot={{ r: 3, fill: '#3182CE', strokeWidth: 1, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#2B6CB0' }} isAnimationActive={true} animationDuration={500} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TempChart;