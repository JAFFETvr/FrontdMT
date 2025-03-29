import { adminRepository } from "../../data/Repository/admin.repository";
export const approveUserUseCase = async (id, mac) => {
    if (!mac) throw new Error("La dirección MAC es obligatoria.");
    return await adminRepository.approve(id, mac);
};
