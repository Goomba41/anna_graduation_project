import { defineStore } from 'pinia'

import z from 'zod'
import axios from 'axios'

import toast, { remove } from '@/utils/toast'
import queryString from '@/utils/query-string-transformer'
import callParseErrorToast from '@/utils/type-parse-error'

import { TEventsList, TGetCalendarForm, ZEventsList } from '@/typings/calendar.types'
import { errorResult, successResult } from '@/typings/http.types'
import { TTemplate, ZTemplate, ZSpreadData, TSpreadData } from '@/typings/template.types'

import { useSignalRStore } from './signalr.store'

export const useCalendarStore = defineStore({
  id: 'calendar',
  state: () => ({
    // forms: null as TSReportForms | null,
    // form: null as TSReportForm | null,
  }),
  actions: {
    /**
     * Действие для получения событий календаря по заданному периоду
     *
     * @async
     * @param {TGetCalendarForm} body - тело запроса
     * @param {?{ [key: string]: never }} [queryParams] - query-параметры для запроса
     * @returns {Promise<TEventsList>}
     */
    async getCalendarEvents(
      body: TGetCalendarForm,
      queryParams?: { [key: string]: never },
    ): Promise<TEventsList> {
      return await axios
        .post(
          `/api/reporting/getcalendarreports${queryParams ? queryString(queryParams) : ''}`,
          body,
        )
        .then((responseJSON) => {
          const result = successResult.extend({ data: ZEventsList })

          const error = errorResult.safeParse(responseJSON)
          const response = result.safeParse(responseJSON)

          if (response.success === true) {
            const { data } = response.data

            return Promise.resolve(data)
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
    /**
     * Создание объекта
     * @param {TTemplate} form - данные формы для отправки на сервер
     */
    async create(form: TTemplate) {
      return await axios
        .post(`/api/reporting/templates${form.Id ? '/' + form.Id : ''}`, form)
        .then((responseJSON) => {
          const result = successResult.extend({ createdId: z.string().uuid(), form: ZTemplate })

          const error = errorResult.safeParse(responseJSON)
          const response = result.safeParse(responseJSON)

          if (response.success === true) {
            const { createdId, form } = response.data

            return Promise.resolve({ createdId, form })
          } else if (error.success === true) {
            const { data } = error
            toast('Ошибка', data.ErrorMsg || data.Error, 'error')
            return Promise.reject(data.ErrorMsg || data.Error)
          } else {
            callParseErrorToast(response.error)
            callParseErrorToast(error.error)
            return Promise.reject(`${error.error}; ${response.error}`)
          }
        })
        .catch((error) => {
          callParseErrorToast(error)
          return Promise.reject(error)
        })
    },
    /**
     * Удаление объекта
     **/
    async delete(object: 'reports' | 'templates', id: string | number) {
      return await axios
        .delete(`/api/Reporting/${object}/${id}`)
        .then((responseJSON) => {
          const result = successResult.extend({ deletedId: z.string().uuid() })

          const error = errorResult.safeParse(responseJSON)
          const response = result.safeParse(responseJSON)

          if (response.success === true) {
            const { deletedId } = response.data

            return Promise.resolve(deletedId)
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
    /**
     * Патч объекта
     **/
    async patch(id: string, query?: { [key: string]: unknown }) {
      return await axios
        .patch(`/api/reporting/templates/${id}${query ? queryString(query) : ''}`)
        .then((responseJSON) => {
          const result = successResult.extend({ patchedId: z.string().uuid() })

          const error = errorResult.safeParse(responseJSON)
          const response = result.safeParse(responseJSON)

          if (response.success === true) {
            const { patchedId } = response.data

            return Promise.resolve(patchedId)
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
    /**
     * Загрузка файлов
     **/
    async download(id: number, template: string, query?: { [key: string]: unknown }) {
      return await axios
        .get(`/api/reporting/templates/${template}/file/${id}${query ? queryString(query) : ''}`)
        // .then((file) => {
        // const result = successResult.extend({ patchedId: z.string().uuid() })

        // const error = errorResult.safeParse(responseJSON)
        // const response = successResult.safeParse(responseJSON)

        // if (response.success === true) {
        //   // const { patchedId } = response.data

        //   return Promise.resolve()
        // } else if (error.success === true) {
        //   const { data } = error
        //   toast('Ошибка', data.ErrorMsg || data.Error, 'error')
        // } else {
        //   callParseErrorToast(response.error)
        //   callParseErrorToast(error.error)
        // }
        // })
        .catch((error) => {
          callParseErrorToast(error)
          return Promise.reject(error)
        })
    },
    /**
     * Загрузка файлов и прикрепление к шаблону
     **/
    async upload(
      form: FormData,
      title: string = 'Загрузка файлов',
      query?: { [key: string]: unknown },
    ) {
      toast(title, null, 'info', null, 'progress')

      return await axios
        .post(`/api/reporting/templates/attached-files${query ? queryString(query) : ''}`, form, {
          onUploadProgress: (progressEvent) => {
            const totalLength = progressEvent.lengthComputable
              ? progressEvent.total
              : progressEvent.event.target.getResponseHeader('content-length') ||
                progressEvent.event.target.getResponseHeader('x-decompressed-content-length')

            if (totalLength !== null) {
              const percent = Math.round((progressEvent.loaded * 100) / totalLength)

              useSignalRStore().received = {
                percent,
                title,
              }

              if (percent === 100) remove('progress')
            }
          },
        })
        .then((responseJSON) => {
          // const result = successResult.extend({ patchedId: z.string().uuid() })

          const error = errorResult.safeParse(responseJSON)
          const response = successResult.safeParse(responseJSON)

          if (response.success === true) {
            // const { patchedId } = response.data

            return Promise.resolve()
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
    /**
     * Действие для получения событий календаря по заданному периоду
     *
     * @async
     * @param {?number} id - тело запроса
     * @param {?{ [key: string]: never }} [queryParams] - query-параметры для запроса
     * @returns {Promise<TTemplate>}
     */
    async get(
      id?: string,
      parsedResult: boolean = true,
      queryParams?: { [key: string]: never },
    ): Promise<TTemplate> {
      return await axios
        .get(
          `/api/reporting/templates${id ? `/${id}` : ''}${queryParams ? queryString(queryParams) : ''}`,
        )
        .then((responseJSON) => {
          const result = successResult.extend({ data: ZTemplate })

          const error = errorResult.safeParse(responseJSON)
          const response = result.safeParse(responseJSON)

          if (response.success === true) {
            const { data } = parsedResult ? response.data : responseJSON

            return Promise.resolve(data)
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
    /**
     * Обновление объекта
     **/
    async update(id: string, form: TTemplate, query?: { [key: string]: unknown }) {
      return await axios
        .put(`/api/reporting/templates/${id}${query ? queryString(query) : ''}`, form)
        .then((responseJSON) => {
          const result = successResult.extend({ updatedId: z.string().uuid() })

          const error = errorResult.safeParse(responseJSON)
          const response = result.safeParse(responseJSON)

          if (response.success === true) {
            const { updatedId } = response.data

            return Promise.resolve({ updatedId, form })
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

    /**
     * Получение spead шаблона
     *
     * @async
     * @param {?number} id - идентификатор шаблона
     * @param {?{ [key: string]: never }} [queryParams] - query-параметры для запроса
     * @returns {Promise<TSpreadData>}
     */
    async getSpread(
      id: string,
      parsedResult: boolean = true,
      queryParams?: { [key: string]: never },
    ): Promise<TSpreadData> {
      return await axios
        .get(`/api/spreadsheet/${id}${queryParams ? queryString(queryParams) : ''}`)
        .then((responseJSON) => {
          const result = successResult.extend({ data: ZSpreadData })

          const error = errorResult.safeParse(responseJSON)
          const response = result.safeParse(responseJSON)

          if (response.success === true) {
            const { data } = parsedResult ? response.data : responseJSON

            return Promise.resolve(data)
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
    /**
     * Запись spread
     * @param {string} spread - данные формы для отправки на сервер
     */
    async writeSpread(id: string, spread: unknown) {
      return await axios
        .post(`/api/spreadsheet/${id}`, spread)
        .then((responseJSON) => {
          const result = successResult

          const error = errorResult.safeParse(responseJSON)
          const response = result.safeParse(responseJSON)

          if (response.success === true) {
            return Promise.resolve()
          } else if (error.success === true) {
            const { data } = error
            toast('Ошибка', data.ErrorMsg || data.Error, 'error')
            return Promise.reject(data.ErrorMsg || data.Error)
          } else {
            callParseErrorToast(response.error)
            callParseErrorToast(error.error)
            return Promise.reject(`${error.error}; ${response.error}`)
          }
        })
        .catch((error) => {
          callParseErrorToast(error)
          return Promise.reject(error)
        })
    },
  },
})
