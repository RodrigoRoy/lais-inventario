/**
 * Actualizar una Salida existente.
 * @param Object Información nueva sobre la salida
 * {
 *  "Fecha": "string",
 *  "Usos": "string",
 *  "Responsable": "string",
 *  "Equipo": [
 *      {
 *          "Id": 3
 *      },
 *      {
 *          "Id": 4
 *      }
 *  ]
 * }
 * @return Object Resultado de la actualización, incluye Id del record, copia de la lista de equipo y
 * boolean que indica si son correctos los "links" de la lista de equipo
 * {
 *   "Id": 10,
 *   "updated": true,
 *   "list": [
 *     {
 *       "Id": 3
 *     },
 *     {
 *       "Id": 4
 *     }
 *   ]
 * }
 */
export default defineEventHandler(async (event) => {
  // Id de la "Salida" solicitada
  const recordId = getRouterParam(event, 'recordId')

  // Parámetros enviados como "body"
  const { Fecha, Usos, Responsable, Equipo } = await readBody(event)

  // Validar si falta el ID
  if (!recordId) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Falta el Id de la salida a actualizar.'
    }))
  }

  // Actualizar los datos básicos (Fecha, Usos, Responsable)
  const updateSalida = await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mxylas8z9l8ohr1/records/`, {
    headers: {
      'xc-token': process.env.NOCODB_TOKEN
    },
    method: 'patch',
    body: {
      "Id": recordId,
      "Fecha": Fecha,
      "Usos": Usos,
      "Responsable": Responsable,
    }
  })

  // Actualizar la lista de equipo (linked records):
  // 1. Obtener la lista de linked records actual
  // 2. Borrar linked records actuales
  // 3. Actualizar por nuevos linked records

  // Obtener la lista actual de Linked Records (lista de equipo)
  const linkedRecords = await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mxylas8z9l8ohr1/links/ccugy2tparkdkdi/records/${recordId}`, {
    headers: {
      'xc-token': process.env.NOCODB_TOKEN
    },
    method: 'get',
  })

  // Lista (de Id's) de equipo audiovisual
  const toUnlinkRecords = linkedRecords.list

  // Petición para eliminar / unlink la lista de equipo actual
  await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mxylas8z9l8ohr1/links/ccugy2tparkdkdi/records/${recordId}`, {
    headers: {
      'xc-token': process.env.NOCODB_TOKEN
    },
    method: 'delete',
    body: toUnlinkRecords
  })

  // Agregar la nueva lista de equipo como Linked Records
  const updateEquipo = await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mxylas8z9l8ohr1/links/ccugy2tparkdkdi/records/${recordId}`, {
      headers: {
          'xc-token': process.env.NOCODB_TOKEN
      },
      method: 'post',
      body: Equipo
  })

  // Esperar 1 segundo para no exceder peticiones máximas a NocoDB
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Respuesta personalizada con Id, lista de equipo y boolean de operación exitosa
  return {
    ...updateSalida,
    updated: true,
    list: Equipo
  }
})
