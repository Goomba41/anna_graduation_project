import { z } from "zod";

export const ZFIASObject = z.object({
  objectId: z.number(),
  postalCode: z.number().nullable(),
  okato: z
    .string()
    .regex(/^\d{11}$/)
    .nullable(), // 79000000000
  oktmo: z
    .string()
    .regex(/^\d{8,12}$/)
    .nullable(), // 79000000
  kladrCode: z
    .string()
    .regex(/^\d{13}$/)
    .nullable(), // 0100000000000
  oktmoBudget: z
    .string()
    .regex(/^\d{8}$/)
    .nullable(), // 79000000
  objectGuid: z.string().uuid(),
  fullName: z.string(),
  regionCode: z.number(),
  isActive: z.boolean(),
  path: z.string().regex(/^(\d+)(.\d+){0,2}$/), // 11.11.1145
});

export const ZFIASObjects = z.array(ZFIASObject);

export type TFIASObject = z.infer<typeof ZFIASObject>;

export type TFIASObjects = z.infer<typeof ZFIASObjects>;
