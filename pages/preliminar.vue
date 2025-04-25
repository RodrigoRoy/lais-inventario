<template>
    <!-- Título -->
    <h1 color="primary" class="text-xl font-semibold tracking-wide uppercase text-center my-2">
        Vista preliminar
    </h1>

    <!-- En caso de error con API  -->
    <UAlert v-if="error" title="No hay información para mostrar" description="Verifica la conexión a internet y/o el número de registro en base de datos." icon="i-mdi-emoticon-sad" color="error" variant="subtle" :actions="[{label: 'Crear nueva salida', href: '/formulario', color: 'neutral', variant: 'subtle'}]" orientation="horizontal" />

    <!-- Si no hay error, mostrar datos para comprobación -->
    <div v-else>
        <p> Fecha: {{ salida.Fecha }} </p>
        <p> Motivo: {{ salida.Usos }} </p>

        <!-- Lista de equipo audiovisual -->
        <TablaEquipo :lista=salida.list />
    </div>

</template>

<script setup>
// Acceso a URL querie "record"
const route = useRoute()

// Información de base de datos
const { data: salida, error } = await useFetch(`/api/salidas/${route.query.record}`)
</script>