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

// imagen lais en formato base64 (string)
const logoLaisBase64 = "data:image/png;base64,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"

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
            width: { size: 1000, type: WidthType.DXA },
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
            width: { size: 3600, type: WidthType.DXA },
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

    // Se agrega el encabezado
    let primeraCategoria = true
    if (primeraCategoria) {
        equipoRows.push(encabezado)
        primeraCategoria = false
    }
    
    // Agregar equipos por categoría
    for (const [categoria, items] of categoriasOrdenadas) {
        equipoRows.push(new TableRow({
            children: [
            new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                columnSpan: 4,
                shading: { fill: "e0e0e0", type: ShadingType.CLEAR, color: "auto" },
                margins: { top: 0, right: 0, bottom: 0, left: 0 },
                children: [new Paragraph({
                    children: [new TextRun({ text: categoria.toUpperCase(), bold: true })],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 0, after: 0 },
                    size: 28
                })],
            }),
            ]
        }))
        
        
        for (const equipo of items) {
            equipoRows.push(new TableRow({
                height: { value: 300, rule: "atLeast" },
                children: [
                new TableCell({ 
                    verticalAlign: VerticalAlign.CENTER, 
                    children: [
                        new Paragraph({ 
                            children: [new TextRun("1")], 
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 0, after: 0 },
                        })
                    ],
                    margins: { top: 0, right: 0, bottom: 0, left: 0 },
                }),
                new TableCell({ 
                    verticalAlign: VerticalAlign.CENTER, 
                    children: [
                        new Paragraph({ 
                            children: [new TextRun(String(equipo.Nombre || ""))],
                            spacing: { before: 0, after: 0 }
                        })
                    ],
                    margins: { top: 0, right: 0, bottom: 0, left: 0 },
                }),
                new TableCell({ 
                    verticalAlign: VerticalAlign.CENTER, 
                    children: [
                        new Paragraph({ 
                            children: [new TextRun(String(equipo["Número de serie"] || ""))] ,
                            spacing: { before: 0, after: 0 }
                        })
                    ],
                    margins: { top: 0, right: 0, bottom: 0, left: 0 },
                }),
                new TableCell({ 
                    verticalAlign: VerticalAlign.CENTER, 
                    children: [
                        new Paragraph({ 
                            children: [new TextRun(String(equipo["Número de inventario"] || ""))],
                            spacing: { before: 0, after: 0 }
                        })
                    ],
                    margins: { top: 0, right: 0, bottom: 0, left: 0 },
                })
                ]
            }))
        }
    }
    
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: { font: "Arial", size: 22 },
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
                                    text: " Instituto de Investigaciones Dr. José María Luis Mora",
                                    bold: true,
                                    size: 26,
                                }),
                                new ImageRun({
                                    type: "png",
                                    data: logoLaisBase64,
                                    transformation: {
                                        width: 60,
                                        height: 60,
                                    },
                                }),
                            ],
                            spacing: { before: 0, after: 0 },
                            alignment: AlignmentType.CENTER,
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

            new Paragraph(""),
            
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
                columnWidths: [1000, 3600, 2300, 2300],
                rows: equipoRows,
                verticalAlign: VerticalAlign.CENTER,
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
                spacing: { before: 0, after: 0 },
                keepLines: true,
                keepNext: true,
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
                            keepLines: true, // evitar dividir parrafos entre paginas
                            keepNext: true, // hace que el siguiente elemento se mantenga junto
                        }),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                            text: "____________________________",
                            alignment: AlignmentType.CENTER,
                            keepLines: true,
                            keepNext: true,
                        }),
                        new Paragraph({
                            text: `${props.salida.Responsable}`,
                            alignment: AlignmentType.CENTER,
                            keepLines: true,
                            keepNext: true,
                        }),
                        new Paragraph({
                            text: "Firma",
                            alignment: AlignmentType.CENTER,
                            keepLines: true,
                            keepNext: true,
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
                            keepLines: true,
                            keepNext: true,
                        }),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                            text: "____________________________",
                            alignment: AlignmentType.CENTER,
                            keepLines: true,
                            keepNext: true,
                        }),
                        new Paragraph({
                            text: "Nombre y firma",
                            alignment: AlignmentType.CENTER,
                            keepLines: true,
                            keepNext: true,
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