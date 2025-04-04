import { loginRepository } from "../../data/Repository/login.repository";

export const GetApprovedUsersList = async () => {
    try {
        const users = await loginRepository.getApprovedUsers();
        return users;
    } catch (err) {
        throw err; 
    }
};