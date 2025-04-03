import { useLoginViewModel } from "../ViewModel/Login.Viewmodel"; 
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
const LoginSection = () => {
    const { credentials, handleChange, handleSubmit } = useLoginViewModel();
    const navigate = useNavigate();

    const accentColor = "orange-500"; 
    const accentHoverColor = "orange-600";
    const focusRingColor = "orange-500";

   
    const titleFontWeight = "font-bold"; 
    const titleFontSize = "text-3xl";    


    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-orange-200 to-red-200 p-4"> {/* Gradiente cálido y suave */}

            <div className="relative w-full max-w-sm">

                <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className={`bg-white p-4 rounded-full shadow-lg border border-gray-200`}>
                        <FaUser className={`h-8 w-8 text-${accentColor}`} />
                    </div>
                </div>


                <div className="bg-white pt-14 pb-8 px-8 rounded-2xl shadow-xl text-center">

                    <h2 className={`${titleFontSize} ${titleFontWeight} text-gray-800 mb-2`}> 
                        Bienvenido
                    </h2>
                    <p className="text-gray-600 mb-8 text-sm"> 
                        Accede para cuidar y gestionar a tu pequeño amigo
                    </p>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        <input
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            placeholder="Usuario"
                            className={`border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-${focusRingColor} focus:border-transparent w-full text-sm`}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Contraseña"
                            className={`border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-${focusRingColor} focus:border-transparent w-full text-sm`}
                            required
                        />

                        <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className={`flex-1 bg-${accentColor} text-white px-5 py-2.5 rounded-lg hover:bg-${accentHoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${focusRingColor} transition duration-300 font-medium text-sm`}
                            >
                                Regístrate
                            </button>

                            <button
                                type="submit"
                                className={`flex-1 bg-${accentColor} text-white px-5 py-2.5 rounded-lg hover:bg-${accentHoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${focusRingColor} transition duration-300 font-medium text-sm`}
                            >
                                Ingresar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginSection;