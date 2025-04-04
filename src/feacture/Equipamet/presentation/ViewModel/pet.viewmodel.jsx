// viewModel/usePetViewModel.js
import { useState, useEffect } from "react";

// Define the WebSocket URL (using ws:// for non-secure connection)
const WS_URL = "ws://174.129.168.168:8080/ws";

export const usePetViewModel = () => {
    // State to hold the raw data array received from the backend
    const [rawData, setRawData] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Attempting to connect to WebSocket:", WS_URL);
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            console.log("WebSocket Connected");
            setIsConnected(true);
            setError(null); // Clear any previous error on successful connection
        };

        ws.onmessage = (event) => {
            try {
                // Assuming the backend sends the full array of data objects
                // similar to the '/datos' endpoint in JSON format.
                // Adjust parsing if the format is different!
                const messageData = JSON.parse(event.data);

                // --- Data Structure Assumption ---
                // We assume messageData is an array like:
                // [ { id: 1, movimiento: 'Detectado', temperatura: 22, timestamp: '...' }, ... ]
                // Or maybe just the latest reading:
                // { id: 5, movimiento: 'Detectado', temperatura: 23, timestamp: '...' }
                // --- Adjust Logic Below Based on Actual WS Message Format ---

                console.log("WebSocket message received:", messageData);

                // Example: If WS sends the *entire* updated list
                if (Array.isArray(messageData)) {
                    setRawData(messageData);
                }
                // Example: If WS sends only the *latest* single reading
                else if (typeof messageData === 'object' && messageData !== null && messageData.id) {
                     // Add the new reading to the existing list (keeping maybe last 100 records)
                     setRawData(prevData => [...prevData.slice(-99), messageData]);
                }
                 // Example: If WS sends a custom event structure
                 // else if (messageData.type === 'sensorUpdate') {
                 //    handleSensorUpdate(messageData.payload); // Implement this function
                 // }

                // If the WS sends something else, you'll need to adapt the logic here.

            } catch (e) {
                console.error("Failed to parse WebSocket message or update state:", e);
                console.error("Received data:", event.data); // Log raw data on parse error
                // Optionally set an error state here
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
            // Optional: Implement reconnection logic here if desired
            // setError("WebSocket disconnected. Attempting to reconnect...");
        };

        // Cleanup function: Close the WebSocket connection when the component unmounts
        return () => {
            console.log("Closing WebSocket connection");
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };
    }, []); // Empty dependency array ensures this effect runs only once on mount

    // --- Derived State Calculations ---
    // Calculate derived values based on the latest rawData

    // 1. Calculate total movements detected
    const calcularMovimientoDetectado = () => {
        return rawData.filter(item => item.movimiento === 'Detectado').length;
    };

    // 2. Format data for the temperature chart
    // IMPORTANT: Assumes your data objects have a 'temperatura' field
    //            and potentially a 'timestamp' or similar field for the X-axis.
    //            If not, you'll need to adjust how 'time' is generated.
    const temperatureData = rawData.map((item, index) => ({
        // Use a timestamp from the data if available, otherwise use index or a simple label
        time: item.timestamp || `T${index + 1}`, // Adjust 'item.timestamp' if the field name is different
        temp: parseFloat(item.temperatura)       // Ensure temperature is a number
    }));


    // Return the raw data and derived values/functions needed by the component
    return {
        datos: rawData, // The raw array
        temperatureData, // Formatted for TempChart
        calcularMovimientoDetectado, // Function to get count
        isConnected, // Connection status
        error // Any connection/parsing errors
    };
};