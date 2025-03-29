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
        } catch (err) {
            setError("Error al obtener solicitudes pendientes.");
        }
    };

    const approveUser = async (id) => {
        const mac = prompt("Ingrese la dirección MAC:");
        if (!mac) return;

        try {
            await approveUserUseCase(id, mac);
            fetchRequests(); // Recargar lista después de aprobar
        } catch (err) {
            setError("Error al aprobar usuario.");
        }
    };

    return { requests, error, approveUser };
};
