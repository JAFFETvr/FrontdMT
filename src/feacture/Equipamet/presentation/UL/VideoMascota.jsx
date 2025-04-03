import React, { useEffect, useState, useRef } from "react"; // Import React
import DataSource from "../../data/DataSource/videapi"; // Ensure this path is correct
import Header from "./Header"; // Assuming Header component exists

// useWebSocketService custom hook (remains the same as the previous corrected version)
const useWebSocketService = () => {
    const [imageSrc, setImageSrc] = useState("");
    const [status, setStatus] = useState("Initializing...");
    const socketRef = useRef(null);

    useEffect(() => {
        const connectWebSocket = () => {
            setStatus("Conectando...");
             if (!DataSource.WEBSOCKET_URL) {
                 setStatus("Error: WebSocket URL no configurada ❌");
                 console.error("WebSocket URL is not configured in DataSource.");
                 return;
            }
            try {
                socketRef.current = new WebSocket(DataSource.WEBSOCKET_URL);
            } catch (error) {
                console.error("Failed to create WebSocket:", error);
                setStatus("Error al iniciar conexión ❌");
                return;
            }

            const currentSocket = socketRef.current;

            currentSocket.onopen = () => setStatus("Conectado ✅");

            currentSocket.onmessage = (event) => {
                 if (typeof event.data === 'string') {
                    if (event.data.length > 100 && !event.data.includes(' ') && event.data.match(/^[A-Za-z0-9+/=]+$/)) {
                         setImageSrc(`data:image/jpeg;base64,${event.data}`);
                     } else {
                         console.warn("Received non-image string data or invalid base64:", event.data);
                     }
                 } else if (event.data instanceof Blob) {
                     const reader = new FileReader();
                     reader.onload = () => {
                         if (typeof reader.result === 'string') {
                             const base64String = reader.result.split(',')[1];
                              if (base64String) {
                                setImageSrc(`data:image/jpeg;base64,${base64String}`);
                             } else {
                                 console.warn("Could not extract base64 string from Blob data URL");
                             }
                         } else {
                             console.warn("FileReader result was not a string:", reader.result);
                         }
                     };
                     reader.onerror = () => {
                         console.error("FileReader error reading Blob");
                     }
                     reader.readAsDataURL(event.data);
                 } else {
                     console.warn("Received unexpected data type:", typeof event.data);
                 }
            };

            currentSocket.onerror = (error) => {
                console.error("WebSocket Error:", error);
                setStatus("Error en la conexión ❌");
            }

            currentSocket.onclose = (event) => {
                console.log("WebSocket closed:", event.reason, event.code);
                 setImageSrc("");
                 if (socketRef.current === currentSocket) {
                    socketRef.current = null;
                 }

                 if (event.wasClean) {
                    setStatus("Desconectado.");
                } else {
                     if (![1000, 1001, 1005, 1006].includes(event.code)) {
                         setStatus("Desconectado. Reconectando en 5s...");
                         const timerId = setTimeout(connectWebSocket, 5000);
                         // In a real app, you might want to clear this timer in the cleanup
                     } else {
                         setStatus(`Conexión cerrada (${event.code}).`);
                     }
                }
            };
        };

        connectWebSocket();

        return () => {
             const currentSocket = socketRef.current;
             if (currentSocket) {
                 console.log("Cleaning up WebSocket connection.");
                 currentSocket.onopen = null;
                 currentSocket.onmessage = null;
                 currentSocket.onerror = null;
                 currentSocket.onclose = null;
                 if (currentSocket.readyState === WebSocket.OPEN) {
                     currentSocket.close(1000, "Component unmounting");
                 }
                 socketRef.current = null;
             }
             // Clear any potential reconnect timers here
        };
    }, []);

    return { imageSrc, status };
};


// --- VideoMascota Component ---
const VideoMascota = () => {
    const { imageSrc, status } = useWebSocketService();

    const getStatusColor = (currentStatus) => {
        if (currentStatus.includes("Conectado")) return "text-green-600";
        if (currentStatus.includes("Error") || currentStatus.includes("no configurada") || currentStatus.includes("cerrada")) return "text-red-600";
        if (currentStatus.includes("Desconectado")) return "text-orange-500";
        if (currentStatus.includes("Conectando") || currentStatus.includes("Initializing")) return "text-blue-600";
        return "text-gray-500";
    };

    return (
        <>
            <Header />
            <div className="flex justify-center p-4 sm:p-6">
                <div className="w-full max-w-2xl bg-white p-5 rounded-xl shadow-lg flex flex-col items-center">

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
                        <span role="img" aria-label="video camera" className="mr-2">📹</span>
                        Monitoreo del Hámster
                    </h2>

                    {/* Status Indicator */}
                    <div className={`text-center mb-3 text-sm font-medium ${getStatusColor(status)}`}>
                        Estado Conexión: {status}
                    </div>

                    {/* Video Container */}
                    <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 relative shadow-inner mb-4">
                        {imageSrc ? (
                            <img
                                src={imageSrc}
                                alt="Video en vivo del hábitat del hámster"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400 p-4">
                                { (status.includes("Conectando") || status.includes("Initializing")) && (
                                    <svg className="animate-spin h-6 w-6 text-gray-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) }
                                <span className="text-center text-sm">
                                    {status.includes("Error") || status.includes("Desconectado") || status.includes("cerrada")
                                     ? "Señal de video no disponible"
                                     : "Cargando video..."}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* --- General Info & Actions Section --- */}
                    <div className="w-full border-t border-gray-200 pt-4 mt-2 text-sm text-gray-700 flex flex-col items-center space-y-3"> {/* Centered items and added space */}

                        {/* General Hamster Facts/Reminders */}
                        <div className="text-center space-y-2"> {/* Group related text */}
                            <p className="text-xs text-gray-500 italic">
                                <span role="img" aria-label="moon" className="mr-1">🌜</span>
                                Recuerda: Los hámsters son nocturnos, ¡quizás esté durmiendo!
                            </p>
                            <p className="text-xs text-gray-500 italic">
                                <span role="img" aria-label="seedling" className="mr-1">🌱</span>
                                Les encanta explorar y necesitan espacio para roer y esconderse.
                            </p>
                        </div>

                         {/* Optional: Placeholder for Action Buttons */}
                         <div className="flex justify-center space-x-3 pt-2">
                             
                             <button
                                type="button"
                                onClick={() => alert('Función "Ver Guía" no implementada aún.')} // Placeholder action
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-md shadow-sm transition duration-150 ease-in-out"
                                title="Abrir guía de cuidados para hámsters" // Tooltip
                             >
                                <span role="img" aria-label="book" className="mr-1">📖</span> {/* Emoji Icon */}
                                Guía
                             </button>
                         </div>

                    </div>
                    {/* --- End General Info & Actions Section --- */}

                </div>
            </div>
        </>
    );
};

export default VideoMascota;