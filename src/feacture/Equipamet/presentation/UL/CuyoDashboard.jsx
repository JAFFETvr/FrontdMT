import React, { useEffect, useState } from "react";
import { usePetViewModel } from "../../domain/UseCase/usePetViewModel";
import Header from "./Header";  
import ProgressBar from "./ProgressBar";  
import TempChart from "./TempChart";  
import GraficaAlimento from "./GraficAlimentos";

const CuyoDashboard = () => {
    const { stats } = usePetViewModel();
    const [socketMessage, setSocketMessage] = useState("");

    

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="p-6 flex flex-col items-center">
                {stats && (
                    <section className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
                        {/* Mostrar cuántas veces se detectó movimiento */}
                        <div className="mb-4 text-lg font-bold">
                            🚨 Movimiento Detectado: {stats.calcularMovimientoDetectado()} veces
                        </div>
                    
                        {/* Barra de carga para el movimiento */}
                        <ProgressBar value={stats.calcularMovimientoDetectado()} />

                        {/* Gráfico de temperatura */}
                        <TempChart temperatureData={stats.temperatureData} />


                        {/* Lista de registros */}
                        <ul className="w-full bg-gray-50 p-4 rounded-lg shadow">
                            {stats.datos.map((item) => (
                                <li key={item.id} className="p-2 border-b last:border-none">
                                    <span className="text-gray-800">
                                        📌 <strong>Movimiento:</strong> {item.movimiento} | 
                                        🌡️ <strong>Temperatura:</strong> {item.temperatura}
                                    </span>
                                </li>
                            ))}
                            <GraficaAlimento></GraficaAlimento>
                        </ul>
                    </section>
                )}
            </main>
        </div>
    );
};

export default CuyoDashboard;
