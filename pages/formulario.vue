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
                        {{ calendar ? dateFormat.format(calendar.toDate(getLocalTimeZone())) : 'Seleccionar fecha' }}
                    </UButton>
                    <template #content>
                        <UCalendar v-model="calendar" class="p-2" />
                    </template>
                </UPopover>
            </UFormField>
        </div>

        Ejemplo emit: <pre> {{ inventarioFinal }} </pre>

    </div>

    <!-- Lista de equipo audiovisual -->
    <TablaEquipo :lista=inventario.list select serie inventario v-model:inventarioFinal="inventarioFinal"/>

</template>

<script setup>
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

// Información de base de datos
const { data: inventario } = await useFetch('/api/equipo')

const inventarioFinal = ref([])

// Datos para el calendario
const dateFormat = new DateFormatter('es-MX', { dateStyle: 'medium' })
const today = new Date()
const calendar = shallowRef(new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()))

// Datos del formulario
const formData = reactive({
    nombre: 'Rodrigo Colin Rivera',
})
</script>