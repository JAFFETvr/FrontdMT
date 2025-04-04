const API_URL = "http://18.209.134.24:8080"; // Ajusta según tu backend

// Obtener usuarios pendientes
export const getPendingRequests = async () => {
    try {
        const response = await fetch(`${API_URL}/pending_requests`);
        if (!response.ok) {
            throw new Error(`Error al obtener solicitudes: ${response.status} - ${response.statusText}`); // Mejor manejo de errores
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// Aprobar usuario con dirección MAC
export const approveUser = async (id, mac) => {
    try {
        const response = await fetch(`${API_URL}/approve?id=${id}&mac=${mac}`, {
            method: "POST",
        });
        if (!response.ok) {
            throw new Error(`Error al aprobar usuario: ${response.status} - ${response.statusText}`); // Mejor manejo de errores
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};