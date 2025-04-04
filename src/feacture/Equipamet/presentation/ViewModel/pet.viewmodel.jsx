import { useState, useEffect, useCallback, useRef } from 'react';

const MAX_HISTORY_LENGTH = 100;
const MAX_CHART_POINTS = 30;
const FETCH_INTERVAL_MS = 5000;
const API_URL = 'http://174.129.168.168:8080/datos';
const TOKEN_KEY = "jwtToken"; // Key used to store the token in localStorage

// Helper function (optional, but good practice) to get the token
const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const usePetViewModel = () => {
    const [datos, setDatos] = useState([]);
    const [temperatureData, setTemperatureData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const intervalId = useRef(null);

    const processFetchedData = useCallback((rawData) => {
        // ... (keep the existing processFetchedData function exactly as it was)
        if (!Array.isArray(rawData)) {
            console.error("Fetched data is not an array:", rawData);
             // Handle as a single record if applicable, or set an error
             // If it's always expected to be an array, set an error:
             // setError("Formato de datos inesperado del servidor.");
             // If it *could* be a single object representing the latest:
             // rawData = [rawData]; // Treat as an array with one item
             // For now, we assume it SHOULD be an array based on typical API design
             setError("Formato de datos inesperado del servidor."); // Set error if not array
             return; // Or handle appropriately
        }

        const sortedData = [...rawData].sort((a, b) => (a.id || 0) - (b.id || 0));

        const processedDatos = sortedData.slice(-MAX_HISTORY_LENGTH).map(item => {
            const temperature = parseFloat(item.temperatura);
            const movimiento = item.movimiento === '1' ? 'Detectado' : 'Sin Movimiento';
            const distancia = item.distancia !== undefined && item.distancia !== '-1.0' ? parseFloat(item.distancia) : null;

            return {
                ...item,
                temperatura: isNaN(temperature) ? null : temperature,
                movimiento: movimiento,
                distancia: isNaN(distancia) ? null : distancia,
            };
        }).filter(item => item.temperatura !== null);

        setDatos(processedDatos);

        const chartData = processedDatos
            .slice(-MAX_CHART_POINTS)
            .map((item, index) => {
                 const timeLabel = `ID ${item.id}` || `Data ${index + 1}`;
                 return {
                    time: timeLabel,
                    temp: item.temperatura,
                };
            });
        setTemperatureData(chartData);
    }, []);


    const fetchData = useCallback(async () => {
        console.log("Fetching data from:", API_URL);
        const token = getToken(); // Get the token from localStorage

        // --- Check if token exists ---
        if (!token) {
            console.warn("No authentication token found. Fetch request cancelled.");
            // Set error state appropriately - user needs to login
            setError("No estás autenticado. Por favor, inicia sesión.");
            setLoading(false); // Stop loading indicator
            // Stop polling if not authenticated
            if (intervalId.current) {
                clearInterval(intervalId.current);
            }
            return; // Stop the fetch attempt
        }

        // --- Prepare Headers ---
        const headers = {
            // You might need 'Content-Type' even for GET if the API expects it, but often not needed
            // 'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Add the Authorization header
        };

        try {
            // --- Perform Fetch with Headers ---
            const response = await fetch(API_URL, {
                method: 'GET', // Explicitly state method
                headers: headers // Pass the headers object
            });

            // --- Handle HTTP Errors (including 401 Unauthorized) ---
            if (!response.ok) {
                 let errorMsg = `HTTP error! status: ${response.status}`;
                 if (response.status === 401) {
                    errorMsg = "Acceso no autorizado (401). Tu sesión puede haber expirado o el token es inválido. Por favor, inicia sesión de nuevo.";
                    // Optional: Clear the potentially invalid token? Decide based on your app structure.
                    // localStorage.removeItem(TOKEN_KEY);
                    // Stop further polling attempts if unauthorized
                     if (intervalId.current) {
                        clearInterval(intervalId.current);
                        console.log("Polling stopped due to authorization error.");
                    }
                 } else if (response.status === 403) {
                     errorMsg = "Acceso prohibido (403). No tienes permiso para ver estos datos.";
                 }
                 // Try to get more specific error message from response body if available
                 try {
                     const errorData = await response.json();
                     if (errorData && errorData.message) {
                         errorMsg += ` - ${errorData.message}`;
                     }
                 } catch (jsonError) {
                     // Ignore if response body is not JSON or empty
                 }
                 throw new Error(errorMsg);
            }

            // --- Process Successful Response ---
            const data = await response.json();
            processFetchedData(data);
            setError(null); // Clear error on successful fetch

        } catch (err) {
            console.error("Failed to fetch data:", err);
            // Avoid overwriting specific 401/403 messages if they were set
            if (!error || !error.includes("401") && !error.includes("403")) {
               setError(`No se pudo cargar los datos: ${err.message}. Verifica la conexión, la URL y tu estado de autenticación.`);
            }
            // Keep loading false even on error
            setLoading(false); // Ensure loading is set to false on error too
        } finally {
            // Set loading to false ONLY after the first attempt, handled within try/catch/token check now.
             // setLoading(false); // --> Removed from here, handled earlier/in error cases
        }
    }, [processFetchedData, error]); // Added 'error' dependency to potentially avoid loops if error state causes re-renders


    // --- Effect for Initial Fetch and Interval ---
    useEffect(() => {
        // Clear any existing interval before starting
        if (intervalId.current) {
            clearInterval(intervalId.current);
        }

        // Fetch immediately on component mount (if token exists)
        fetchData();

        // Set up interval polling ONLY IF not already stopped by error/no token
        // Check error state before setting interval
         if (!error || (!error.includes("autenticado") && !error.includes("401"))) {
             intervalId.current = setInterval(fetchData, FETCH_INTERVAL_MS);
             console.log("Data fetching interval started.");
         } else {
             console.log("Data fetching interval NOT started due to existing error/auth issue.");
         }


        // Cleanup function: clear interval when component unmounts
        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
                console.log("Cleared data fetching interval on unmount.");
            }
        };
    }, [fetchData, error]); // Add 'error' to dependency array to potentially restart interval if error clears


    // --- Calculation Function ---
    const calcularMovimientoDetectado = useCallback(() => {
        return datos.filter(d => d.movimiento === 'Detectado').length;
    }, [datos]);

    // --- Return values ---
    return {
        datos,
        temperatureData,
        loading,
        error,
        calcularMovimientoDetectado,
    };
};