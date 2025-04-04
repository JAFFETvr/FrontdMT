// ViewModel/Login.Viewmodel.js (MODIFICADO CON ACCESO ADMIN ESPECIAL)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importa las NUEVAS funciones de tu API de login
import { loginUser, saveToken } from '../../data/DataSource/login.api';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export const useLoginViewModel = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // ----- INICIO: Comprobación de credenciales especiales de Admin -----
            if (credentials.username === "administradores" && credentials.password === "112233") {
                console.log("Acceso especial de administrador detectado.");
                // Establece el rol directamente en localStorage
                localStorage.setItem("role", "admin");
                // Limpia cualquier token JWT previo por si acaso
                localStorage.removeItem("jwtToken"); // O la key que uses para el token normal

                // Muestra mensaje de éxito para admin
                Swal.fire({
                    icon: 'success',
                    title: 'Acceso de Administrador Concedido',
                    timer: 1500,
                    showConfirmButton: false
                });

                navigate("/admin"); // Navega a la ruta de admin
                setLoading(false);  // Detiene el indicador de carga
                return; // ¡IMPORTANTE! Sal de la función handleSubmit aquí para no llamar a la API
            }
            // ----- FIN: Comprobación de credenciales especiales de Admin -----

            // --- Si no son las credenciales especiales, procede con el login normal vía API ---
            console.log("Intentando login normal vía API para usuario:", credentials.username);
            const responseData = await loginUser(credentials);

            // Verifica si la respuesta contiene el token esperado
            if (!responseData || !responseData.token) {
                console.error("Respuesta de login inválida:", responseData);
                throw new Error("Error inesperado del servidor al iniciar sesión.");
            }

            // Guarda el token JWT recibido
            saveToken(responseData.token);

            // Determina y guarda el ROL (obtenido de la API para usuarios normales)
            const userRole = responseData.role;
            if (!userRole) {
                 console.warn("La respuesta de login no especificó un rol. Asignando 'user' por defecto.");
            }
            localStorage.setItem("role", userRole || 'user');

            // Muestra mensaje de éxito normal
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                timer: 1500,
                showConfirmButton: false
            });

            // Navega a la página principal para usuarios normales
            // (La navegación para admin ya se hizo en el bloque 'if' de arriba)
            navigate("/main"); // O /dashboard, etc.

        } catch (err) {
            // Manejo de errores (tanto de la API como el error por token inválido)
            const errorMessage = err.message || "Usuario o contraseña incorrectos.";
            console.error("Error en handleSubmit de login:", err);
            setError(errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Error de Acceso',
                text: errorMessage,
            });
        } finally {
            // Asegura que el loading se detenga siempre, excepto si ya se hizo return en el bloque admin
            // El bloque 'finally' se ejecuta incluso después de un 'return' en el 'try',
            // pero como pusimos setLoading(false) antes del return, está bien.
            // Si no lo hubiéramos puesto antes del return, se desactivaría aquí.
             if (loading) { // Solo si aún está activo (no se hizo return antes)
                 setLoading(false);
             }
        }
    };

    return {
        credentials,
        handleChange,
        handleSubmit,
        error,
        loading
    };
};