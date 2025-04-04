import { useState, useEffect } from "react";
import { adminRepository } from "../../data/Repository/admin.repository";
import { approveUserUseCase } from "../../domain/UsesCases/ApproveUser.usecase";
import { AdminRequest } from "../../domain/Entities/AdminRequest";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

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

        Swal.fire({
            title: 'Ingrese la dirección MAC:',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Aprobar',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: (macAddress) => {
                if (!macAddress) {
                    Swal.showValidationMessage(`Por favor, ingrese la dirección MAC`);
                }
                return macAddress;
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                const macAddress = result.value;
                if (macAddress) {
                    approveWithMacAddress(id, macAddress);
                }
            }
        })
    };


    const approveWithMacAddress = async (id, mac) => {
        try {
            await approveUserUseCase(id, mac);
            fetchRequests(); // Recargar lista después de aprobar
        } catch (err) {
            setError("Error al aprobar usuario.");
            Swal.fire({  // Utilizar SweetAlert2 para errores
                icon: 'error',
                title: '¡Error!',
                text: "Error al aprobar usuario.",
            });
        }
    };

    return { requests, error, approveUser };
};