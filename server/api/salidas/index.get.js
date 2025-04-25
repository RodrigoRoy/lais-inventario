/**
 * Información parcial de todas las salidas de equipo audiovisual
 * @return Object - Propiedades generales de los registros/records
 * {
 *  "list": [
 *    {
 *      "Id": 0,
 *      "Fecha": "string",
 *      "Lista de equipo": 0,
 *      "Usos": "string"
 *    }
 *  ],
 *  "PageInfo": {
 *    "pageSize": 0,
 *    "totalRows": 0,
 *    "isFirstPage": true,
 *    "isLastPage": true,
 *    "page": 0
 *  }
 * }
 */

export default defineEventHandler(async (event) => {
    return await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mxylas8z9l8ohr1/records`, {
        headers: {
            'xc-token': process.env.NOCODB_TOKEN
        },
        method: 'get',
    })
})
