<template>
  <!-- Sección hero principal -->
  <section class="text-center py-12 px-6 space-y-6 bg-background rounded-xl shadow-sm border border-muted-foreground/10 max-w-4xl mx-auto">
    
    <!-- Título -->
    <h1 class="text-3xl font-bold tracking-wide text-primary uppercase">
      Inventario de equipo audiovisual
    </h1>

    <!-- Subtítulo -->
    <p class="text-muted-foreground text-base font-light max-w-xl mx-auto">
      Aplicación para la generación del formato de bienes en tránsito. Comienza una nueva salida para registrar los equipos seleccionados.
    </p>

    <!-- Icono decorativo grande -->
    <div class="flex justify-center">
      <UIcon name="i-mdi-package-variant-closed" class="text-primary text-6xl" />
    </div>

    <!-- Botón de acción -->
    <div class="flex justify-center">
      <UButton to="/formulario" target="_self" size="lg" icon="i-mdi-plus-box" color="primary" class="mt-4" >
        Crear nueva salida
      </UButton>
    </div>
    
  </section>
</template>
