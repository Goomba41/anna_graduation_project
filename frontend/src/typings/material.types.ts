import { z } from "zod";

export enum MaterialType {
  Incoming = 0,
  Outgoing = 1,
}

export const ZMaterial = z.object({
  id: z.number().nullish(),
  materialType: z.nativeEnum(MaterialType),
  actionDate: z.string().datetime({ offset: true }),
  control: z.string().datetime({ offset: true }).nullable(),
  fact: z.string().datetime({ offset: true }).nullable(),
  number: z
    .string()
    .min(1, "Обязательное поле")
    .max(300, "Максимум 300 символов"),
  additionalInfo: z
    .string()
    .max(1000, "Максимум 1000 символов")
    .nullable()
    .default(null),
  departureTypeId: z.number().nullable(),
  documentTypeId: z.number().nullable(),
  projectId: z.number().nullable(),
  institutionId: z.number().nullable(),
  creatorId: z.number().nullable(),
});

export const ZMaterials = z.array(ZMaterial);

export type TMaterial = z.infer<typeof ZMaterial>;

export type TMaterials = z.infer<typeof ZMaterials>;
