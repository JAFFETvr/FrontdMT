import React, { useEffect, useState } from "react";
import { usePetViewModel } from "../../domain/UseCase/usePetViewModel";
import Header from "./Header";
import TempChart from "./TempChart";
import GraficaAlimento from "./GraficAlimentos";
import { FaExclamationTriangle, FaRunning, FaTemperatureHigh, FaClipboardList } from "react-icons/fa"; 

const CuyoDashboard = () => {
    const { stats } = usePetViewModel();
    const exampleStats = {
        calcularMovimientoDetectado: () => 5,
        temperatureData: [
            { time: '10:00', temp: 22.0 },
            { time: '10:01', temp: 22.2 },
            { time: '10:02', temp: 22.5 },
            { time: '10:03', temp: 22.8 },
            { time: '10:04', temp: 23.0 },
            { time: '10:05', temp: 23.1 },
        ],
        datos: [
            { id: 1, movimiento: 'Detectado', temperatura: 22 },
            { id: 2, movimiento: 'No Detectado', temperatura: 21 },
            { id: 3, movimiento: 'Detectado', temperatura: 23 },
             { id: 4, movimiento: 'Detectado', temperatura: 23 },
              { id: 5, movimiento: 'Detectado', temperatura: 23 },
        ],
    };

    const displayStats = stats || exampleStats;

    const lastMovement = displayStats.datos.length > 0 ? displayStats.datos[displayStats.datos.length - 1].movimiento : 'N/A';
    const lastTemperature = displayStats.datos.length > 0 ? displayStats.datos[displayStats.datos.length - 1].temperatura : 'N/A';

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Header />

            <main className="container mx-auto p-4 md:p-6 lg:p-8">

                <section className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg flex flex-col gap-8"> {/* Aumentamos gap */}

                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                        <FaExclamationTriangle className="text-xl text-yellow-500" />
                        <h2 className="text-xl font-semibold text-gray-800">
                            Movimiento Detectado: {displayStats.calcularMovimientoDetectado()} veces
                        </h2>
                    
                    </div>

                     <div className="flex flex-wrap gap-x-6 gap-y-2 text-md text-gray-600">
                         <div className="flex items-center gap-2">
                            <FaRunning className={lastMovement === 'Detectado' ? 'text-green-500' : 'text-red-500'}/>
                            <span>Último Movimiento: <span className="font-medium text-gray-800">{lastMovement}</span></span>
                         </div>
                         <div className="flex items-center gap-2">
                            <FaTemperatureHigh className="text-blue-500"/>
                            <span>Última Temperatura: <span className="font-medium text-gray-800">{lastTemperature}°C</span></span>
                         </div>
                     </div>


                
                    <TempChart temperatureData={displayStats.temperatureData} />

                    <GraficaAlimento />

                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FaClipboardList className="text-gray-500"/>
                            Historial de Registros Recientes
                        </h3>
                        <ul className="w-full space-y-2"> 
                            {displayStats.datos.slice(-5).reverse().map((item) => ( 
                                <li
                                    key={item.id}
                                    className="p-3 bg-gray-50 rounded-md border border-gray-200 flex justify-between items-center text-sm"
                                >
                                    <span className={`font-medium ${item.movimiento === 'Detectado' ? 'text-green-600' : 'text-red-600'}`}>
                                       {item.movimiento === 'Detectado' ? '● Movimiento Detectado' : '○ Sin Movimiento'}
                                    </span>
                                    <span className="text-gray-600">
                                        🌡️ {item.temperatura}°C
                                    </span>
                                 
                                </li>
                            ))}
                        </ul>
                        {displayStats.datos.length === 0 && (
                            <p className="text-center text-gray-500 mt-4">No hay registros históricos.</p>
                        )}
                    </div>

                </section>

            </main>
        </div>
    );
};

export default CuyoDashboard;