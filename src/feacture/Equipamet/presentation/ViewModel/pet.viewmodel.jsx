import { useState, useEffect, useCallback, useRef } from 'react';

const MAX_HISTORY_LENGTH = 100; // Máximo de registros en memoria
const MAX_CHART_POINTS = 30;   // Máximo de puntos en la gráfica
const FETCH_INTERVAL_MS = 5000; // Intervalo de actualización (5 segundos)
const API_URL = 'http://174.129.168.168:8080/datos'; // URL de tu API
const TOKEN_KEY = "jwtToken"; // Clave del token en localStorage

// Helper para obtener el token
const getToken = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    // console.log("getToken called. Token found:", token ? 'Yes' : 'No');
    return token;
};

export const usePetViewModel = () => {
    const [datos, setDatos] = useState([]); // Historial completo procesado
    const [temperatureData, setTemperatureData] = useState([]); // Datos para gráfica
    const [loading, setLoading] = useState(true); // Estado inicial de carga
    const [error, setError] = useState(null); // Mensaje de error
    const intervalId = useRef(null); // Referencia al ID del intervalo
    const initialFetchDone = useRef(false); // Para controlar el estado 'loading'

    // --- Procesamiento de Datos (VERSIÓN CORREGIDA) ---
    const processFetchedData = useCallback((rawData) => {
        console.log("processFetchedData received:", rawData); // Log: Datos crudos recibidos

        // Verificar si es un array
        if (!Array.isArray(rawData)) {
            console.error("Error Crítico: La respuesta de la API NO es un array. Es:", typeof rawData, rawData);
            setError("Error: Formato de datos inesperado del servidor (no es un array).");
            setDatos([]); // Limpiar datos si el formato es inválido
            setTemperatureData([]);
            return; // Salir si no es array
        }

        // Ordenar por ID ascendente (asume que IDs mayores son más recientes)
        const sortedData = [...rawData].sort((a, b) => (a.id || 0) - (b.id || 0));

        // Mapear los datos crudos a un formato consistente para la UI
        const processedDatos = sortedData
            .slice(-MAX_HISTORY_LENGTH) // Tomar solo los últimos N registros
            .map((item, index) => {
                const rawTemp = item.temperatura;
                const rawMov = item.movimiento;
                const rawDist = item.distancia;
                const rawId = item.id;

                // Procesar Temperatura: Convertir a número o null si no es válido
                let temperature = parseFloat(rawTemp);
                if (isNaN(temperature)) { // Si es 'llego' o cualquier cosa no numérica
                    // console.warn(`Temperatura inválida (ID: ${rawId}). Recibido: '${rawTemp}'. Se usará null.`);
                    temperature = null;
                }

                // Procesar Movimiento: Normalizar a 'Detectado' o 'Sin Movimiento'
                let movimiento = 'Sin Movimiento'; // Valor por defecto
                // Busca 'detect' (case-insensitive) en el string de movimiento
                if (typeof rawMov === 'string' && rawMov.toLowerCase().includes('detect')) {
                    movimiento = 'Detectado';
                }

                // Procesar Distancia: Convertir a número o null
                let distancia = null;
                if (rawDist !== undefined && rawDist !== null) {
                    const parsedDist = parseFloat(rawDist); // parseFloat ignora 'm' al final
                    if (!isNaN(parsedDist)) {
                        distancia = parsedDist;
                    }
                }

                // Devolver el objeto procesado
                return {
                    id: rawId || `fallback-${index}-${Date.now()}`, // ID único para key de React
                    temperatura: temperature, // number | null
                    movimiento: movimiento,   // 'Detectado' | 'Sin Movimiento'
                    distancia: distancia,     // number | null
                };
            });

        console.log("Datos procesados (CORREGIDO):", processedDatos); // Log: Datos después de procesar
        setDatos(processedDatos); // Actualizar estado con el historial completo

        // Preparar datos específicamente para la gráfica de temperatura
        const chartData = processedDatos
            .slice(-MAX_CHART_POINTS) // Tomar solo los últimos N para la gráfica
            .map((item) => ({
                time: item.id ? `ID ${item.id}` : `Pt. ?`, // Etiqueta para eje X
                temp: item.temperatura, // Valor para eje Y (puede ser null)
            }));

        console.log("Datos para la gráfica (CORREGIDO):", chartData); // Log: Datos formateados para Recharts
        setTemperatureData(chartData); // Actualizar estado para la gráfica

    }, []); // useCallback: si usara setError u otros, se añadirían como dependencias

    // --- Función para Obtener Datos de la API ---
    const fetchData = useCallback(async () => {
        // No mostrar el log de "Intentando obtener" si ya hay un error persistente de auth
        const shouldLogFetchAttempt = !error || (!error.includes("autenticado") && !error.includes("401") && !error.includes("403"));
        if (shouldLogFetchAttempt) {
             console.log("Intentando obtener datos desde:", API_URL);
        }

        // 1. Verificar Token
        const token = getToken();
        if (!token) {
            console.error("Fetch cancelado: No se encontró token de autenticación.");
            setError("No estás autenticado. Por favor, inicia sesión.");
            setLoading(false);
            initialFetchDone.current = true;
            if (intervalId.current) { // Detener intervalo si existe
                clearInterval(intervalId.current);
                intervalId.current = null;
                console.log("Intervalo detenido por falta de token.");
            }
            return; // Salir
        }

        // 2. Preparar y Ejecutar Fetch
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const response = await fetch(API_URL, { method: 'GET', headers });
            console.log(`Respuesta recibida de ${API_URL}: Status ${response.status}`); // Log: Status HTTP

            // 3. Manejar Respuesta HTTP (Errores)
            if (!response.ok) {
                let errorMsg = `Error HTTP ${response.status}: ${response.statusText}`;
                if (response.status === 401 || response.status === 403) {
                    errorMsg = response.status === 401
                        ? "Acceso no autorizado (401). Token inválido o sesión expirada. Inicia sesión de nuevo."
                        : "Acceso prohibido (403). No tienes permisos.";
                    if (intervalId.current) { // Detener intervalo en errores de auth
                        clearInterval(intervalId.current);
                        intervalId.current = null;
                        console.log(`Intervalo detenido por error ${response.status}.`);
                    }
                } else if (response.status === 404) {
                    errorMsg = `Error: Recurso no encontrado (404) en ${API_URL}. Verifica la URL.`;
                }
                // Intentar añadir detalles del cuerpo del error
                try {
                    const errorBody = await response.json();
                    errorMsg += ` - Detalles: ${JSON.stringify(errorBody)}`;
                } catch (e) { /* Ignorar si el cuerpo no es JSON */ }
                throw new Error(errorMsg); // Lanzar error para el catch
            }

            // 4. Procesar Respuesta Exitosa (status 2xx)
            const data = await response.json(); // Parsear JSON
            processFetchedData(data);     // Procesar los datos con la lógica corregida
            setError(null);               // Limpiar errores previos si la llamada fue exitosa

        } catch (err) {
            console.error("Error durante fetch o procesamiento:", err); // Log: Error detallado
             // Evitar sobrescribir errores específicos de auth si ya estaban
            if (!error || (!error.includes("401") && !error.includes("403"))) {
                 if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
                    setError(`Error de red: No se pudo conectar a la API. Verifica conexión, URL y CORS.`);
                 } else {
                    setError(`Error al cargar datos: ${err.message}`);
                 }
            }
        } finally {
            // Marcar que el primer intento ya se hizo (o uno posterior)
            initialFetchDone.current = true;
             // Quitar el estado 'loading' solo después del primer intento
             if (loading) {
                 setLoading(false);
             }
        }
    }, [processFetchedData, error, loading]); // Dependencias del useCallback

    // --- Efecto para Fetch Inicial e Intervalo ---
    useEffect(() => {
        // Limpiar intervalo anterior al (re)ejecutar el efecto
        if (intervalId.current) {
            clearInterval(intervalId.current);
            intervalId.current = null;
        }

        fetchData(); // Ejecutar fetch inmediatamente

        // Configurar intervalo SOLO si no hay error de auth y no está ya activo
        const noAuthError = !error || (!error.includes("autenticado") && !error.includes("401") && !error.includes("403"));
        if (noAuthError) {
             // Solo iniciar si no está ya corriendo (por si acaso)
             if (!intervalId.current) {
                intervalId.current = setInterval(fetchData, FETCH_INTERVAL_MS);
                console.log(`Intervalo iniciado (${FETCH_INTERVAL_MS}ms). ID: ${intervalId.current}`);
             }
        } else {
            console.log("Intervalo NO iniciado debido a error de autenticación/autorización.");
        }

        // Función de limpieza: se ejecuta al desmontar o antes de re-ejecutar
        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
                console.log(`Intervalo detenido (limpieza). ID: ${intervalId.current}`);
                intervalId.current = null;
            }
        };
    }, [fetchData, error]); // fetchData y error como dependencias

    // --- Función de Cálculo (ejemplo) ---
    const calcularMovimientoDetectado = useCallback(() => {
        // Asegurarse de que 'datos' es un array
        return Array.isArray(datos) ? datos.filter(d => d.movimiento === 'Detectado').length : 0;
    }, [datos]);

    // --- Valores Devueltos por el Hook ---
    return {
        datos,              // Array de historial procesado
        temperatureData,    // Array para la gráfica
        // Muestra loading solo la primera vez, hasta que initialFetchDone es true
        loading: loading && !initialFetchDone.current,
        error,              // Mensaje de error
        calcularMovimientoDetectado,
    };
};


// --- Función separada fetchPetStats (Opcional, si la usas en otro lado) ---
// Recuerda que también necesita autenticación si tu API la requiere.
export const fetchPetStats = async () => {
    console.warn("Llamando a fetchPetStats (función separada). Requiere manejo de token y errores.");
    const token = getToken();
    if (!token) {
        console.error("fetchPetStats: No hay token.");
        return []; // O lanzar error
    }
    try {
        const response = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) {
            throw new Error(`Error ${response.status} en fetchPetStats`);
        }
        const data = await response.json();
        return data; // Devuelve datos crudos
    } catch (error) {
        console.error("Error en fetchPetStats:", error);
        return [];
    }
};