<!--
    Verificar que tenga datos que es necesario que correspondan en los siguientes campos:
        * fechaNacimiento - Tipo Date
        * fechaDefuncion - Tipo Date
        * documentales - documentales (lista) y poblado de cada documental
-->

<template>
    <h1 class="text-2xl font-bold mb-15">CSV → JSON (para Documentalista)</h1>
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
    // ejemplo: "Nombre del documentalista" en el Excel -> "identificacion.nombre" en el modelo
    "Nombre": "nombre",
    "Nombre completo": "nombreCompleto",
    // "Fecha de nacimiento": "fechaNacimiento",
    // "Fecha de defunción": "fechaDefuncion",
    //"Semblanza": "semblanza",  // no sirve tener ya semblanza sola
    "Semblanza": "semblanzaHTML",
    "Documentales del periodo": "documentales",   // poner en lista
    "Colectivos": "colectivos",
    "Mención de responsabilidades": "mencionResponsabilidad",
    "Identificador (url)": "url",
    "Imagen": "imagen",
    //"Clip video": "clipVideo",  // No existe
    //"galeria": "galeria",  // no existe
    "Principal": "principal",
    
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
        nombre: "",
        nombreCompleto: "",
        url: "",
        fechaNacimiento: null,
        fechaDefuncion: null,
        semblanza: "",
        semblanzaHTML: "",
        mencionResponsabilidad: "",
        documentales: row.documentales ? row.documentales.split('.').map(doc => doc.trim()) : [],
        colectivos: "",
        imagen: "",
        clipVideo: "",
        galeria: [],
        principal: false,
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
    link.download = 'documentalistas.json'
    link.click()
}
</script>


<style scoped>
button:hover {
    opacity: 0.9
}
</style>
