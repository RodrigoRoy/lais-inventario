<template>
    <!-- Título -->
    <h1 color="primary" class="text-xl font-semibold tracking-wide uppercase text-center mt-2">
        Documento
    </h1>

    <div class="flex flex-col sm:flex-row gap-4 justify-center sm:text-center my-4">
        <!-- Generar documento docx -->
        <ExportDocx :salida="salida" text="Crear documento (Id 1)" />
    </div>
</template>

<script setup>
// Información de base de datos (este es un ejemplo con el registro con Id 1)
const { data:salida } = await useFetch('/api/salidas/1')
</script>