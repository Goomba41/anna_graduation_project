import { createApp } from "vue";
import { createPinia } from "pinia";

import "@total-typescript/ts-reset";

import App from "./App.vue";
import router from "./router";

import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";

// HttpClient
import axios from "@/utils/http-client";
import VueAxios from "vue-axios";

// CSS
import "./assets/main.css";

export const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ToastService);
app.use(PrimeVue, {
  locale: {
    startsWith: "Начинается с",
    contains: "Содержит",
    notContains: "Не содержит",
    endsWith: "Кончается на",
    equals: "Равно",
    notEquals: "Не равно",
    noFilter: "Сброс",
    lt: "Меньше чем",
    lte: "Меньше чем или равно",
    gt: "Больше чем",
    gte: "Больше чем или равно",
    dateIs: "Дата равна",
    dateIsNot: "Дата не равна",
    dateBefore: "Дата до",
    dateAfter: "Дата после",
    clear: "Очистить",
    apply: "Применить",
    matchAll: "Match All",
    matchAny: "Match Any",
    addRule: "Добавить правило",
    removeRule: "Удалить правило",
    accept: "Да",
    reject: "Нет",
    Выберите: "Выбрать",
    upload: "Загрузить",
    cancel: "Отмена",
    dayNames: [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ],
    dayNamesShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Сбт"],
    dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    monthNames: [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ],
    monthNamesShort: [
      "Янв",
      "Фев",
      "Мар",
      "Апр",
      "Май",
      "Июн",
      "Июл",
      "Авг",
      "Сен",
      "Окт",
      "Ноя",
      "Дек",
    ],
    chooseYear: "Выберите год",
    chooseMonth: "Выберите месяц",
    chooseDate: "Выберите дату",
    prevDecade: "Предыдущая декада",
    nextDecade: "Следующая декада",
    prevYear: "Предыдущий год",
    nextYear: "Следующий год",
    prevMonth: "Предыдущий месяц",
    nextMonth: "Следующий месяц",
    prevHour: "Предыдущий час",
    nextHour: "Следующий час",
    prevMinute: "Предыдущая минута",
    nextMinute: "Следующая минута",
    prevSecond: "Предыдущая секунда",
    nextSecond: "Следующая секунда",
    am: "am",
    pm: "pm",
    today: "Сегодня",
    weekHeader: "Нед",
    firstDayOfWeek: 1,
    dateFormat: "mm.dd.yy",
    weak: "Слабый",
    medium: "Средний",
    strong: "Сильный",
    passwordPrompt: "Введите пароль",
    emptyFilterMessage: "Результатов не найдено", // @deprecated Use 'emptySearchMessage' option instead.
    searchMessage: "{0} результатов найдено",
    selectionMessage: "{0} выбрано",
    emptySelectionMessage: "Не выбрано",
    emptySearchMessage: "Не найдено результатов",
    emptyMessage: "Нет доступных опций",
    aria: {
      trueLabel: "Да",
      falseLabel: "Нет",
      nullLabel: "Не выбрано",
      star: "1 звезда",
      stars: "{star} звезд",
      selectAll: "Всё выбрано",
      unselectAll: "Сбросить",
      close: "Закрыть",
      previous: "Предыдущий",
      next: "Следующий",
    },
  },
});
app.use(VueAxios, axios);

app.provide("axios", app.config.globalProperties.axios);

router.isReady().then(() => {
  app.mount("#app");
});
