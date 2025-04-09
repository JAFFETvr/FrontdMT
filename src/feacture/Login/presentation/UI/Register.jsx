import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../data/DataSource/register.api";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { FaUserPlus, FaExclamationTriangle } from "react-icons/fa";

const RegisterSection = () => {
    const navigate = useNavigate();
    // Mantenemos el estado como antes
    const [userData, setUserData] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Añadir estado de carga

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (userData.password.length < 6) { // Mantenemos validación básica
             const errMsg = "La contraseña debe tener al menos 6 caracteres.";
             setError(errMsg);
             Swal.fire({ icon: 'warning', title: 'Contraseña Corta', text: errMsg });
             return;
        }

        setLoading(true); // Inicia carga

        try {
            // Llama a la función de API actualizada
            await createUser({
                username: userData.username,
                password: userData.password // <-- Envía contraseña directamente
            });

            // Mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Registro Exitoso!',
                text: 'Tu cuenta ha sido creada. Puede que necesites esperar la asignación de MAC por un administrador para funcionalidad completa.',
                showConfirmButton: true,
                confirmButtonColor: '#F97316'
            });
            navigate("/login"); // Navega a login después del registro

        } catch (err) {
             const message = err.message || "Ocurrió un error desconocido al registrar.";
             setError(message);
             Swal.fire({
                icon: 'error',
                title: '¡Error al Registrar!',
                text: message, // Muestra el error de la API
            });
        } finally {
            setLoading(false); // Finaliza carga
        }
    };

    // ----- ¡AÑADE ESTAS DEFINICIONES AQUÍ! -----
    const accentColor = "orange-500";
    const accentHoverColor = "orange-600";
    const focusRingColor = "orange-500";
    const secondaryBgColor = "gray-200";
    const secondaryHoverBgColor = "gray-300";
    const secondaryTextColor = "gray-700";
    const secondaryFocusRingColor = "gray-400";

    // También define estas si las usas en otra parte del JSX que no mostraste aquí
    // const titleFontWeight = "font-bold";
    // const titleFontSize = "text-3xl";
    // --------------------------------------------

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-orange-200 to-red-200 p-4">
            {/* Contenedor relativo y otros elementos */}
            <div className="relative w-full max-w-sm">
                 {/* Icono superior */}
                <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className={`bg-white p-4 rounded-full shadow-lg border border-gray-200`}>
                       {/* Aquí también usas accentColor, asegúrate que esté definido */}
                       <FaUserPlus className={`h-8 w-8 text-${accentColor}`} />
                    </div>
                </div>

                <div className="bg-white pt-14 pb-8 px-8 rounded-2xl shadow-xl text-center">
                    {/* Título y párrafo */}
                     <h2 className={`text-3xl font-bold text-gray-800 mb-2`}> {/* Ejemplo: Usando clases directamente o variables si están definidas */}
                        Crear Cuenta
                    </h2>
                    <p className="text-gray-600 mb-6 text-sm">
                        Regístrate para empezar a cuidar a tu amigo
                    </p>

                    {/* Display de Error */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg relative mb-4 text-xs text-left flex items-center gap-2">
                            <FaExclamationTriangle className="h-4 w-4"/>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                         {/* Inputs (asegúrate que focusRingColor también esté definido) */}
                         <input
                            type="text"
                            name="username"
                            value={userData.username}
                            onChange={handleChange}
                            placeholder="Elige un nombre de usuario"
                            className={`border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-${focusRingColor} focus:border-transparent w-full text-sm`}
                            required
                            autoComplete="username"
                        />
                        <input
                            type="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            placeholder="Crea una contraseña"
                            className={`border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-${focusRingColor} focus:border-transparent w-full text-sm`}
                            required
                            autoComplete="new-password"
                        />

                        {/* Botones */}
                        <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                // Ahora las variables están definidas y las clases se construirán correctamente
                                className={`flex-1 bg-${secondaryBgColor} text-${secondaryTextColor} px-5 py-2.5 rounded-lg hover:bg-${secondaryHoverBgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${secondaryFocusRingColor} transition duration-300 font-medium text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                Volver al Login
                            </button>

                            <button
                                type="submit"
                                // Ahora las variables están definidas
                                className={`flex-1 bg-${accentColor} text-white px-5 py-2.5 rounded-lg hover:bg-${accentHoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${focusRingColor} transition duration-300 font-medium text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Creando...' : 'Crear Cuenta'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterSection;