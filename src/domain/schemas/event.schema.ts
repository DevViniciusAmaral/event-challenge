import { z } from 'zod'

export const createEventSchema = z
  .object({
    title: z
      .string({ error: 'Título é obrigatório' })
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
      .string({ error: 'Data é obrigatória' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato AAAA-MM-DD'),
    time: z
      .string({ error: 'Horário é obrigatório' })
      .regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:MM'),
    venue: z
      .string({ error: 'Local é obrigatório' })
      .trim()
      .min(2, 'Local deve ter no mínimo 2 caracteres'),
    address: z
      .string({ error: 'Endereço é obrigatório' })
      .trim()
      .min(5, 'Endereço deve ter no mínimo 5 caracteres'),
    capacity: z
      .number({
        error: 'Capacidade é obrigatória',
        message: 'Capacidade deve ser um número',
      })
      .int('Capacidade deve ser um número inteiro')
      .min(1, 'Capacidade mínima é 1 ingresso')
      .max(500000, 'Capacidade máxima é 500.000 ingressos'),
    ticketPrice: z
      .number({
        error: 'Preço é obrigatório',
        message: 'Preço deve ser um número',
      })
      .min(0, 'Preço não pode ser negativo'),
    imageUrl: z
      .string()
      .trim()
      .url('URL da imagem é inválida')
      .optional()
      .or(z.literal('')),
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
