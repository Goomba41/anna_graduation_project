import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import FileSaver from "file-saver";

import { getUserData, useAuthStore } from "@/stores/auth.store";
import { useLoadingStore } from "@/stores/loading.store";

import toast from "./toast";

import { v4 } from "uuid";

// const filetypes: string[] = [
//   'application/pdf',
//   'application/vnd.oasis.opendocument.spreadsheet',
//   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//   'text/plain',
//   'application/octet-stream',
// ]

// Перехватчик на запрос
// Подсовываем токен авторизации пользователя
axios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore();
    const loadingStore = useLoadingStore();
    // Проверим, есть ли токен в локальном хранилище браузера
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    // Если нет данных пользователя и пользователь авторизован -
    // восстановим данные из токена
    if (!authStore.user && isLoggedIn) authStore.user = getUserData();

    // Если есть токен, подставляем в заголовок запроса
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Нужно указать этот параметр, чтобы в перехватчике ответа
      // разбирать результат вручную (если файл - загрузить, если json - отдать)
      // чтобы можно было не указывать ожидаемый тип ответа в
      // остальном приложении
      config.responseType = "arraybuffer";

      // Посмотрим сервис-worker, если есть и активен, то отправить ему
      // сообщение с маркером, чтобы он использовал его для последующей
      // авторизации на бэкэнде
      // if (navigator.serviceWorker) {
      //   const sW = navigator.serviceWorker.controller;

      //   if (sW && sW.state === "activated") {
      //     navigator.serviceWorker.controller.postMessage({
      //       type: "authToken",
      //       token: token,
      //     });
      //   }
      // }
    }

    loadingStore.loading(true, "axios");

    return config;
  },
  (error: AxiosError) => {
    const loadingStore = useLoadingStore();
    loadingStore.loading(false, "axios");

    const title: string = `${error.response.status} - ${error.response.statusText}`;
    const body: string = error.message;

    toast(title, body);

    return Promise.reject(error);
  },
);

// Перехватчик на ответ
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // Остановим блокиратор интерфейса
    const loadingStore = useLoadingStore();
    loadingStore.loading(false, "axios");

    // Посмотрим тип ответа
    const responseType: string | undefined =
      response.headers["content-type"]?.split(";")[0];

    // Если есть тип и входит в файловые типы преобразуем в блоб
    // и сохраним
    if (responseType && responseType === "application/json") {
      // Иначе преобразуем в JSON, если это ArrayBuffer и отдадим дальше
      if (response.data instanceof ArrayBuffer) {
        response.data = JSON.parse(new TextDecoder().decode(response.data));
        return response;
      }

      return response;
    }

    let filename = "";
    const disposition = response.headers["content-disposition"];

    if (disposition && disposition.indexOf("attachment") !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/gi;
      const matches = filenameRegex.exec(disposition);
      if (matches?.[1]) {
        filename = decodeURI(matches[1].replace(/['"]/g, ""));
      }
    }

    const file = new Blob([response.data], { type: responseType });

    // FileSaver(file, filename || `ИС «ЭКО» ${v4()}`);
    FileSaver(file, filename || `АИС «Документооборот» ${v4()}`);
    return;
  },
  (error: AxiosError) => {
    const authStore = useAuthStore();
    const loadingStore = useLoadingStore();

    const title: string = `${error.response.status} - ${error.response.statusText}`;
    let body: string = error.message;

    if (error.response && error.response.status === 401) {
      if (authStore.user !== null || localStorage.getItem("token") !== null) {
        authStore.logout(true);
        body = "Сессия истекла, необходимо войти заново!";
        toast(title, body, "error");
      }
    } else {
      toast(title, body, "error");
    }

    loadingStore.loading(false, "axios");
    return Promise.reject(error);
  },
);

export default axios;
