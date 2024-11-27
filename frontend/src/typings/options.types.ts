import z from 'zod'

export const MeasuringUnit = z.object({
  Id: z.number(),
  Name: z.string(),
  UsOboznRu: z.nullable(z.string()),
  UsOboznM: z.nullable(z.string()),
  KodOboznRu: z.nullable(z.string()),
  KodOboznM: z.nullable(z.string()),
  Base: z.nullable(z.number()),
  Koef: z.nullable(z.number()),
})

export const MeasuringUnits = z.array(MeasuringUnit)

export type TSMeasuringUnits = z.infer<typeof MeasuringUnits>

export const RightsGroup = z.object({
  Id: z.number(),
  Name: z.string(),
  AppId: z.number(),
  GroupId: z.number(),
})

export const RightsGroups = z.array(RightsGroup)

export const Document = z.object({
  Id: z.number(),
  Name: z.string(),
})

export const Documents = z.array(Document)

export const IndicatorType = z.object({
  Id: z.number(),
  AlgName: z.string(),
})

export const IndicatorTypes = z.array(IndicatorType)

export const WebReportsGroup = z.object({
  Groupid: z.number(),
  Sort: z.number().nullish(),
  Groupname: z.string(),
  Metadata: z.any().transform((val) => {
    return val ? (typeof val === 'string' ? (JSON.parse(val) as unknown) : val) : null
  }),
})

export const WebReportsGroups = z.array(WebReportsGroup)

export type WebReportsGroup = z.infer<typeof WebReportsGroup>

export type WebReportsGroups = z.infer<typeof WebReportsGroups>

export const IndicatorMode = z.object({
  Id: z.number(),
  MsrModeName: z.string(),
  MsrModeSort: z.number(),
})

export const IndicatorModes = z.array(IndicatorMode)

export const IndicatorRank = z.object({
  Id: z.number(),
  RankName: z.string(),
  RankSort: z.number(),
})

export const IndicatorRanks = z.array(IndicatorRank)

export const WebReportsModel = z.object({
  Id: z.number(),
  Name: z.string(),
  Base: z.string(),
  TableFakt: z.string(),
  FieldValue: z.string(),
})

export const WebReportsModels = z.array(WebReportsModel)

export type WebReportsModel = z.infer<typeof WebReportsModel>

export type WebReportsModels = z.infer<typeof WebReportsModels>

export const dottedNumbersRegex: RegExp = /^([0-9]{1,}([.+][0-9]{1,})*)|([A-Z]+)$/gm

export const OkvedItem = z.object({
  OkvedCodeCh: z.nullable(z.string().regex(dottedNumbersRegex)),
  OkvedNodeCh: z.nullable(z.string().regex(dottedNumbersRegex)),
  OkvedId: z.coerce.number(),
  OkvedNode: z.coerce.number().nullable(),
  OkvedCode: z.coerce.number(),
  OkvedSort: z.coerce.number(),
  OkvedName: z.string(),
  OkvedShname: z.string(),
  OkvedLevel: z.coerce.number(),
  CathokvedCode: z.nullable(z.string()),
  SubokvedCode: z.nullable(z.string()),
  OkvedActive: z.coerce.number(),
  OkvedGrnum: z.coerce.number(),
  OkvedSokrName: z.nullable(z.string()),
})

export const OkvedItems = z.array(OkvedItem)

export type TSOkvedItem = z.infer<typeof OkvedItem>

export type TSOkvedItems = z.infer<typeof OkvedItems>

export const ModelAttribute = z.object({
  Id: z.coerce.number(), // УИД
  ModelId: z.coerce.number(), // Связанная с атрибутом модель
  AttrName: z.string(), // Имя атрибута (для вывода в UI)
  Tree: z.boolean(), // Справочник атрибута - дерево или таблица?
  TreeId: z.string(), // Если дерево, УИД строки
  TreeNode: z.string(), // Если дерево, УИД родителя строки
  TableS: z.string(), // Таблица, из которой подгружается справочник
  Alias: z.string(), // Псевдоним таблицы (для вывода в UI)
  FieldS: z.string(), // Столбец справочника
  FieldSid: z.string(), // Столбец справочника
  SortAtr: z.string(), // Поле для сортировки
  FieldTable: z.string(), // Поле в таблице данных
  HandbookEditable: z.boolean().default(false), // Справочник, соответствующий модели, является редактируемым
})

export const ModelAttributes = z.array(ModelAttribute)

export type ModelAttribute = z.infer<typeof ModelAttribute>

export type ModelAttributes = z.infer<typeof ModelAttributes>

export const Decree607Plane = z.object({
  ReportName: z.string(), // Имя отчёта (начальная часть)
  PlaneName: z.string(), // Имя плана (ReportName + YEARCREATE)
  YearCreate: z.coerce.number(), // Год создания
  IdReport: z.coerce.number(), // Идентификатор отчёта
  IdPlane: z.coerce.number(), // Идентификатор плана
  Published: z.boolean().default(false),
  HasData: z.boolean().default(false).nullish(),
  HasTable: z.boolean().default(false).nullish(),
})

export const Decree607Planes = z.array(Decree607Plane)

export type Decree607Plane = z.infer<typeof Decree607Plane>

export type Decree607Planes = z.infer<typeof Decree607Planes>

export const Decree607Report = z.object({
  IdReport: z.coerce.number(), // Идентификатор плана
  ReportName: z.string(), // Имя отчёта
  TypeReport: z.coerce.number(), // Тип отчёта (почти бесполезный)
})

export const Decree607Reports = z.array(Decree607Report)

export type Decree607Report = z.infer<typeof Decree607Report>

export type Decree607Reports = z.infer<typeof Decree607Reports>

const periodBase = z.object({
  PeriodId: z.coerce.number(), // Идентификатор периода
  PeriodName: z.string(), // Имя Периода
  PeriodGr: z.coerce.number(), // Уровень периода
  PeriodSort: z.coerce.number(), // Порядок сортировки
  PeriodRef: z.coerce.number().nullable(), // Порядок сортировки
})

export const Period = periodBase.extend({
  PeriodRefNavigation: periodBase.or(z.coerce.number()).nullable(),
})

export const Periods = z.array(Period)

export type TSPeriod = z.infer<typeof Period>

export type TSPeriods = z.infer<typeof Periods>

const ownershipBase = z.object({
  Kfs: z.coerce.number(),
  KfsName: z.coerce.string(),
  KfsNode: z.coerce.number().nullable(),
  Prim: z.coerce.string(),
  KfsSort: z.coerce.number(),
})

export const Ownership = ownershipBase.extend({
  KfsNodeNavigation: ownershipBase.nullish(),
})

export const Ownerships = z.array(Ownership)

export type TSOwnership = z.infer<typeof Ownership>

export type TSOwnerships = z.infer<typeof Ownerships>

export const IndicatorModeGroup = z.object({
  Id: z.coerce.number(),
  MsrModeGroupName: z.coerce.string(),
  MsrModeGroupSort: z.coerce.number(),
})

export const IndicatorModeGroups = z.array(IndicatorModeGroup)

export type TSIndicatorModeGroup = z.infer<typeof IndicatorModeGroup>

export type TSIndicatorModeGroups = z.infer<typeof IndicatorModeGroups>

export const TemplateCategory = z.object({
  Id: z.number(),
  Name: z.string(),
  Description: z.string(),
  IsDelete: z.boolean(),
})

// 👆 Старые возможно не нужные данные, после окончания разработки свериться и почистить

export const TemplateCategories = z.array(TemplateCategory)

export type TTemplateCategory = z.infer<typeof TemplateCategory>

export type TTemplateCategories = z.infer<typeof TemplateCategories>

export const Reglament = z.object({
  Id: z.number(),
  Name: z.string(),
  IsDelete: z.boolean(),
})

export const Reglaments = z.array(Reglament)

export type TReglament = z.infer<typeof Reglament>

export type TReglaments = z.infer<typeof Reglaments>

export const Initiator = z.object({
  Id: z.number(),
  Name: z.string(),
  Description: z.string(),
  IsDelete: z.boolean(),
})

export const Initiators = z.array(Initiator)

export type TInitiator = z.infer<typeof Initiator>

export type TInitiators = z.infer<typeof Initiators>

export const Status = z.object({
  Id: z.number(),
  Name: z.string(),
})

export const Statuses = z.array(Status)

export type TStatus = z.infer<typeof Status>

export type TStatuses = z.infer<typeof Statuses>

export const Recipient = z.object({
  Label: z.string(),
  Value: z.number(),
})

export const Recipients = z.array(Recipient.extend({ CatalogueValue: z.number() }))

export const RecipientsGroup = Recipient.extend({
  Items: z.array(Recipient.extend({ CatalogueValue: z.number() })),
})

export const RecipientsGroups = z.array(RecipientsGroup)

export type TRecipient = z.infer<typeof Recipient>

export type TRecipients = z.infer<typeof Recipients>

export type TRecipientsGroup = z.infer<typeof RecipientsGroup>

export type TRecipientsGroups = z.infer<typeof RecipientsGroups>
