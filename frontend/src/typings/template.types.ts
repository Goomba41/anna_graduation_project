import z from 'zod'
import { DateTime as luxon } from 'luxon'
import { NIL } from 'uuid'

export const ZBaseTemplate = z.object({
  Id: z.nullable(z.string().uuid().optional()),
  Parent: z.nullable(z.string().uuid()).default(NIL),
  Nodelevel: z.coerce.number().default(1),
  Templatename: z
    .string({ message: 'Обязательное поле' })
    .min(3, { message: 'Минимум 3 символа' })
    .max(1000, { message: 'Максимум 1000 символов' }),
  Creationdate: z.string().datetime({ offset: true }).default(luxon.now().toISO()),
  Modifydate: z.nullable(z.string().datetime({ offset: true }).optional()),
  Iscatalog: z.boolean().default(false),
})

export type TBaseTemplate = z.infer<typeof ZBaseTemplate>

export const ZAttachment = z.object({
  Id: z.number().default(null).nullish(),
  AttachmentType: z.number(),
  WrTemplateId: z.string().uuid().default(null).nullish(),
  URL: z.string().url().default(null).nullish(),
  Name: z.string(),
})

export const ZAttachments = z.array(ZAttachment)

export type TAttachment = z.infer<typeof ZAttachment>

export type TAttachments = z.infer<typeof ZAttachments>

export const ZScheduleItem = z
  .object({
    Id: z.number().nullish(),
    PeriodTypeId: z.number({ message: 'Обязательное поле' }),
    Dates: z
      .array(
        z.union([
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
        ]),
      )
      .default([new Date()]),
  })
  .refine(
    (data) =>
      ([3, 7].includes(data.PeriodTypeId) && data.Dates.length > 0) ||
      ![3, 7].includes(data.PeriodTypeId),
    {
      message: 'Обязательное поле для выбранного типа периода',
      path: ['Dates'],
    },
  )

export const ZSchedule = z.array(ZScheduleItem)

export type TScheduleItem = z.infer<typeof ZScheduleItem>

export type TSchedule = z.infer<typeof ZSchedule>

export const ZRecipient = z.object({
  Id: z.number().nullish(),
  ARType: z.number({ message: 'Обязательное поле' }), // Идентификатор каталога
  KeyId: z.number({ message: 'Обязательное поле' }), // Идентификатор объекта
  Period: z
    .array(
      z
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
    )
    .min(1, { message: 'Начальная дата обязательна' })
    .max(2, { message: 'В периоде может быть только две даты' })
    .default([new Date()]),
})

export const ZRecipients = z.array(ZRecipient)

export type TRecipient = z.infer<typeof ZRecipient>

export type TRecipients = z.infer<typeof ZRecipients>

export const ZTemplate = ZBaseTemplate.merge(
  z.object({
    DocumentName: z
      .string({ message: 'Обязательное поле' })
      .max(1000, { message: 'Максимум 1000 символов' })
      .default(null)
      .nullish(),
    DocumentNumber: z
      .string({ message: 'Обязательное поле' })
      .max(50, { message: 'Максимум 50 символов' })
      .default(null)
      .nullish(),
    DocumentDate: z
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
      .default(null)
      .nullish(),
    TemplateTypeId: z.number(),
    ResponsibleId: z.number().default(null).nullish(),
    TemplateInitiatorId: z.number().default(null).nullish(),
    TemplateCategoryId: z.number().default(null).nullish(),
    ReportingDate: z
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
      .default(null),
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
      .default(null)
      .nullish(),
    Instructions: z
      .string()
      .max(5000, { message: 'Максимум 5000 символов' })
      .default(null)
      .nullish(),
    Attachments: ZAttachments.default([]).nullish(),
    ReportingSchedule: ZSchedule.min(1, { message: 'Обязательное поле' }),
    Assignments: ZRecipients.default(null).nullish(),
  }),
)

export const ZTemplates = z.array(ZTemplate)

export type TTemplate = z.infer<typeof ZTemplate>

export type TTemplates = z.infer<typeof ZTemplates>

export const ZTemplateHandbooksItem = z.object({
  Id: z.string().uuid(),
  ParentId: z.string().uuid().default(null).nullable(),
  Value: z.string(),
})

export const ZTemplateHandbooksItems = z.array(ZTemplateHandbooksItem)

export type TTemplateHandbooksItem = z.infer<typeof ZTemplateHandbooksItem>

export type TTemplateHandbooksItems = z.infer<typeof ZTemplateHandbooksItems>

export const ZSpreadData = z.object({
  name: z.string(),
  spread: z
    .string()
    .nullable()
    .transform((value) => (value ? (typeof value === 'string' ? JSON.parse(value) : value) : null)),
})

export type TSpreadData = z.infer<typeof ZSpreadData>
