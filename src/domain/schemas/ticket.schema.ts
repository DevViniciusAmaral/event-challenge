import { z } from 'zod'

export const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/

export const checkoutSchema = z
  .object({
    buyerName: z
      .string({ required_error: 'Nome é obrigatório' })
      .trim()
      .min(3, 'Nome deve ter no mínimo 3 caracteres')
      .max(120, 'Nome deve ter no máximo 120 caracteres'),
    buyerEmail: z
      .string({ required_error: 'E-mail é obrigatório' })
      .trim()
      .min(1, 'E-mail é obrigatório')
      .email('Digite um e-mail válido'),
    buyerCpf: z
      .string({ required_error: 'CPF é obrigatório' })
      .trim()
      .regex(cpfRegex, 'Digite um CPF válido (11 dígitos)'),
    quantity: z
      .number({ required_error: 'Quantidade é obrigatória' })
      .int('Quantidade deve ser um número inteiro')
      .min(1, 'Quantidade mínima é 1')
      .max(10, 'Quantidade máxima é 10 ingressos por compra'),
    paymentMethod: z.enum(['pix', 'card'], {
      required_error: 'Selecione a forma de pagamento',
      invalid_type_error: 'Forma de pagamento inválida',
    }),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.paymentMethod === 'card') {
      if (!val.cardNumber || val.cardNumber.replace(/\s/g, '').length < 13) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Número do cartão é obrigatório',
          path: ['cardNumber'],
        })
      }
      if (!val.cardName || val.cardName.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nome no cartão é obrigatório',
          path: ['cardName'],
        })
      }
      if (!val.cardExpiry || !/^\d{2}\/\d{2}$/.test(val.cardExpiry)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Validade inválida (MM/AA)',
          path: ['cardExpiry'],
        })
      }
      if (!val.cardCvv || val.cardCvv.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CVV inválido',
          path: ['cardCvv'],
        })
      }
    }
  })

export type CheckoutSchema = z.infer<typeof checkoutSchema>
