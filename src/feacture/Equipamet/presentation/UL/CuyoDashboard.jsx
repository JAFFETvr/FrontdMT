import React from "react";
import { usePetViewModel } from "../ViewModel/pet.viewmodel"; // Ajusta ruta
import Header from "./Header"; // Asume que existe
import TempChart from "./TempChart"; // Asume que existe
import GraficaAlimento from "./GraficAlimentos"; // Asume que existe
import { FaExclamationTriangle, FaRunning, FaTemperatureHigh, FaClipboardList, FaServer, FaSpinner, FaCheckCircle } from "react-icons/fa";

// --- Componentes Auxiliares (Loading e Error) ---
const LoadingIndicator = () => (
    <div className="text-center p-10 text-gray-500 flex flex-col items-center gap-4">
        <FaSpinner className="animate-spin h-10 w-10 text-blue-500" />
        <span>Cargando datos iniciales...</span>
        <span className="text-sm text-gray-400">(Conectando con el servidor...)</span>
    </div>
);

const ErrorDisplay = ({ error }) => (
    <section className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg flex flex-col items-center gap-4 text-center border-l-4 border-red-500">
        <FaServer className="text-5xl text-red-600 mb-3" />
        <h2 className="text-xl font-semibold text-red-700">Error al Cargar Datos</h2>
        <p className="text-gray-700 bg-red-50 p-3 rounded border border-red-200 w-full text-sm">{error || "Ha ocurrido un error desconocido."}</p>
        <p className="text-xs text-gray-500 mt-2">
            Verifica tu conexión, el estado del servidor en
            <code className="text-xs bg-gray-200 px-1 py-0.5 rounded mx-1 break-all">{API_URL}</code>,
            y tu estado de autenticación (token). Revisa la consola (F12) para más detalles.
        </p>
    </section>
);

// --- Componente Principal del Dashboard ---
const CuyoDashboard = () => {
    const { datos, temperatureData, calcularMovimientoDetectado, loading, error } = usePetViewModel();

    console.log("Renderizando CuyoDashboard:", { loading, error: !!error, datosCount: datos?.length });

    // 1. Estado de Carga Inicial
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 font-sans">
                <Header />
                <main className="container mx-auto p-4 md:p-6 lg:p-8"><LoadingIndicator /></main>
            </div>
        );
    }

    // 2. Estado de Error (se muestra incluso si hay datos viejos)
    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 font-sans">
                <Header />
                <main className="container mx-auto p-4 md:p-6 lg:p-8"><ErrorDisplay error={error} /></main>
            </div>
        );
    }

    // 3. No hay datos (después de carga y sin errores)
    if (!Array.isArray(datos) || datos.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 font-sans">
                <Header />
                <main className="container mx-auto p-4 md:p-6 lg:p-8">
                    <section className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg text-center">
                         <FaCheckCircle className="text-4xl text-gray-400 mx-auto mb-4"/>
                        <p className="text-gray-600 py-5">
                            Conexión establecida, pero no hay datos de sensores disponibles aún.
                        </p>
                         <p className="text-sm text-gray-500">(Esperando la primera lectura del dispositivo o la API no devolvió registros).</p>
                    </section>
                </main>
            </div>
        );
    }

    // 4. Mostrar Datos (Carga completa, sin errores, y hay datos)
    const totalMovimientoDetectado = calcularMovimientoDetectado();
    const lastReading = datos[datos.length - 1]; // Último registro procesado
    const lastMovement = lastReading?.movimiento || 'N/A';
    const lastTemperature = lastReading?.temperatura; // Puede ser number o null
    const lastDistance = lastReading?.distancia;   // Puede ser number o null

    const recentHistory = datos.slice(-5).reverse(); // Últimos 5 para historial

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Header />
            <main className="container mx-auto p-4 md:p-6 lg:p-8">
                <section className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg flex flex-col gap-8">

                    {/* Sección Resumen */}
                    <div className="flex items-center justify-between gap-3 pb-4 border-b border-gray-200">
                         <div className="flex items-center gap-3">
                             {lastMovement === 'Detectado'
                                ? <FaRunning className="text-2xl text-green-500" />
                                : <FaExclamationTriangle className="text-2xl text-yellow-500" />
                             }
                            <h2 className="text-xl font-semibold text-gray-800">
                                Resumen Actual
                            </h2>
                        </div>
                        <span className="text-sm text-gray-500">ID Último Reg: {lastReading.id || '?'}</span>
                    </div>

                    {/* Últimas Lecturas Detalladas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-md text-gray-700">
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
                            <FaRunning className={`w-5 h-5 ${lastMovement === 'Detectado' ? 'text-green-600' : 'text-gray-400'}`} />
                            <span>Último Movimiento: <span className="font-medium text-gray-900">{lastMovement}</span></span>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
                            <FaTemperatureHigh className="w-5 h-5 text-blue-500" />
                            <span>Última Temperatura: <span className="font-medium text-gray-900">
                                {/* Muestra N/A si es null */}
                                {typeof lastTemperature === 'number' ? `${lastTemperature.toFixed(1)}°C` : 'N/A'}
                            </span></span>
                        </div>
                         {/* Mostrar distancia si está disponible */}
                         {typeof lastDistance === 'number' && (
                             <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
                                 {/* Puedes elegir un icono para distancia */}
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                 <span>Última Distancia: <span className="font-medium text-gray-900">{lastDistance.toFixed(0)}m</span></span>
                             </div>
                         )}
                         <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
                             <FaClipboardList className="w-5 h-5 text-orange-500" />
                             <span>Movimientos Totales: <span className="font-medium text-gray-900">{totalMovimientoDetectado}</span></span>
                        </div>
                    </div>

                    {/* Gráfica de Temperatura */}
                    <TempChart temperatureData={temperatureData} />

                    {/* Gráfica de Alimento */}
                    <GraficaAlimento />

                    {/* Historial Reciente */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FaClipboardList className="text-gray-500" />
                            Historial Reciente (Últimos 5)
                        </h3>
                        <ul className="w-full space-y-2">
                            {recentHistory.map((item) => (
                                <li
                                    key={item.id || `hist-${Math.random()}`} // Usa ID real si es posible
                                    className="p-3 bg-gray-50 rounded-md border border-gray-200 flex flex-wrap justify-between items-center text-sm gap-x-4 gap-y-1"
                                >
                                    <span className={`font-medium ${item.movimiento === 'Detectado' ? 'text-green-700' : 'text-red-700'}`}>
                                        {item.movimiento === 'Detectado' ? '● Movimiento' : '○ Sin Movimiento'}
                                    </span>
                                    <span className="text-gray-600">
                                        🌡️ {typeof item.temperatura === 'number' ? `${item.temperatura.toFixed(1)}°C` : 'N/A'}
                                    </span>
                                    {typeof item.distancia === 'number' && (
                                        <span className="text-gray-600">📏 {item.distancia.toFixed(0)}m</span>
                                    )}
                                    {/* Muestra ID si es útil y no es el fallback */}
                                    {item.id && !String(item.id).startsWith('fallback-') && (
                                         <span className="text-xs text-gray-400">ID: {item.id}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CuyoDashboard;