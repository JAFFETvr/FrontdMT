const API_URL = "http://localhost:8080"; 

export const registerUser = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error al registrar usuario:", error);
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
