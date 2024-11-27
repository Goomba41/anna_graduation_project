import z from 'zod'
import { DateTime as luxon } from 'luxon'

export const semverRegex: RegExp =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

export const ZTechEmployee = z.object({
  id: z.string().uuid(),
  icon: z.string(),
  name: z.string(),
  post: z.string(),
  phone: z.number(),
  email: z.string().email(),
})

export type TTechEmployee = z.infer<typeof ZTechEmployee>

export const ZTechEmployees = z.array(ZTechEmployee)

export type TTechEmployees = z.infer<typeof ZTechEmployees>

export const ZDocumentation = z.object({
  id: z.string().uuid(),
  icon: z.string(),
  text: z.string(),
  date: z
    .string()
    .datetime()
    .transform((date) => luxon.fromISO(date).toFormat('dd.MM.yyyy')),
  link: z.string(),
})

export type TDocumentation = z.infer<typeof ZDocumentation>

export const ZDocumentationList = z.array(ZDocumentation)

export type TDocumentationList = z.infer<typeof ZDocumentationList>

export const ZPackage = z.object({
  id: z.string().uuid(),
  name: z.string(),
  version: z.string(),
  icon: z.string().optional(),
  position: z.number(),
})

export type TPackage = z.infer<typeof ZPackage>

export const ZPackages = z.array(ZPackage)

export type TPackages = z.infer<typeof ZPackages>

export const ZChangelogItem = z.object({
  Id: z.string().uuid(),
  Number: z.string().regex(semverRegex),
  Date: z
    .string()
    .datetime()
    .transform((value) => {
      const formatted = luxon.fromISO(value).toLocaleString(luxon.DATE_HUGE)
      return formatted[0].toUpperCase() + formatted.slice(1)
    }),
  Changelogs: z.array(
    z.object({
      Id: z.string().uuid(),
      Versionid: z.string().uuid(),
      Text: z.string(),
      Type: z.number(),
      Icon: z.string().default('question'),
    }),
  ),
})

export type TChangelogItem = z.infer<typeof ZChangelogItem>

export const ZChangelog = z.array(ZChangelogItem)

export type TChangelog = z.infer<typeof ZChangelog>
