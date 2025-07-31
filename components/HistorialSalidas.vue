<template>
    <!-- Sección para historial de salidas -->
  <section class="max-w-5xl mx-auto my-10 px-4">
    <h2 class="text-2xl font-semibold text-primary mb-8">Historial de salidas</h2>

    <UTable :columns="columnas" :data="salidas" sticky resizable class="rounded-lg border border-gray-200 shadow-md overflow-hidden text-start shadow-md border border-gray-700 [&_thead]:bg-gray-800 [&_tbody_tr:hover]:bg-gray-800/50 [&_td]:border-gray-700 [&_th]:border-gray-700" >
      
        <template #Usos-cell="{ row }">
            <ul class="max-h-30 overflow-y-auto list-disc list-inside text-sm">
                <li v-for="(uso, index) in row.original.Usos" :key="index">{{ uso }}</li>
            </ul>
        </template>

        <template #Acciones-cell="{ row }">
            {{ row.original['Lista de equipo'] }}
            <UButton :to="'/formulario'" icon="i-mdi-file-document-arrow-right" size="sm" :color="new Date()<new Date(row.original.Fecha) ? 'primary' : 'neutral'" variant="soft" class="ml-5" @click="setLocalStorage(row.original)" >
                {{ new Date()<new Date(row.original.Fecha) ? 'Editar ' : 'Copiar lista' }}
            </UButton>
        </template>

    </UTable>
  </section>
</template>

<script setup>
const props = defineProps({
    salidas: { type: [Object], required: true  }
})

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

/**
 * Almacena datos sobre la salida en localStorage del navegador, para copiar una salida
 * Los datos que se almacenan son:
 * - Id de la Salida
 * - Fecha
 * - Motivo o usos
 * - Nombre de responsable
 */
async function setLocalStorage(salidaActual){
    // Información de base de datos
    const data = await $fetch(`/api/salidas/${salidaActual.Id}`)

    // Eliminar el ID si es actualización, insertar ID si es una copia
    if (new Date()<new Date(salidaActual.Fecha) ) 
        localStorage.setItem('preliminar-id', salidaActual.Id)
    else 
        localStorage.removeItem('preliminar-id')

    localStorage.removeItem('preliminar-lista')
    
    // Guardar la información importante en el local storage, para copia
    localStorage.setItem('preliminar-fecha', salidaActual.Fecha)
    localStorage.setItem('preliminar-motivo', salidaActual.Usos)
    localStorage.setItem('preliminar-responsable', salidaActual.Responsable)
    // Iteracion para obtener id's del equipo audiovisual
    let preliminarEquipo = []
    for(const equipo of data.list)
        preliminarEquipo.push(equipo.Id)
    localStorage.setItem('preliminar-equipo', preliminarEquipo)
}
</script>