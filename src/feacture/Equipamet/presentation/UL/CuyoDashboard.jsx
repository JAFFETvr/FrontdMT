import React, { useEffect, useState } from "react";
import { usePetViewModel } from "../../domain/UseCase/usePetViewModel";
import Header from "./Header";  
import ProgressBar from "./ProgressBar";  
import TempChart from "./TempChart";  

const CuyoDashboard = () => {
    const { stats } = usePetViewModel();
    const [socketMessage, setSocketMessage] = useState("");

    // Notificaciones de movimiento
    useEffect(() => {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                console.log("Permiso concedido para notificaciones");
            }
        });

        if (stats && stats.calcularMovimientoDetectado() > 0) {
            alert("Movimiento detectado en tu mascota!");
        }
    }, [stats]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="p-6 flex flex-col items-center">
                <section className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">📹 Video en Vivo</h2>
                    <video className="w-full rounded-lg mb-6" controls>
                        <source src="https://www.example.com/video.mp4" type="video/mp4" />
                        Tu navegador no soporta videos.
                    </video>

                    {stats && (
                        <>
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
                            </ul>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
};

export default CuyoDashboard;
