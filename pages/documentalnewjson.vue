<!--
    Verificar que tenga datos que es necesario que correspondan en los siguientes campos:
        * identificacion.duracion - ver que sea un numero entero positivo
        * condicionesAccesoUso.color - ['Color', 'Blanco y negro']
        * condicionesAccesoUso.soporteOriginal - ['35 mm', '16 mm', 'Super 8', 'U-matic', 'Betacam', 'Betamax', 'VHS', 'Hi8', 'DVCAM', 'MiniDV']
        * adicional.mujeres - mujeres (lista) y poblado de cada documentalista
        * adicional.etiquetas - etiquetas (lista)
-->

<template>
    <h1 class="text-2xl font-bold mb-15">CSV → JSON (para Documentales)</h1>
    <UButton target="_self" size="xl" icon="i-mdi-code-json" class="cursor-pointer" color="secondary" to="documentalistanewjson"> Documentalista </UButton>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
        
        <!-- <input type="file" accept=".csv" @change="handleFileUpload" class="mb-4" /> -->
        
        <button @click="selectFile" class="cursor-pointer py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"> Seleccionar CSV </button>

        <!-- Input file oculto -->
        <input type="file" ref="csvFile" @change="handleFileUpload" accept=".csv" style="display: none" />
        
        <button @click="convertCSV" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Convertir a JSON
        </button>
        <button @click="downloadJSON" class="bg-green-500 text-white px-4 py-2 rounded">
            Descargar JSON
        </button>
        
    </div>
    <pre v-if="jsonOutput.length" class="my-10 bg-gray-100 rounded text-sm text-black overflow-auto max-h-[500px]">
        {{ JSON.stringify(jsonOutput, null, 2) }}
    </pre>
</template>


<script setup>
import Papa from 'papaparse'

const csvFile = ref(null)
const jsonOutput = ref([])

// --- Mapeo entre columnas del CSV y el modelo ewn Mongo ---
const columnMap = {
    // ejemplo: "Nombre del documental" en el Excel -> "identificacion.titulo" en el modelo
    "Código de referencia": "identificacion.codigoReferencia",
    "Referencia de procedencia": "identificacion.referenciaProcedencia",
    "Título": "identificacion.titulo",
    "Año": "identificacion.fecha",
    "Título de la serie": "identificacion.tituloSerie",
    "Número de programa": "identificacion.numeroPrograma",
    "País": "identificacion.pais",
    "Duración (mins)": "identificacion.duracion",
    "Realización": "identificacion.realizacion",
    "Investigación": "identificacion.investigacion",
    "Idea original": "identificacion.ideaOriginal",
    "Guión": "identificacion.guion",
    "Edición": "identificacion.edicion",
    "Cámara": "identificacion.camara",
    "Sonido directo": "identificacion.sonido",
    "Fotografía fija": "identificacion.fotografia",
    "Animación": "identificacion.animacion",
    "Música original": "identificacion.musicaOriginal",
    "Musicalización": "identificacion.musicalizacion",
    "Dirección de actores": "identificacion.direccionActuacion",
    "Actuación": "identificacion.actuacion",
    "Voces": "identificacion.voces",
    "Otros colaboradores": "identificacion.otrosColaboracion",
    "Entidad productora": "contexto.entidadProductora",
    "Producción": "contexto.produccion",
    "Distribuidora": "contexto.distribuidora",
    "Historia institucional": "contexto.historiaInstitucional",
    "Reseña biográfica": "contexto.resenaBiografica",
    "Sinopsis": "contenidoEstructura.sinopsis",
    "Descriptor onomástico": "contenidoEstructura.descriptorOnomastico",
    "Descriptor toponímico": "contenidoEstructura.descriptorToponimico",
    "Descriptor cronológico": "contenidoEstructura.descriptorCronologico",
    "Fuentes": "contenidoEstructura.fuentes",
    "Recursos": "contenidoEstructura.recursos",
    "Idioma original": "condicionesAccesoUso.idiomaOriginal",
    "Subtitulajes disponibles": "condicionesAccesoUso.subtitulaje",
    "Color": "condicionesAccesoUso.color",
    "Soporte original": "condicionesAccesoUso.soporteOriginal",
    "Unidades de descripción relacionadas": "documentacionAsociada.unidadesRelacionadas",
    "Notas de publicación": "documentacionAsociada.notasPublicacion",
    "Notas": "notas.notas",
    "Nombre de la persona que describe": "controlDescripcion.nombreCatalogacion",
    "Fecha de descripción": "controlDescripcion.fechaDescripcion",
    "Imagen o fotografía de retrato": "adicional.imagen",
    "Clip de video de representación": "adicional.clipVideo",
    //"Mujeres": "adicional.mujeres",   // Agregar mujeres
    "Etiquetas/ palabras clave": "adicional.etiquetas",   // Se debe tener lista de esto, en Excel aparece como string vacío
    "URL": "adicional.url",
    // "External URL": "adicional.externalUrl", // Agregar external url
    "Comentario": "adicional.comentario.texto",
    "Autor/a del comentario": "adicional.comentario.autoria",
    "Fecha del comentario": "adicional.comentario.fecha",
    "Semblanza del autor/a": "adicional.comentario.semblanza",
    "Fotografía del autor/a": "adicional.comentario.imagen",
    
}

const selectFile = () => {
  // Abre el input de archivo cuando el botón es presionado
  csvFile.value.click()
}

// --- Maneja la carga del archivo ---
const handleFileUpload = (event) => {
    const files = event.target.files
    if (files && files.length > 0) {
        csvFile.value = files[0]
    }
}

// --- Convierte CSV a JSON ---
const convertCSV = () => {
    if (!csvFile.value) return alert("Selecciona un archivo CSV primero")
    
    Papa.parse(csvFile.value, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            const mapped = results.data.map((row) => mapRowToModel(row))
            jsonOutput.value = mapped
        }
    })
}

// --- Mapea cada fila del CSV al modelo JSON ---
function mapRowToModel(row) {
    const baseModel = {
        identificacion: {
            codigoReferencia: "",
            referenciaProcedencia: "",
            titulo: "",
            fecha: "",
            tituloSerie: "",
            numeroPrograma: "",
            pais: "",
            duracion: 0,
            realizacion: "",
            investigacion: "",
            ideaOriginal: "",
            guion: "",
            edicion: "",
            camara: "",
            sonido: "",
            fotografia: "",
            animacion: "",
            musicaOriginal: "",
            musicalizacion: "",
            direccionActuacion: "",
            actuacion: "",
            direccion: "",
            voces: "",
            otrosColaboracion: "",
        },
        contexto: {
            entidadProductora: "",
            produccion: "",
            distribuidora: "",
            historiaInstitucional: "",
            resenaBiografica: "",
        },
        contenidoEstructura: {
            sinopsis: "",
            descriptorOnomastico: "",
            descriptorToponimico: "",
            descriptorCronologico: "",
            fuentes: "",
            recursos: "",
        },
        condicionesAccesoUso: {
            idiomaOriginal: "",
            subtitulaje: "",
            color: "Color",
            soporteOriginal: "35 mm",
        },
        documentacionAsociada: {
            unidadesRelacionadas: "",
            notasPublicacion: "",
        },
        notas: {
            notas: "",
        },
        controlDescripcion: {
            nombreCatalogacion: "",
            fechaDescripcion: "",
        },
        adicional: {
            imagen: "",
            clipVideo: "",
            //mujeres: [],
            etiquetas: 'row.adicional.etiquetas' ? 'row.adicional.etiquetas'.split('.').map(doc => doc.trim()) : [],
            url: "",
            externalUrl: "",
            comentario: {
                texto: "",
                autoria: "",
                fecha: "",
                semblanza: "",
                imagen: "",
            },
        },
    }
    
    // Rellenar campos a partir del mapeo
    for (const [csvKey, modelPath] of Object.entries(columnMap)) {
        const value = row[csvKey] || ""
        setNestedValue(baseModel, modelPath, value)
    }
    
    return baseModel
}

// --- Asigna un valor en un objeto anidado dado un path tipo "identificacion.titulo" ---
function setNestedValue(obj, path, value) {
    const keys = path.split('.')
    let current = obj
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
}

// --- Descarga el JSON ---
const downloadJSON = () => {
    if (jsonOutput.value.length === 0) return alert("No hay datos para descargar")
    const blob = new Blob([JSON.stringify(jsonOutput.value, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'documentales.json'
    link.click()
}
</script>


<style scoped>
button:hover {
    opacity: 0.9
}
</style>
