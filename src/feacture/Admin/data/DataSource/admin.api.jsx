// DataSource/admin.api.js (EJEMPLO)

const API_URL = "http://174.129.168.168:8080"; // <-- NUEVA IP

// --- getPendingRequests YA NO EXISTE en la nueva API ---
// export const getPendingRequests = async () => { ... } // ¡ELIMINA ESTA FUNCIÓN!
// Necesitarás una nueva forma de obtener la lista de usuarios si quieres asignarles MACs.
// Quizás haya un endpoint GET /admin/users (no especificado en tu lista)
// o tendrás que obtener los IDs de usuario de otra manera.

// --- approveUser se convierte en assignMacToUser ---
// Esta función ahora asigna una MAC a un usuario específico y requiere JWT.
export const assignMacToUser = async (userId, macAddress) => {
    const token = getToken(); // <-- Necesitas una función que obtenga el token guardado

    if (!token) {
        throw new Error("No autenticado. Token no encontrado.");
    }

    try {
        const response = await fetch(`${API_URL}/admin/users/${userId}/assign-mac`, { // <-- NUEVA RUTA Y MÉTODO
            method: "PUT", // <-- CAMBIADO A PUT
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // <-- AÑADIR HEADER DE AUTENTICACIÓN JWT
            },
            body: JSON.stringify({ mac: macAddress }), // <-- La MAC va en el cuerpo
        });

        if (response.status === 401 || response.status === 403) {
            throw new Error("No autorizado para realizar esta acción.");
        }
        if (!response.ok) {
            // Intenta obtener un mensaje de error del cuerpo de la respuesta
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: `Error ${response.status} - ${response.statusText}` };
            }
            throw new Error(errorData.message || `Error al asignar MAC: ${response.status}`);
        }

        // Devuelve la respuesta si es necesario (puede ser vacía o un mensaje de éxito)
        try {
            return await response.json();
        } catch (e) {
            // Si no hay cuerpo JSON (ej. 204 No Content), devuelve éxito
            return { success: true, message: "MAC asignada correctamente." };
        }

    } catch (error) {
        console.error("Error en assignMacToUser:", error);
        throw error; // Propaga el error
    }
};

// --- Función auxiliar de ejemplo para obtener el token ---
// Debes implementar esto según cómo guardes el token (localStorage, sessionStorage, context, etc.)
const getToken = () => {
    return localStorage.getItem("jwtToken"); // O sessionStorage, etc.
};