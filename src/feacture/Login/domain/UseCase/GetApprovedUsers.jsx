import { loginRepository } from "../../data/Repository/login.repository";

export const GetApprovedUsers = async () => {
    try {
        const users = await loginRepository.getApprovedUsers();
        return users;
    } catch (err) {
        throw err; 
    }
};