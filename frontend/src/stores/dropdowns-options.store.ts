import { defineStore } from 'pinia'

import axios from 'axios'
import { z } from 'zod'

import toast from '@/utils/toast'
import queryString from '@/utils/query-string-transformer'
import callParseErrorToast from '@/utils/type-parse-error'

import { ZUsers, ZUser } from '@/typings/user.types'

import { errorResult, successResult } from '@/typings/http.types'

import {
  MeasuringUnit,
  MeasuringUnits,
  Document,
  Documents,
  IndicatorMode,
  IndicatorModes,
  IndicatorRank,
  IndicatorRanks,
  IndicatorType,
  IndicatorTypes,
  OkvedItem,
  OkvedItems,
  RightsGroup,
  RightsGroups,
  WebReportsGroup,
  WebReportsGroups,
  WebReportsModel,
  WebReportsModels,
  ResponsibleUsers,
  ModelAttribute,
  ModelAttributes,
  Decree607Plane,
  Decree607Planes,
  Decree607Report,
  Decree607Reports,
  Period,
  Periods,
  Ownership,
  Ownerships,
  IndicatorModeGroup,
  IndicatorModeGroups,
  TemplateCategory,
  TemplateCategories,
  Reglament,
  Reglaments,
  Initiator,
  Initiators,
  Status,
  Statuses,
  RecipientsGroup,
  RecipientsGroups,
} from '@/typings/options.types'
import { ZTemplateHandbooksItems } from '@/typings/template.types'

const optionsTypes: { [key: string]: (z.ZodObject<any> | z.ZodArray<any>)[] } = {
  units: [MeasuringUnit, MeasuringUnits],
  documents: [Document, Documents],
  'indicator-type': [IndicatorType, IndicatorTypes],
  'indicator-mode': [IndicatorMode, IndicatorModes],
  'indicator-mode-groups': [IndicatorModeGroup, IndicatorModeGroups],
  'indicator-rank': [IndicatorRank, IndicatorRanks],
  okved: [OkvedItem, OkvedItems],
  period: [Period, Periods],
  'period-types': [Document, Documents],
  'territories-for-reglament': [Document, Documents],
  'rights-groups': [RightsGroup, RightsGroups],
  'web-reports-groups': [WebReportsGroup, WebReportsGroups],
  'web-reports-models': [WebReportsModel, WebReportsModels],
  'web-reports-models-attributes': [ModelAttribute, ModelAttributes],
  '607-decree-planes': [Decree607Plane, Decree607Planes],
  '607-decree-reports': [Decree607Report, Decree607Reports],
  ownerships: [Ownership, Ownerships],
  // 👆 Старые возможно не нужные данные, после окончания разработки свериться и почистить
  users: [ZUser, ZUsers],
  templatecategory: [TemplateCategory, TemplateCategories],
  orggroup: [Reglament, Reglaments],
  templateinitiator: [Initiator, Initiators],
  templatestatus: [Status, Statuses],
  assignments: [RecipientsGroup, RecipientsGroups],
}

export const useDropdownsOptionsStore = defineStore({
  id: 'dropdowns-options',
  // state: () => ({}),
  actions: {
    /**
     * Получение данных (строка или список строк)
     * @param {string} [id] - ID строки для получения данных по ней
     */
    async read(object: string, id?: number, query?: { [key: string]: unknown }) {
      if (id) {
        return await axios
          .get(`/api/options/${object}/${id}${query ? queryString(query) : ''}`)
          .then((response: unknown) => {
            if (response.result < 0) {
              toast('Ошибка!', response.Error, 'error')
              return Promise.reject()
            } else {
              const parsing = optionsTypes[object][0].safeParse(response.data)

              if (parsing.success === false) {
                toast('Ошибка!', 'С сервера получен некорректный объект', 'error')

                const formatted: { [key: string]: unknown } = parsing.error.format()
                const fields: string[] = Object.keys(formatted)

                fields.forEach((field: string) => {
                  console.error(`${field}: ${formatted[field]?._errors.join(';')}`)
                })
                return Promise.reject([])
              }
              return Promise.resolve(parsing.data)
            }
          })
          .catch((error) => Promise.reject(error))
      } else {
        return await axios
          .get(`/api/options/${object}${query ? queryString(query) : ''}`)
          .then((response: unknown) => {
            if (response.result < 0) {
              toast('Ошибка!', response.Error, 'error')
              return Promise.reject()
            } else {
              const parsing = optionsTypes[object][1].safeParse(response.data)

              if (parsing.success === false) {
                const formatted: { [key: string]: unknown } = parsing.error.format()
                // const rows: string[] = Object.keys(formatted);

                // toast(
                //   "Предупреждение!",
                //   `Некорректные данные в строках: ${rows.join(",")}`,
                //   "warn"
                // );
                console.error(formatted)

                return Promise.resolve(response.data)
              }
              return Promise.resolve(parsing.data)
            }
          })
      }
    },
    /**
     * Получение данных для справочников шаблона
     */
    async readSpreadOptions(query?: { [key: string]: never }) {
      return await axios
        .get(`/api/spreadsheet/selection-options${query ? queryString(query) : ''}`)
        .then((responseJSON) => {
          const result = successResult.extend({
            // data: z.record(z.string(), z.union([z.array(z.string()), ZMedicalSpecializations])),
            data: z.record(z.string(), ZTemplateHandbooksItems),
            description: z.array(
              z.object({
                Name: z.string(),
                Path: z.string(),
              }),
            ),
          })

          const error = errorResult.safeParse(responseJSON)
          const response = result.safeParse(responseJSON)

          if (response.success === true) {
            const { data } = response.data
            const { description } = response.data

            return Promise.resolve({ data, description })
          } else if (error.success === true) {
            const { data } = error
            toast('Ошибка', data.ErrorMsg || data.Error, 'error')
          } else {
            callParseErrorToast(response.error)
            callParseErrorToast(error.error)
          }
        })
        .catch((error) => {
          callParseErrorToast(error)
          return Promise.reject(error)
        })
    },
  },
})
