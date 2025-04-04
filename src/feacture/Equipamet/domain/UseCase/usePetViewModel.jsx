// src/usecases/usePetViewModel.js
export const usePetViewModel = () => {
    const stats = {
        calcularMovimientoDetectado: () => 5,  // Ejemplo de lógica
        temperatureData: [
            { time: '10:00', temp: 22 },
            { time: '10:05', temp: 23 },
        ],
        datos: [
            { id: 1, movimiento: 'Detectado', temperatura: 22 },
            { id: 2, movimiento: 'No Detectado', temperatura: 21 },
        ],
    };

    return { stats };
};
