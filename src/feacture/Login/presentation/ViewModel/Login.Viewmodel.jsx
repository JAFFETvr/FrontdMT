import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetApprovedUsersList } from "../../domain/UseCase/GetApprovedUsers";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

export const useLoginViewModel = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const [approvedUsers, setApprovedUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadApprovedUsers = async () => {
            try {
                const users = await GetApprovedUsersList();
                setApprovedUsers(users);
            } catch (error) {
                setError("Error al obtener usuarios aprobados.");
                Swal.fire({ // Utilizar SweetAlert2 para errores
                    icon: 'error',
                    title: '¡Error!',
                    text: "Error al obtener usuarios aprobados.",
                });
                console.error("Error:", error);
            }
        };

        loadApprovedUsers();
    }, []);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (credentials.username === "JAFFET" && credentials.password === "2233") {
                localStorage.setItem("role", "admin");
                navigate("/admin");
                return;
            }

            const user = approvedUsers.find(
                (u) => u.username === credentials.username && u.password_hash === credentials.password
            );

            if (user) {
                localStorage.setItem("role", "user");
                navigate("/main");
            } else {
                Swal.fire({ // Utilizar SweetAlert2 para errores
                    icon: 'error',
                    title: '¡Error!',
                    text: "Usuario o contraseña incorrectos",
                });
                throw new Error("Credenciales incorrectas");
            }
        } catch (error) {
            console.error("Error en login:", error.message);
            setError("Usuario o contraseña incorrectos");
        }
    };

    return { credentials, handleChange, handleSubmit, error };
};