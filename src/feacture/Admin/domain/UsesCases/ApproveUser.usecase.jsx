import { adminRepository } from "../../data/Repository/admin.repository";

export const approveUserUseCase = async (id, mac) => {
    if (!mac) throw new Error("La dirección MAC es obligatoria.");
    try {
        const result = await adminRepository.approve(id, mac);
        return result;  
    } catch (error) {
        throw new Error(`Error en approveUserUseCase: ${error.message}`);  
    }
};