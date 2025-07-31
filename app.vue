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

// Sirve para actualizar correctamente el 'stepper' actual en los cambios de la url
const activeStepIndex = computed(() => {
  const index = steps.value.findIndex(step => step.to === route.path)
  return index
})

</script>
