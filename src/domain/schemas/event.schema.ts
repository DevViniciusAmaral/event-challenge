import { z } from 'zod'
import { DEFAULT_IMAGE } from '#/utils/viewMappers'

export const createEventSchema = z
  .object({
    title: z
      .string({ message: 'Título é obrigatório' })
      .trim()
      .min(3, 'Título deve ter no mínimo 3 caracteres')
      .max(120, 'Título deve ter no máximo 120 caracteres'),
    description: z
      .string()
      .trim()
      .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
      .optional()
      .default(''),
    date: z
      .string({ message: 'Data é obrigatória' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato AAAA-MM-DD'),
    time: z
      .string({ message: 'Horário é obrigatório' })
      .regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:MM'),
    venue: z
      .string({ message: 'Local é obrigatório' })
      .trim()
      .min(2, 'Local deve ter no mínimo 2 caracteres'),
    address: z
      .string({ message: 'Endereço é obrigatório' })
      .trim()
      .min(5, 'Endereço deve ter no mínimo 5 caracteres'),
    capacity: z
      .number({
        message: 'Capacidade é obrigatória'
      })
      .int('Capacidade deve ser um número inteiro')
      .min(1, 'Capacidade mínima é 1 ingresso')
      .max(500000, 'Capacidade máxima é 500.000 ingressos'),
    ticketPrice: z
      .number({
        message: 'Preço é obrigatório',
      })
      .min(0, 'Preço não pode ser negativo'),
    imageUrl: z
      .union([
        z.literal(''),
        z.string().trim().url('URL da imagem é inválida'),
      ])
      .default(''),
    publishAfter: z.boolean().default(true),
  })
  .transform((val) => ({
    ...val,
    imageUrl: val.imageUrl?.trim() ? val.imageUrl : DEFAULT_IMAGE,
  }))
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
    if (val.time) {
      const [h, m] = val.time.split(':').map(Number)
      if (h < 0 || h > 23 || m < 0 || m > 59) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Horário inválido',
          path: ['time'],
        })
      }
    }
  })

export type CreateEventSchema = z.infer<typeof createEventSchema>
