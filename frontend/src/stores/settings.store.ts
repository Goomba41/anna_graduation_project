import { defineStore } from 'pinia'

import axios from 'axios'

import toast from '@/utils/toast'
import queryString from '@/utils/query-string-transformer'

import { Settings, type TSetting, type TSettings } from '@/typings/settings.types'

export const useSettingsStore = defineStore({
  id: 'settings',
  state: () => ({
    settings: [] as TSettings,
    setting: null as TSetting | null,
  }),
  actions: {
    /**
     * Получение данных (строка или список строк)
     * @param {string} [id] - ID строки для получения данных по ней
     */
    async read(id?: string, query?: { [key: string]: any }) {
      return await axios
        .get(`/api/settings${id ? `/${id}` : ''}${query ? queryString(query) : ''}`)
        .then((response: any) => {
          if (response.result < 0) {
            toast('Ошибка!', response.Error, 'error')
            if (id) {
              this.setting = null
            } else {
              this.settings = []
            }
            return Promise.reject(response)
          } else {
            const responseData = response.data
            const parsing = Settings.safeParse(responseData)

            if (parsing.success === false) {
              // toast(
              //   "Ошибка!",
              //   "С сервера получен некорректный объект",
              //   "error"
              // );

              const formatted: { [key: string]: any } = parsing.error.format()
              const fields: string[] = Object.keys(formatted).filter(
                (field: string) => field !== '_errors',
              )

              fields.forEach((field: string) => {
                console.error(`${field}: ${formatted[field]?._errors.join(';')}`)
              })

              if (id) {
                this.setting = responseData[0]
                return Promise.resolve(responseData[0])
              } else {
                this.settings = responseData
                return Promise.resolve(responseData)
              }
            }

            if (id) {
              this.setting = parsing.data[0]
            } else {
              this.settings = parsing.data
            }

            return Promise.resolve(responseData)
          }
        })
        .catch((error) => Promise.reject(error))
    },
    /**
     * Обновление объекта
     **/
    async patch(form: TSetting, query?: { [key: string]: never }) {
      return await axios
        .patch(`/api/settings${query ? queryString(query) : ''}`, form)
        .then((response: any) => {
          if (response && response.result >= 0) {
            // toast("Успех!", "Отчёт успешно обновлен", "success");
          } else if (response && response.Error) {
            toast('Ошибка!', response.Error, 'error')
          }
          return response
        })
    },
  },
})
