/**
 * Devuelve el formato correcto de las fechas
 * @param fecha La fecha con formato DD-MM-AAAA
 * @returns Una fecha con correcto formato para usar en Date: AAAA-MM-DD
 */
/*
export function parseDate(stringDate){
    if(!stringDate) return ""
    let newFecha = stringDate.split("-")
    return newFecha[2] + "-" + newFecha[1] + "-" + newFecha[0]
}*/

/**
 * Convierte una fecha numérica en una fecha textual
 * @param {String} fecha Fecha en formato DD-MM-YYYY
 * @returns Fecha en formato DD de MMMM de YYYY
 */
export function formatoFecha(fecha){
    const date = new Date ( fecha )
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })
}

/**
 * Se obtiene una lista del equipo para que coincida con la tabla, y se ingresa en localStorage como el ejemplo que sigue:
 * preliminar-lista <- { 5: true, 30: true }
 * @param {String} preliminarEquipo Índices del equipo seleccionado según BD
 */
export async function insertarLista(preliminarEquipo){

    try{
        const lista = await $fetch('/api/equipo')
    
        // Iteramos para encontrar los id's de la tabla
        // Ejemplo: preliminar-equipo: 4,25
        //          tablaFinal: { 5: true, 30: true }
        // Donde 5 y 30 son índices de la tabla que corresponden a equipos con id 4 y 25.
        let i = 0
        let j = 0
        let tablaFinal = {}
        for(const equipo of lista.list){
            if (equipo.Id === preliminarEquipo[j]){
                tablaFinal[i] = true
                j++
            }
            i++
        }
        localStorage.setItem('preliminar-lista', JSON.stringify(tablaFinal))
    } catch(error){
        throw createError({
        statusCode: error?.statusCode || 500,
        statusMessage: 'Database error'
    })
    }
}