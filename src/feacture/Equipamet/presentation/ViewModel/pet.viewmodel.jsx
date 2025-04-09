import { useState, useEffect } from "react";

const WS_URL = "ws://174.129.168.168:8080/ws";

export const usePetViewModel = () => {
    const [rawData, setRawData] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Attempting to connect to WebSocket:", WS_URL);
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            console.log("WebSocket Connected");
            setIsConnected(true);
            setError(null); 
        };

        ws.onmessage = (event) => {
            try {
               
                const messageData = JSON.parse(event.data);


                console.log("WebSocket message received:", messageData);

                if (Array.isArray(messageData)) {
                    setRawData(messageData);
                }
                else if (typeof messageData === 'object' && messageData !== null && messageData.id) {
                     setRawData(prevData => [...prevData.slice(-99), messageData]);
                }
               

            } catch (e) {
                console.error("Failed to parse WebSocket message or update state:", e);
                console.error("Received data:", event.data); 
            }
        };

        ws.onerror = (event) => {
            console.error("WebSocket Error:", event);
            setError("WebSocket connection error. Check console for details.");
            setIsConnected(false);
        };

        ws.onclose = (event) => {
            console.log("WebSocket Disconnected:", event.code, event.reason);
            setIsConnected(false);
         
        };

        return () => {
            console.log("Closing WebSocket connection");
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };
    }, []); 

  
    const calcularMovimientoDetectado = () => {
        return rawData.filter(item => item.movimiento === 'Detectado').length;
    };

  
    const temperatureData = rawData.map((item, index) => ({
        time: item.timestamp || `T${index + 1}`, 
        temp: parseFloat(item.temperatura)      
    }));


    return {
        datos: rawData, 
        temperatureData, 
        calcularMovimientoDetectado, 
        isConnected, 
        error 
    };
};