import z from 'zod'
import { DateTime as luxon } from 'luxon'
import { v4 } from 'uuid'

const ZEventBase = z.object({
  id: z.string().uuid().default(v4()),
  startDate: z.union([
    z.string().min(1, { message: `Обязательное поле` }).datetime({ offset: true }),
    z.string().min(1, { message: `Обязательное поле` }).date(),
    z.date().transform((value) => luxon.fromJSDate(value).toFormat('yyyy-MM-dd')),
  ]),
  endDate: z.union([
    z.string().min(1, { message: `Обязательное поле` }).datetime({ offset: true }),
    z.string().min(1, { message: `Обязательное поле` }).date(),
    z.date().transform((value) => luxon.fromJSDate(value).toFormat('yyyy-MM-dd')),
  ]),
  title: z.string(),
})

export const ZEventItem = ZEventBase.merge(
  z.object({
    tooltip: z.string().optional(),
    url: z.string().url().optional(),
    classes: z.array(z.string()).min(1),
    style: z.string().optional(),
    itemRow: z.number().optional(),
    originalItem: ZEventBase.optional(),
    templateId: z.string().uuid(),
    ReportId: z.number().nullable(),
    Reports: z
      .object({
        Filled: z.number().min(0).default(0),
        Overall: z.number().min(0).default(0),
        ReportsByTemplate: z
          .array(
            z.object({
              Id: z.number(),
              Name: z.string().optional(),
            }),
          )
          .default([]),
      })
      .default({ Filled: 0, Overall: 0, ReportsByTemplate: [] }),
    PublicationDate: z
      .union([
        z
          .string({ message: 'Обязательное поле' })
          .datetime({ offset: true })
          .transform((value) => luxon.fromISO(value).toJSDate()),
        z
          .string({ message: 'Обязательное поле' })
          .date()
          .transform((val) => luxon.fromFormat(val, 'yyyy-MM-dd').toJSDate()),
        z
          .date({ message: 'Обязательное поле' })
          .transform((value) => luxon.fromJSDate(value).toISO()),
      ])
      .nullable(),
  }),
)

export type TEventItem = z.infer<typeof ZEventItem>

export const ZEventsList = z.array(ZEventItem)

export type TEventsList = z.infer<typeof ZEventsList>

const minimalYear = 1970
const maximalYear = new Date().getFullYear()

export const ZGetCalendarFilters = z.object({
  year: z
    .number()
    .gte(minimalYear, { message: `Год не должен быть меньше ${minimalYear}` })
    .lte(maximalYear, { message: `Год не должен быть больше ${maximalYear}` })
    .nullish(),
  month: z
    .number()
    .gte(1, { message: `Несуществующий месяц` })
    .lte(12, { message: `Несуществующий месяц` })
    .nullish(),
  statuses: z.array(z.number()).optional(),
  categories: z.array(z.number()).optional(),
  reglaments: z.array(z.number()).optional(),
  executors: z.array(z.number()).optional(),
  initiators: z.array(z.number()).optional(),
})

export const ZGetCalendarForm = z.object({
  startDate: z
    .union([
      z.string().min(1, { message: `Обязательное поле` }).datetime({ offset: true }),
      z.string().min(1, { message: `Обязательное поле` }).date(),
    ])
    .default(luxon.now().startOf('month').toISO())
    .transform((value) => luxon.fromISO(value).toFormat('yyyy-MM-dd')),
  endDate: z
    .union([
      z.string().min(1, { message: `Обязательное поле` }).datetime({ offset: true }),
      z.string().min(1, { message: `Обязательное поле` }).date(),
    ])
    .default(luxon.now().endOf('month').toISO())
    .transform((value) => luxon.fromISO(value).toFormat('yyyy-MM-dd')),
  filter: ZGetCalendarFilters.optional(),
})

export type TGetCalendarForm = z.infer<typeof ZGetCalendarForm>
