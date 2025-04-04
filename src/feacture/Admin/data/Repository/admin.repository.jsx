// Repository/admin.repository.js (o como se llame tu archivo de repositorio)

// 1. Importa la función CORRECTA desde tu DataSource
//    Asegúrate de que el nombre ('assignMacToUser') coincida exactamente
//    con el que definiste en DataSource/admin.api.js
import { assignMacToUser } from "../DataSource/admin.api"; // Ajusta la ruta si es necesario

// 2. Exporta un objeto repositorio con los métodos actualizados
export const adminRepository = {
    // Ya no existe 'getRequests' basado en la API proporcionada.
    // Si necesitas listar usuarios, deberás añadir esa funcionalidad
    // (requiere un endpoint API como GET /admin/users y su función en DataSource).

    // Renombra 'approve' a algo más descriptivo como 'assignMac'
    // y asígnalo a la función importada correcta.
    assignMac: assignMacToUser
};