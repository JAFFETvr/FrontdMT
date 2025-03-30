import { getApprovedUsers } from "../DataSource/login.api"; // Importa la función para obtener la lista de usuarios aprobados

export const loginRepository = {
    getApprovedUsers: getApprovedUsers // Exporta la función
};