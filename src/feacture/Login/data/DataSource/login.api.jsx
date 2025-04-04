// DataSource/login.api.js (EJEMPLO)

const API_URL = "http://174.129.168.168:8080"; // <-- NUEVA IP

// --- getApprovedUsers YA NO EXISTE en la nueva API ---
// export const getApprovedUsers = async () => { ... } // ¡ELIMINA ESTA FUNCIÓN!

// --- Nueva función para Login ---
export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, { // <-- NUEVA RUTA
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials), // Envía { username: "...", password: "..." }
        });

        const data = await response.json(); // Intenta parsear JSON siempre

        if (!response.ok) {
            // Usa el mensaje del backend si existe, si no, un error genérico
            throw new Error(data.message || `Error de inicio de sesión: ${response.status}`);
        }

        // La respuesta exitosa debería contener el token JWT
        if (!data.token) {
             throw new Error("Respuesta de login exitosa pero no se encontró el token.");
        }

        return data; // Devuelve la respuesta completa (que incluye el token)

    } catch (error) {
        console.error("Error en loginUser:", error);
        throw error; // Propaga el error
    }
};

// --- Función auxiliar de ejemplo para guardar el token ---
// Debes implementar esto para guardar el token después de un login exitoso
export const saveToken = (token) => {
    localStorage.setItem("jwtToken", token); // O sessionStorage, etc.
};

// --- Función auxiliar para eliminar el token (logout) ---
export const removeToken = () => {
    localStorage.removeItem("jwtToken"); // O sessionStorage, etc.
};