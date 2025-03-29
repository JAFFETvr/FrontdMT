import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../data/DataSource/register.api";

const RegisterSection = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Limpiar errores previos

        try {
            await registerUser(userData);
            alert("Registro exitoso. Ahora puedes iniciar sesión.");
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-300 to-yellow-200">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 text-center transform transition duration-300 hover:scale-105">
                <h2 className="text-4xl font-bold text-gray-700 mb-6">Regístrate</h2>
                <p className="text-gray-600 mb-4">Crea tu cuenta para gestionar a tu pequeño amigo</p>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        placeholder="Usuario"
                        className="border-2 border-gray-300 p-3 rounded-lg focus:border-orange-500 focus:outline-none"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        className="border-2 border-gray-300 p-3 rounded-lg focus:border-orange-500 focus:outline-none"
                        required
                    />

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="w-1/2 bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 transition duration-300 mr-2"
                        >
                            Volver
                        </button>

                        <button
                            type="submit"
                            className="w-1/2 bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700 transition duration-300"
                        >
                            Registrarse
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterSection;
