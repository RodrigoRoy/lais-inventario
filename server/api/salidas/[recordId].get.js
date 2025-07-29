/**
* Información completa de una salida de equipo audiovisual
* @return Object - Esquema completo del registro/record solicitado
* {
*  "Id": 0,
*  "Fecha": "string",
*  "Lista de equipo": 0,
*  "Usos": "string",
*  "Responsable": string,
*  "list": [{Equipo audiovisual}]
* }
*/

export default defineEventHandler(async (event) => {
    // Id de la "Salida" solicitada
    const recordId = getRouterParam(event, 'recordId')
    let salidaRecord
    try{
        // Datos básicos de "Salida" (no incluye campos tipo "Link to Another Record")
        salidaRecord = await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mxylas8z9l8ohr1/records/${recordId}`, {
            headers: {
                'xc-token': process.env.NOCODB_TOKEN
            },
            method: 'get',
        })
    } catch(err){
        return sendError(event, createError({
            statusCode: 404,
            statusMessage: 'Registro de salida no encontrado'
        }))
    }
    
    // Lista parcial del equipo audiovisual. Incluye "Id" y "Nombre"
    const listaEquipo = await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mxylas8z9l8ohr1/links/c4tp3pyfg9eihbf/records/${recordId}`, {
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

    // Esperar 1 segundo para no exceder peticiones máximas a NocoDB
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Respuesta personalizada con Id, Fecha, Cantidad de equipo, Usos, Responsable y lista detallada de equipo
    return salidaRecord
})
