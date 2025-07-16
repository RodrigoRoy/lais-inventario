import { z } from 'zod'

// Validación de datos con Zod
export const formularioSchema = z.object({
  Responsable: z.string()
    .min(1, 'El nombre del responsable es obligatorio')
    .max(100, 'El nombre del responsable no debe superar los 100 caracteres'),

  Fecha: z.union([
    z.date(),
    z.null()
  ]).refine((date) => date !== null, {
    message: 'La fecha es obligatoria',
  }),

  Usos: z.string()
    .min(1, 'Debes seleccionar al menos un uso')
    .max(100, 'El texto de los usos no debe superar los 100 caracteres'),

  Equipo: z.array(
    z.object({
      Id: z.union([z.string(), z.number()]) // puedes ajustar según tu DB
    })
  ).min(1, 'Debes seleccionar al menos un equipo'),
})
