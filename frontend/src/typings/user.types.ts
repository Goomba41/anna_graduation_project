import { z } from "zod";

const loginRegex = /^[a-zA-Z_0-9]*$/;
const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+~|}{[\]:;?></=]*$/;
const phoneRegex = /^[0-9]{10,14}$/;

export const ZUserBase = z.object({
  Id: z.number().nullish(),

  // Текстовая строка с собранными ФИО, нужна только на вывод в списке
  Fio: z.string().optional(),
  Fam: z
    .string()
    .min(3, "Минимум 3 символа")
    .max(100, "Максимум 100 символов")
    .regex(/^[а-яёА-ЯЁ-]*$/, "Только символы кириллицы и дефис (-)"),
  Nam: z
    .string()
    .min(2, "Минимум 2 символа")
    .max(100, "Максимум 100 символов")
    .regex(/^[а-яёА-ЯЁ-]*$/, "Только символы кириллицы и дефис (-)"),
  Ot: z
    .string()
    .max(100, "Максимум 100 символов")
    .regex(/^[а-яёА-ЯЁ-]*$/, "Только символы кириллицы и дефис (-)")
    .default(null)
    .nullish(),

  Email: z.union([
    z
      .literal("")
      .transform((val) => (val.length ? val : null))
      .default(null)
      .nullish(),
    z.string().email("Некорректный формат email").nullish(),
  ]),
  Telephone: z.union([
    z
      .literal("")
      .transform((val) => (val.length ? val : null))
      .default(null)
      .nullish(),
    z.string().regex(phoneRegex, "Некорректный формат телефона").nullish(),
  ]),
});

export type TUserBase = z.infer<typeof ZUserBase>;

const ZUserAdditional = z.object({
  Name: z
    .string()
    .min(3, "Минимум 3 символа")
    .max(110, "Максимум 110 символов")
    .regex(loginRegex, "Только символы латиницы, цифры и подчеркивания (_)"),
  Userpassword: z
    .string()
    .regex(
      passwordRegex,
      "Только символы латиницы, цифры и спец. символы !@#$%^&*()_+~|}{[\\]:;?></=",
    )
    .default(null)
    .nullish(),

  Unit: z.string().default(null).nullish(),
  Dol: z.string().default(null).nullish(),

  Sysadmin: z.boolean().default(false),
});

export const ZUser = ZUserBase.merge(ZUserAdditional);

export const ZUsers = z.array(ZUser);

export type TUser = z.infer<typeof ZUser>;

export type TUsers = z.infer<typeof ZUsers>;

export const ZUserActivity = z.object({
  Id: z.coerce.number(),
  Riasappid: z.coerce.number(),
  AppName: z.string(),
  Fio: z.string(),
  Riasapp: z
    .nullable(
      z.object({
        Id: z.coerce.number(),
        AppName: z.string(),
      }),
    )
    .optional(),
  Userid: z.coerce.number(),
  User: z
    .object({
      Id: z.coerce.number(),
      Sysadmin: z.boolean(),
      Name: z.string(),
      Fio: z.string(),
      Fam: z.string(),
      Nam: z.string().nullable(),
      Ot: z.string().nullable(),
      Dol: z.string(),
      Unit: z.string(),
      Telephone: z.string().nullable(),
      Email: z.string().nullable(),
      SrcId: z.nullable(z.coerce.number()),
      TerrId: z.nullable(z.coerce.number()),
    })
    .optional(),
  Message: z.string(),
  Actiondate: z.string().datetime({ offset: true }),
});

export const ZUserActivityGroup = z.object({
  key: z.string(),
  items: z.array(z.any()).nullable(),
  count: z.number(),
  summary: z.any(),
});

export const ZUsersActivities = z.array(
  z.union([ZUserActivity, ZUserActivityGroup]),
);

export type TUserActivity = z.infer<typeof ZUserActivity>;

export type TUsersActivities = z.infer<typeof ZUsersActivities>;

export const ZRight = z.object({
  Id: z.coerce.number(),
  UsersId: z.coerce.number(),
  AppId: z.coerce.number(),
  AppName: z.nullable(z.string().optional()),
  GroupsId: z.coerce.number().default(0),
});

export const ZRights = z.array(ZRight);

export type TRight = z.infer<typeof ZRight>;

export type TRights = z.infer<typeof ZRights>;
