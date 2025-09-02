<template>
    <div class="flex flex-col flex-1" w-full>

        <div v-if="!soloVisualizacion" class="flex pr-4 pt-4 border-b border-accented">
            <div class="flex flex-col md:flex-row items-center gap-4 mb-4">
                <UInput v-model="filtroGlobal" icon="i-mdi-magnify" class="max-w-sm" placeholder="Buscar equipo..." ></UInput>
            </div>
        </div>
        
        <!-- Modo seleccionar equipo (formulario) -->
        <UTable v-if="!soloVisualizacion" :data="lista" :columns="columnas" v-model:row-selection="rowSelection" @select="onSelect" v-model:global-filter="filtroGlobal" v-model:sorting="sorting" sticky class="flex-1 cursor-pointer pointer max-h-[70vh] table-fixed w-full" resizable>
            <!-- Columna "Imagen" -->
            <template #Imagen-cell="{ row }">
                <div class="flex h-full ">
                    <img :src="row.original.Imagen ? row.original.Imagen[0].thumbnails.small.signedUrl : '/LogoLAIS.png'" class="max-w-[128px] max-h-[128px] object-cover rounded shadow-sm bg-white/80"/>
                </div>
            </template>
        </UTable>

        <!-- Modo visualización (prelimianr) -->
        <UTable v-else :data="lista" :columns="columnas" sticky resizable class="overflow-all-auto  flex-1 w-full rounded-lg  text-purple-200 shadow-md border border-purple-700 [&_thead]:bg-purple-800 [&_tbody_tr:hover]:bg-purple-800/10 [&_td]:border-purple-700 [&_th]:border-purple-700" variant="subtle">
            <!-- Columna "Imagen" -->
            <template #Imagen-cell="{ row }">
                <div class="flex h-full ">
                    <img :src="row.original.Imagen ? row.original.Imagen[0].thumbnails.small.signedUrl : '/LogoLAIS.png'" class="max-w-[128px] max-h-[128px] object-cover rounded shadow-sm bg-white/80"/>
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
* @param soloVisualizacion Muestra / oculta la posibilidad de seleccionar un inventario o solo verlo
*/
const props = defineProps({
    lista: {type: [Object], required: true},
    select: {type: Boolean},
    cantidad: {type: Boolean},
    serie: {type: Boolean},
    inventario: {type: Boolean},
    soloVisualizacion: { type: Boolean, default: false },
    // inventarioFinal: { type: Array, default: () => [] } // Lista final emit
})

/**
* updateList
* Emite una lista actualizada del equipo audiovisual seleccionado
* @param lista {array} - Copia de la lista de equipo ("equipoSeleccionado")
*/
const emit = defineEmits(['updateList'])

const UCheckbox = resolveComponent('UCheckbox')
const UButton = resolveComponent('UButton')
const UinputNumber = resolveComponent('UInputNumber')

/**
* Sección de filtrado global
*/
const filtroGlobal = ref('')

// Objeto con los índices del equipo seleccionado en <UTable>
const rowSelection = ref({})

// Definición de las columnas para elemento <UTable>
let columnas = []
if (!props.soloVisualizacion && props.select) {
    columnas.push({
        accessorKey: 'Id',
        id: 'Seleccion',
        header: ({ column }) => getHeader(column, 'Seleccion'),
        cell: ({ row }) => h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value) => row.toggleSelected(!!value),
        'aria-label': 'Seleccionar fila'
    }),
        width: 200
    },)
}
// Columnas generales, siempre van
columnas.push(
{
    accessorKey: 'Nombre',
    id: 'Nombre',
    header: ({ column }) => getHeader(column, 'Nombre'),
    width: 200
},
{
    accessorKey: 'Uso',
    id: 'Uso',
    header: ({ column }) => getHeader(column, 'Uso'),
    cell: ({ row }) => h('div', {class: `inline-flex items-center rounded-md ${assignColor(row.getValue('Uso'))} px-2 py-1 text-xs text-neutral-900 font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset`}, row.getValue('Uso') || 'Desconocido'),
    width: 2200
},
{
    accessorKey: 'Infraestructura',
    id: 'Infraestructura',
    header: ({ column }) => getHeader(column, 'Tipo'),
    width: 200
},
)

/**
* ||| Sección de agregar columnas según props |||
*/

// Agregar columna de imagen
columnas.push
({
    accessorKey: 'Imagen',
    id: 'Imagen',
    width: 200,
    class: 'justify-start'
})

// Agregar columna serie, según props
if(props.serie) columnas.push
({
    accessorKey: 'Número de serie', 
    accessorKey: 'Número de serie', 
    id: 'Número de serie', 
    header: '# Serie',
    width: 200
})

// Agregar columna inventario, según props
if(props.inventario) columnas.push
({
    accessorKey: 'Número de inventario', 
    id: 'Número de inventario', 
    header: '# Inventario',
    width: 200
})
    
// Ordenación por defecto de la lista de equipo
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
    // Emitir evento en cada clic
    emit('updateList', rowSelection.value)
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

onMounted( async () => {
    /**
     * Para que el equipo seleccionado aparezca en la tabla, existen dos maneras.
     * La primera es cuando accedes desde /preliminar, ya que existe en local storage la información del equipo seleccionado en la tabla, solo es acceder a ese valor y ya quedó.
     * La segunda es cuando accedes desde /index. pues es una copia, y entonces debes de obtener los id's del equipo para poder saber que lugar ocupan en la tabla y así se pueda seleccionar.
     */

    // En caso de actualización, encontrar los valores de la tabla
    if (localStorage.getItem('preliminar-equipo')) {
        //TODO: Mover esta funcion a utils/index.vue, utilizar la funcion en lugar de crear preliminar-equipo, y buscar donde se elimina la prelminar-lista para ver si es correcto eliminarla o simplemente la dejamos vacia ({})
        // Obtenemos los id del equipo audiovisual actual y lo borramos del localStorage
        const equipoSeleccionado = localStorage.getItem('preliminar-equipo').split(",").map(Number)
        localStorage.removeItem('preliminar-equipo')
        
        // Iteramos para encontrar los id's de la tabla
        // Ejemplo: preliminar-equipo: 4,25
        //          tablaFinal: { 5: true, 30: true }
        // Donde 5 y 30 son índices de la tabla que corresponden a equipos con id 4 y 25.
        let i = 0
        let j = 0
        let tablaFinal = {}
        for(const equipo of props.lista){
            if (equipo.Id === equipoSeleccionado[j]){
                tablaFinal[i] = true
                j++
            }
            i++
        }
        localStorage.setItem('preliminar-lista', JSON.stringify(tablaFinal))
        rowSelection.value = tablaFinal
    } else{
        // Obtener la lista del equipo audiovisual desde localStorage    
        rowSelection.value = localStorage.getItem('preliminar-lista') ? JSON.parse( localStorage.getItem('preliminar-lista') ) : {}
    }
})
</script>