export class PetStats {
    constructor(datos) {
        this.datos = datos;
    }

    // Método para calcular cuántas veces se detectó movimiento
    calcularMovimientoDetectado() {
        return this.datos.filter((item) => item.movimiento === "Detectado").length;
    }
}
