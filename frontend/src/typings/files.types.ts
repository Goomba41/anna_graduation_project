import z from "zod";
import mime from "mime-types";
import { DateTime as luxon } from "luxon";

export const ZFile = z.object({
  id: z.number().nullish(),
  seqNum: z.number(),
  name: z
    .string({ message: "Обязательное поле" })
    .min(1, "Обязательное поле")
    .max(100, "Максимум 100 символов"),
  mime: z
    .string({ message: "Обязательное поле" })
    .min(1, "Обязательное поле")
    .max(100, "Максимум 100 символов")
    .default("application/octet-stream")
    .refine((val) => mime.extension(val), {
      message: "Тип файла не прошел проверку/не существует",
    }),
  atime: z
    .union([
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
    ])
    .nullable(),
  mtime: z
    .union([
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
    ])
    .nullable(),
  ctime: z.union([
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
});

export const ZFiles = z.array(ZFile);

export type TFile = z.infer<typeof ZFile>;

export type TFiles = z.infer<typeof ZFiles>;
