import { useState } from "react";
import { PostLogin } from "../../domain/UseCase/PostLogin";
export const useLoginViewModel = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await PostLogin(credentials.username, credentials.password);
            console.log("Login exitoso", response);
        } catch (error) {
            console.error(error.message);
        }
    };
    return { credentials, handleChange, handleSubmit };
};
