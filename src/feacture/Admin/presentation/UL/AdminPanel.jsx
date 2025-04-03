import React from "react";
import { useNavigate } from "react-router-dom"; 
import { useAdminViewModel } from "../ViewModel/Admin.viewmodel"; 
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';
import { FaClipboardList, FaCheck, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

const AdminPanel = () => {
    const { requests, error, approveUser } = useAdminViewModel();
    const navigate = useNavigate(); // Hook para navegación

    const accentColor = "orange-500";
    const accentHoverColor = "orange-600";
    const focusRingColor = "orange-500";

    const pageTitleFontWeight = "font-bold";
    const pageTitleFontSize = "text-3xl";
    const cardTitleFontWeight = "font-semibold";
    const cardTitleFontSize = "text-xl";

    const handleApproveClick = (userId, username) => {
        Swal.fire({
            title: `¿Aprobar a ${username}?`,
            text: "Esta acción permitirá al usuario acceder al sistema.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#F97316', 
            cancelButtonColor: '#757575',
            confirmButtonText: 'Sí, aprobar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                approveUser(userId); 
            }
        });
    };


    return (
        <div className="relative flex flex-col items-center min-h-screen bg-gradient-to-br from-yellow-100 via-orange-200 to-red-200 p-4 sm:p-6 lg:p-8">

            <button
                onClick={() => navigate("/login")}
                className={`absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-1.5 bg-white text-gray-600 px-3 py-1.5 rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-300 text-xs font-medium z-20`}
            >
                <FaArrowLeft />
                Volver al Login
            </button>

            <h1 className={`${pageTitleFontSize} ${pageTitleFontWeight} text-gray-800 mb-8 flex items-center gap-3`}>
                <FaClipboardList className={`text-${accentColor}`} />
                Panel de Administración
            </h1>

            <div className="w-full max-w-3xl bg-white p-6 md:p-8 rounded-2xl shadow-xl">

                <h2 className={`${cardTitleFontSize} ${cardTitleFontWeight} text-gray-700 mb-6`}>
                    Solicitudes Pendientes
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 text-sm flex items-center gap-2">
                        <FaExclamationTriangle className="h-5 w-5"/>
                        <span>Error: {error}</span>
                    </div>
                )}

                {requests.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No hay solicitudes de registro pendientes.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {requests.map((user) => (
                            <li key={user.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 px-2 hover:bg-gray-50 rounded-md transition duration-150 ease-in-out gap-3">
                                <span className="text-gray-800 font-medium text-sm">{user.username}</span>
                                <button
                                    onClick={() => handleApproveClick(user.id, user.username)}
                                    className={`flex items-center gap-1 bg-${accentColor} text-white px-3 py-1.5 rounded-lg hover:bg-${accentHoverColor} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-${focusRingColor} transition duration-300 text-xs font-medium whitespace-nowrap`} // Cambiado a colores naranjas
                                >
                                    <FaCheck />
                                    Aprobar
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;