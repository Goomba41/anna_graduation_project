import { defineStore } from 'pinia'

import { z } from 'zod'
import axios from 'axios'

import toast from '@/utils/toast'
import queryString from '@/utils/query-string-transformer'

import { TSubsystem, TSubsystems, ZSubsystems } from '@/typings/subsystem.types'
import {
  TRights,
  TUser,
  TUsers,
  TUsersActivities,
  ZUser,
  ZUsers,
  ZUsersActivities,
  ZRights,
} from '@/typings/user.types'
import { errorResult, successResult } from '@/typings/http.types'

import { useAuthStore } from './auth.store'
import callParseErrorToast from '@/utils/type-parse-error'
// import { DataSource } from './data-sources.store'

async function read(id?: undefined, query?: { [key: string]: unknown }): Promise<TUsers>
async function read(id: number, query?: { [key: string]: unknown }): Promise<TUser>
async function read(id?: number, query?: { [key: string]: unknown }) {
  return await axios
    .get(`/api/users${id ? `/${id}` : ''}${query ? queryString(query) : ''}`)
    .then((responseJSON) => {
      const result = successResult.extend({
        data: id ? ZUser : ZUsers,
      })

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
}

export const useUsersStore = defineStore({
  id: 'users',
  state: () => ({
    activities: [] as TUsersActivities,
    subsystems: [] as TSubsystems,
    rights: [] as TRights,
  }),
  actions: {
    /**
     * Создание объекта
     * @param {[key: string]: any} form - данные формы для отправки на сервер
     */
    async create(form: TUser) {
      return await axios
        .post(`/api/users`, form)
        .then((responseJSON) => {
          const result = successResult.extend({ createdId: z.number(), data: ZUser })

          const error = errorResult.safeParse(responseJSON)
          const response = result.safeParse(responseJSON)

          if (response.success === true) {
            const { createdId, data: form } = response.data

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
     * Получение данных (строка или список строк)
     * @param {string} [id] - ID строки для получения данных по ней
     */
    read,
    /**
     * Обновление объекта
     **/
    async update(form: TUser) {
      return await axios
        .put(`/api/users`, form)
        .then((responseJSON) => {
          const result = successResult.extend({ updatedId: z.number(), data: ZUser })

          const error = errorResult.safeParse(responseJSON)
          const response = result.safeParse(responseJSON)

          if (response.success === true) {
            const { updatedId, data: form } = response.data

            return Promise.resolve({ updatedId, form })
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
    async delete(id: number) {
      return await axios
        .delete(`/api/users/${id}`)
        .then((responseJSON) => {
          const result = successResult.extend({ deletedId: z.number() })

          const error = errorResult.safeParse(responseJSON)
          const response = result.safeParse(responseJSON)

          if (response.success === true) {
            const { deletedId } = response.data

            return Promise.resolve(deletedId)
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
     * Получение данных (строка или список строк)
     * @param {object} [query] - дополнительные параметры
     */
    async activity(
      action: 'write' | 'read' = 'read',
      app: number | null = null,
      sysAction: string = '',
      query?: { [key: string]: unknown },
    ) {
      if (action === 'read') {
        return await axios
          .get(`/api/users/activity${query ? queryString(query) : ''}`)
          .then((responseJSON) => {
            const result = successResult.extend({ data: ZUsersActivities })

            const error = errorResult.safeParse(responseJSON)
            const response = result.safeParse(responseJSON)

            if (response.success === true) {
              const { data } = response.data

              this.activities = data
              return Promise.resolve(data)
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
      } else if (action === 'write') {
        return await axios.post(`/api/users/activity`, {
          Riasappid: app,
          Message: sysAction,
        })
      }
    },

    async readSubsystems(id?: number) {
      return await axios
        .get(`/api/users/${id || useAuthStore().user?.UserId}/subsystems`)
        .then((responseJSON) => {
          const result = successResult.extend({ data: ZSubsystems })

          const error = errorResult.safeParse(responseJSON)
          const response = result.safeParse(responseJSON)

          if (response.success === true) {
            const { data } = response.data

            this.subsystems = data

            const subsystemsOnlyForAdmins: number[] = [2]

            if (!useAuthStore().user?.IsAdmin) {
              this.subsystems = this.subsystems.filter(
                (subsystem: TSubsystem) => !subsystemsOnlyForAdmins.includes(subsystem.Id),
              )
            }

            this.rights = data
            return Promise.resolve(data)
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

    async readRights(id: number, subsystemId?: number | string) {
      subsystemId = subsystemId ? subsystemId.toString() + '/' : ''
      return await axios
        .get(`/api/users/${id}/subsystems/${subsystemId}rights`)
        .then((responseJSON) => {
          const result = successResult.extend({ data: ZRights })

          const error = errorResult.safeParse(responseJSON)
          const response = result.safeParse(responseJSON)

          if (response.success === true) {
            const { data } = response.data

            this.rights = data
            return Promise.resolve(data)
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
