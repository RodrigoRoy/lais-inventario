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
</script>

<!-- <template>
  <UApp>
    <UNavigationMenu :items="navBar" class="w-full justify-center" />

    <UContainer>
      <NuxtPage />
    </UContainer>
  </UApp>
</template>

<script setup>
// Opciones de navegación

const navBar = ref([
  {
    label: 'Inicio',
    icon: 'i-mdi-home',
    to: '/',
  },
  {
    label: 'Selección',
    icon: 'i-mdi-video-input-component',
    to: '/formulario',
  },
  {
    label: 'Preliminar',
    icon: 'i-mdi-clipboard-check-outline',
    to: '/preliminar',
  },
  // {
  //   label: 'Documento',
  //   icon: 'i-mdi-file-document',
  //   to: '/documento',
  // },
])
</script> -->
