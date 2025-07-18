/**
 * Información de todo el equipo audiovisual
 * @return Object - Lista de los registros/records de equipo audiovisual
 * {
 *   "list": [
 *     {
 *       "Id": 1,
 *       "Nombre": "string",
 *       "Infraestructura": "string",
 *       "Número de serie": "string",
 *       "Número de inventario": "string",
 *       "Cantidad": number,
 *       "Uso": "string",
 *       "Notas": "string",
 *       "Préstamo": true,
 *       "Imagen": [
 *         {
 *           "mimetype": "string",
 *           "size": 0,
 *           "title": "string",
 *           "url": "string",
 *           "icon": "string"
 *         }
 *       ],
 *       "Salidas_id": 0,
 *       "Salidas": {
 *         "Fecha": "string",
 *         "Usos": "string"
 *       },
 *     }
 *   ],
 *   "PageInfo": {
 *     "pageSize": 0,
 *     "totalRows": 0,
 *     "isFirstPage": true,
 *     "isLastPage": true,
 *     "page": 0
 *   }
 * }
 */

export default defineEventHandler(async (event) => {
    const limit = 100 // máximo número de registros por petición/request

    // Obtener los primeros (100) registros
    let records = await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mcc4adsnscn92bb/records/`, {
        headers: {
            'xc-token': process.env.NOCODB_TOKEN
        },
        method: 'get',
        query: {
            limit: limit
        }
    })

    // Agregar más registros en caso de que lista aún esté incompleta (más de 100 registros)
    let moreRecords = []
    if( records.pageInfo.totalRows > limit ){
        // Determinar cantidad de iteraciones necesarias
        const quotient = Math.floor(records.pageInfo.totalRows / limit)

        for(let i = 0; i < quotient; i++){
            // Esperar un segundo por cada 5 peticiones (restricción del API de NocoDB)
            if(i % 5 == 0)
                await new Promise((resolve) => setTimeout(resolve, 1000))

            // Obtener los siguientes records de equipo audiovisual
            moreRecords = await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mcc4adsnscn92bb/records/`, {
                headers: {
                    'xc-token': process.env.NOCODB_TOKEN
                },
                method: 'get',
                query: {
                    limit: limit,
                    offset: limit * (i+1)
                },
            })

            // Agregar records (combinar con ES6 destructuring)
            records.list = [...records.list, ...moreRecords.list]
        }
    }

    // Esperar 1 segundo para no exceder peticiones máximas a NocoDB
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Respuesta personalizada con la propiedad "list" que tiene el listado COMPLETO de equipo
    return records
})