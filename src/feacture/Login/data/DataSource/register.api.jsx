// DataSource/register.api.js (EJEMPLO)

const API_URL = "http://174.129.168.168:8080"; // <-- NUEVA IP

export const createUser = async (userData) => {
    // userData debería ser { username: "...", password: "..." }
    // La API nueva probablemente espera 'password', no 'password_hash'.
    // El backend se encargará del hash.
    const payload = {
        username: userData.username,
        password: userData.password // <-- Envía la contraseña en texto plano
    };

    try {
        const response = await fetch(`${API_URL}/auth/register`, { // <-- NUEVA RUTA
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload), // <-- USA EL PAYLOAD SIN HASH
        });

        const data = await response.json(); // Intenta parsear JSON

        if (!response.ok) {
             // Usa el mensaje del backend si existe
            throw new Error(data.message || `Error al crear usuario: ${response.status}`);
        }

        // Devuelve la respuesta del backend (puede contener ID de usuario, mensaje, etc.)
        return data;

    } catch (error) {
        console.error("Error al crear usuario:", error);
        throw error; // Propaga el error para que el componente pueda manejarlo
    }
};

// --- getPendingRequests y approveUser NO PERTENECEN AQUÍ ---
// Elimínalas si estaban en este archivo. Se manejan en admin.api.js