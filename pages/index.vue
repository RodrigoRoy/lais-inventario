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
      <UButton to="/formulario" target="_self" size="xl" icon="i-mdi-plus-box" color="primary" >
        Crear nueva salida
      </UButton>
    </div>
      
    <!-- Sección para historial de salidas -->
    <section class="my-10 max-w-2xl mx-auto px-6">
      <h2 class="text-2xl font-semibold text-primary mb-6">Historial de salidas</h2>

      <div class="max-h-[370px] overflow-y-auto pr-2">
        <div class="grid gap-6 sm:grid-cols-1">
          <div v-for="salida in salidas" :key="salida.Id" class="border rounded-lg p-5" >
              
            <div class="flex justify-between items-start">
              <div>
                <p class="text-xs uppercase">Fecha</p>
                <p class="text-md font-semibold">{{ salida.Fecha }}</p>
              </div>
              <UButton :to="`../preliminar?Id=${salida.Id}`" size="md" icon="i-mdi-eye" variant="soft" > Ver Detalles </UButton>
            </div>
                      
            <div  class="mt-4">
              <p class="text-xs uppercase">Responsable</p>
              <p class="text-md font-semibold">{{ salida.Responsable }}</p>
            </div>
    
            <div class="my-5">
              <p class="text-xs uppercase">Usos</p>
              <ul class="list-disc list-inside font-semibold">
                <li v-for="(uso, index) in salida.Usos" :key="index"> {{ uso }} </li>
              </ul>
            </div>
              
            <div>
              <p class="text-xs uppercase">Cantidad de equipo solicitado</p>
              <p class="text-md font-semibold">{{ salida['Lista de equipo'] }}</p>
            </div>

          </div>  
        </div>  
      </div>  
    </section>
  </section>
</template>

<script setup>
const { data: salidaDB } = await useFetch('api/salidas')

// Convierte la lista de información en una lista para poder operar directamente con ella
const salidas = computed(() => {
  if (!salidaDB.value?.list) return []

  return salidaDB.value.list.map( (item) => ({
    ...item,
    Usos: item.Usos ? item.Usos.split(',') : [],
  }))
})

</script>