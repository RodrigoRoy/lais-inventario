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
                    <p class="font-medium text-gray-500">Fecha</p>
                    <p class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ salida.Fecha }}</p>
                </div>
                <div>
                    <p class="font-medium text-gray-500">Motivo</p>
                    <p class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ salida.Usos }}</p>
                </div>
                <div>
                    <p class="font-medium text-gray-500">Responsable</p>
                    <p class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ salida.Responsable }}</p>
                </div>
            </div>
        </div>
        
        <!-- Botones -->
        <div class="flex flex-col sm:flex-row gap-4 justify-end items-center">
            <UButton color="success" variant="outline" size="lg" icon="i-mdi-pencil" to="/formulario" class="cursor-pointer" @click="setLocalStorage" >
                Editar salida
            </UButton>
            
            <!-- Generar documento docx -->
            <ExportDocx :salida="salida" text="Crear documento" icon="i-mdi-file-word" class="w-auto cursor-pointer" @click="deleteLocalStorage"/>
        </div>
        
        <div>
            <h2 class="text-xl font-semibold tracking-wide text-primary mb-2">
                Lista de equipo audiovisual
            </h2>
            
            <!-- Lista de equipo audiovisual -->
            <TablaEquipo :lista=salida.list :soloVisualizacion="true" class="mb-8" />
        </div>
    </div>
    
</template>

<script setup>
// Acceso a URL querie "Id"
const route = useRoute()

// Información de base de datos
const { data, error } = await useFetch(`/api/salidas/${route.query.Id}`)

// Referencia a la Salida en base de datos
const salida = ref(data.value)

/**
 * Almacena datos sobre la salida en localStorage del navegador
 * Los datos que se almacenan son:
 * - Id de la Salida
 * - Fecha
 * - Motivo o usos
 * - Nombre de responsable
 */
function setLocalStorage(){
    localStorage.setItem('preliminar-id', route.query.Id)
    localStorage.setItem('preliminar-fecha', data.value.Fecha)
    localStorage.setItem('preliminar-motivo', data.value.Usos)
    localStorage.setItem('preliminar-responsable', data.value.Responsable)
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
}
</script>