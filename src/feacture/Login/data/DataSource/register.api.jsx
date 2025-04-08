
const API_URL = "http://174.129.168.168:8080"; 

export const createUser = async (userData) => {
 
    const payload = {
        username: userData.username,
        password: userData.password 
    };

    try {
        const response = await fetch(`${API_URL}/auth/register`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload), 
        });

        const data = await response.json(); // Intenta parsear JSON

        if (!response.ok) {
            throw new Error(data.message || `Error al crear usuario: ${response.status}`);
        }

        return data;

    } catch (error) {
        console.error("Error al crear usuario:", error);
        throw error; 
    }
};

