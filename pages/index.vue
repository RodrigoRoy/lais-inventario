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

    <!-- Botones -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      
      <!-- Botón de acción -->
      <UButton to="/formulario" target="_self" size="xl" icon="i-mdi-plus-box" color="primary" @click="eliminaDatosBorrador">
        Crear nueva salida
      </UButton>
      
      <!-- Botón de borrador. Se activa si existe un borrador en curso. -->
      <UButton v-if="existeListaPreliminar" to="/formulario" color="success" variant="soft" size="lg" icon="i-mdi-pencil" class="cursor-pointer" >
        Modificar borrador actual
      </UButton>

    </div>

    <HistorialSalidas :salidas="salidasRecientes" />
  </section>
</template>

<script setup>
// Salidas recientes para componente de historial de salidas
const { data } = await useFetch('/api/salidas')

// Adaptar los datos para la tabla
function salidaDB(){
  if (!data.value?.list) return []
  
  return data.value.list.map((item) => ({
    ...item,
    Usos: item.Usos ? item.Usos.split(',') : [],
  }))
}

const salidasRecientes = ref(salidaDB())

const existeListaPreliminar = ref(false)

// Elimina los datos almacenados del borrador para crear una nueva salida
function eliminaDatosBorrador(){
    localStorage.removeItem('preliminar-id')
    localStorage.removeItem('preliminar-fecha')
    localStorage.removeItem('preliminar-motivo')
    localStorage.removeItem('preliminar-responsable')
    localStorage.removeItem('preliminar-lista')
}

onMounted(() => {
  existeListaPreliminar.value = !!localStorage.getItem('preliminar-lista')
})

</script>