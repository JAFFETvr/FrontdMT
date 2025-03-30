import { useState } from "react";
import { useNavigate } from "react-router-dom";
// REMOVE import { PostLogin } from "../../domain/UseCase/PostLogin";

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
            if (credentials.username === "JAFFET" && credentials.password === "2233") {
                localStorage.setItem("role", "admin");  // **Guardar el rol**
                navigate("/admin"); // Redirige a la vista de admin
                return; // IMPORTANTE: Salir de la función si es el admin
            }

            // En este ejemplo, simplemente verificamos si el nombre de usuario no está vacío:
            if (credentials.username !== "") {
                localStorage.setItem("role", "user"); // Guardar el rol
                navigate("/main"); // Redirige a la vista normal
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