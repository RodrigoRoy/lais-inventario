<template>
    <!-- Título -->
    <div class="text-center mt-2">
        <h1 color="primary" class="text-xl font-semibold tracking-wide uppercase">
            Inventario de equipo audiovisual
        </h1>
    
        <p class="text-center text-sm font-thin">
            Aplicación para la generación del formato de bienes en tránsito.
        </p>
    </div>

    <!-- Opciones iniciales -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center text-center">
        <!-- Comenzar un registro -->
        <div class="sm:basis-auto px-4">
            <p class="mt-6">
                Probar formulario de selección de equipo
            </p>
            <UButton color="primary" class="mt-2" to="/formulario" target="_blank">Crear salida</UButton>
        </div>

        <!-- Enlace a base de datos -->
        <div class="sm:basis-auto px-4">
            <p class="mt-6">
                Consultar base de datos de equipo audiovisual
            </p>
            <UButton color="primary" class="mt-2" to="https://app.nocodb.com/#/nc/view/cd31340b-a706-42fe-9739-1f00d5494cca" target="_blank">Noco DB</UButton>
        </div>
    </div>

</template>