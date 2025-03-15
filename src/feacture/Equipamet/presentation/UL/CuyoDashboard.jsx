import React, { useEffect } from "react";
import { messaging, onMessage } from "../../../../firebase-config"; // Ajusta la ruta según tu estructura
import { usePetViewModel } from "../ViewModel/pet.viewmodel";

const CuyoDashboard = () => {
    const { stats } = usePetViewModel();

    useEffect(() => {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                console.log("Permiso concedido para notificaciones");
            }
        });

        onMessage(messaging, (payload) => {
            console.log("Notificación recibida:", payload);
            alert(`🔔 ${payload.notification.title}: ${payload.notification.body}`);
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-orange-500 text-white p-4 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold">🐹 Cuyo Monitor</h1>
            </header>
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
