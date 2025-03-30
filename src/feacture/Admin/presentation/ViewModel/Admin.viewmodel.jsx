import { useState, useEffect } from "react";
import { adminRepository } from "../../data/Repository/admin.repository";
import { approveUserUseCase } from "../../domain/UsesCases/ApproveUser.usecase";
import { AdminRequest } from "../../domain/Entities/AdminRequest";

export const useAdminViewModel = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await adminRepository.getRequests();
            setRequests(data.map(AdminRequest.fromJSON));
            setError(null); // Clear any previous errors on successful fetch
        } catch (err) {
            setError(`Error al obtener solicitudes pendientes: ${err.message}`); // Muestra el mensaje específico
        }
    };

    const approveUser = async (id) => {
        const mac = prompt("Ingrese la dirección MAC:");
        if (!mac) return;

        try {
            await approveUserUseCase(id, mac);
            fetchRequests(); // Recargar lista después de aprobar
            setError(null); // Clear any previous errors on successful approve
        } catch (err) {
            setError(`Error al aprobar usuario: ${err.message}`); // Muestra el mensaje específico
        }
    };

    return { requests, error, approveUser };
};