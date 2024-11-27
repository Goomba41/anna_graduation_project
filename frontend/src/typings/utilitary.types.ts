import z from 'zod'
// import { DateTime as luxon } from 'luxon'

export const ZGridColumn = z.object({
  dataField: z.string(),
  position: z.number(),
  type: z.string(), // ? Возможно литерал с перечислением типов
  caption: z.string(),
  visible: z.boolean(),
  allowGrouping: z.boolean(),
  groupIndex: z.number(),
  minWidth: z.number().optional(),
  width: z.number().optional(),
  format: z.string().optional(),
  cellTemplate: z.string().optional(),
})

export type TGridColumn = z.infer<typeof ZGridColumn>

export const ZGridColumns = z.array(ZGridColumn)

export type TGridColumns = z.infer<typeof ZGridColumns>
