import { defineStore } from 'pinia'

import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import toast, { remove } from '@/utils/toast'

import { useSettingsStore } from './settings.store'
import { TSetting } from '@/typings/settings.types'

export const useSignalRStore = defineStore({
  id: 'signalR',
  state: () => ({
    connection: null as HubConnection | null,
    received: null as any | null,
  }),
  actions: {
    /**
     * Создание и старт соединения с сервером SignalR
     */
    async connect() {
      const settingsStore = useSettingsStore()

      // Создаем соединение с параметрами
      this.connection = new HubConnectionBuilder()
        .withUrl('/notification', {
          accessTokenFactory: () => localStorage.getItem('token') || '',
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .build()

      this.connection.on('Export', (progress) => {
        this.received = progress

        const progressStart: boolean =
          progress.step === 1 &&
          (progress.percent === 0 || (progress.row / progress.total) * 100 === 0)

        if (progressStart) {
          toast(progress.title, null, 'info', null, 'progress')
        }

        const progressEnd: boolean =
          (progress.step / progress.steps) * 100 === 100 &&
          (progress.percent === 100 || (progress.row / progress.total) * 100 === 100)

        if (progressEnd) {
          setTimeout(() => {
            remove('progress')
            this.received = null
          }, 2000)
        }
      })

      this.connection.on('DBDump', (progress) => {
        this.received = progress

        if (progress.pending != undefined && progress.pending) {
          toast(progress.title, undefined, 'info', undefined, 'progress')
        } else {
          setTimeout(() => {
            remove('progress')
            this.received = null
          }, 2000)
        }
      })

      this.connection.on('Maintenance', (setting: TSetting) => {
        if (settingsStore.setting.Id === setting.Id) settingsStore.setting.Value = setting.Value

        settingsStore.settings = settingsStore.settings.filter((s) => s.Id !== setting.Id)
        settingsStore.settings.push(setting)
      })

      this.start()
    },
    /**
     * Старт соединения с сервером SignalR
     */
    async start() {
      this.connection?.start()
    },
    /**
     * Функция остановки соединения с сервером
     * @param {string | string[]} [listeners] - имена слушателей для удаления.
     */
    async stop(listeners?: string | string[]) {
      if (listeners && typeof listeners === 'string') {
        this.connection?.off(listeners)
      } else if (listeners && Array.isArray(listeners) && listeners.length) {
        listeners.forEach((listener: string) => {
          this.connection?.off(listener)
        })
      }
      this.connection?.stop()
    },
  },
})
