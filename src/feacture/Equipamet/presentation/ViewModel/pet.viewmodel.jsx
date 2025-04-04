import { useState, useEffect } from "react";
import { getPetStats } from "../../domain/UseCase/getAllPet.usecase";

export const usePetViewModel = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const newStats = await getPetStats();
            setStats(newStats);
        };

        fetchData(); // Obtener datos al inicio

        const interval = setInterval(fetchData, 5000); // Actualizar cada 5 segundos

        return () => clearInterval(interval); // Limpiar intervalo cuando el componente se desmonta
    }, []);

    return { stats };
};
