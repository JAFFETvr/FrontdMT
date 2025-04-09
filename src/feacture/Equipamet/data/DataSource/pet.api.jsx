
const API_URL = "http://174.129.168.168:8080";

const TOKEN_KEY = 'authToken';
const ROLE_STORAGE_KEY = "role";

export const saveToken = (token) => { if (token) localStorage.setItem(TOKEN_KEY, token); console.log(`Token guardado (${TOKEN_KEY})`); };
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => { localStorage.removeItem(TOKEN_KEY); console.log(`Token eliminado (${TOKEN_KEY})`); };
export const saveRole = (role) => { if (role) localStorage.setItem(ROLE_STORAGE_KEY, role); console.log(`Rol guardado (${ROLE_STORAGE_KEY}): ${role}`); };
export const getRole = () => localStorage.getItem(ROLE_STORAGE_KEY);
export const removeRole = () => localStorage.removeItem(ROLE_STORAGE_KEY);

export const loginUser = async (credentials) => {
    const loginEndpoint = `${API_URL}/auth/login`;
    console.log(`Intentando login (esperando texto) en ${loginEndpoint} para: ${credentials.username}`);
    try {
        const response = await fetch(loginEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(credentials) });
        const responseText = await response.text();
        console.log(`loginUser: Respuesta - Status: ${response.status}, Body(texto): ${responseText.substring(0, 50)}...`);
        if (!response.ok) {
            let errorMessage = `Error login (${response.status})`;
            try { const errorData = JSON.parse(responseText); errorMessage = errorData?.message || errorData?.error || errorMessage; }
            catch (e) { if (responseText) errorMessage = responseText; }
            console.error(`Login fallido: ${errorMessage}`);
            throw new Error(errorMessage);
        }
        const token = responseText;
        if (!token || typeof token !== 'string' || token.split('.').length !== 3) { throw new Error("Respuesta de login inválida (no es token JWT)."); }
        console.log("Login exitoso. Token (texto) recibido.");
        return token;
    } catch (error) { console.error("Error durante la llamada a loginUser:", error); throw error instanceof Error ? error : new Error(String(error)); }
};


export const fetchPetStats = async () => {
    const datosEndpoint = `${API_URL}/datos`;
    console.log(`>>> Iniciando fetchPetStats para ${datosEndpoint}`);
    let token = null; // Inicializa en null

    try {
        token = getToken(); // Intenta obtener el token

       
        console.log(`>>> DEBUG fetchPetStats: Valor de token recuperado de localStorage con clave ('${TOKEN_KEY}'):`, token);

        if (!token) {
            console.error(">>> ERROR fetchPetStats: getToken() devolvió null o undefined. No se encontró token.");
            throw new Error(`No autenticado: Token no encontrado en localStorage (clave: ${TOKEN_KEY}).`);
        }

        const fetchOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };

        console.log(">>> DEBUG fetchPetStats: Headers que se enviarán:", JSON.stringify(fetchOptions.headers));

        console.log(`>>> DEBUG fetchPetStats: Ejecutando fetch a ${datosEndpoint}`);
        const response = await fetch(datosEndpoint, fetchOptions);

        console.log(`>>> DEBUG fetchPetStats: Respuesta recibida - Status: ${response.status}`);

        if (!response.ok) {
            let errorBody = `Error ${response.status}: ${response.statusText}`;
            try { const errorData = await response.json(); errorBody += ` - ${JSON.stringify(errorData.error || errorData.message || errorData)}`; }
            catch (e) { try { const textError = await response.text(); if(textError) errorBody += ` - ${textError}`; } catch (e2) {} }

            if (response.status === 401 || response.status === 403) {
                 console.warn(`>>> WARN fetchPetStats: Token rechazado por el servidor (${response.status}). Respuesta: ${errorBody}`);
                 throw new Error(`No autenticado: Sesión inválida/expirada. Token usado: ${token ? token.substring(0, 15) + '...' : 'NINGUNO'}. (${errorBody})`);
            }
            console.error(`>>> ERROR fetchPetStats: Error en la respuesta: ${errorBody}`);
            throw new Error(`Error al obtener datos: ${errorBody}`);
        }

        const data = await response.json();
        console.log(">>> SUCCESS fetchPetStats: Datos recibidos.");
        return Array.isArray(data) ? data : [];

    } catch (error) {
        console.error(">>> ERROR fetchPetStats: Error final atrapado:", error.message);
        throw error;
    }
};