/**
 * Devuelve el formato correcto de las fechas
 * @param fecha La fecha con formato DD-MM-AAAA
 * @returns Una fecha con correcto formato para usar en Date: AAAA-MM-DD
 */
export function parseDate(stringDate){
    if(!stringDate) return ""
    let newFecha = stringDate.split("-")
    return newFecha[2] + "-" + newFecha[1] + "-" + newFecha[0]
}

/**
 * Convierte una fecha numérica en una fecha textual
 * @param {String} fecha Fecha en formato DD-MM-YYYY
 * @returns Fecha en formato DD de MMMM de YYYY
 */
export function formatoFecha(fecha){
    const date = new Date (parseDate(fecha))
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })
}