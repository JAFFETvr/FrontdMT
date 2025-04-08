// ViewModel/Login.Viewmodel.js (CORREGIDO - Asume loginUser devuelve STRING y NO se obtiene ROL)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importa las funciones (loginUser devuelve string, saveToken guarda string)
import { loginUser, saveToken, removeToken as removeAuthToken } from '../../data/DataSource/login.api'; // Asegúrate de tener removeToken
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Claves y Rutas
const ROLE_STORAGE_KEY = "role";
const TOKEN_KEY_ADMIN_SPECIAL = "jwtToken"; // La clave que usaste para el admin especial
const ADMIN_ROUTE = "/admin";
const USER_ROUTE = "/main";

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
                console.log("Acceso especial admin.");
                localStorage.setItem(ROLE_STORAGE_KEY, "admin");
                // Limpia el token JWT normal (usa la función de api.js si usa 'authToken')
                removeAuthToken(); // Asegúrate que esta función elimina la key 'authToken'
                // O limpia la clave específica si es diferente:
                // localStorage.removeItem('authToken'); // <-- Si usas 'authToken' para el token normal

                Swal.fire({ /* ... SweetAlert admin ... */
                    icon: 'success',
                    title: 'Acceso de Administrador Concedido',
                    timer: 1500,
                    showConfirmButton: false
                 });
                navigate(ADMIN_ROUTE);
                setLoading(false);
                return; // Salir
            }
            // ----- FIN Admin Especial -----

            // --- Login normal vía API ---
            console.log("Intentando login normal (esperando string) para:", credentials.username);

            // 1. Llama a loginUser, que devuelve el TOKEN (string)
            const tokenString = await loginUser(credentials); // Renombrado para claridad

            // 2. Validación básica del token recibido como STRING
            if (!tokenString || typeof tokenString !== 'string' || tokenString.split('.').length !== 3) {
                 console.error("loginUser devolvió una respuesta inesperada:", tokenString);
                throw new Error("Respuesta inválida del servidor al iniciar sesión.");
            }

            // 3. Guarda el token STRING directamente
            saveToken(tokenString); // saveToken debe estar preparada para recibir un string
            console.log("Token (string) guardado.");

            // 4. ASIGNAR ROL POR DEFECTO (No se puede obtener sin jwt-decode o cambio en API)
            const defaultRole = 'user';
            localStorage.setItem(ROLE_STORAGE_KEY, defaultRole);
            console.log(`Rol asignado por defecto: ${defaultRole}`);
            // Se ELIMINAN las líneas que intentaban acceder a responseData.role

            // 5. Muestra mensaje de éxito
            Swal.fire({ /* ... SweetAlert éxito normal ... */
                icon: 'success',
                title: '¡Bienvenido!',
                timer: 1500,
                showConfirmButton: false
             });

            // 6. Navega a la ruta de usuario normal
            navigate(USER_ROUTE);

        } catch (err) {
            // Manejo de errores
            const errorMessage = err.message || "Usuario o contraseña incorrectos.";
            console.error("Error en handleSubmit de login:", err);
            setError(errorMessage);
            Swal.fire({ /* ... SweetAlert error ... */
                 icon: 'error',
                 title: 'Error de Acceso',
                 text: errorMessage,
             });
            // Limpiar token/rol si algo falla
            removeAuthToken(); // Limpia el token normal
            localStorage.removeItem(ROLE_STORAGE_KEY); // Limpia el rol
        } finally {
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