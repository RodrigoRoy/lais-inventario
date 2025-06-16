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

import {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    WidthType, HeadingLevel, AlignmentType, BorderStyle, ShadingType, VerticalAlign,
    ImageRun, Header
} from 'docx'
import { saveAs } from 'file-saver'

console.log("Esto es lo que recibe props: ", props.salida)


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
        const cat = equipo.Infraestructura || "Sin categoría"
        if (!categorias[cat]) categorias[cat] = []
        categorias[cat].push(equipo)
    }
    
    const equipoRows = []

    // Encabezado de tabla
    const encabezado = new TableRow({
        tableHeader: true,
        children: ["Cantidad", "Descripción breve", "No. Serie", "No. Inventario"].map(text =>
        new TableCell({
            verticalAlign: "center",
            width: { size: 2300, type: WidthType.DXA },
            shading: { fill: "e0e0e0", type: ShadingType.CLEAR, color: "auto" },
            children: [new Paragraph({ 
                children: [new TextRun({text: text, bold: true})], 
                alignment: AlignmentType.CENTER 
            })]
        })
        )
    })
    
    let primeraCategoria = true
    
    // Agregar equipos por categoría
    for (const [categoria, items] of Object.entries(categorias)) {
        equipoRows.push(new TableRow({
            children: [
            new TableCell({
                verticalAlign: "center",
                columnSpan: 4,
                shading: { fill: "e0e0e0", type: ShadingType.CLEAR, color: "auto" },
                children: [new Paragraph({
                    children: [new TextRun({ text: categoria.toUpperCase(), bold: true })],
                    alignment: AlignmentType.CENTER,
                    size: 28
                })]
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
                    children: [new Paragraph({ children: [new TextRun("1")], alignment: AlignmentType.CENTER })] 
                }),
                new TableCell({ 
                    verticalAlign: "center", 
                    children: [new Paragraph({ children: [new TextRun(String(equipo.Nombre || ""))] })] 
                }),
                new TableCell({ 
                    verticalAlign: "center", 
                    children: [new Paragraph({ children: [new TextRun(String(equipo["Número de serie"] || ""))] })] 
                }),
                new TableCell({ 
                    verticalAlign: "center", 
                    children: [new Paragraph({ children: [new TextRun(String(equipo["Número de inventario"] || ""))] })] 
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
            children: [
            new Paragraph({
                children: [
                new TextRun({
                    text: " Instituto de Investigaciones Dr. José Ma. Luis Mora",
                    bold: true,
                    size: 26,
                }),
                ],
                alignment: AlignmentType.LEFT
            }),
            new Paragraph({ children: [new TextRun("Formato para bienes en tránsito", { bold: true, size: 32 })], alignment: AlignmentType.CENTER }),
            new Paragraph(""),
            new Paragraph({
                children: [new TextRun({ text: `Fecha: ${formatoFecha()}`, bold: true })],
                alignment: AlignmentType.RIGHT
            }),
            new Paragraph({
                children: [
                new TextRun({ text: "Nombre del solicitante: ", bold: true }),
                new TextRun(String(props.salida.Responsable || ""))
                ]
            }),
            new Paragraph({
                children: [new TextRun({ text: "Origen: ", bold: true }), new TextRun("Laboratorio Audiovisual de Investigación Social")]
            }),
            new Paragraph({
                children: [new TextRun({ text: "Sede: ", bold: true }), new TextRun("Poussin")]
            }),
            new Paragraph(""),
            
            new Table({
                columnWidths: [2200, 2300, 2300, 2300],
                rows: equipoRows,
                width: { size: 100, type: WidthType.PERCENTAGE },
                layout: "fixed"
            }),
            
            new Paragraph(""),
            new Paragraph({
                children: [new TextRun({ text: "Observaciones: ", bold: true })]
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
                            children: [new TextRun(String(props.salida.Usos || ""))],
                            alignment: AlignmentType.CENTER
                        })
                        ]
                    })
                    ]
                })
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
                        verticalAlign: "center",
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
                        verticalAlign: "center",
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
            
            ]
        }]
    })
    
    Packer.toBlob(doc).then(blob => {
        saveAs(blob, `Formato para bienes - id${props.salida.Id}.docx`)
    })
    
}


</script>