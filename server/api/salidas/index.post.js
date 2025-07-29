/**
 * Crear una nueva Salida y almacenarla en base de datos.
 * @param Object Información sobre la salida
 * {
 *  "Fecha": "string",
 *  "Usos": "string",
 *  "Responsable": string,
 *  "Equipo": [
 *      {
 *          "Id": 3
 *      },
 *      {
 *          "Id": 4
 *      }
 *  ]
 * }
 * @return Object Incluye Id del record, copia de la lista de equipo y 
 * boolean que indica si son correctos los "Link" de la lista de equipo
 * {
 *     "Id": 10,
 *     "updated": "true",
 *     "list": [
 *         {
 *             "Id": 3
 *         },
 *         {
 *             "Id": 4
 *         }
 *     ]
 * }
 */

export default defineEventHandler(async (event) => {
    const { Fecha, Usos, Responsable, Equipo } = await readBody(event)

    // Crear registro de nueva "Salida"
    const newSalida = await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mxylas8z9l8ohr1/records/`, {
        headers: {
            'xc-token': process.env.NOCODB_TOKEN
        },
        method: 'post',
        body: {
            "Fecha": Fecha,
            "Usos": Usos,
            "Responsable": Responsable
        }
    })

    // Agregar lista de equipo para Linked field
    const updateEquipo = await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mxylas8z9l8ohr1/links/c4tp3pyfg9eihbf/records/${newSalida.Id}`, {
        headers: {
            'xc-token': process.env.NOCODB_TOKEN
        },
        method: 'post',
        body: Equipo
    })
    
    // Agregar lista de equipo y respuesta de la actualización del Linked field
    newSalida.updated = updateEquipo
    newSalida.list = Equipo

    // Esperar 1 segundo para no exceder peticiones máximas a NocoDB
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Respuesta personalizada con Id, lista de equipo y boolean de operación exitosa
    return newSalida
})