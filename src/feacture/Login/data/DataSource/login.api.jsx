// src/data/DataSource/login.api.js

const API_URL = "http://174.129.168.168:8080";
// --- ¡ASEGÚRATE QUE ESTA CLAVE SEA LA CORRECTA Y CONSISTENTE! ---
// Esta clave DEBE ser la misma que usa fetchPetStats
export const TOKEN_KEY = 'authToken';
// ---
export const ROLE_STORAGE_KEY = "role"; // También exportamos esta si se usa en otros lados

// --- Funciones Auxiliares para Token y Rol ---
// Guardan y leen strings directamente de localStorage
export const saveToken = (tokenString) => {
    if (tokenString && typeof tokenString === 'string') {
        localStorage.setItem(TOKEN_KEY, tokenString);
        console.log(`>>> login.api: Token (string) guardado en localStorage ('${TOKEN_KEY}')`);
    } else {
        console.warn(">>> login.api: saveToken - Intento de guardar token inválido o no string:", tokenString);
    }
};

export const getToken = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    // console.log(`>>> login.api: getToken - Leyendo token de localStorage ('${TOKEN_KEY}'):`, token ? 'Encontrado' : 'No encontrado');
    return token;
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    console.log(`>>> login.api: Token eliminado de localStorage ('${TOKEN_KEY}')`);
};

export const saveRole = (role) => {
    if (role && typeof role === 'string') {
        localStorage.setItem(ROLE_STORAGE_KEY, role);
        console.log(`>>> login.api: Rol guardado en localStorage ('${ROLE_STORAGE_KEY}'): ${role}`);
    } else {
         console.warn(">>> login.api: saveRole - Intento de guardar rol inválido:", role);
    }
};

export const getRole = () => {
    const role = localStorage.getItem(ROLE_STORAGE_KEY);
    // console.log(`>>> login.api: getRole - Leyendo rol de localStorage ('${ROLE_STORAGE_KEY}'):`, role);
    return role;
};

export const removeRole = () => {
    localStorage.removeItem(ROLE_STORAGE_KEY);
    console.log(`>>> login.api: Rol eliminado de localStorage ('${ROLE_STORAGE_KEY}')`);
};


// --- Función Login (CORREGIDA - Espera JSON como respuesta) ---
/**
 * Realiza la petición de login a la API.
 * Asume que la API responde con JSON: { "token": "jwt_string", ... } en caso de éxito.
 * @param {object} credentials - Objeto con { username: "...", password: "..." }.
 * @returns {Promise<object>} Una promesa que resuelve con el objeto JSON completo de la respuesta si el login es exitoso.
 * @throws {Error} Si el login falla, la respuesta no es OK, o no se puede parsear como JSON.
 */
export const loginUser = async (credentials) => {
    const loginEndpoint = `${API_URL}/auth/login`;
    console.log(`>>> login.api: Intentando login (esperando JSON) en ${loginEndpoint} para: ${credentials.username}`);
    try {
        const response = await fetch(loginEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                 // Es buena práctica indicar que aceptas JSON
                "Accept": "application/json"
            },
            body: JSON.stringify(credentials)
        });

        // Intentamos parsear como JSON incluso si hay error, podría contener un mensaje útil
        let responseData;
        try {
            responseData = await response.json();
             console.log(`>>> login.api: Respuesta recibida - Status: ${response.status}. Body JSON parseado.`);
        } catch (e) {
             // Si falla el parseo JSON, el body podría ser texto u otra cosa
            const responseText = await response.text(); // Intentamos leer como texto
            console.error(`>>> login.api: Login fallido - No se pudo parsear JSON. Status: ${response.status}, Body(texto): ${responseText}`);
            // Lanzamos error con el texto si lo hay, o un error genérico
            throw new Error(`Error del servidor (${response.status}): ${responseText || 'Respuesta no válida'}`);
        }

        // Verificamos si la respuesta fue exitosa (status 2xx) DESPUÉS de intentar parsear
        if (!response.ok) {
            // Usamos el mensaje de error del JSON si existe, si no, uno genérico
            const errorMessage = responseData?.message || responseData?.error || `Error de inicio de sesión (${response.status})`;
            console.error(`>>> login.api: Login fallido - Status ${response.status}. Error: ${errorMessage}`);
            throw new Error(errorMessage);
        }

        // Validación: Asegurarse que el JSON de respuesta contiene un token
        if (!responseData || typeof responseData.token !== 'string' || responseData.token.split('.').length !== 3) {
             console.error(">>> login.api: Login exitoso (status OK) pero la respuesta JSON no contiene un token JWT válido:", responseData);
            throw new Error("Respuesta de login inválida o inesperada del servidor (falta token).");
        }

        console.log(">>> login.api: Login exitoso. Objeto JSON con token recibido.");
        return responseData; // Devuelve el OBJETO JSON COMPLETO { token: "...", ... }

    } catch (error) {
        console.error(">>> login.api: Error GRAL durante la llamada a loginUser:", error);
        // Re-lanza el error para que el ViewModel lo capture
        if (error instanceof Error) { throw error; }
        else { throw new Error(String(error)); }
    }
};

// --- Función fetchPetStats (SIN CAMBIOS - Usa la misma TOKEN_KEY) ---
// Asegúrate que esta función esté en el mismo archivo o importe getToken de aquí
// si decides separar las APIs. Los logs ya estaban bien.
export const fetchPetStats = async () => {
    const datosEndpoint = `${API_URL}/datos`;
    console.log(`>>> Iniciando fetchPetStats para ${datosEndpoint}`);
    let token = null;

    try {
        // --- PASO 1: RECUPERAR TOKEN (USA LA MISMA TOKEN_KEY) ---
        token = getToken(); // Debe leer la clave 'authToken'

        console.log(`>>> DEBUG fetchPetStats: Valor de token recuperado de localStorage con clave ('${TOKEN_KEY}'):`, token ? token.substring(0, 15) + '...' : 'NULL/UNDEFINED');

        if (!token) {
            console.error(">>> ERROR fetchPetStats: getToken() devolvió null o undefined. No se encontró token.");
            throw new Error(`No autenticado: Token no encontrado en localStorage (clave: ${TOKEN_KEY}).`);
        }

        // --- PASO 2: CONSTRUIR OPCIONES ---
        const fetchOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Envía el STRING del token
            },
        };
        console.log(">>> DEBUG fetchPetStats: Headers que se enviarán:", JSON.stringify(fetchOptions.headers));

        // --- PASO 3: REALIZAR FETCH ---
        console.log(`>>> DEBUG fetchPetStats: Ejecutando fetch a ${datosEndpoint}`);
        const response = await fetch(datosEndpoint, fetchOptions);
        console.log(`>>> DEBUG fetchPetStats: Respuesta recibida - Status: ${response.status}`);

        // --- PASO 4: MANEJAR RESPUESTA ---
        if (!response.ok) {
            let errorBody = `Error ${response.status}: ${response.statusText}`;
            let errorJson = null;
            try { errorJson = await response.json(); errorBody += ` - ${JSON.stringify(errorJson?.error || errorJson?.message || errorJson)}`; }
            catch (e) { try { const textError = await response.text(); if(textError) errorBody += ` - ${textError}`; } catch (e2) {} }

            if (response.status === 401 || response.status === 403) {
                 console.warn(`>>> WARN fetchPetStats: Token rechazado por el servidor (${response.status}). Respuesta: ${errorBody}`);
                 // Incluye el mensaje específico del backend si existe ("Token inválido")
                 const serverMessage = errorJson?.message || errorJson?.error || response.statusText;
                 throw new Error(`No autenticado: Sesión inválida/expirada. Token usado: ${token ? token.substring(0, 15) + '...' : 'NINGUNO'}. (${response.status} - ${serverMessage})`);
            }
            console.error(`>>> ERROR fetchPetStats: Error en la respuesta: ${errorBody}`);
            throw new Error(`Error al obtener datos (${response.status}): ${errorBody}`);
        }

        const data = await response.json();
        console.log(">>> SUCCESS fetchPetStats: Datos recibidos.");
        return Array.isArray(data) ? data : []; // O devuelve data directamente si esperas un objeto

    } catch (error) {
        console.error(">>> ERROR fetchPetStats: Error final atrapado:", error.message);
        throw error; // Re-lanza para que CuyoDashboard lo maneje
    }
};