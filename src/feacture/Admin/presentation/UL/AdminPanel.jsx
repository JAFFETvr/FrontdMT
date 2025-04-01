import React from "react";
import { useAdminViewModel } from "../ViewModel/Admin.viewmodel";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

const AdminPanel = () => {
    const { requests, error, approveUser } = useAdminViewModel();

    return (
        <div className="min-h-screen flex flex-col items-center p-10 bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">📋 Panel de Administración</h1>

            {error && <p className="text-red-500">{error}</p>}

            <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Solicitudes Pendientes</h2>
                {requests.length === 0 ? (
                    <p>No hay solicitudes pendientes.</p>
                ) : (
                    <ul>
                        {requests.map((user) => (
                            <li key={user.id} className="flex justify-between items-center p-2 border-b">
                                <span>{user.username}</span>
                                <button
                                    onClick={() => approveUser(user.id)}
                                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                                >
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
//