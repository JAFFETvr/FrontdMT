import { useLoginViewModel } from "../ViewModel/Login.Viewmodel";
import React from "react";
import { useNavigate } from "react-router-dom";

const LoginSection = () => {
    const { credentials, handleChange, handleSubmit } = useLoginViewModel();
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-300 to-orange-200">
            <button
                onClick={() => navigate("/adminLogin")}
                className="absolute top-4 right-4 bg-orange-500 text-white p-2 rounded-md hover:bg-orange-700"
            >
                Ingresar como Admin
            </button>
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 text-center transform transition duration-300 hover:scale-105">
                <h2 className="text-4xl font-bold text-gray-700 mb-6"> Bienvenido </h2>
                <p className="text-gray-600 mb-4">Accede para cuidar y gestionar a tu pequeño amigo</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        placeholder="Usuario"
                        className="border-2 border-gray-300 p-3 rounded-lg focus:border-orange-500 focus:outline-none"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        className="border-2 border-gray-300 p-3 rounded-lg focus:border-orange-500 focus:outline-none"
                        required
                    />

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="w-1/2 bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700 transition duration-300 mr-2"
                        >
                            Regístrate
                        </button>

                        <button
                            type="submit"
                            className="w-1/2 bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700 transition duration-300"
                        >
                            Ingresar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginSection;