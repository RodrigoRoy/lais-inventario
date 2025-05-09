<template>
    <!-- Título -->
    <h1 color="primary" class="text-xl font-semibold tracking-wide uppercase text-center mt-2">
        Documento
    </h1>

    <div class="flex flex-col sm:flex-row gap-4 justify-center sm:text-center my-4">
        <!-- Generar documento docx -->
        <UButton @click="createDocument(salida)">Crear documento (Id 1)</UButton>
    </div>
</template>

<script setup>
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, AlignmentType, BorderStyle, ShadingType } from 'docx'
import { saveAs } from 'file-saver'

// Información de base de datos (este es un ejemplo con el registro con Id 1)
const { data:salida } = await useFetch('/api/salidas/1')

/**
 * Crea un documento de ejemplo, integrando texto arbitrario
 * @param {Object} salida Representa una salida de equipo, según el esquema en base de datos
 */
function createDocument(salida) {
    // Definición de las filas de equipo audiovisual
    let equipoRows = [
        // Encabezado de la tabla
        new TableRow({
            tableHeader: true,
            children: [
                new TableCell({
                    width: {
                        size: 2200,
                        type: WidthType.DXA,
                    },
                    shading: {
                        fill: "e0e0e0",
                        type: ShadingType.CLEAR,
                        color: "auto",
                    },
                    children: [new Paragraph("Cantidad")]
                }),
                new TableCell({
                    width: {
                        size: 2300,
                        type: WidthType.DXA,
                    },
                    shading: {
                        fill: "e0e0e0",
                        type: ShadingType.CLEAR,
                        color: "auto",
                    },
                    children: [new Paragraph("Descripción breve")]
                }),
                new TableCell({
                    width: {
                        size: 2300,
                        type: WidthType.DXA,
                    },
                    shading: {
                        fill: "e0e0e0",
                        type: ShadingType.CLEAR,
                        color: "auto",
                    },
                    children: [new Paragraph("No. Serie (Opcional)")]
                }),
                new TableCell({
                    width: {
                        size: 2300,
                        type: WidthType.DXA,
                    },
                    shading: {
                        fill: "e0e0e0",
                        type: ShadingType.CLEAR,
                        color: "auto",
                    },
                    children: [new Paragraph("No. Inventario")]
                }),
            ]
        }),
    ]

    // Agregar filas con la información de cada equipo audiovisual
    for(const equipo of salida.list){
        equipoRows.push(new TableRow({
            children: [
                new TableCell({
                    width: {
                        size: 2200,
                        type: WidthType.DXA,
                    },
                    children: [new Paragraph(`1`)]
                }),
                new TableCell({
                    width: {
                        size: 2300,
                        type: WidthType.DXA,
                    },
                    children: [new Paragraph(`${equipo.Nombre}`)]
                }),
                new TableCell({
                    width: {
                        size: 2300,
                        type: WidthType.DXA,
                    },
                    children: [new Paragraph(`${equipo["Número de serie"] ? equipo["Número de serie"] : ''}`)]
                }),
                new TableCell({
                    width: {
                        size: 2300,
                        type: WidthType.DXA,
                    },
                    children: [new Paragraph(`${equipo["Número de inventario"] ? equipo["Número de inventario"] : ''}`)]
                }),
            ]
        }))
    }

    // Definición del documento, que incluye la tabla de equipo
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Instituto de Investigaciones Dr. José Ma. Luis Mora",
                                color: "000000",
                            })
                        ],
                        heading: HeadingLevel.HEADING_2,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph(""),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Formato para bienes en tránsito",
                                color: "000000",
                            })
                        ],
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                        color: "000000",
                    }),
                    new Paragraph(""),
                    new Paragraph(""),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Fecha: 8 de mayo de 2025",
                                bold: true,
                            }),
                        ],
                        alignment: AlignmentType.RIGHT,
                    }),
                    new Paragraph(""),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Nombre del solicitante: ",
                                bold: true,
                            }),
                            new TextRun("Felipe Morales Leal"),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Origen: ",
                                bold: true,
                            }),
                            new TextRun("Laboratorio Audiovisual de Investigación Social"),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Sede: ",
                                bold: true,
                            }),
                            new TextRun("Poussin"),
                        ],
                    }),
                    new Paragraph(""),
                    
                    // Lista de equipo audiovisual
                    new Table({
                        columnWidths: [2200, 2300, 2300, 2300],
                        rows: equipoRows,
                    }),

                    new Paragraph(""),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Observaciones: ",
                                bold: true,
                            }),
                        ],
                    }),
                    new Paragraph(""),
                    new Table({
                        columnWidths: [9100],
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: {
                                        size: 9100,
                                        type: WidthType.DXA,
                                        },
                                        children: [new Paragraph({
                                            text: "Entrevista",
                                            alignment: AlignmentType.CENTER,
                                        })]
                                    }),
                                ]
                            }),
                        ]
                    }),

                    // new Paragraph(""),
                    // new Paragraph(""),
                    
                    // Page break (dos saltos de línea)
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "",
                                break: 2,
                            })
                        ]
                    }),

                    // Firmas finales
                    new Table({
                        columnWidths: [4550, 4550],
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: {
                                            size: 4550,
                                            type: WidthType.DXA,
                                        },
                                        borders: {
                                            top: {
                                                style: BorderStyle.NIL,
                                                size: 0,
                                            },
                                            bottom: {
                                                style: BorderStyle.NIL,
                                                size: 0,
                                            },
                                            left: {
                                                style: BorderStyle.NIL,
                                                size: 0,
                                            },
                                            right: {
                                                style: BorderStyle.NIL,
                                                size: 0,
                                            },
                                        },
                                        children: [
                                            new Paragraph({
                                                text: "Portador del bien y autorización",
                                                alignment: AlignmentType.CENTER,
                                            }),
                                            new Paragraph(""),
                                            new Paragraph(""),
                                            new Paragraph(""),
                                            new Paragraph({
                                                text: "____________________________",
                                                alignment: AlignmentType.CENTER,
                                            }),
                                            new Paragraph({
                                                text: "Felipe Morales Leal",
                                                alignment: AlignmentType.CENTER,
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: {
                                            size: 4550,
                                            type: WidthType.DXA,
                                        },
                                        borders: {
                                            top: {
                                                style: BorderStyle.NIL,
                                                size: 0,
                                            },
                                            bottom: {
                                                style: BorderStyle.NIL,
                                                size: 0,
                                            },
                                            left: {
                                                style: BorderStyle.NIL,
                                                size: 0,
                                            },
                                            right: {
                                                style: BorderStyle.NIL,
                                                size: 0,
                                            },
                                        },
                                        children: [
                                            new Paragraph({
                                                text: "Personal de vigilancia",
                                                alignment: AlignmentType.CENTER,
                                            }),
                                            new Paragraph(""),
                                            new Paragraph(""),
                                            new Paragraph(""),
                                            new Paragraph({
                                                text: "____________________________",
                                                alignment: AlignmentType.CENTER,
                                            }),
                                            new Paragraph({
                                                text: "Nombre y firma",
                                                alignment: AlignmentType.CENTER,
                                            }),
                                        ],
                                    }),
                                ]
                            }),
                        ]
                    })
                ],
            },
        ],
    })

    // Exportar el archivo como blob para descargar
    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `Formato para bienes - id${salida.Id}.docx`)
    })
}
</script>