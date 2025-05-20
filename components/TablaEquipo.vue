<template>
    <div class="flex flex-col flex-1" w-full>
        <div class="flex px-4 py-3.5 border-b border-accented">
        <UInput v-model="filtroGlobal" class="max-w-sm" placeholder="Buscar..." />
        </div>


        <UTable ref="tablaInventario" :data="lista" :columns="columnas" v-model:row-selection="rowSelection" @select="onSelect" v-model:global-filter="filtroGlobal" v-model:sorting="sorting" sticky class="flex-1 cursor-pointer pointer max-h-[75vh] table-fixed w-full">

            <!-- Columna "Selección" (checkbox) -->
            <template v-if="props.cantidad" #Cantidad-cell="{ row }">
                <UInputNumber v-model="row.original.Cantidad" :default-value="1" :min="0" :max="3" size="sm" />
            </template>

            <!-- Columna "Imagen" -->
            <template #Imagen-cell="{ row }">
                 <div class="flex items-center justify-center h-full ">
                     <img :src="row.original.Imagen ? row.original.Imagen[0].thumbnails.small.signedUrl : '/perrito.jpeg'" class="max-w-[200px] max-h-[200px] object-cover rounded shadow-sm"/>
                 </div>
            </template>

        </UTable>
    </div>
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
const UButton = resolveComponent('UButton')

/**
 * Sección de filtrado global
 */
const filtroGlobal = ref('')

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
        id: 'Seleccion',
        header: ({ column }) => getHeader(column, 'Seleccion'),
        cell: ({ row }) => h(UCheckbox, {
            modelValue: row.getIsSelected(),
            'onUpdate:modelValue': (value) => row.toggleSelected(!!value),
            'aria-label': 'Seleccionar fila'
        })
    },
    {
        accessorKey: 'Nombre',
        header: ({ column }) => getHeader(column, 'Nombre')
    },
    {
        accessorKey: 'Uso',
        header: ({ column }) => getHeader(column, 'Uso'),
        cell: ({ row }) => h('div', {class: `inline-flex items-center rounded-md ${assignColor(row.getValue('Uso'))} px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset`}, row.getValue('Uso') || 'Desconocido')
    },
    {
        accessorKey: 'Infraestructura',
        header: ({ column }) => getHeader(column, 'Tipo'),
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

// Objeto para la ordenación de una columna
const sorting = ref([
    {
        id: 'Seleccion',
        desc: false
    }
])

/**
 * Ordena una columna de forma ascendente o descendente.
 * @param column Los datos de la columna
 * @param label La etiqueta de la columna (accesorKey)
 */
function getHeader(column, label) {
    const isSorted = column.getIsSorted()

    // TODO:Ordenar por booleanos la selección
    if (label === "Seleccion") return "Selección"

    return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label,
                icon: isSorted 
                    ? isSorted === 'asc'
                        ? 'i-lucide-arrow-up-narrow-wide'
                        : 'i-lucide-arrow-down-wide-narrow'
                    : 'i-lucide-arrow-up-down',
                class: '-mx-2.5 data-[state=open]:bg-elevated',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
            })
}

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