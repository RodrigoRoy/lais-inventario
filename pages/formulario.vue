<template>
    <!-- Título -->
    <h1 color="primary" class="text-xl font-semibold tracking-wide uppercase text-center mt-2">
        Seleccionar equipo
    </h1>

    <!-- Formulario para datos básicos -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center sm:text-center my-4">

        <div class="flex flex-col sm:flex-row gap-4 mt-5" >
            <UButton color="success" variant="outline" size="lg" icon="i-mdi-keyboard-return" to="/" class="cursor-pointer" @click="crearBorrador" >
                Regresar a Inicio
            </UButton>
        </div>

        <!-- Nombre -->
        <div class="sm:basis-auto px-4">
            <UFormField label="Nombre de responsable" name="responsable" :error="erroresEstado.Responsable">
                <UInput v-model="formData.Responsable" placeholder="Nombre" />
            </UFormField>
        </div>
        
        <!-- Fecha (con calendario desplegable) -->
        <div class="sm:basis-auto px-4">
            <UFormField label="Fecha de salida" :error="erroresEstado.Fecha">
                <UPopover>
                    <UButton color="neutral" variant="subtle" icon="i-mdi-calendar">
                        {{ calendar ? dateFormat.format(calendar.toDate(getLocalTimeZone())) : 'Seleccionar fecha' }}
                    </UButton>
                    <template #content>
                        <UCalendar v-model="calendar" class="p-2" />
                    </template>
                </UPopover>
            </UFormField>
        </div>
        
        <!-- Usos -->
        <div class="sm:basis-auto px-4">
            <UFormField label="Usos" name="usos" :error="erroresEstado.Usos">
                <USelect v-model="usos" multiple :items="usosItems" class="w-48" required/>
            </UFormField>
        </div>
        
        <!-- Enviar información de salida a base de datos -->
        <div class="flex flex-col sm:flex-row gap-4 justify-end items-center mt-5">
            
            <UButton color="success" variant="outline" size="lg" class="cursor-pointer" icon="mdi-cube-send" @click="submit" :loading="isLoading" loading-icon="i-mdi-cube-send">
                {{ isUpdate ? 'Actualizar salida' : 'Crear salida' }}
            </UButton>
        </div>
        
    </div>

    <!-- Error de selección de equipo -->
    <p v-if="erroresEstado.Equipo" class="text-red-500 text-sm text-left ">
        {{ erroresEstado.Equipo }}
    </p>

    <!-- Lista de equipo audiovisual -->
    <TablaEquipo :lista=inventario.list select @update-list="(lista) => listaTabla = lista" />
        
</template>

<script setup>
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { formularioSchema } from '~/utils/validacion.js'

// Información de base de datos
const { data: inventario } = await useFetch('/api/equipo')

// Determina si es actualización de una Salida o creación de una nueva Salida
const isUpdate = ref(false)

// Id de la Salida, según base de datos (en caso de actualización)
const idLista = ref(null)

// Determina si está cargando la información o no
const isLoading = ref(false)

// Lista del equipo audiovisual seleccionado. Según la definición en base de datos
const listaEquipo = computed(() => {
    const nuevoEquipo = []
    for(let i in listaTabla.value){
        nuevoEquipo.push(
        {
            "Id": inventario.value.list[i].Id
        })
    }
    return nuevoEquipo
})

// Lista actualizada de equipo (desde el componente <TablaEquipo>)
const listaTabla = ref({})

// Datos para el calendario
const dateFormat = new DateFormatter('es-MX', { dateStyle: 'medium' })
const today = new Date()
const calendar = shallowRef(new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()))
const fechaComputed = computed(() => {
    if (!calendar.value) return null
    return new Date(calendar.value.year, calendar.value.month-1, calendar.value.day)
})

// Posibles valores de 'usos' para la salida de equipo
const usosItems = ref(['Entrevista', 'Reprografía', 'Entrevista videograbada', 'Entrevista audiograbada', 'Trabajo de campo'])
const usos = ref(['Entrevista'])
const usosComputed = computed(() => {
    return usos.value.join(",")
})

// Datos del formulario
const formData = reactive({
    Fecha: fechaComputed,
    Usos: usosComputed,
    Responsable: 'Felipe Morales Leal',
    Equipo: listaEquipo
})

// Estado de los errores
const erroresEstado = reactive({
    Responsable: null,
    Fecha: null,
    Usos: null,
    Equipo: null,
})

/**
* Envío de todos los datos para crear salida en la base de datos
*/
// Guardar información de la selección del equipo en localStorage (objeto 'listaTabla')
async function submit() {

    isLoading.value = true  // Cargando la información
    
    const datosParaValidar = {
        Responsable: formData.Responsable,
        Fecha: fechaComputed.value,
        Usos: usosComputed.value,
        Equipo: listaEquipo.value,
    }
    
    const result = formularioSchema.safeParse(datosParaValidar)
    
    // Limpiar errores previos
    Object.keys(erroresEstado).forEach(key => erroresEstado[key] = null)
    
    // Si no es válido, mostrar errores
    if (!result.success) {
        result.error.issues.forEach(error => {
            const field = error.path[0]
            erroresEstado[field] = error.message
        })
        isLoading.value = false  // Terminó de cargar la información
        return
    }
    
    localStorage.setItem('preliminar-lista', JSON.stringify(listaTabla.value))
    
    // Validación OK, continuar
    if (isUpdate.value)
        actualizarSalida()
    else
        crearNuevaSalida()
}

/**
 * Guarda la información actual en caso de regresar a la página inicial
 */
function crearBorrador(){
    localStorage.setItem('preliminar-lista', JSON.stringify(listaTabla.value))
    localStorage.setItem('preliminar-fecha', calendar.value)
    localStorage.setItem('preliminar-motivo', formData.Usos)
    localStorage.setItem('preliminar-responsable', formData.Responsable)
}

/**
* Envia los datos recopilados para crear un registro de "Salida" en base de datos.
* Después, redirige a la siguiente página "Vista preliminar"
*/
async function crearNuevaSalida() {
  try {
    // Petición para crear nueva salida en API
    const data = await $fetch('/api/salidas', {
      method: 'POST',
      body: formData
    })

    await navigateTo({
      path: '/preliminar',
      query: {
        Id: data.Id
      }
    })
  } catch (error) {
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: 'Database error'
    })
  }
}

/**
* Envia los datos recopilados para actualizar un registro de "Salida" en base de datos.
* Después, redirige a la siguiente página "Vista preliminar"
*/
async function actualizarSalida() {
    try {
        // Petición para actualizar salida existente en API
        const data = await $fetch(`/api/salidas/${idLista.value}`, {
            method: 'PATCH',
            body: formData
        })
        
        // Reenviar a vista preliminar
        await navigateTo({
            path: '/preliminar',
            query: {
                Id: data.Id
            }
        })
    } catch (error) {
        console.error("error: ", error)
        throw createError({
            statusCode: error?.statusCode || 500,
            statusMessage: 'Database error'
        })
    }
}

// Acciones que se efectuan inmediatamente en la página
onMounted(async () => {
    // Obtener Id de la salida en localStorage (solo para actualizaciones)
    idLista.value = localStorage.getItem('preliminar-id')
    isUpdate.value = idLista.value ? true : false

    // En caso de actualización, establecer ciertos valores del formulario

    // Lista de equipo seleccionado (objeto que representa los índices del equipo seleccionado)
    listaTabla.value = localStorage.getItem('preliminar-lista') ? JSON.parse( localStorage.getItem('preliminar-lista') ) : {}
    
    // Fecha de la "Salida"
    const fechaDB = localStorage.getItem('preliminar-fecha') ? new Date( parseDate(localStorage.getItem('preliminar-fecha')) ) : undefined
    calendar.value = fechaDB ? new CalendarDate(fechaDB.getFullYear(), fechaDB.getMonth() + 1, fechaDB.getDate() + 1) : calendar.value
    
    // Usos o motivo
    usos.value = localStorage.getItem('preliminar-motivo') ? localStorage.getItem('preliminar-motivo').split(',') : usos.value
    
    // Nombre de responsable
    formData.Responsable = localStorage.getItem('preliminar-responsable') ? localStorage.getItem('preliminar-responsable') : formData.Responsable

})
</script>