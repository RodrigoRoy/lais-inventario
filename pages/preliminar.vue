<template>
    <!-- Título -->
    <div class="text-center mb-6">
        <h1 class="text-3xl font-semibold tracking-wide uppercase text-primary">
            Vista preliminar
        </h1>
    </div>
    
    <!-- En caso de error con API  -->
    <UAlert v-if="error" title="No hay información para mostrar" description="Verifica la conexión a internet y/o el número de registro en base de datos." icon="i-mdi-emoticon-sad" color="error" variant="subtle" :actions="[{label: 'Crear nueva salida', href: '/formulario', color: 'neutral', variant: 'subtle'}]" orientation="horizontal" />
    
    <!-- Si no hay error, mostrar datos para comprobación -->
    <div v-else class="space-y-6">
        
        <!-- Información general -->
        <div class="bg-muted-foreground/5 rounded-lg p-6 border border-muted-foreground/10">
            <div class="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                    <p class="font-medium text-gray-500">Responsable</p>
                    <p class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ salida.Responsable }}</p>
                </div>
                <div>
                    <p class="font-medium text-gray-500">Fecha</p>
                    <p class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ formatoFecha(salida.Fecha ) }}</p>
                </div>
                <div>
                    <p class="font-medium text-gray-500">Motivo<span v-if="salida.Usos.split(',').length > 1">s</span></p>
                    <p class="text-lg font-semibold text-gray-800 dark:text-gray-200" v-for="motivo in salida.Usos.split(',')">{{ motivo }}</p>
                </div>
            </div>
        </div>
        
        <!-- Botones -->
        <div class="flex sm:flex-row gap-4 justify-between items-center">
            <UButton color="primary" variant="ghost" size="lg" icon="i-mdi-keyboard-return" to="/" class="justify-start" @click="deleteLocalStorage; isLoadingInicio=true" :loading="isLoadingInicio" loading-icon="i-mingcute-loading-fill" >
                Regresar a Inicio
            </UButton>
            
            <div class="flex flex-col sm:flex-row gap-4">
                <UButton color="primary" variant="soft" size="lg" icon="i-mdi-pencil" @click="setLocalStorage" :loading="isLoading" loading-icon="i-mingcute-loading-fill" >
                    Editar salida
                </UButton>
                
                <!-- Generar documento docx -->
                <ExportDocx :salida="salida" text="Crear documento" icon="i-mdi-file-word-outline" class="cursor-pointer" @click="deleteLocalStorage"/>
            </div>

        </div>
        
        <div>
            <h2 class="text-xl font-semibold tracking-wide text-primary mb-2">
                Lista de equipo audiovisual
            </h2>
            
            <!-- Lista de equipo audiovisual -->
            <TablaEquipo :lista=salida.list :soloVisualizacion="true" class="mb-8" />
        </div>

        <!-- Botones (duplicados, solo por eficiencia del usuario al bajar y corroborar que todo está en orden) -->
        <div v-if="salida.list.length > 3" class="flex sm:flex-row gap-4 justify-end items-center mb-10">
            
            <div class="flex flex-col sm:flex-row gap-4">
                <UButton color="primary" variant="soft" size="lg" icon="i-mdi-pencil" @click="setLocalStorage" :loading="isLoading" loading-icon="i-mingcute-loading-fill" >
                    Editar salida
                </UButton>
                
                <!-- Generar documento docx -->
                <ExportDocx :salida="salida" text="Crear documento" icon="i-mdi-file-word-outline" class="cursor-pointer" @click="deleteLocalStorage" />
            </div>

        </div>

    </div>
    
</template>

<script setup>
// Acceso a URL querie "Id"
const route = useRoute()

// Información de base de datos - error es utilizado para UAlert
const { data, error } = await useFetch(`/api/salidas/${route.query.Id}`)

// Referencia a la Salida en base de datos
const salida = ref(data.value)

// Determina si está cargando la información o no
const isLoading = ref(false)
const isLoadingInicio = ref(false)

/**
 * Almacena datos sobre la salida en localStorage del navegador
 * Los datos que se almacenan son:
 * - Id de la Salida
 * - Fecha
 * - Motivo o usos
 * - Nombre de responsable
 */
async function setLocalStorage(){
    isLoading.value = true

    localStorage.setItem('preliminar-id', route.query.Id)
    localStorage.setItem('preliminar-fecha', data.value.Fecha)
    localStorage.setItem('preliminar-motivo', data.value.Usos)
    localStorage.setItem('preliminar-responsable', data.value.Responsable)
    // Iteracion para obtener id's del equipo audiovisual
    let preliminarEquipo = []
    for(const equipo of data.value.list)
        preliminarEquipo.push(equipo.Id)
    localStorage.setItem('preliminar-equipo', preliminarEquipo)
    await insertarLista(preliminarEquipo)

    await navigateTo({
      path: '/formulario',
    })
}

/**
 * Borra datos sobre la salida en localStorage del navegador
 * Los datos que se borran son:
 * - Id de la Salida
 * - Fecha
 * - Motivo o usos
 * - Nombre de responsable
 */
function deleteLocalStorage(){
    localStorage.removeItem('preliminar-id')
    localStorage.removeItem('preliminar-fecha')
    localStorage.removeItem('preliminar-motivo')
    localStorage.removeItem('preliminar-responsable')
    localStorage.removeItem('preliminar-lista')
}

</script>