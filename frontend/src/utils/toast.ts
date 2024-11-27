import { app } from '@/main'

/**
 * Создаёт всплывающее сообщение с заданным заголовком, телом, типом и временем существования.
 * @param {string} [title=Тест] - Заголовок тоста
 * @param {string} [body=Тестовое сообщение, для отладки] - Сообщение, которое вы хотите отобразить.
 * @param {"info" | "success" | "warn" | "error"} [type=info] - Тип (цвет) тоста: "информация" | "успех" | "предупредить"
 * | "ошибка" = "информация"
 * @param {number | null} [time=3000] - Время в миллисекундах, в течение которого будет отображаться всплывающее
 * уведомление, null - пока не будет закрыто пользователем.
 * @param {"progress" | undefined} [template=undefined] - Шаблон для отображения: "прогресс бар" | стандартный
 */
export default function toast(
  title: string = 'Тест',
  body: string = 'Тестовое сообщение, для отладки',
  type: 'info' | 'success' | 'warn' | 'error' = 'info',
  time: number | null = 3000,
  template: undefined | 'progress' = undefined,
): void {
  const toastData = {
    severity: type,
    summary: title,
    detail: body,
    life: time || undefined,
    group: template,
    closable: template && template !== 'progress',
  }

  app.config.globalProperties.$toast.add(toastData)
}

export function remove(group?: string): void {
  if (group) {
    app.config.globalProperties.$toast.removeGroup(group)
  } else {
    app.config.globalProperties.$toast.removeAllGroups()
  }
}
