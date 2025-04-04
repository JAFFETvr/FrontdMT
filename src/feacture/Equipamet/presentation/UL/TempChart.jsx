import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FaThermometerHalf } from 'react-icons/fa';

const TempChart = ({ temperatureData }) => {
    // Los datos ('temperatureData') vienen formateados desde usePetViewModel
    // Cada elemento debe tener { time: string, temp: number | null }
    const chartData = Array.isArray(temperatureData) ? temperatureData : [];

    console.log("Renderizando TempChart con datos:", chartData); // Log para ver qué recibe

    // --- Mensaje si no hay datos ---
    if (chartData.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10 border border-dashed border-gray-300 rounded-lg h-[340px] flex flex-col justify-center items-center bg-gray-50 shadow-inner">
                 <FaThermometerHalf className="mx-auto text-4xl mb-3 text-gray-400"/>
                 <span className='font-semibold text-gray-600'>Esperando datos de temperatura...</span>
                 <span className='text-sm mt-1 text-gray-500'>(La gráfica aparecerá aquí)</span>
             </div>
        );
    }

    // --- Cálculo del Dominio Y (para ajustar la escala) ---
    const validTemps = chartData
        .map(d => d.temp) // Extrae las temperaturas (pueden ser null)
        .filter(t => typeof t === 'number' && !isNaN(t)); // Filtra solo números válidos

    let yDomain = ['auto', 'auto']; // Deja que Recharts decida por defecto
    if (validTemps.length > 0) {
        const minTemp = Math.min(...validTemps);
        const maxTemp = Math.max(...validTemps);
        const margin = Math.max(1, (maxTemp - minTemp) * 0.1); // Un margen pequeño
        // Define un dominio con algo de espacio arriba y abajo
        yDomain = [
            Math.floor(minTemp - margin),
            Math.ceil(maxTemp + margin)
        ];
        // Asegura que el dominio no sea idéntico si solo hay un valor
        if (yDomain[0] === yDomain[1]) {
            yDomain[0] -= 1;
            yDomain[1] += 1;
        }
    }
    console.log("TempChart: Dominio Y:", yDomain);

    // --- Renderizado de la Gráfica ---
    return (
        <div className="w-full border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center flex items-center justify-center gap-2">
                 <FaThermometerHalf className="text-blue-500"/>
                 Temperatura Ambiente (°C)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 25, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                        dataKey="time" // CLAVE DEL EJE X (debe coincidir con el hook)
                        tick={{ fontSize: 10, fill: '#666' }}
                        axisLine={{ stroke: '#ccc' }}
                        tickLine={{ stroke: '#ccc' }}
                        // Considera interval={...} o angle={...} si tienes muchos puntos o etiquetas largas
                    />
                    <YAxis
                        domain={yDomain} // Dominio calculado o 'auto'
                        tick={{ fontSize: 12, fill: '#666' }}
                        axisLine={{ stroke: '#ccc' }}
                        tickLine={{ stroke: '#ccc' }}
                        tickFormatter={(value) => `${value}°`}
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', borderColor: '#ccc', padding: '8px 12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                        labelStyle={{ fontWeight: 'bold', color: '#333', marginBottom: '4px', fontSize: '13px' }}
                        itemStyle={{ color: '#3182CE', fontSize: '12px' }}
                        // Muestra N/A en tooltip si temp es null
                        formatter={(value, name, props) => [
                            `${typeof value === 'number' ? value.toFixed(1) : 'N/A'}°C`,
                            "Temperatura" // Nombre en el tooltip
                        ]}
                    />
                    <Legend verticalAlign="top" height={36} iconType="line"/>
                    <Line
                        type="monotone"
                        dataKey="temp" // CLAVE DEL EJE Y (debe coincidir con el hook)
                        name="Temperatura" // Nombre para leyenda/tooltip
                        stroke="#3182CE" // Color línea
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: '#3182CE', strokeWidth: 1, stroke: '#fff' }}
                        activeDot={{ r: 6, stroke: 'rgba(49, 130, 206, 0.3)', strokeWidth: 6 }}
                        connectNulls={false} // NO conectar puntos si hay un 'null' entre ellos
                        // isAnimationActive={false} // Desactivar animación si los datos llegan muy rápido
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TempChart;