<template>
  <UApp>

    <div class="w-full max-w-lg mx-auto my-6">
      <UStepper :items="steps" v-model="activeStepIndex" disabled size="xs" />
    </div>

    <UContainer>
      <NuxtPage />
    </UContainer>

  </UApp>
</template>

<script setup>

const route = useRoute()

// Define los pasos con títulos e íconos
const steps = ref([
  { title: 'Inicio', icon: 'i-mdi-home', to: '/' },
  { title: 'Selección', icon: 'i-mdi-video-input-component', to: '/formulario' },
  { title: 'Preliminar', icon: 'i-mdi-clipboard-check-outline', to: '/preliminar' }
])

const activeStepIndex = computed(() => {
  const index = steps.value.findIndex(step => step.to === route.path)
  return index
})

onMounted(() => {
  // Elimina los datos almacenados en el local storage
  localStorage.removeItem('preliminar-id')
  localStorage.removeItem('preliminar-fecha')
  localStorage.removeItem('preliminar-motivo')
  localStorage.removeItem('preliminar-responsable')
  localStorage.removeItem('preliminar-lista')
})
</script>
