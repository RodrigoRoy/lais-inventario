<template>
    lista equipo: {{ listaEquipo }}
    lista tabla: {{ listaTabla }}
    <!-- Título -->
    <h1 color="primary" class="text-xl font-semibold tracking-wide uppercase text-center mt-2">
        Crear salida
    </h1>
    
    <!-- Formulario para datos básicos -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center sm:text-center my-4">
        <!-- Nombre -->
        <div class="sm:basis-auto px-4">
            <UFormField label="Nombre de responsable" name="responsable">
                <UInput v-model="formData.Responsable" placeholder="Nombre" />
            </UFormField>
        </div>
        
        <!-- Fecha (con calendario desplegable) -->
        <div class="sm:basis-auto px-4">
            <UFormField label="Fecha de salida">
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
            <UFormField label="Usos" name="responsable">
                <USelect v-model="usos" multiple :items="usosItems" class="w-48" required/>
            </UFormField>
        </div>
        
        <!-- Enviar información de salida a base de datos -->
        <div class="flex flex-col sm:flex-row gap-4 justify-end items-center mt-5">
            
            <UButton color="success" variant="outline" size="lg" class="cursor-pointer" icon="mdi-keyboard-return" :disabled="listaEquipo.length===0" @click="submit">
                Continuar
            </UButton>
        </div>
        
    </div>
    
    <!-- Lista de equipo audiovisual -->
    <TablaEquipo :lista=inventario.list select @update-list="(lista) => actualizacion(lista)"/>
        
    </template>
    
    <script setup>
    import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
    
    // Información de base de datos
    const { data: inventario } = await useFetch('/api/equipo')
    
    // Clave secreta (TODO: poner en .env despues)
    const SECRET = 'ClaveSecreta'
    
    // Checa si es actualización de una lista o es una nueva lista
    const isUpdate = ref(false)
    const idLista = ref(null)

    const actualizacion = (lista) => {
        listaEquipo.value = lista.dataList
        listaTabla.value = lista.tableList
    }
    
    // Lista actualizada de equipo (desde el componente <TablaEquipo>)
    const listaEquipo = ref([])
    const listaTabla = ref([])
    
    // Datos para el calendario
    const dateFormat = new DateFormatter('es-MX', { dateStyle: 'medium' })
    const today = new Date()
    const calendar = shallowRef(new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()))
    const fechaComputed = computed(() => {
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
    
    /**
    * Envío de todos los datos para crear salida en la base de datos
    */
    async function submit() {
        if (idLista.value != null) {
            actualizarSalida()
        } else {
            crearNuevaSalida()
        }
    }
    
    // Función para crear nueva salida
    async function crearNuevaSalida() {
        const { data, error } = await useFetch('/api/salidas', {
            method: 'POST',
            body: formData
        })
        
        if (!error.value) {
            console.log('Salida creada', data.value)
            localStorage.setItem(SECRET, data.value.Id) // Guardamos el nuevo ID
            localStorage.setItem('listaTabla', listaTabla.value) // Guardamos la lista de la tabla row
            
            // Reenviar a vista preliminar
            await navigateTo({
                path: '/preliminar',
                method: 'post',
                query : {
                    Id: data.value.Id
                }
            })
        } else {
            console.error('Error al crear salida', error.value)
        }
    }
    
    // Función para actualizar salida existente
    async function actualizarSalida() {
        const { data, error } = await useFetch('/api/salidas', {
            method: 'PATCH',
            body: {
                Id: idLista.value,
                ...formData
            }
        })
        
        if (!error.value) {
            console.log('Salida actualizada', data.value)
        } else {
            console.error('Error al actualizar salida', error.value)
        }
    }

    function llenarFormulario(formulario){
        // Asignamos los datos a formData (que es reactive y necesita valores puros)
        console.log("Formulario en llenar formulario: ", formulario)
        formData.Fecha = formulario.Fecha
        formData.Usos = formulario.Usos
        formData.Responsable = formulario.Responsable
        formData.Equipo = formulario.list
        
        // TODO: También actualizamos la lista reactiva de equipo
        listaEquipo.value = formulario.list
    }
    
    onMounted(async () => {
        const idGuardado = localStorage.getItem(SECRET)

        if (idGuardado) {
            const { data, error } = await useFetch(`/api/salidas/${idGuardado}`)
            
            if (!error.value && data.value) {
                // Creamos una copia segura del objeto reactivo
                // const salidaCopia = structuredClone(data.value)
                const salidaCopia = JSON.parse(JSON.stringify(data.value))

                console.log("salidaCopia dentro de mount", salidaCopia)

                llenarFormulario(salidaCopia)

                
                // Flags de control
                isUpdate.value = true
                idLista.value = idGuardado
            } else {
                isUpdate.value = false
            }
        } else {
            isUpdate.value = false
        }
    })
        
        
    </script>