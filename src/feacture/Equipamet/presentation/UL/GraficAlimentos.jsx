import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"; 
import { FaUtensils } from 'react-icons/fa'; 

const GraficaAlimento = () => {
    const data = [
        { name: "Restante", value: 6 }, 
        { name: "Consumido", value: 4 }
    ];

    const COLORS = ["#48BB78", "#F56565"];

    const total = data.reduce((sum, entry) => sum + entry.value, 0);

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5; 
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={14} 
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };


    return (
        <div className="w-full border border-gray-200 rounded-lg p-4"> 
            <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center flex items-center justify-center gap-2">
                 <FaUtensils className="text-orange-500" /> 
                 Consumo de Alimento (KG)
            </h2>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false} 
                        label={renderCustomizedLabel}
                        outerRadius={110} 
                        innerRadius={50}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} stroke={COLORS[index]} /> 
                        ))}
                    </Pie>
                    <Tooltip
                         contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', borderColor: '#ccc' }}
                         formatter={(value, name) => [`${value} KG`, name]}
                    />
                     <Legend verticalAlign="bottom" height={36} iconType="circle"/> 
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GraficaAlimento;