/**
 * Actualizar una Salida existente.
 * @param Object Información nueva sobre la salida
 * {
 *  "Id": 10,
 *  "Fecha": "string",
 *  "Usos": "string",
 *  "Responsable": "string",
 *  "Equipo": [
 *      { "Id": 3 },
 *      { "Id": 4 }
 *  ]
 * }
 * @return Object Resultado de la actualización
 */

export default defineEventHandler(async (event) => {
  const { Id, Fecha, Usos, Responsable, Equipo } = await readBody(event)

  // Validar si falta el ID
  if (!Id) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Falta el Id de la salida a actualizar.'
    }))
  }

  // Actualizar los datos principales (PATCH = parcial, PUT = completo)
  const updateSalida = await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mxylas8z9l8ohr1/records/`, {
    headers: {
      'xc-token': process.env.NOCODB_TOKEN
    },
    method: 'patch',
    body: {
      Id,
      Fecha,
      Usos,
      Responsable
    }
  })

  // Actualizar la lista de equipo (linked records)
  // TO DO: @RodrigoRoy No existe fetch para actualizar linked records. Al parecer la única manera es eliminando los linked records
  // existentes y volver a realizar petición POST
  
  // const updateEquipo = await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mxylas8z9l8ohr1/links/ccugy2tparkdkdi/records/${Id}`, {
  //   headers: {
  //     'xc-token': process.env.NOCODB_TOKEN
  //   },
  //   method: 'post',
  //   body: Equipo // una lista de objetos con campo "Id"
  // })

  // Respuesta combinada
  return {
    ...updateSalida,
    updated: true,
    list: Equipo
  }
})
