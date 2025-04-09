import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "./Header";
import TempChart from "./TempChart";
import GraficaAlimento from "./GraficAlimentos";
import { FaExclamationTriangle, FaRunning, FaTemperatureHigh, FaClipboardList, FaTimesCircle, FaThermometerHalf, FaSignOutAlt } from "react-icons/fa";
import { fetchPetStats, removeToken as removeAuthToken, removeRole } from "../../data/DataSource/pet.api"; // Ajusta la ruta

const LoadingIndicator = () => ( <div className="text-center p-10 text-gray-500"> {/* ... SVG ... */} Cargando datos... </div> );

const CuyoDashboard = () => {
    const [datos, setDatos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        let isAuthError = false;

        const loadData = async () => {
            if (isMounted) { setIsLoading(true); setError(null); isAuthError = false; }
            try {
                console.log("CuyoDashboard: Llamando a fetchPetStats...");
                const fetchedData = await fetchPetStats(); // Usa la función con logs
                console.log("CuyoDashboard: fetchPetStats retornó datos.");
                if (isMounted) { setDatos(fetchedData); }
            } catch (err) {
                console.error("CuyoDashboard: Error capturado en useEffect:", err.message);
                if (err && err.message && err.message.toLowerCase().includes("no autenticado")) {
                    isAuthError = true;
                    if (isMounted) {
                        console.log("CuyoDashboard: Redirigiendo al login por error de autenticación.");
                        removeAuthToken();
                        removeRole();
                        navigate('/login');
                    }
                } else {
                    if (isMounted) { setError(err.message || "Error inesperado."); }
                }
            } finally {
                if (isMounted && !isAuthError) {
                    console.log("CuyoDashboard: Finalizando carga.");
                    setIsLoading(false);
                } else if (isMounted && isAuthError) {
                     console.log("CuyoDashboard: Carga interrumpida por redirección.");
                }
            }
        };
        loadData();
        return () => { isMounted = false; console.log("CuyoDashboard: Desmontado."); };
    }, [navigate]);

    const handleLogout = () => {
        console.log("Cerrando sesión...");
        removeAuthToken();
        removeRole();
        navigate('/login');
    };

    if (isLoading) { return ( <div className="min-h-screen bg-gray-100"> <Header onLogout={handleLogout} /> <main className="container mx-auto p-8"><section className="bg-white p-8 rounded-xl shadow-lg"><LoadingIndicator /></section></main> </div> ); }
    if (error) { return ( <div className="min-h-screen bg-gray-100"> <Header onLogout={handleLogout} /> <main className="container mx-auto p-8"><section className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-4"><FaTimesCircle className="text-5xl text-red-500"/> <h2 className="text-xl font-semibold text-red-700">Error</h2> <p className="text-gray-600 text-center break-words px-4">{error}</p> {/* Botones Recargar/Inicio */} <div className="flex gap-4 mt-4"><button onClick={()=>window.location.reload()} className="...">Recargar</button><button onClick={handleLogout} className="...">Ir a Inicio</button></div></section></main> </div> ); }

    const totalMovimientoDetectado = Array.isArray(datos) ? datos.filter(d => d?.movimiento === '1').length : 0;
    const lastReading = Array.isArray(datos) && datos.length > 0 ? datos[datos.length - 1] : null;
    const lastMovement = lastReading?.movimiento === '1' ? 'Detectado' : 'Sin Movimiento';
    const lastTemperatureRaw = lastReading?.temperatura;
    const lastTemperature = (lastTemperatureRaw !== null && typeof lastTemperatureRaw !== 'undefined' && !isNaN(parseFloat(lastTemperatureRaw))) ? parseFloat(lastTemperatureRaw) : 'N/A';
    const recentHistory = Array.isArray(datos) ? datos.slice(-5).reverse() : [];
    const temperatureData = Array.isArray(datos) ? datos.map((item, index) => ({ time: item?.id || `Reg. ${datos.length - index}`, temp: (item && typeof item.temperatura !== 'undefined') ? parseFloat(item.temperatura) : NaN })).filter(item => !isNaN(item.temp)) : [];

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Header onLogout={handleLogout} />
            <main className="container mx-auto p-4 md:p-6 lg:p-8">
                <section className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg flex flex-col gap-8">
                     {datos.length === 0 && (<p className="text-center text-gray-500 py-10 border border-dashed rounded-lg">No hay datos registrados.</p>)}
                     {datos.length > 0 && (
                        <>
                            <div className="flex items-center gap-3 pb-4 border-b"><FaExclamationTriangle className="text-xl text-yellow-500" /> <h2 className="text-xl font-semibold">Movimiento: {totalMovimientoDetectado} veces</h2></div>
                            <div className="flex flex-wrap gap-x-6 gap-y-2"><div className="flex items-center gap-2"><FaRunning className={lastMovement === 'Detectado' ? 'text-green-500' : 'text-red-500'}/><span>Último Mov.: <span className="font-medium">{lastMovement}</span></span></div><div className="flex items-center gap-2"><FaTemperatureHigh className="text-blue-500"/><span>Última Temp.: <span className="font-medium">{typeof lastTemperature === 'number' ? `${lastTemperature.toFixed(1)}°C` : 'N/A'}</span></span></div></div>
                            <TempChart temperatureData={temperatureData} />
                            <GraficaAlimento />
                            <div className="border-t pt-6"><h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FaClipboardList /> Historial Reciente</h3>{recentHistory.length > 0 ? (<ul className="space-y-2">{recentHistory.map((item, index) => { const mov = item?.movimiento === '1' ? 'Detectado' : 'Sin Movimiento'; const tempNum = (item && typeof item.temperatura !== 'undefined') ? parseFloat(item.temperatura) : NaN; const tempTxt = !isNaN(tempNum) ? `${tempNum.toFixed(1)}°C` : 'N/A'; const key = item?.id ?? `hist-${index}`; return (<li key={key} className="p-3 bg-gray-50 rounded-md border flex justify-between items-center text-sm"><span className={`font-medium ${item?.movimiento === '1' ? 'text-green-600' : 'text-red-600'}`}>{item?.movimiento === '1' ? '● Mov. Detectado' : '○ Sin Mov.'}</span><span className="text-gray-600">🌡️ {tempTxt}</span></li>); })}</ul>) : (<p className="text-center text-gray-500">Sin historial reciente.</p>)}</div>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
};

export default CuyoDashboard;