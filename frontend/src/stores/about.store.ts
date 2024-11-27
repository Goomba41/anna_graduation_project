import { defineStore } from 'pinia'

import z from 'zod'
import axios from 'axios'
import { DateTime as luxon } from 'luxon'

import toast from '@/utils/toast'
import callParseErrorToast from '@/utils/type-parse-error'

import frontendPackages from '../../package.json'
import {
  TChangelog,
  TDocumentationList,
  TPackages,
  TTechEmployees,
  ZChangelog,
} from '@/typings/about.types'
import { errorResult, successResult } from '@/typings/http.types'

function versionParser({ versionString }: { versionString: string }): string {
  return !Number.isNaN(parseInt(versionString[0], 10)) ? versionString : versionString.substring(1)
}

export const useAboutStore = defineStore({
  id: 'about',
  state: () => ({
    changelog: [] as TChangelog,
    packages: [
      {
        id: '3a144b64-4b36-4019-a788-f5778c8facda',
        name: 'Приложение',
        version: versionParser({ versionString: frontendPackages.version }),
        icon: undefined,
        position: 0,
      },
      {
        id: '8b36dda8-b95e-41df-b2d1-b571f7b535fc',
        name: 'Vue',
        version: versionParser({
          versionString: frontendPackages.dependencies.vue,
        }),
        icon: 'fa-brands fa-vue',
        position: 1,
      },
      {
        id: '0443b5b6-87bb-493b-88e5-787e1eddd699',
        name: 'PrimeVue',
        version: versionParser({
          versionString: frontendPackages.dependencies.primevue,
        }),
        icon: undefined,
        position: 2,
      },
      {
        id: 'baa068f7-9b2c-43b5-9f02-37a2bad8cb75',
        name: 'Devextreme',
        version: versionParser({
          versionString: frontendPackages.dependencies.devextreme,
        }),
        icon: undefined,
        position: 3,
      },
      {
        id: '324f0ac7-a876-41ae-90a5-5ef3a75bdc50',
        name: 'PostgreSQL',
        version: '🤷',
        icon: undefined,
        position: 5,
      },
      {
        id: '06cfc52e-e6ad-4299-b5c1-443b665bbd74',
        name: '.NET',
        version: '🤷',
        icon: undefined,
        position: 6,
      },
      {
        id: '69abc141-9632-4335-a11e-3e586e4255d5',
        name: 'ОС сервера',
        version: '🤷',
        icon: undefined,
        position: 7,
      },
    ] as TPackages,
    techEmployeesContacts: [
      {
        id: 'b3dd76d4-c15b-4afb-97a5-5ce412f6b916',
        icon: 'user-tie',
        name: 'Вожегов Никита Андреевич',
        post: 'Техническая поддержка проекта',
        phone: 8332714471150,
        email: 'vozhegov@kn-k.ru',
      },
    ] as TTechEmployees,
    documentationDocs: [
      {
        id: 'ba76db2c-7407-4d25-8ba9-c75179a3157d',
        icon: 'book',
        text: 'Руководство пользователя подсистемы «Редактор опросов населения»',
        date: '21.09.2022',
        link: 'manuals/Руководство пользователя подсистемы «Редактор опросов населения».pdf',
      },
    ] as TDocumentationList,
  }),
  actions: {
    /**
     * Получение данных (строка или список строк)
     */
    async readChangelog() {
      return axios.get('/api/changelog').then((responseJSON) => {
        const changelogResult = successResult.extend({ data: ZChangelog })

        const error = errorResult.safeParse(responseJSON)
        const response = changelogResult.safeParse(responseJSON)

        if (response.success === true) {
          const { data } = response.data

          // Отсортируем по дате
          data.sort((a, b) => {
            if (luxon.fromISO(a.Date) > luxon.fromISO(b.Date)) return -1
            if (luxon.fromISO(a.Date) < luxon.fromISO(b.Date)) return 1
            return 0
          })

          // Отформатируем даты из ISO к читаемой
          data.forEach((item) => {
            item.Changelogs.sort((a, b) => {
              if (a.Type > b.Type) return -1
              if (a.Type < b.Type) return 1
              return 0
            })

            item.Changelogs.forEach((detail) => {
              switch (detail.Type) {
                case 1:
                  detail.Icon = 'bug-slash'
                  break
                case 2:
                  detail.Icon = 'info'
                  break
                case 3:
                  detail.Icon = 'plus'
                  break
                case 4:
                  detail.Icon = 'trash'
                  break
                case 5:
                  detail.Icon = 'arrows-rotate'
                  break

                default:
                  detail.Icon = 'question'
                  break
              }
            })
          })
        } else if (error.success === true) {
          const { data } = error
          toast('Ошибка', data.ErrorMsg || data.Error, 'error')
        } else {
          callParseErrorToast(response.error)
          callParseErrorToast(error.error)
        }
      })
    },
    async readSoftware() {
      return axios.get('/api/versions').then((responseJSON) => {
        const softwareResult = successResult.extend({
          Info: z.object({
            DotNetVersion: z.string(),
            OSVersion: z.any(),
            PGVersion: z.string(),
          }),
        })

        const error = errorResult.safeParse(responseJSON)
        const response = softwareResult.safeParse(responseJSON)

        if (response.success === true) {
          const { Info } = response.data

          // Поскольку нет унифицированного интерфейса для элемента версии
          // и для бэкэнда, и для фронта, приходится вручную перебирать и вставлять версии
          const packages: TPackages = this.packages

          packages.find((_package) => _package.name.includes('.NET'))!.version = Info.DotNetVersion

          const index = 1
          packages.find((_package) => _package.name.includes('PostgreSQL'))!.version =
            Info.PGVersion.split(',')[0].split(' ')[index]

          packages.find((_package) => _package.name.includes('ОС сервера'))!.version =
            Info.OSVersion.VersionString
        } else if (error.success === true) {
          const { data } = error
          toast('Ошибка', data.ErrorMsg || data.Error, 'error')
        } else {
          callParseErrorToast(response.error)
          callParseErrorToast(error.error)
        }
      })
    },
  },
})
