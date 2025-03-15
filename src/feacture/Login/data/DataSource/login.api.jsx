export const loginAPI = async (credentials) => {
    const response = await fetch("https://", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    });
    if (!response.ok) throw new Error("Error en el inicio de sesión");
    return response.json();
};
