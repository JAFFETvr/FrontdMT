const API_URL = "http://localhost:8080"; // Ajusta según tu backend

// Obtener usuarios pendientes
export const getPendingRequests = async () => {
    try {
        const response = await fetch(`${API_URL}/pending_requests`);
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
        return await response.json();
    } catch (error) {
        throw error;
    }
};
