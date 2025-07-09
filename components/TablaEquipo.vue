<template>
    <div class="flex flex-col flex-1" w-full>
        
        <div v-if="!soloVisualizacion" class="flex pr-4 pt-4 border-b border-accented">
            <div class="flex flex-col md:flex-row items-center gap-4 mb-4">
                <UInput v-model="filtroGlobal" icon="i-mdi-magnify" class="max-w-sm" placeholder="Buscar..." ></UInput>
            </div>
        </div>
        
        <UTable v-if="!soloVisualizacion" :data="lista" :columns="columnas" v-model:row-selection="rowSelection" @select="onSelect" v-model:global-filter="filtroGlobal" v-model:sorting="sorting" sticky class="flex-1 cursor-pointer pointer max-h-[70vh] table-fixed w-full" resizable>
            <!-- Columna "Imagen" -->
            <template #Imagen-cell="{ row }">
                <div class="flex items-center justify-center h-full ">
                    <img :src="row.original.Imagen ? row.original.Imagen[0].thumbnails.small.signedUrl : '/perrito.jpeg'" class="max-w-[200px] max-h-[200px] object-cover rounded shadow-sm"/>
                </div>
            </template>
        </UTable>
        <!-- Modo visualización -->
        <UTable v-else :data="lista" :columns="columnas" sticky resizable class="flex-1 max-h-[70vh] table-fixed w-full rounded-lg overflow-hidden bg-gray-900 text-gray-200 shadow-md border border-gray-700 [&_thead]:bg-gray-800 [&_tbody_tr:hover]:bg-gray-800/50 [&_td]:border-gray-700 [&_th]:border-gray-700" color="gray" variant="subtle">
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
    soloVisualizacion: { type: Boolean, default: false }
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

// Clave secreta (TODO: poner en .env despues)
    const SECRET = 'ClaveSecreta'

/**
* Sección de filtrado global
*/
const filtroGlobal = ref('')

// Lista del equipo audiovisual seleccionado. Según la definición en base de datos
const equipoSeleccionado = computed(() => {
    const listaEquipo = []
    const listaTabla = []
    // let idLista
    for(let i in rowSelection.value){
        // idLista = props.lista[i].Id
        listaEquipo.push(
        {
            "Id": props.lista[i].Id
        })
        listaTabla.push(i)
    }
    return { tableList: listaTabla, dataList: listaEquipo }
})

// Definición de las columnas para elemento <UTable>
    let columnas = []
    if (!props.soloVisualizacion && props.select) {    
        columnas.push({
            accessorKey: 'Id',
            id: 'Seleccion',
            header: ({ column }) => getHeader(column, 'Seleccion'),
            cell: ({ row }) => {
                const isSelected = row.getIsSelected()
                
                return isSelected
                ?   h(UinputNumber, {
                    modelValue: row.original.Cantidad,
                    'onUpdate:modelValue': (value) => {
                        row.original.Cantidad = value
                    },
                    variant: "outline",
                    placeholder: "0",
                    min: 1,
                    max: 10,
                    size: 'sm',
                    class: 'w-24',
                }, {
                    decrement: () => h(UButton, {
                        size: 'xs',
                        icon: 'i-lucide-minus'
                    }),
                    increment: () => h(UButton, {
                        size: 'xs',
                        icon: 'i-lucide-plus'
                    })
                })
                :   h(UCheckbox, {
                    modelValue: isSelected,
                    'onUpdate:modelValue': (value) => row.toggleSelected(!!value),
                    'aria-label': 'Seleccionar fila',
                })
            },
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
        cell: ({ row }) => h('div', {class: `inline-flex items-center rounded-md ${assignColor(row.getValue('Uso'))} px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset`}, row.getValue('Uso') || 'Desconocido'),
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
        width: 200
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
    
    // Objeto con los índices del equipo seleccionado en <UTable>
        const rowSelection = ref({})
        
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
            emit('updateList', equipoSeleccionado.value)
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
        
        onMounted(async () => {
            const idGuardado = localStorage.getItem(SECRET)
            const listaRowTabla = localStorage.getItem('listaTabla')
            
            if (listaRowTabla) {

                    const newTable = listaRowTabla.split(",")

                    console.log("lista tabla:", newTable)
                    const tabla = []

                    newTable.map(
                        (value) => {value : true}
                    )


                    console.log("tabla final ", newTable)
                    
                    
            } else {
                console.log("No se pudo obtener :c")
            }
            
        })
    </script>