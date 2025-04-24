export default defineEventHandler(async (event) => {
    // Id de la "Salida" solicitada
    const recordId = getRouterParam(event, 'recordId')

    // Datos básicos de "Salida" (no incluye campos tipo "Link to Another Record")
    const salidaRecord = await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mxylas8z9l8ohr1/records/${recordId}`, {
        headers: {
            'xc-token': process.env.NOCODB_TOKEN
        },
        method: 'get',
    })

    // Lista parcial del equipo audiovisual. Incluye "Id" y "Nombre"
    const listaEquipo = await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mxylas8z9l8ohr1/links/ccugy2tparkdkdi/records/${recordId}`, {
        headers: {
            'xc-token': process.env.NOCODB_TOKEN
        },
        method: 'get',
    })

    // Generar lista a detalle del equipo audiovisual
    let listaEquipoDetail = []
    let equipoRecordDetail
    for(let i = 0; i < listaEquipo.list.length; i++){
        // Esperar un segundo por cada 5 peticiones
        if(i % 5 == 0)
            await new Promise((resolve) => setTimeout(resolve, 1000))

        // Obtener detalles
        equipoRecordDetail = await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mcc4adsnscn92bb/records/${listaEquipo.list[i].Id}`, {
            headers: {
                'xc-token': process.env.NOCODB_TOKEN
            },
            method: 'get',
        })

        // Agregar a lista
        listaEquipoDetail.push(equipoRecordDetail)
    }

    // Agregar propiedad "list" con los detalles del equipo audiovisual
    salidaRecord.list = listaEquipoDetail

    return salidaRecord
})
