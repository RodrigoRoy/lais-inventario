/**
 * Información parcial de las últimas salidas de equipo audiovisual
 * @return Object - Propiedades generales de los registros/records
 * {
 *  "list": [
 *    {
 *      "Id": 0,
 *      "Fecha": "string",
 *      "Lista de equipo": 0,
 *      "Usos": "string",
 *      "Responsable": "string",
 *      "CreatedAt": "2025-07-15 19:29:18+00:00",
 *      "UpdatedAt": "2025-07-15 19:29:19+00:00",
 *    }
 *  ],
 *  "PageInfo": {
 *    "pageSize": 10,
 *    "totalRows": 80,
 *    "isFirstPage": true,
 *    "isLastPage": true,
 *    "page": 1
 *  }
 * }
 */

export default defineEventHandler(async (event) => {
    
    // Esperar 1 segundo para no exceder peticiones máximas a NocoDB
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mxylas8z9l8ohr1/records`, {
        headers: {
            'xc-token': process.env.NOCODB_TOKEN
        },
        method: 'get',
        query: { 
            limit: 10, // Tamaño máximo de records/registros solicitados
            sort: '-Fecha,CreatedAt' // Orden por fecha (descendente) y fecha de creación (ascendente)
        }
    })
})
