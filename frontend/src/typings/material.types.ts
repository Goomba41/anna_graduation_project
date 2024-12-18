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
  materialTypeName: z.string().optional(),
  actionDate: z.union([
    z
      .string({ message: "Обязательное поле" })
      .min(1, { message: "Обязательное поле" })
      .datetime({ offset: true })
      .transform((value) => luxon.fromISO(value).toJSDate()),
    z
      .string({ message: "Обязательное поле" })
      .min(1, { message: "Обязательное поле" })
      .date()
      .transform((value) => luxon.fromISO(value).toJSDate()),
    z.date().transform((value) => luxon.fromJSDate(value).toISO()),
  ]),
  control: z
    .union([
      z
        .string()
        .datetime({ offset: true })
        .transform((value) => luxon.fromISO(value).toJSDate()),
      z
        .string()
        .date()
        .transform((value) => luxon.fromISO(value).toJSDate()),
      z.date().transform((value) => luxon.fromJSDate(value).toISO()),
    ])
    .nullish(),
  fact: z
    .union([
      z
        .string()
        .datetime({ offset: true })
        .transform((value) => luxon.fromISO(value).toJSDate()),
      z
        .string()
        .date()
        .transform((value) => luxon.fromISO(value).toJSDate()),
      z.date().transform((value) => luxon.fromJSDate(value).toISO()),
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
  departureTypeId: z.number().nullish(),
  documentTypeId: z.number(),
  projectId: z.number(),
  institutionId: z.number(),
  creatorId: z.number(),
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
