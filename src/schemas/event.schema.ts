import { z } from 'zod'
import type { EventMovie } from '#/types/event.types'

const eventMovieSchema = z.object({
  name: z.string({ message: 'Nome do filme é obrigatório' }).trim().min(1, 'Nome do filme é obrigatório'),
  description: z.string().trim().default(''),
})

export const createEventSchema = z
  .object({
    movie: eventMovieSchema,
    date: z
      .string({ message: 'Data é obrigatória' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato AAAA-MM-DD'),
    hours: z
      .string({ message: 'Horário é obrigatório' })
      .regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:MM'),
    local: z
      .string({ message: 'Local é obrigatório' })
      .trim()
      .min(2, 'Local deve ter no mínimo 2 caracteres'),
    capacity: z
      .number({
        message: 'Capacidade é obrigatória'
      })
      .int('Capacidade deve ser um número inteiro')
      .min(1, 'Capacidade mínima é 1 ingresso')
      .max(500000, 'Capacidade máxima é 500.000 ingressos'),
    price: z
      .number({
        message: 'Preço é obrigatório',
      })
      .min(0, 'Preço não pode ser negativo'),
    publishAfter: z.boolean().default(true),
  })
  .superRefine((val, ctx) => {
    if (val.date) {
      const d = new Date(val.date)
      if (Number.isNaN(d.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Data inválida',
          path: ['date'],
        })
      }
    }
    if (val.hours) {
      const [h, m] = val.hours.split(':').map(Number)
      if (h < 0 || h > 23 || m < 0 || m > 59) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Horário inválido',
          path: ['hours'],
        })
      }
    }
  })

export type CreateEventSchema = z.infer<typeof createEventSchema>
export type CreateEventMovieSchema = z.infer<typeof eventMovieSchema> & EventMovie
