import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FaThermometerHalf } from 'react-icons/fa'; 

const TempChart = ({ temperatureData }) => {
    const formattedData = temperatureData?.map(item => ({
        time: item.time,
        Temperatura: parseFloat(item.temp) 
    })) || []; 


    if (!formattedData || formattedData.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10 border border-gray-200 rounded-lg">
                 <FaThermometerHalf className="mx-auto text-3xl mb-2 text-gray-400"/>
                 No hay datos de temperatura disponibles.
             </div>
        );
    }

    const temps = formattedData.map(d => d.Temperatura);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const yDomainMargin = 1; 
    const yDomain = [
        Math.floor(minTemp - yDomainMargin),
        Math.ceil(maxTemp + yDomainMargin)
    ];


    return (
        
        <div className="w-full border border-gray-200 rounded-lg p-4"> {/* Solo borde y padding */}
            <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center flex items-center justify-center gap-2">
                 <FaThermometerHalf className="text-blue-500"/> 
                 Temperatura Ambiente (°C)
            </h2>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}> 
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> 
                    <XAxis
                        dataKey="time"
                        tick={{ fontSize: 12, fill: '#666' }} 
                        axisLine={{ stroke: '#ccc' }}
                        tickLine={{ stroke: '#ccc' }}
                    />
                    <YAxis
                        domain={yDomain} 
                        tick={{ fontSize: 12, fill: '#666' }}
                        axisLine={{ stroke: '#ccc' }}
                        tickLine={{ stroke: '#ccc' }}
                        tickFormatter={(value) => `${value}°`} 
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', borderColor: '#ccc' }} // Tooltip más bonito
                        labelStyle={{ fontWeight: 'bold', color: '#333' }}
                        itemStyle={{ color: '#3182CE' }}
                        formatter={(value) => [`${value}°C`, "Temperatura"]} 
                    />
                     <Legend verticalAlign="top" height={36}/> 
                    <Line
                        type="monotone"
                        dataKey="Temperatura"
                        stroke="#3182CE" 
                        strokeWidth={2} 
                        dot={{ r: 4, fill: '#3182CE', strokeWidth: 1, stroke: '#fff' }} 
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TempChart;