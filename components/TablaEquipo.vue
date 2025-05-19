<template>
    <UTable :data="lista" :columns="columnas" v-model:row-selection="rowSelection" @select="onSelect" v-model:column-filters="columnFilters" sticky class="flex-1 cursor-pointer max-h-[75vh]">

        <!-- Columna "Selección" (checkbox) -->
        <template v-if="props.cantidad" #Cantidad-cell="{ row }">
            <UInputNumber v-model="row.original.Cantidad" :default-value="1" :min="0" :max="3" size="sm" />
        </template>

        <!-- Columna "Imagen" -->
        <template #Imagen-cell="{ row }">
            <img :src="row.original.Imagen ? row.original.Imagen[0].thumbnails.small.signedUrl : '/perrito.jpeg'" class="rounded"/>
        </template>
    </UTable>
</template>

<script setup>
/**
 * Propiedades del componente
 * @param lista Lista de equipo audiovisual (según DB)
 * @param select Muestra / oculta columna "Selección"
 * @param cantidad Muestra / oculta columna "Cantidad"
 * @param serie Muestra / oculta columna "# Serie"
 * @param inventario Muestra / oculta columna "# Inventario"
 */
const props = defineProps({
    lista: {type: [Object], required: true},
    select: {type: Boolean},
    cantidad: {type: Boolean},
    serie: {type: Boolean},
    inventario: {type: Boolean},
})

const UCheckbox = resolveComponent('UCheckbox')

// Lista del equipo audiovisual seleccionado. Según la definición en base de datos
const equipoSeleccionado = computed(() => {
    const listaEquipo = []
    for(let i in rowSelection.value)
        listaEquipo.push(lista.value[i])
    return listaEquipo
})

// Definición de las columnas para elemento <UTable>
let columnas = [
    {
        accessorKey: 'Id',
        id: 'select',
        header: 'Selección',
        cell: ({ row }) => h(UCheckbox, {
            modelValue: row.getIsSelected(),
            'onUpdate:modelValue': (value) => row.toggleSelected(!!value),
            'aria-label': 'Seleccionar fila'
        })
    },
    {
        accessorKey: 'Nombre',
        header: 'Nombre',
    },
    {
        accessorKey: 'Uso',
        header: 'Uso',
        cell: ({ row }) => h('div', {class: `inline-flex items-center rounded-md ${assignColor(row.getValue('Uso'))} px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset`}, row.getValue('Uso') || 'Desconocido')
    },
    {
        accessorKey: 'Infraestructura',
        header: 'Tipo',
    },
]

// Agregar columna serie, según props
if(props.serie) columnas.push({accessorKey: 'Número de serie', header: '# Serie' })

// Agregar columna inventario, según props
if(props.inventario) columnas.push({accessorKey: 'Número de inventario', header: '# Inventario' })

// Agregar columna de imagen
columnas.push({accessorKey: 'Imagen'})

// Agregar columna cantidad, según props
if(props.cantidad) columnas.push({accessorKey: 'Cantidad', header: 'Cantidad' })

// Objeto con los índices del equipo seleccionado en <UTable>
const rowSelection = ref({})

/**
 * Selecciona un equipo audiovisual. Determina el comportamiento del evento
 * select en cada fila de la tabla.
 * @param row Fila de la table
 * @param event Evento de select
 */
function onSelect(row, event) {
  row.toggleSelected(!row.getIsSelected())
}

/**
 * Asigna un color según el tipo de uso del equipo audiovisual
 * @param {string} uso Texto que represnta el tipo de equipo
 * @return {string} Nombre del color en formato TailwindCSS
 */
const assignColor = (uso) => {
    const colores = {
        'Fotografía': 'bg-sky-300',
        'Video': 'bg-yellow-300',
        'Audio': 'bg-red-300',
        'Cargador': 'bg-slate-300',
        'Iluminación': 'bg-orange-300',
        'Dictado / transcripción': 'bg-emerald-300',
        'Reproductor': 'bg-purple-300',
        'Cómputo': 'bg-cyan-300',
        'Batería': 'bg-teal-300',
        'Extensiones': 'bg-amber-300',
    }
    return colores[uso] || 'bg-neutral-300';
}

/**
 * Asigna un icono según el tipo de uso del equipo audiovisual
 * @param {string} uso Texto que represnta el tipo de equipo
 * @return {string} Nombre del icono en formato NuxtUI
 */
// const assignIcon = (uso) => {
//     const icon = {
//         'Fotografía': 'i-mdi-camera',
//         'Video': 'i-mdi-video',
//         'Audio': 'i-mdi-volume',
//         'Cargador': 'i-mdi-power-plug-battery',
//         'Iluminación': 'i-mdi-lightbulb',
//         'Dictado / transcripción': 'i-mdi-message-text',
//         'Reproductor': 'i-mdi-disc-player',
//         'Cómputo': 'i-mdi-laptop',
//         'Batería': 'i-mdi-battery',
//         'Extensiones': 'i-mdi-power-plug',
//     }
//     return icon[uso] || 'i-mdi-help-rhombus'
// }
</script>