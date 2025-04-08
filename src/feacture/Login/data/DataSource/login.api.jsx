// src/services/api.js (o donde esté tu lógica de API)

const API_URL = "http://174.129.168.168:8080";
const TOKEN_KEY = 'authToken'; // Clave consistente para localStorage

// --- Funciones Auxiliares para Manejar el Token (sin cambios) ---
export const saveToken = (token) => {
    if (token) { localStorage.setItem(TOKEN_KEY, token); console.log(`Token guardado (${TOKEN_KEY})`); }
    else { console.warn("saveToken: Intento de guardar token nulo."); }
};
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => { localStorage.removeItem(TOKEN_KEY); console.log(`Token eliminado (${TOKEN_KEY})`); };

// --- Función de Login (CORREGIDA) ---
/**
 * Realiza la petición de login a la API.
 * @param {object} credentials - Objeto con { username: "...", password: "..." }.
 * @returns {Promise<string>} Una promesa que resuelve con el token JWT si el login es exitoso.
 * @throws {Error} Si el login falla o la respuesta no es OK.
 */
export const loginUser = async (credentials) => {
    const loginEndpoint = `${API_URL}/auth/login`;
    console.log(`Intentando login en ${loginEndpoint} para usuario: ${credentials.username}`);
    try {
        const response = await fetch(loginEndpoint, {
            method: "POST",
            headers: {
                // Importante: Incluso si la *respuesta* es texto plano,
                // usualmente envías JSON al endpoint de login.
                "Content-Type": "application/json",
                // Podrías añadir 'Accept': 'text/plain' si quieres ser explícito
                // sobre lo que esperas, pero no es estrictamente necesario.
            },
            body: JSON.stringify(credentials),
        });

        // Lee la respuesta como TEXTO plano primero.
        const responseText = await response.text();
        console.log(`loginUser: Respuesta recibida - Status: ${response.status}, Body (texto): ${responseText.substring(0, 100)}...`); // Loguea el inicio del texto

        // --- Verificar si la respuesta fue exitosa (status 2xx) ---
        if (!response.ok) {
            console.error(`Login fallido - Status: ${response.status}`);
            // Intenta parsear el texto como JSON *solo si falló*,
            // para obtener un mensaje de error más detallado del backend.
            let errorMessage = `Error de inicio de sesión (${response.status})`;
            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData?.message || errorData?.error || errorMessage;
            } catch (e) {
                // Si no era JSON, usa el texto plano como error si tiene contenido.
                if (responseText) {
                    errorMessage = responseText;
                }
            }
            throw new Error(errorMessage);
        }

        // --- La respuesta fue OK (2xx) ---
        // El token debería ser el texto de la respuesta.
        const token = responseText;

        // Validación básica: el token no debe estar vacío y debería parecer un JWT.
        if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
            console.error("Login exitoso (status OK) pero la respuesta no parece un token JWT válido:", token);
            throw new Error("Respuesta de login inválida o inesperada del servidor.");
        }

        console.log("Login exitoso. Token recibido (como texto plano).");
        return token; // Devuelve el token como string

    } catch (error) {
        console.error("Error durante la llamada a loginUser:", error);
        if (error instanceof Error) { throw error; }
        else { throw new Error(String(error)); }
    }
};

// --- Función fetchPetStats (sin cambios, ya usa getToken) ---
export const fetchPetStats = async () => {
    console.log("Intentando obtener datos de /datos...");
    try {
        const token = getToken();
        if (!token) {
             console.error("fetchPetStats: No se encontró token.");
             throw new Error("No autenticado: Inicia sesión para ver los datos.");
        }
        const fetchOptions = { /* ... headers con Bearer token ... */
             method: 'GET',
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
             },
         };
        const response = await fetch(`${API_URL}/datos`, fetchOptions);
        console.log(`fetchPetStats: Respuesta - Status: ${response.status}`);
        if (!response.ok) {
            let errorBody = `Error ${response.status}: ${response.statusText}`;
            try {
                 const errorData = await response.json(); // Aquí sí esperamos JSON para errores
                 errorBody += ` - ${JSON.stringify(errorData.error || errorData.message || errorData)}`;
                 if (response.status === 401 || response.status === 403) { /* ... */ }
             } catch (e) {
                 try { const textError = await response.text(); errorBody += ` - ${textError}`; } catch (e2) { /* Ignorar */ }
             }
             console.error(`fetchPetStats: Error en la respuesta: ${errorBody}`);
            throw new Error(`Error al obtener datos: ${errorBody}`);
        }
        const data = await response.json(); // Aquí sí esperamos JSON para los datos
        console.log("fetchPetStats: Datos recibidos.");
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error general en fetchPetStats:", error);
        throw error;
    }
};