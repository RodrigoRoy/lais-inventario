<template>
    <!-- Título -->
    <h1 color="primary" class="text-xl font-semibold tracking-wide uppercase text-center mt-2">
        Documento
    </h1>

    <!-- Formulario de prueba -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center sm:text-center my-4">
        <!-- Nombre -->
        <div class="sm:basis-auto px-4">
            <UFormField label="Texto de prueba" name="responsable">
                <UInput v-model="myText" size="xl" />
            </UFormField>
        </div>

        <!-- Generar documento docx -->
        <UButton @click="createDocument(myText)">Crear documento</UButton>
    </div>

    
</template>

<script setup>
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from 'docx'
import { saveAs } from 'file-saver'

// Texto de prueba para incrustar en documento
const myText = ref('Hola, mundo!')

/**
 * Crea un documento de ejemplo, integrando texto arbitrario
 * @param text Cadena de texto arbitrario para integrar al documento
 */
function createDocument(text) {
    // Definición de una tabla
    const table = new Table({
        columnWidths: [3010, 2000, 2000, 2000],
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                        size: 3010,
                        type: WidthType.PERCENTAGE,
                        },
                        children: [new Paragraph("Hola")]
                    }),
                    new TableCell({
                        width: {
                        size: 2000,
                        type: WidthType.PERCENTAGE,
                        },
                        children: [new Paragraph("Mundo")]
                    }),
                    new TableCell({
                        width: {
                        size: 2000,
                        type: WidthType.PERCENTAGE,
                        },
                        children: [new Paragraph("Foo")]
                    }),
                    new TableCell({
                        width: {
                        size: 2000,
                        type: WidthType.PERCENTAGE,
                        },
                        children: [new Paragraph("Bar")]
                    }),
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                        size: 3010,
                        type: WidthType.PERCENTAGE,
                        },
                        children: [new Paragraph("Hola2")]
                    }),
                    new TableCell({
                        width: {
                        size: 2000,
                        type: WidthType.PERCENTAGE,
                        },
                        children: [new Paragraph("Mundo2")]
                    }),
                    new TableCell({
                        width: {
                        size: 2000,
                        type: WidthType.PERCENTAGE,
                        },
                        children: [new Paragraph("Foo2")]
                    }),
                    new TableCell({
                        width: {
                        size: 2000,
                        type: WidthType.PERCENTAGE,
                        },
                        children: [new Paragraph("Bar2")]
                    }),
                ]
            }),
        ]
    })

    // Documentos pueden contener múltiples secciones
    // Este ejemplo solo contiene una sección
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Lorem ipsum ",
                                bold: true,
                            }),
                            new TextRun("dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. "),
                            new TextRun("Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos."),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun(`\n\r${text}\n\r`), // Integración de texto arbitrario
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun('\tLorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.'),
                        ]
                    }),
                    table,
                ],
            },
        ],
    })

    // Exportar el archivo como blob para descargar
    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "MiDocumento.docx")
    })
}
</script>