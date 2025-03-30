import { getPendingRequests, approveUser } from "../DataSource/admin.api"; // Ajustar la ruta
export const adminRepository = {
    getRequests: getPendingRequests,
    approve: approveUser
};