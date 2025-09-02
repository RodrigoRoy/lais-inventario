<template>
    <UButton @click="createDocument()">{{ text }}</UButton>
</template>

<script setup>
/**
* Propiedades del componente
* @param salida Información de una salida de equipo audiovisual (según DB)
* @param text Texto para mostrar en el botón
*/
const props = defineProps({
    salida: {type: Object, required: true},
    text: {type: String}
})

const usosCadena = props?.salida?.Usos.replace(/,/g, ', ');

import {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    WidthType, HeadingLevel, AlignmentType, BorderStyle, ShadingType, VerticalAlign,
    ImageRun, Header
} from 'docx'
import { saveAs } from 'file-saver'

// imagen institucional en formato base64 (string)
const logoMoraBase64 = "data:image/png;base64,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"

/**
 * Cambia el formato de fecha en base de datos (DD-MM-AAAA) a texto (DD de MMMM de YYYY)
 * @returns String - Fecha en formato string
 */
function formatoFecha(){
    let fecha = props.salida.Fecha
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function createDocument() {
    
    const categorias = {}
    for (const equipo of props.salida.list || []) {
        const cat = equipo.Infraestructura || "Otros"
        if (!categorias[cat]) categorias[cat] = []
        categorias[cat].push(equipo)
    }
    
    const equipoRows = []

    // Encabezado de tabla
    const encabezado = new TableRow({
        tableHeader: true,
        
        children: [
        // Columna Cantidad
        new TableCell({
            verticalAlign: "center",
            width: { size: 600, type: WidthType.DXA },
            shading: { fill: "e0e0e0", type: ShadingType.CLEAR, color: "auto" },
            margins: { top: 0, right: 0, bottom: 0, left: 0 },
            children: [new Paragraph({
                children: [new TextRun({ text: "Cantidad", bold: true })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 0 }
            })]
        }),
        // Columna Descripción breve (más ancho)
        new TableCell({
            verticalAlign: "center",
            width: { size: 4000, type: WidthType.DXA },
            shading: { fill: "e0e0e0", type: ShadingType.CLEAR, color: "auto" },
            margins: { top: 0, right: 0, bottom: 0, left: 0 },
            children: [new Paragraph({
                children: [new TextRun({ text: "Descripción breve", bold: true })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 0 }
            })]
        }),
        // Columna No. Serie
        new TableCell({
            verticalAlign: "center",
            width: { size: 2300, type: WidthType.DXA },
            shading: { fill: "e0e0e0", type: ShadingType.CLEAR, color: "auto" },
            margins: { top: 0, right: 0, bottom: 0, left: 0 },
            children: [new Paragraph({
                children: [new TextRun({ text: "No. Serie", bold: true })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 0 }
            })]
        }),
        // Columna No. Inventario
        new TableCell({
            verticalAlign: "center",
            width: { size: 2300, type: WidthType.DXA },
            shading: { fill: "e0e0e0", type: ShadingType.CLEAR, color: "auto" },
            margins: { top: 0, right: 0, bottom: 0, left: 0 },
            children: [new Paragraph({
                children: [new TextRun({ text: "No. Inventario", bold: true })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 0 }
            })]
        })
    ]
    })
    
    let categoriasOrdenadas = Object.entries(categorias)
    .sort(([catA], [catB]) => {
        if (catA === "Otros") return 1; // "Otros" va al final
        if (catB === "Otros") return -1;
        return catA.localeCompare(catB); // Ordenar alfabéticamente las otras categorías
    });

    let primeraCategoria = true
    
    // Agregar equipos por categoría
    for (const [categoria, items] of categoriasOrdenadas) {
        equipoRows.push(new TableRow({
            children: [
            new TableCell({
                verticalAlign: "center",
                columnSpan: 4,
                shading: { fill: "e0e0e0", type: ShadingType.CLEAR, color: "auto" },
                margins: { top: 0, right: 0, bottom: 0, left: 0 },
                children: [new Paragraph({
                    children: [new TextRun({ text: categoria.toUpperCase(), bold: true })],
                    alignment: AlignmentType.CENTER,
                    size: 28
                })],
                spacing: { before: 0, after: 0 }
            }),
            ]
        }))
        
        if (primeraCategoria) {
            equipoRows.push(encabezado)
            primeraCategoria = false
        }
        
        for (const equipo of items) {
            equipoRows.push(new TableRow({
                children: [
                new TableCell({ 
                    verticalAlign: "center", 
                    margins: { top: 0, right: 0, bottom: 0, left: 0 },
                    children: [new Paragraph({ children: [new TextRun("1")], alignment: AlignmentType.CENTER })],
                    spacing: { before: 0, after: 0 }
                }),
                new TableCell({ 
                    verticalAlign: "center", 
                    margins: { top: 0, right: 0, bottom: 0, left: 0 },
                    children: [new Paragraph({ children: [new TextRun(String(equipo.Nombre || ""))] })],
                    spacing: { before: 0, after: 0 }
                }),
                new TableCell({ 
                    verticalAlign: "center", 
                    margins: { top: 0, right: 0, bottom: 0, left: 0 },
                    children: [new Paragraph({ children: [new TextRun(String(equipo["Número de serie"] || ""))] })],
                    spacing: { before: 0, after: 0 }
                }),
                new TableCell({ 
                    verticalAlign: "center", 
                    margins: { top: 0, right: 0, bottom: 0, left: 0 },
                    children: [new Paragraph({ children: [new TextRun(String(equipo["Número de inventario"] || ""))] })],
                    spacing: { before: 0, after: 0 }
                })
                ]
            }))
        }
    }
    
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: { font: "Arial", size: 24 },
                    paragraph: { spacing: { after: 100 } }
                }
            }
        },
        sections: [{
            properties: {},

            // Encabezado con imagen y nombre institucional
            headers: {
                default: new Header({
                    children: [
                        new Paragraph({
                            children: [
                                new ImageRun({
                                    type: "png",
                                    data: logoMoraBase64,
                                    transformation: {
                                        width: 60,
                                        height: 60,
                                    },
                                }),
                                new TextRun({
                                    text: " Instituto de Investigaciones Dr. José Ma. Luis Mora",
                                    bold: true,
                                    size: 26,
                                }),
                            ],
                            spacing: { before: 0, after: 0 }
                        })
                    ]
                })
            },

            // Contenido del documento inicia aqui
            children: [
            new Paragraph(""),
            
            // Título
            new Paragraph({
                children: [
                new TextRun({
                    text: "Formato para bienes en tránsito",
                    bold: true,
                    size: 32,
                }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 0 }
            }),

            new Paragraph(""),
            new Paragraph({
                children: [new TextRun({ text: `Fecha: ${formatoFecha()}`, bold: true })],
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 0 }
            }),
            new Paragraph({
                children: [
                new TextRun({ text: "Nombre del solicitante: ", bold: true }),
                new TextRun(String(props.salida.Responsable || ""))
                ],
                spacing: { before: 0, after: 0 }
            }),
            new Paragraph({
                children: [new TextRun({ text: "Origen: ", bold: true }), new TextRun("Laboratorio Audiovisual de Investigación Social")],
                spacing: { before: 0, after: 0 }
            }),
            new Paragraph({
                children: [new TextRun({ text: "Sede: ", bold: true }), new TextRun("Poussin")],
                spacing: { before: 0, after: 0 }
            }),
            new Paragraph(""),
            
            new Table({
                columnWidths: [2200, 2300, 2300, 2300],
                rows: equipoRows,
                width: { size: 100, type: WidthType.PERCENTAGE },
                layout: "fixed",
                spacing: { before: 0, after: 0 }
            }),
            
            new Paragraph(""),
            new Paragraph({
                children: [new TextRun({ text: "Observaciones: ", bold: true })],
                spacing: { before: 0, after: 0 }
            }),
            new Paragraph(""),
            new Table({
                columnWidths: [9100],
                rows: [
                new TableRow({
                    children: [
                    new TableCell({
                        verticalAlign: "center",
                        width: { size: 9100, type: WidthType.DXA },
                        children: [
                        new Paragraph({
                            children: [new TextRun(
                               String(usosCadena || "")
                            )],
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 0, after: 0 }
                        })
                        ]
                    })
                    ],
                    spacing: { before: 0, after: 0 }
                })
                ]
            }),
            
            new Paragraph({
                children: [
                new TextRun({
                    text: "",
                    break: 2,
                })
                ],
                spacing: { before: 0, after: 0 }
            }),
            
            // Firmas finales
            new Table({
                columnWidths: [4550, 4550],
                rows: [
                new TableRow({
                    children: [
                    new TableCell({
                        verticalAlign: "top",
                        margins: { top: 0, right: 0, bottom: 0, left: 0 },
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
                            size: 28,
                        }),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                            text: "____________________________",
                            alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                            text: `${props.salida.Responsable}`,
                            alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                            text: "Firma",
                            alignment: AlignmentType.CENTER,
                        }),
                        ],
                    }),
                    new TableCell({
                        verticalAlign: "top",
                        margins: { top: 0, right: 0, bottom: 0, left: 0 },
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
                            size: 28,
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
            
            ]
        }]
    })
    
    Packer.toBlob(doc).then(blob => {
        saveAs(blob, `Formato para bienes - id${props.salida.Id}.docx`)
    })
    
}


</script>