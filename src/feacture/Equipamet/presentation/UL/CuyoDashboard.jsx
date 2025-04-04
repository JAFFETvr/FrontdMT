import React from "react";
import { usePetViewModel } from "../ViewModel/pet.viewmodel";
import Header from "./Header";
import TempChart from "./TempChart";
import GraficaAlimento from "./GraficAlimentos";
import { FaExclamationTriangle, FaRunning, FaTemperatureHigh, FaClipboardList, FaWifi, FaTimesCircle } from "react-icons/fa"; // Added Wifi icons

const LoadingIndicator = () => (
    <div className="text-center p-10 text-gray-500">
        <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Conectando y esperando datos...
    </div>
);


const CuyoDashboard = () => {
    const { datos, temperatureData, calcularMovimientoDetectado, isConnected, error } = usePetViewModel();

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 font-sans">
                <Header />
                <main className="container mx-auto p-4 md:p-6 lg:p-8">
                     <section className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg flex flex-col items-center gap-4">
                        <FaTimesCircle className="text-5xl text-red-500 mb-3"/>
                        <h2 className="text-xl font-semibold text-red-700">Error de Conexión</h2>
                        <p className="text-gray-600 text-center">{error}</p>
                        <p className="text-sm text-gray-500 mt-2">Por favor, verifica la consola del navegador y asegúrate de que el servidor WebSocket esté funcionando en `ws://174.129.168.168:8080/ws`.</p>
                    </section>
                </main>
            </div>
        );
    }

     // Show loading only if connected but no data arrived yet, or if not connected yet
    if (!isConnected || (isConnected && datos.length === 0)) {
       return (
            <div className="min-h-screen bg-gray-100 font-sans">
                <Header />
                 <main className="container mx-auto p-4 md:p-6 lg:p-8">
                    <section className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg">
                        <LoadingIndicator />
                     </section>
                </main>
            </div>
        );
    }


    // --- Data Display ---
    // Calculate derived values based on the *current* data
    const totalMovimientoDetectado = calcularMovimientoDetectado(); // Call the function
    const lastReading = datos.length > 0 ? datos[datos.length - 1] : null;
    const lastMovement = lastReading ? lastReading.movimiento : 'N/A';
    const lastTemperature = lastReading ? lastReading.temperatura : 'N/A';
    const recentHistory = datos.slice(-5).reverse(); // Get last 5 records

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Header />

            <main className="container mx-auto p-4 md:p-6 lg:p-8">
                {/* Connection Status Indicator */}
                 <div className={`fixed top-4 right-4 p-2 rounded-full shadow-md ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
                    {isConnected ?
                        <FaWifi className="text-green-600" title="WebSocket Conectado" /> :
                        <FaTimesCircle className="text-red-600" title="WebSocket Desconectado" />
                     }
                 </div>

                <section className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg flex flex-col gap-8">

                    {/* Movement Section */}
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                        <FaExclamationTriangle className="text-xl text-yellow-500" />
                        <h2 className="text-xl font-semibold text-gray-800">
                            {/* Use the calculated value */}
                            Movimiento Detectado: {totalMovimientoDetectado} veces
                        </h2>
                    </div>

                    {/* Last Readings Section */}
                     <div className="flex flex-wrap gap-x-6 gap-y-2 text-md text-gray-600">
                         <div className="flex items-center gap-2">
                            <FaRunning className={lastMovement === 'Detectado' ? 'text-green-500' : 'text-red-500'}/>
                            <span>Último Movimiento: <span className="font-medium text-gray-800">{lastMovement}</span></span>
                         </div>
                         <div className="flex items-center gap-2">
                            <FaTemperatureHigh className="text-blue-500"/>
                             {/* Display temperature safely */}
                            <span>Última Temperatura: <span className="font-medium text-gray-800">{lastTemperature !== 'N/A' ? `${lastTemperature}°C` : 'N/A'}</span></span>
                         </div>
                     </div>

                    {/* Temperature Chart */}
                    {/* Pass the formatted temperatureData */}
                    <TempChart temperatureData={temperatureData} />

                    {/* Food Chart (remains static for now) */}
                    <GraficaAlimento />

                    {/* History Section */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FaClipboardList className="text-gray-500"/>
                            Historial de Registros Recientes
                        </h3>
                        {/* Check if there's history */}
                        {recentHistory.length > 0 ? (
                             <ul className="w-full space-y-2">
                                {/* Map over the recentHistory */}
                                {recentHistory.map((item) => (
                                    <li
                                        key={item.id || Math.random()} // Use ID if available, fallback to random key (not ideal for production)
                                        className="p-3 bg-gray-50 rounded-md border border-gray-200 flex justify-between items-center text-sm"
                                    >
                                        <span className={`font-medium ${item.movimiento === 'Detectado' ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.movimiento === 'Detectado' ? '● Movimiento Detectado' : '○ Sin Movimiento'}
                                        </span>
                                        <span className="text-gray-600">
                                            🌡️ {item.temperatura}°C
                                        </span>
                                        {/* Optionally display timestamp if available */}
                                        {/* <span className="text-xs text-gray-400">{item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : ''}</span> */}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500 mt-4">No hay registros históricos todavía.</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CuyoDashboard;