import React, { useEffect, useState, useRef } from "react";
import DataSource from "../../data/DataSource/videapi";
import Header from "./Header";
import { FaCamera, FaMoon, FaHome, FaBookOpen, FaSpinner } from "react-icons/fa";
import { MdErrorOutline, MdSignalWifiOff } from "react-icons/md";

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
                         console.warn("Received non-image string data or invalid base64:", event.data.substring(0, 50) + '...');
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
                 const isCurrentSocket = socketRef.current === currentSocket; // Check if this is the current socket before nulling

                 let closeStatus = "Desconectado.";
                 if (!event.wasClean) {
                    const nonRetryCodes = [1000, 1001, 1005, 1006, 1008, 1011]; // Added more standard codes
                    if (!nonRetryCodes.includes(event.code)) {
                        closeStatus = `Conexión perdida (${event.code}). Reconectando en 5s...`;
                         if (isCurrentSocket) {
                             const timerId = setTimeout(connectWebSocket, 5000);
                            
                         }
                    } else {
                        closeStatus = `Conexión cerrada (${event.code} - ${event.reason || 'Sin razón específica'}).`;
                    }
                 }
                 setStatus(closeStatus);

                 if (isCurrentSocket) {
                    socketRef.current = null;
                 }
            };
        };

        connectWebSocket();

        return () => {
             const currentSocket = socketRef.current;
             if (currentSocket) {
                 console.log("Cleaning up WebSocket connection on unmount.");
                 currentSocket.onopen = null;
                 currentSocket.onmessage = null;
                 currentSocket.onerror = null;
                 currentSocket.onclose = null; 
                 if (currentSocket.readyState === WebSocket.OPEN || currentSocket.readyState === WebSocket.CONNECTING) {
                     currentSocket.close(1000, "Component unmounting");
                 }
                 socketRef.current = null; 
             }
             
        };
    }, []); 

    return { imageSrc, status };
};


const VideoMascota = () => {
    const { imageSrc, status } = useWebSocketService();

    const getStatusColor = (currentStatus) => {
        if (currentStatus.includes("Conectado")) return "text-green-600";
        if (currentStatus.includes("Error") || currentStatus.includes("no configurada") || currentStatus.includes("cerrada") || currentStatus.includes("perdida")) return "text-red-600";
        if (currentStatus.includes("Desconectado") || currentStatus.includes("Reconectando")) return "text-orange-500";
        if (currentStatus.includes("Conectando") || currentStatus.includes("Initializing")) return "text-blue-600";
        return "text-gray-500";
    };

    const renderPlaceholderIcon = () => {
        if (status.includes("Error") || status.includes("cerrada") || status.includes("no configurada") || status.includes("perdida")) {
            return <MdErrorOutline className="h-8 w-8 text-red-400 mb-2" />;
        }
        if (status.includes("Desconectado") || status.includes("Reconectando")) {
            return <MdSignalWifiOff className="h-8 w-8 text-orange-400 mb-2" />;
        }
         if (status.includes("Conectando") || status.includes("Initializing")) {
            return <FaSpinner className="animate-spin h-7 w-7 text-blue-500 mb-2" />;
        }
        return null;
    };

    const pdfPath = "/pdfs/HAMSTER.pdf"; 
    const pdfFilename = "CuidadoDeLHamster.pdf"; 
    return (
        <>
            <Header />
            <div className="flex justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-2xl bg-white p-5 md:p-6 rounded-xl shadow-xl border border-gray-300 flex flex-col items-center">

                    <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
                        <FaCamera className="text-gray-700" />
                        Monitoreo del Hámster
                    </h2>

                    <div className={`text-center mb-4 text-sm font-medium ${getStatusColor(status)}`}>
                        Estado Conexión: {status}
                    </div>

                    <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden border border-gray-400 relative shadow-inner mb-5">
                        {imageSrc ? (
                            <img
                                src={imageSrc}
                                alt="Video en vivo del hábitat del hámster"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center text-gray-500 p-4">
                                {renderPlaceholderIcon()}
                                <span className="text-center text-sm">
                                    {status.includes("Error") || status.includes("Desconectado") || status.includes("cerrada") || status.includes("no configurada") || status.includes("perdida")
                                     ? "Señal de video no disponible"
                                     : "Cargando video..."}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="w-full border-t border-gray-300 pt-5 mt-4 text-sm text-gray-700 flex flex-col items-center space-y-4">
                        <div className="text-center space-y-2">
                            <p className="text-xs text-gray-600 italic flex items-center justify-center gap-1.5">
                                <FaMoon className="text-gray-500" />
                                Recuerda: Los hámsters son nocturnos, ¡quizás esté durmiendo!
                            </p>
                            <p className="text-xs text-gray-600 italic flex items-center justify-center gap-1.5">
                                <FaHome className="text-gray-500" />
                                Les encanta explorar y necesitan espacio para roer y esconderse.
                            </p>
                        </div>

                        <div className="flex justify-center space-x-3 pt-2">
                            <a 
                                href={pdfPath} 
                                download={pdfFilename}
                                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center gap-1.5" // Mismas clases de estilo
                                title="Descargar guía de cuidados para hámsters" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                             >
                                <FaBookOpen />
                                Guía
                             </a>
                         </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default VideoMascota;