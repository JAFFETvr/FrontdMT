import { useLoginViewModel } from "../ViewModel/Login.Viewmodel";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const LoginSection = () => {
    const { credentials, handleChange, handleSubmit } = useLoginViewModel();
    const navigate = useNavigate(); 
    const handleLogin = () => {
     
            navigate("/main");
      
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-200 to-orange-100">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center transform transition duration-300 hover:scale-105">
                <h2 className="text-3xl font-bold text-gray-700 mb-6">🐹 Welcome 🐹</h2>
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
                    <button onClick={handleLogin} type="submit" className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700 transition duration-300">Ingresar</button>
                </form>
            </div>
        </div>
    );
};
export default LoginSection;