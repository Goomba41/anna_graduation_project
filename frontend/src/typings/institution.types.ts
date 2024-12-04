import { z } from "zod";

export const ZInstitution = z.object({
  id: z.number().nullish(),

  name: z
    .string()
    .min(1, "Обязательное поле")
    .max(300, "Максимум 300 символов"),
  address: z
    .string()
    .min(1, "Обязательное поле")
    .max(300, "Максимум 300 символов"),
  contact: z.string().max(500, "Максимум 500 символов").nullish().default(null),

  subject: z.number().positive(),
  district: z.number().positive(),
  locality: z.number().positive(),
});

export const ZInstitutions = z.array(ZInstitution);

export type TInstitution = z.infer<typeof ZInstitution>;

export type TInstitutions = z.infer<typeof ZInstitutions>;
