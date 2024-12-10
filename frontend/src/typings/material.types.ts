import { z } from "zod";
import { ZUser } from "./user.types";
import { ZInstitution } from "./institution.types";

export enum MaterialType {
  Incoming = 0,
  Outgoing = 1,
}

const ZStaticHandbook = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .nullish();

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
  departureType: ZStaticHandbook,
  documentTypeId: z.number().nullable(),
  documentType: ZStaticHandbook,
  projectId: z.number().nullable(),
  project: ZStaticHandbook,
  institutionId: z.number().nullable(),
  institution: ZInstitution,
  creatorId: z.number().nullable(),
  creator: ZUser,
});

export const ZMaterials = z.array(ZMaterial);

export type TMaterial = z.infer<typeof ZMaterial>;

export type TMaterials = z.infer<typeof ZMaterials>;
