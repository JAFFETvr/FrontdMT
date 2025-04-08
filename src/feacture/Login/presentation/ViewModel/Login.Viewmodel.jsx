// src/ViewModel/Login.Viewmodel.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Asegúrate que la ruta sea correcta y que importas desde el archivo API unificado
import {
    loginUser,
    saveToken,
    removeToken as removeAuthToken, // Renombrado localmente
    saveRole,
    removeRole as removeAuthRole  // Importa también removeRole
} from '../../data/DataSource/login.api'; // Ajusta la ruta si es necesario
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Claves y Rutas (puedes importar ROLE_STORAGE_KEY si lo exportaste)
const ROLE_STORAGE_KEY = "role"; // O import { ROLE_STORAGE_KEY } from '...';
// const TOKEN_KEY_ADMIN_SPECIAL = "jwtToken"; // Ya no parece necesaria si el admin no usa token
const ADMIN_ROUTE = "/admin";
const USER_ROUTE = "/main"; // Ruta para usuarios normales

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
        let isAdminLogin = false;

        try {
            // ----- Comprobación Admin Especial -----
            if (credentials.username === "administradores" && credentials.password === "112233") {
                isAdminLogin = true;
                console.log("ViewModel: Acceso especial admin detectado.");
                // Limpia cualquier token JWT normal anterior
                removeAuthToken(); // Llama a la función importada que usa 'authToken'
                // Guarda el rol de admin
                saveRole("admin"); // Usa la función importada

                Swal.fire({
                    icon: 'success',
                    title: 'Acceso de Administrador Concedido',
                    timer: 1500,
                    showConfirmButton: false
                 });
                navigate(ADMIN_ROUTE);
                setLoading(false); // Detiene el loading aquí para el admin
                return; // Salir temprano
            }
            // ----- FIN Admin Especial -----

            // --- Login normal vía API ---
            console.log("ViewModel: Intentando login normal (esperando objeto JSON) para:", credentials.username);

            // 1. Llama a loginUser, que devuelve el OBJETO JSON { token: "..." }
            const responseData = await loginUser(credentials);
            console.log("ViewModel: loginUser devolvió objeto:", responseData);

            // 2. EXTRACCIÓN DEL TOKEN del objeto (Ya validado dentro de loginUser)
            const tokenString = responseData.token; // Accede a la propiedad 'token'
            console.log("ViewModel: Token string extraído:", tokenString ? tokenString.substring(0, 15) + '...' : 'NO ENCONTRADO');

            // 3. Guarda SOLO el token STRING usando saveToken
            saveToken(tokenString); // saveToken ahora recibe y guarda solo el string

            // 4. ASIGNAR ROL - Podrías intentar obtenerlo de responseData si la API lo incluyera
            // const userRole = responseData.role || 'user'; // Ejemplo si la API devolviera rol
            const defaultRole = 'user'; // O mantener el rol por defecto
            saveRole(defaultRole); // Guarda el rol usando la función importada

            // 5. Muestra mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Inicio de sesión exitoso.',
                timer: 1500,
                showConfirmButton: false
             });

            // 6. Navega a la ruta de usuario normal
            navigate(USER_ROUTE);

        } catch (err) {
            // Manejo de errores (captura errores de loginUser o de la lógica aquí)
            const errorMessage = err.message || "Error desconocido al iniciar sesión.";
            console.error("ViewModel: Error en handleSubmit de login:", err);
            setError(errorMessage); // Actualiza estado de error para UI si es necesario
            Swal.fire({
                 icon: 'error',
                 title: 'Error de Acceso',
                 text: errorMessage, // Muestra el error específico de la API
             });
            // Limpiar token Y rol si algo falla en el login normal
            removeAuthToken();
            removeAuthRole(); // Llama a la función importada
        } finally {
            // Asegura que el loading se detenga si no fue el login admin
            if (!isAdminLogin) {
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