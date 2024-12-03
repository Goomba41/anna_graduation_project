import { z } from "zod";

const loginRegex = /^[a-zA-Z_0-9]*$/;
const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+~|}{[\]:;?></=]*$/;
const phoneRegex = /^[0-9]{10,14}$/;

export const ZUserBase = z.object({
  id: z.number().nullish(),

  // Текстовая строка с собранными ФИО, нужна только на вывод в списке
  fullName: z.string().optional(),
  lastName: z
    .string()
    .min(3, "Минимум 3 символа")
    .max(100, "Максимум 100 символов")
    .regex(/^[а-яёА-ЯЁ-]*$/, "Только символы кириллицы и дефис (-)"),
  firstName: z
    .string()
    .min(2, "Минимум 2 символа")
    .max(100, "Максимум 100 символов")
    .regex(/^[а-яёА-ЯЁ-]*$/, "Только символы кириллицы и дефис (-)"),
  patronymic: z
    .string()
    .max(100, "Максимум 100 символов")
    .regex(/^[а-яёА-ЯЁ-]*$/, "Только символы кириллицы и дефис (-)")
    .nullish()
    .default(null),

  email: z.union([
    z
      .literal("")
      .transform((val) => (val.length ? val : null))
      .nullish()
      .default(null),
    z.string().email("Некорректный формат email").nullish(),
  ]),
  phone: z.union([
    z
      .literal("")
      .transform((val) => (val.length ? val : null))
      .nullish()
      .default(null),
    z.string().regex(phoneRegex, "Некорректный формат телефона").nullish(),
  ]),
});

export type TUserBase = z.infer<typeof ZUserBase>;

const ZUserAdditional = z.object({
  login: z
    .string()
    .min(3, "Минимум 3 символа")
    .max(110, "Максимум 110 символов")
    .regex(loginRegex, "Только символы латиницы, цифры и подчеркивания (_)"),
  password: z
    .string()
    .regex(
      passwordRegex,
      "Только символы латиницы, цифры и спец. символы !@#$%^&*()_+~|}{[\\]:;?></=",
    )
    .nullish()
    .default(null),

  sysadmin: z.boolean().default(false),
});

export const ZUser = ZUserBase.merge(ZUserAdditional);

export const ZUsers = z.array(ZUser);

export type TUser = z.infer<typeof ZUser>;

export type TUsers = z.infer<typeof ZUsers>;

export const ZUserActivity = z.object({
  id: z.coerce.number(),
  userid: z.coerce.number(),
  userfullname: z.string(),
  action: z.string(),
  actiondate: z.string().datetime({ offset: true }),
});

export const ZUsersActivities = z.array(ZUserActivity);

export type TUserActivity = z.infer<typeof ZUserActivity>;

export type TUsersActivities = z.infer<typeof ZUsersActivities>;
