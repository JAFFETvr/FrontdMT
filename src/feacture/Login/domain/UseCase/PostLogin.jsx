import { loginRepository } from "../../data/Repository/login.repository";
export const PostLogin = async (username, password) => {
    const user = new LoginModel(username, password);
    return await loginRepository.login(user);
};
