import z from 'zod'

export const Setting = z.object({
  Id: z.string().uuid(),
  Name: z.string(),
  Value: z.union([z.boolean(), z.number().int(), z.string()]),
  Type: z.enum(['Boolean', 'Int32', 'String']),
  // Type: z.number().int()
})

export const Settings = z.array(Setting)

export type TSetting = z.infer<typeof Setting>

export type TSettings = z.infer<typeof Settings>
