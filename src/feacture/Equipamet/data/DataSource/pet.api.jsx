export const fetchPetStats = async () => {
    try {
        const response = await fetch("http://174.129.168.168:8080/datos");
        if (!response.ok) {
            throw new Error("Error al obtener datos");
        }
        const data = await response.json();
        return data; // Enviamos toda la lista de datos
    } catch (error) {
        console.error("Error en fetchPetStats:", error);
        return [];
    }
};
