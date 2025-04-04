import React from "react";
import { usePetViewModel } from "../ViewModel/pet.viewmodel";
import Header from "./Header";
import TempChart from "./TempChart";
import GraficaAlimento from "./GraficAlimentos";
// Removed FaWifi, added FaSpinner (or use existing SVG) and FaServer for errors
import { FaExclamationTriangle, FaRunning, FaTemperatureHigh, FaClipboardList, FaTimesCircle, FaServer } from "react-icons/fa";

// Updated Loading Indicator (or keep your SVG)
const LoadingIndicator = () => (
    <div className="text-center p-10 text-gray-500">
        {/* Optional: Replace with a spinner icon */}
        <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Cargando datos iniciales...
    </div>
);

const CuyoDashboard = () => {
    // Get loading and error states from the hook
    const { datos, temperatureData, calcularMovimientoDetectado, loading, error } = usePetViewModel();

    // --- Loading State ---
    if (loading) {
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

    // --- Error State ---
    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 font-sans">
                <Header />
                <main className="container mx-auto p-4 md:p-6 lg:p-8">
                    <section className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg flex flex-col items-center gap-4">
                        {/* Using FaServer or FaTimesCircle for error indication */}
                        <FaServer className="text-5xl text-red-500 mb-3" />
                        <h2 className="text-xl font-semibold text-red-700">Error al Cargar Datos</h2>
                        <p className="text-gray-600 text-center">{error}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Por favor, verifica que el servidor esté respondiendo correctamente en
                            <code className="text-xs bg-gray-200 px-1 py-0.5 rounded mx-1">http://174.129.168.168:8080/datos</code>
                             y revisa la consola del navegador para más detalles.
                        </p>
                    </section>
                </main>
            </div>
        );
    }

    // --- Data Display --- (Executed only if not loading and no error)
    const totalMovimientoDetectado = calcularMovimientoDetectado();
    // Get the latest reading from the fetched 'datos' array
    const lastReading = datos.length > 0 ? datos[datos.length - 1] : null;
    // Safely access properties, providing defaults if lastReading is null
    const lastMovement = lastReading ? lastReading.movimiento : 'N/A'; // Already 'Detectado' or 'Sin Movimiento'
    const lastTemperature = lastReading ? lastReading.temperatura : 'N/A'; // Already a number or null
    const recentHistory = datos.slice(-5).reverse(); // Get last 5 records from processed data

     // Handle case where data fetch succeeded but returned empty array
     if (datos.length === 0) {
         return (
            <div className="min-h-screen bg-gray-100 font-sans">
                <Header />
                 <main className="container mx-auto p-4 md:p-6 lg:p-8">
                    <section className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg">
                         <p className="text-center text-gray-600 py-10">
                             No hay datos disponibles para mostrar en este momento. Esperando nueva información del servidor...
                         </p>
                     </section>
                </main>
             </div>
         );
     }


    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Header />

            <main className="container mx-auto p-4 md:p-6 lg:p-8">
                {/* Removed WebSocket Connection Status Indicator */}

                <section className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg flex flex-col gap-8">

                    {/* Movement Section */}
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                        {/* Icon based on *any* recent movement perhaps? Or just static */}
                        <FaExclamationTriangle className="text-xl text-yellow-500" />
                        <h2 className="text-xl font-semibold text-gray-800">
                            Movimiento Detectado (Total): {totalMovimientoDetectado} veces
                        </h2>
                    </div>

                    {/* Last Readings Section */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-md text-gray-600">
                        <div className="flex items-center gap-2">
                            {/* Icon color based on the last movement status */}
                            <FaRunning className={lastMovement === 'Detectado' ? 'text-green-500' : 'text-gray-400'} />
                            <span>Último Estado Mov.: <span className="font-medium text-gray-800">{lastMovement}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaTemperatureHigh className="text-blue-500" />
                            {/* Display temperature safely, checking for null/N/A */}
                            <span>Última Temperatura: <span className="font-medium text-gray-800">{lastTemperature !== 'N/A' && lastTemperature !== null ? `${lastTemperature.toFixed(1)}°C` : 'N/A'}</span></span>
                        </div>
                    </div>

                    {/* Temperature Chart - Should work as is, receiving temperatureData */}
                    <TempChart temperatureData={temperatureData} />

                    {/* Food Chart (remains static for now) */}
                    <GraficaAlimento />

                    {/* History Section */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FaClipboardList className="text-gray-500" />
                            Historial de Registros Recientes
                        </h3>
                        {/* Check recentHistory which comes from processed 'datos' */}
                        {recentHistory.length > 0 ? (
                            <ul className="w-full space-y-2">
                                {recentHistory.map((item) => (
                                    <li
                                        // Use item.id from API if available and unique, fallback needed if not
                                        key={item.id || `hist-${Math.random()}`}
                                        className="p-3 bg-gray-50 rounded-md border border-gray-200 flex justify-between items-center text-sm"
                                    >
                                        <span className={`font-medium ${item.movimiento === 'Detectado' ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.movimiento === 'Detectado' ? '● Movimiento Detectado' : '○ Sin Movimiento'}
                                        </span>
                                        <span className="text-gray-600">
                                            {/* Display temperature safely */}
                                            🌡️ {item.temperatura !== null ? `${item.temperatura.toFixed(1)}°C` : 'N/A'}
                                        </span>
                                        {/* Optionally display ID or time if available */}
                                        <span className="text-xs text-gray-400">ID: {item.id || '?'}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             // This case should be rare now if datos.length>0 check passed above, but keep for safety
                            <p className="text-center text-gray-500 mt-4">No hay registros históricos para mostrar.</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CuyoDashboard;