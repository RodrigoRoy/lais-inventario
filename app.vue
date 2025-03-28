<template>
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
    label: 'Crear salida',
    icon: 'i-mdi-video-input-component',
    to: '/formulario',
  },
])
</script>