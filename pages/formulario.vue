<template>
    <!-- Título -->
    <h1 color="primary" class="text-xl font-semibold tracking-wide uppercase text-center mt-2">
        Crear salida
    </h1>

    <!-- Formulario para datos básicos -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center sm:text-center my-4">
        <!-- Nombre -->
        <div class="sm:basis-auto px-4">
            <UFormField label="Nombre de responsable" name="responsable">
                <UInput v-model="formData.nombre" />
            </UFormField>
        </div>

        <!-- Fecha (con calendario desplegable) -->
        <div class="sm:basis-auto px-4">
            <UFormField label="Fecha de salida">
                <UPopover>
                    <UButton color="neutral" variant="subtle" icon="i-mdi-calendar">
                        {{ calendar ? df.format(calendar.toDate(getLocalTimeZone())) : 'Seleccionar fecha' }}
                    </UButton>
                    <template #content>
                        <UCalendar v-model="calendar" class="p-2" />
                    </template>
                </UPopover>
            </UFormField>
        </div>
    </div>

    <!-- <div class="flex px-4 py-3.5 border-b border-(--ui-border-accented)">
      <UInput
        :model-value="table?.tableApi?.getColumn('email')?.getFilterValue() as string"
        class="max-w-sm"
        placeholder="Filter emails..."
        @update:model-value="table?.tableApi?.getColumn('email')?.setFilterValue($event)"
      />
    </div> -->

    <UTable :data="inventario.list" :columns="columnas" v-model:row-selection="rowSelection" @select="onSelect" v-model:column-filters="columnFilters" class="flex-1 cursor-pointer">
        <template #Imagen-cell="{ row }">
            <img :src="row.original.Imagen ? row.original.Imagen[0].thumbnails.small.signedUrl : '/perrito.jpeg'" class="rounded"/>
        </template>
    </UTable>
</template>

<script setup>
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date' // calendar

// Información de base de datos
const { data:inventario } = await useFetch('https://app.nocodb.com/api/v2/tables/mcc4adsnscn92bb/records/', {
    headers: {
        'xc-token': process.env.NOCODB_TOKEN
    },
    query: {
        limit: 100
    }
})

const UCheckbox = resolveComponent('UCheckbox')

// Lista del equipo audiovisual seleccionado. Según la definición en base de datos
const equipoSeleccionado = computed(() => {
    const listaEquipo = []
    for(let i in rowSelection.value)
        listaEquipo.push(inventario.value.list[i])
    return listaEquipo
})

const columnas = [
    {
        // accessorKey: 'Id',
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
    {
        accessorKey: 'Número de serie',
        header: '# Serie',
    },
    {
        accessorKey: 'Número de inventario',
        header: '# Inventario',
    },
    {
        accessorKey: 'Imagen',
    }
]

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

const columnFilters = ref([
  {
  }
])

// Datos para el calendario
const df = new DateFormatter('es-US', {
  dateStyle: 'medium'
})
const modelValue = shallowRef(new CalendarDate(2025, 3, 27))
const dateFormat = new DateFormatter('en-US', { dateStyle: 'medium' })
const calendar = shallowRef(new CalendarDate(2025, 3, 27))

// Datos del formulario
const formData = reactive({
    nombre: '',
})

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