const API_URL = "http://18.209.134.24:8080";

export const createUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al crear usuario");
        }

        return await response.json();
    } catch (error) {
        console.error("Error al crear usuario:", error);
        throw error; // Propaga el error para que el componente pueda manejarlo
    }
};

export const getPendingRequests = async () => {
    try {
        const response = await fetch(`${API_URL}/pending_requests`);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener solicitudes pendientes:", error);
    }
};

export const approveUser = async (id, mac) => {
    try {
        const response = await fetch(`${API_URL}/approve?id=${id}&mac=${mac}`, {
            method: "POST",
        });
        return await response.json();
    } catch (error) {
        console.error("Error al aprobar usuario:", error);
    }
};