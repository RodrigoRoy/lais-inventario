/**
 * Evento que te dice si la visualización es menor (True) o mayor que 880 px.
 * @returns { Boolean } True si es menor de 880 px, False si es mayor. 
 */
export default function () {
  const isMobile = ref(false)

  function checkIsMobile () {
    isMobile.value = window.innerWidth < 880
  }

  onMounted(() => {
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkIsMobile)
  })

  return { isMobile }
}
