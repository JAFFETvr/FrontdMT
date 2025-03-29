import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostLogin } from "../../domain/UseCase/PostLogin";

export const useLoginViewModel = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Limpiar errores previos

        try {
            const response = await PostLogin(credentials.username, credentials.password);
            
            if (response?.token) {
                localStorage.setItem("token", response.token); // Guardar el token en localStorage
                console.log("Login exitoso", response);

                // Verificar si es el usuario administrador
                if (credentials.username === "JAFFET" && credentials.password === "2233") {
                    navigate("/admin"); // Redirige a la vista de admin
                } else {
                    navigate("/main"); // Redirige a la vista normal
                }
            } else {
                throw new Error("Credenciales incorrectas");
            }
        } catch (error) {
            console.error("Error en login:", error.message);
            setError("Usuario o contraseña incorrectos"); // Mostrar mensaje de error
        }
    };

    return { credentials, handleChange, handleSubmit, error };
};
