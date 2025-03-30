const API_URL = "http://localhost:8080";

export const getApprovedUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/approved_users`);  // Endpoint para obtener usuarios aprobados
        if (!response.ok) {
            throw new Error("Error al obtener la lista de usuarios aprobados");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};