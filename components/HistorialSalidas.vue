<template>
    <!-- Sección para historial de salidas -->
  <section class="max-w-5xl mx-auto my-10 px-4">
    <h2 class="text-2xl font-semibold text-primary mb-8">Historial de salidas</h2>

    <UTable :columns="columnas" :data="salidas" sticky resizable class="rounded-lg border border-purple-200 shadow-md overflow-x-auto text-start shadow-md border border-purple-700 [&_thead]:bg-purple-800 [&_tbody_tr:hover]:bg-purple-800/50 [&_td]:border-purple-700 [&_th]:border-purple-700" v-model:column-visibility="columnVisibility" >
      
        <template #Fecha-cell="{ row }">
            <div v-if="isMobile">
                {{ fechaCorta(row.original.Fecha) }}
            </div>
            <div v-else>
                {{ formatoFecha(row.original.Fecha)  }}
            </div>
        </template>

        <template #Usos-cell="{ row }">
            <ul class="max-h-30 overflow-y-auto list-disc list-inside text-sm">
                <li v-for="(uso, index) in row.original.Usos" :key="index">{{ uso }}</li>
            </ul>
        </template>

        <template #Acciones-cell="{ row }">
            <div class="flex items-center gap-3">
                {{ row.original['Lista de equipo'] }}

                <UButton icon="i-mdi-file-document-arrow-right" size="sm" :color="new Date() < new Date( row.original.Fecha ) ? 'primary' : 'neutral'" variant="soft" class="ml-5 cursor-pointer" @click="setLocalStorage(row.original)" :loading="isLoadingID === row.original.Id" loading-icon="i-mingcute-loading-fill">
                    {{ new Date() < new Date( row.original.Fecha ) ? 'Editar ' : 'Copiar lista' }}
                </UButton>
            </div>
        </template>
    </UTable>
  </section>
</template>

<script setup>
const props = defineProps({
    salidas: { type: [Object], required: true  }
})

// ID de la salia que se desea editar
const isLoadingID = ref('')
// Columnas para UTable
const columnas = [
    {
        accessorKey: 'Id', 
        header: 'ID' 
    },
    {
        accessorKey: 'Fecha', 
        header: 'Fecha salida' 
    },
    {
        accessorKey: 'Usos', 
        header: 'Usos / Motivos',
    },
    {
        accessorKey: 'Responsable', 
        header: 'Responsable',
    },
    {
        accessorKey: 'Acciones', 
        header: 'Cantidad de equipo' 
    },
]

// Composable que reacciona al tamaño de la pantalla.
const { isMobile } = useIsMobile()
// Columnas que queremos ver en mobile
const mobileVisibleColumns = ['Fecha', 'Acciones']
/**
 * Estado reactivo de visibilidad de las columnas. Requiere 3 parámetros:
 * - isMobile -> Estado reactivo para saber si es mobile o desktop
 * - columnas -> Las columnas totales de la tabla
 * - mobileVisibleColumns -> Un array con el nombre en 'accesorKey' de las columnas que se vean cuando sea mobile
 */
const { columnVisibility } = useResponsiveColumns( isMobile, columnas, mobileVisibleColumns )

/**
 * Almacena datos sobre la salida en localStorage del navegador, para copiar una salida
 * Los datos que se almacenan son:
 * - Id de la Salida
 * - Fecha
 * - Motivo o usos
 * - Nombre de responsable
 */
async function setLocalStorage(salidaActual){
    // Asigna el ID del botón al que se le da clic
    isLoadingID.value = salidaActual.Id

    // Información de base de datos
    const data = await $fetch(`/api/salidas/${salidaActual.Id}`)

    // Eliminar el ID si es actualización, insertar ID si es una copia
    if ( new Date() < new Date( salidaActual.Fecha ) ) 
        localStorage.setItem('preliminar-id', salidaActual.Id)
    else 
        localStorage.removeItem('preliminar-id')

    // Guardar la información importante en el local storage, para copia
    localStorage.setItem('preliminar-fecha', salidaActual.Fecha)
    localStorage.setItem('preliminar-motivo', salidaActual.Usos)
    localStorage.setItem('preliminar-responsable', salidaActual.Responsable)
    // Iteracion para obtener id's del equipo audiovisual
    let preliminarEquipo = []
    for(const equipo of data.list)
        preliminarEquipo.push(equipo.Id)
    localStorage.setItem('preliminar-equipo', preliminarEquipo)
    await insertarLista(preliminarEquipo)

    await navigateTo({
      path: '/formulario',
    })
}

/**
 * Devuelve el formato correcto de las fechas
 * @param fecha La fecha con formato AAAA-MM-DD
 * @returns Una fecha con correcto formato para usar en Date: DD/MM/AAAA
 */
function fechaCorta( fecha ){
    if(!fecha) return ""
    let newFecha = fecha.split("-")
    return newFecha[2] + "/" + newFecha[1] + "/" + newFecha[0]
}

</script>
