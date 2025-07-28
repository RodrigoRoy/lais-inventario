<template>
    <!-- Sección para historial de salidas -->
  <section class="max-w-5xl mx-auto my-10 px-4">
    <h2 class="text-2xl font-semibold text-primary mb-8">Historial de salidas</h2>

    <UTable :columns="columnas" :data="salidas" sticky resizable class="rounded-lg border border-gray-200 shadow-md overflow-hidden text-start shadow-md border border-gray-700 [&_thead]:bg-gray-800 [&_tbody_tr:hover]:bg-gray-800/50 [&_td]:border-gray-700 [&_th]:border-gray-700" >
      
        <!-- SLOT: Usos -->
        <template #Usos-cell="{ row }">
            <ul class="max-h-30 overflow-y-auto list-disc list-inside text-sm">
                <li v-for="(uso, index) in row.original.Usos" :key="index">{{ uso }}</li>
            </ul>
        </template>

        <!-- SLOT: Acciones -->
        <template #Acciones-cell="{ row }">
            {{ row.original['Lista de equipo'] }}
            <UButton :to="`/preliminar?Id=${row.original.Id}`" icon="i-mdi-eye" size="sm" color="primary" variant="soft" class="ml-5" >
            Ver detalles
            </UButton>
        </template>

    </UTable>
  </section>
</template>

<script setup>
const { data: salidaDB } = await useFetch('api/salidas')

// Adaptar los datos para la tabla
const salidas = computed(() => {
  if (!salidaDB.value?.list) return []

  return salidaDB.value.list.map((item) => ({
    ...item,
    Usos: item.Usos ? item.Usos.split(',') : [],
  }))
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

</script>