
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    loginUser,
    saveToken,
    removeToken as removeAuthToken, 
    saveRole,
    removeRole as removeAuthRole  
} from '../../data/DataSource/login.api';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const ROLE_STORAGE_KEY = "role"; 
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
            if (credentials.username === "administradores" && credentials.password === "112233") {
                isAdminLogin = true;
                console.log("ViewModel: Acceso especial admin detectado.");
                removeAuthToken(); // Llama a la función importada que usa 'authToken'
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

            console.log("ViewModel: Intentando login normal (esperando objeto JSON) para:", credentials.username);

            const responseData = await loginUser(credentials);
            console.log("ViewModel: loginUser devolvió objeto:", responseData);

            const tokenString = responseData.token; // Accede a la propiedad 'token'
            console.log("ViewModel: Token string extraído:", tokenString ? tokenString.substring(0, 15) + '...' : 'NO ENCONTRADO');

            saveToken(tokenString); 

            
            const defaultRole = 'user'; 
            saveRole(defaultRole);
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Inicio de sesión exitoso.',
                timer: 1500,
                showConfirmButton: false
             });

            navigate(USER_ROUTE);

        } catch (err) {
            const errorMessage = err.message || "Error desconocido al iniciar sesión.";
            console.error("ViewModel: Error en handleSubmit de login:", err);
            setError(errorMessage); // Actualiza estado de error para UI si es necesario
            Swal.fire({
                 icon: 'error',
                 title: 'Error de Acceso',
                 text: errorMessage, // Muestra el error específico de la API
             });
            removeAuthToken();
            removeAuthRole(); // Llama a la función importada
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
