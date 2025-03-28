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

    <!-- Lista de equipo audiovisual -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div v-for="equipo in inventario.list" :key="equipo.Id">
            <!-- Card para cada equipo audiovisual -->
            <UCard class="relative h-64 border-gray-700 bg-gray-800 border rounded-lg shadow-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105" :style="{ backgroundImage: `url(${equipo.Imagen ? equipo.Imagen[0].thumbnails.card_cover.signedUrl : ''})`, backgroundSize: 'cover', backgroundPosition: 'center' }" @click="toggleSaved(equipo.Id)">
                
                <!-- Icono para mostrar que se ha seleccionado en esquina superior derecha -->
                <div class="absolute top-1 right-1">
                    <Icon v-if="savedItems.has(equipo.Id)" name="mdi:bookmark" class=" text-2xl"/>
                </div>
                
                <!-- Datos del equipo en la parte inferior -->
                <div class="absolute bottom-2 text-start">
                    <div class="backdrop-blur-sm rounded-b-lg px-1">
                        <p class="text-sm font-light">
                            {{ equipo.Infraestructura }}
                        </p>
                        <p class="text-md -mt-1">
                            {{ equipo.Nombre || '(Sin nombre)' }}
                        </p>
                    </div>
                    <!-- Etiqueta del tipo de equipo -->
                    <UBadge size="md" variant="subtle" :icon="assignIcon(equipo.Uso)" class="text-gray-800 rounded-full" :class="assignColor(equipo.Uso)">
                        {{ equipo.Uso || 'Desconocido' }}
                    </UBadge>
                </div>
            </UCard>
        </div>
    </div>
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

// Datos para el calendario (TO DO: Allow spanish)
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

// Estructura para guardar los equipos marcados
const savedItems = ref(new Set())

/**
 * Quita o agrega un equipo según su id
 * @param {string} id Id del equipo audiovisual
 */
const toggleSaved = (id) => {
    if (savedItems.value.has(id))
        savedItems.value.delete(id)
    else
        savedItems.value.add(id)
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
const assignIcon = (uso) => {
    const icon = {
        'Fotografía': 'i-mdi-camera',
        'Video': 'i-mdi-video',
        'Audio': 'i-mdi-volume',
        'Cargador': 'i-mdi-power-plug-battery',
        'Iluminación': 'i-mdi-lightbulb',
        'Dictado / transcripción': 'i-mdi-message-text',
        'Reproductor': 'i-mdi-disc-player',
        'Cómputo': 'i-mdi-laptop',
        'Batería': 'i-mdi-battery',
        'Extensiones': 'i-mdi-power-plug',
    }
    return icon[uso] || 'i-mdi-help-rhombus'
}
</script>