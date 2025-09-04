/**
 * Composable para manejar la visibilidad de columnas en una tabla (ej. UTable),
 * adaptándose automáticamente al tamaño de pantalla, ya sea mobile o desktop.
 * 
 * @param { Ref: boolean } isMobile - Referencia reactiva que indica si es una vista mobile (true si < 880 px).
 * @param { Array: Object } columns - Lista de columnas usadas en la tabla. Cada columna debe tener 'accessorKey'.
 * @param { Array: String } mobileVisibleColumns - Lista de claves ('accessorKey') de las columnas visibles solo en mobile.
 * 
 * @returns { Object } columnVisibility - Objeto reactivo con las claves de columnas y un valor booleano que indica si deben mostrarse.
 * 
 * @example
 * const { columnVisibility } = useResponsiveColumns( isMobile, columnas, [ 'Fecha', 'Acciones' ])
 * <UTable v-model:column-visibility = "columnVisibility" ... />
 */
export default function ( isMobile, columns, mobileVisibleColumns = [] ) {
  // Estado reactivo que guarda la visibilidad actual de cada columna
  const columnVisibility = ref({})

  // Función que genera el objeto de visibilidad basado en si es mobile o no
  function getVisibility( mobile ) {
    if ( mobile ) {
      // Solo muestra las columnas que están en 'mobileVisibleColumns'
      return Object.fromEntries(
        columns.map( col => [ col.accessorKey, mobileVisibleColumns.includes( col.accessorKey ) ])
      )
    } else {
      // Muestra todas las columnas
      return Object.fromEntries(
        columns.map( col => [ col.accessorKey, true ])
      )
    }
  }

  // Observa cambios en isMobile y actualiza la visibilidad automáticamente
  watch( isMobile, (val) => {
    columnVisibility.value = getVisibility( val )
  }, { immediate: true }) // Ejecutar también al montar el componente

  // Retorna el objeto reactivo que se puede conectar a UTable u otras tablas
  return { columnVisibility }
}
