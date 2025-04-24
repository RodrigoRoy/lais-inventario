export default defineEventHandler(async (event) => {
    const { Fecha, Usos, Equipo } = await readBody(event)

    // Crear registro de nueva "Salida"
    const newSalida = await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mxylas8z9l8ohr1/records/`, {
        headers: {
            'xc-token': process.env.NOCODB_TOKEN
        },
        method: 'post',
        body: {
            "Fecha": Fecha,
            "Usos": Usos,
        }
    })

    // Agregar lista de equipo para Linked field
    const updateEquipo = await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mxylas8z9l8ohr1/links/ccugy2tparkdkdi/records/${newSalida.Id}`, {
        headers: {
            'xc-token': process.env.NOCODB_TOKEN
        },
        method: 'post',
        body: Equipo
    })
    
    // Agregar lista de equipo y respuesta de la actualización del Linked field
    newSalida.updated = updateEquipo
    newSalida.list = Equipo

    return newSalida
})