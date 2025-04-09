export class PetStats {
    constructor(datos) {
        this.datos = datos;
    }

    calcularMovimientoDetectado() {
        return this.datos.filter((item) => item.movimiento === "Detectado").length;
    }
}
