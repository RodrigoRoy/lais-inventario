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
                <UInput v-model="formData.Responsable" placeholder="Nombre" />
            </UFormField>
        </div>

        <!-- Fecha (con calendario desplegable) -->
        <div class="sm:basis-auto px-4">
            <UFormField label="Fecha de salida">
                <UPopover>
                    <UButton color="neutral" variant="subtle" icon="i-mdi-calendar">
                        {{ calendar ? dateFormat.format(calendar.toDate(getLocalTimeZone())) : 'Seleccionar fecha' }}
                    </UButton>
                    <template #content>
                        <UCalendar v-model="calendar" class="p-2" />
                    </template>
                </UPopover>
            </UFormField>
        </div>

        <!-- Usos -->
        <div class="sm:basis-auto px-4">
            <UFormField label="Usos" name="responsable">
                <USelect v-model="usos" multiple :items="usosItems" class="w-48" required/>
            </UFormField>
        </div>

        <!-- Enviar información de salida a base de datos -->
        <div class="sm:basis-auto px-4 flex">
            <UButton color="success" variant="outline" size="lg" class="cursor-pointer" icon="mdi-keyboard-return" @click="submit">
                Siguiente
            </UButton>
        </div>

    </div>
    
    <!-- Lista de equipo audiovisual -->
    <TablaEquipo :lista=inventario.list select @update-list="(lista) => listaEquipo = lista"/>

</template>

<script setup>
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

// Información de base de datos
const { data: inventario } = await useFetch('/api/equipo')

// Lista actualizada de equipo (desde el componente <TablaEquipo>)
const listaEquipo = ref([])

// Datos para el calendario
const dateFormat = new DateFormatter('es-MX', { dateStyle: 'medium' })
const today = new Date()
const calendar = shallowRef(new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()))
const fechaComputed = computed(() => {
    return new Date(calendar.value.year, calendar.value.month-1, calendar.value.day)
})

// Posibles valores de 'usos' para la salida de equipo
const usosItems = ref(['Entrevista', 'Reprografía', 'Entrevista videograbada', 'Entrevista audiograbada', 'Trabajo de campo'])
const usos = ref(['Entrevista'])
const usosComputed = computed(() => {
    return usos.value.join(",")
})

// Datos del formulario
const formData = reactive({
    Fecha: fechaComputed,
    Usos: usosComputed,
    Responsable: '',
    Equipo: listaEquipo
})

/**
 * Envío de todos los datos para crear salida en la base de datos
 */
async function submit() {
    const nuevaSalida = await $fetch("/api/salidas", {
        method: 'post',
        body: formData
    })
    
    // Reenviar a vista preliminar
    await navigateTo({
        path: '/preliminar',
        method: 'post',
        query : {
            Id: nuevaSalida.Id
        }
    })
}

</script>