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

// imagen institucional en formato base64 (string)
const logoMoraBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcwAAAGcCAYAAABUVZBxAAAA0GVYSWZJSSoACAAAAAoAAAEEAAEAAADMAQAAAQEEAAEAAACcAQAAAgEDAAMAAACGAAAAEgEDAAEAAAABAAAAGgEFAAEAAACMAAAAGwEFAAEAAACUAAAAKAEDAAEAAAADAAAAMQECAA0AAACcAAAAMgECABQAAACqAAAAaYcEAAEAAAC+AAAAAAAAAAgACAAIAIkFAAAyAAAAiQUAADIAAABHSU1QIDIuMTAuMzgAADIwMjQ6MDg6MzAgMTE6Mjg6NDIAAQABoAMAAQAAAAEAAAAAAAAAFOmWZwAAAYRpQ0NQSUNDIHByb2ZpbGUAAHicfZE9SMNAHMVfU4tFKiJWEBHJUJ3soiKOtQpFqFBqhVYdTC79giYNSYqLo+BacPBjserg4qyrg6sgCH6AODs4KbpIif9LCi1iPDjux7t7j7t3gNCoMNXsigGqZhnpRFzM5lbF7lcEMYp+DCIgMVOfS6WS8Bxf9/Dx9S7Ks7zP/Tl6lbzJAJ9IHGO6YRFvEM9sWjrnfeIwK0kK8TnxhEEXJH7kuuzyG+eiwwLPDBuZ9DxxmFgsdrDcwaxkqMTTxBFF1ShfyLqscN7irFZqrHVP/sJQXltZ5jrNESSwiCWkIEJGDWVUYCFKq0aKiTTtxz38w44/RS6ZXGUwciygChWS4wf/g9/dmoWpSTcpFAcCL7b9MQZ07wLNum1/H9t28wTwPwNXWttfbQCzn6TX21rkCOjbBi6u25q8B1zuAENPumRIjuSnKRQKwPsZfVMOGLgFetbc3lr7OH0AMtRV8gY4OATGi5S97vHuYGdv/55p9fcDaJpyoiDxBKMAAA5XaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA0LjQuMC1FeGl2MiI+CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICB4bWxuczpHSU1QPSJodHRwOi8vd3d3LmdpbXAub3JnL3htcC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOmNiZjYyMjQwLTFmN2YtNGIxOS04YzQ3LTE4MmNlNThmNjI3OSIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3YTY3NzgzNS0wNTU0LTQxODItOWU3NS0xMTVkYjEwNzRhNDMiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyNDgyZjJiZS01NTYyLTQ1NDQtOGUyNi1kYzg0MTliMDQzYWUiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBHSU1QOkFQST0iMi4wIgogICBHSU1QOlBsYXRmb3JtPSJMaW51eCIKICAgR0lNUDpUaW1lU3RhbXA9IjE3MjUwMzg5MjI2NjAwMjkiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zOCIKICAgdGlmZjpPcmllbnRhdGlvbj0iMSIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQ6MDg6MzBUMTE6Mjg6NDItMDY6MDAiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDI0OjA4OjMwVDExOjI4OjQyLTA2OjAwIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Y2UyOWI3ZWEtZTEyZi00ZWQyLWIxNTItNzQ3OWFmYjM4YjhkIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKFdpbmRvd3MpIgogICAgICBzdEV2dDp3aGVuPSIyMDI0LTA1LTI5VDA2OjEyOjUzIi8+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmE1YzhlYWQzLTFkODctNDYzOS1iMDcyLWVjN2QyOGMyYWQzZiIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChMaW51eCkiCiAgICAgIHN0RXZ0OndoZW49IjIwMjQtMDgtMzBUMTE6Mjg6NDItMDY6MDAiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+wTQPWgAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB+gIHhEcKpZdBe4AACAASURBVHja7d0rlyPXmubxp9wFpklKg1+QOqwHpczOoJRRd6OUWbOUP0GpPoFVaKDlT1BK1swqNswSa2Yla2Yl2PhIK0kP6gF6ZavySLF3XHX7/9bKdS6lS8SOUDzxRuy9450ANMrM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"

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
                            ]
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
                alignment: AlignmentType.CENTER
            }),

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