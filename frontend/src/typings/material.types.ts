import z from "zod";
import { DateTime as luxon } from "luxon";

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
  actionDate: z.union([
    z
      .string({ message: "Обязательное поле" })
      .min(1, { message: "Обязательное поле" })
      .datetime({ offset: true }),
    z
      .string({ message: "Обязательное поле" })
      .min(1, { message: "Обязательное поле" })
      .date(),
    z
      .date()
      .transform((value) => luxon.fromJSDate(value).toFormat("yyyy-MM-dd")),
  ]),
  control: z
    .union([
      z.string().datetime({ offset: true }),
      z.string().date(),
      z
        .date()
        .transform((value) => luxon.fromJSDate(value).toFormat("yyyy-MM-dd")),
    ])
    .nullish(),
  fact: z
    .union([
      z.string().datetime({ offset: true }),
      z.string().date(),
      z
        .date()
        .transform((value) => luxon.fromJSDate(value).toFormat("yyyy-MM-dd")),
    ])
    .nullish(),
  number: z
    .string({ message: "Обязательное поле" })
    .min(1, "Обязательное поле")
    .max(100, "Максимум 100 символов"),
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

export const ZMaterialReferences = z.object({
  departureType: ZStaticHandbook,
  documentType: ZStaticHandbook,
  project: ZStaticHandbook,
  institution: ZInstitution,
  creator: ZUser,
});

export const ZMaterialExtended = ZMaterial.merge(ZMaterialReferences);

export const ZMaterialsExtended = z.array(ZMaterialExtended);

export type TMaterialExtended = z.infer<typeof ZMaterialExtended>;

export type TMaterialsExtended = z.infer<typeof ZMaterialsExtended>;
