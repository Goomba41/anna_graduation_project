import { defineStore } from "pinia";

import axios from "axios";
import plural from "plural-ru";

import { z } from "zod";

import router from "@/router";

import jwtParse from "@/utils/jwt-parse";
import toast from "@/utils/toast";

import { useUsersStore } from "./users.store";
// import { useSignalRStore } from "./signalr.store";

export const User = z.object({
  UserId: z.coerce.number(),
  UserName: z.string(),
  UserLogin: z.string(),

  exp: z.date(),
});

export type User = z.infer<typeof User>;

export function getUserData(token?: string): User | null {
  const parsedUser = User.safeParse(
    jwtParse(token || localStorage.getItem("token")),
  );

  if (parsedUser.success) return parsedUser.data;

  return null;
}

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: getUserData() as User | null, // подгурзка изначального состояния
    // логина пользователя после обновления страницы F5
    returnUrl: "",
    // ! В теории, функционала сигнализирования о новых уведомлениях в
    // ! заголовке вкладки здесь быть не должно, потому что он не подходит
    // ! сюда по логике, но коли уж это хранилище все равно используется в роутере и
    // ! в компоненте-обёртке, да и нескольких значений и функции заводить
    // ! отдельное хранилище не хочется, пускай будет тут
    // ! Возможно, когда с уведомлениями будет что-то более комплексное, то выделим
    // ! отдельно
    notificationsCount: 0,
    tabTitle: "АИС «Документооборот»",
    // "ИС «ЭКО» - Экономика Кировской области",
    timer: undefined,
    titleToggled: false,
  }),
  actions: {
    /**
     * Функция входа в систему, которая вызывается, когда пользователь нажимает кнопку входа
     **/
    async login(username: string, password: string) {
      return await axios
        .post<{ accessToken: string }>("/api/Authentication/Login", {
          Login: username,
          Password: password,
        })
        .then((response) => {
          const token: string = response.data.accessToken;

          if (token) {
            this.refreshToken(token);

            // const signalRStore = useSignalRStore();
            // signalRStore.connect();

            // Перенаправим на главную, или на указанный для возвращения адрес
            router.push(this.returnUrl || "/");
          }

          if (!token) toast("Ошибка входа", JSON.stringify(response), "error");
        });
    },
    /**
     * Выход из системы
     **/
    async logout(expired = false) {
      if (!expired) await useUsersStore().activity("write", "Выход из системы");

      const exiting = new Promise((resolve) => {
        this.user = null;
        this.notificationsCount = 0;
        localStorage.removeItem("token");
        resolve(true);
      });

      exiting.then(() => {
        router.push("/login");
      });
    },
    // ! см. наверх
    /**
     * Функция, меняющая заголовок вкладки в браузере
     **/
    updateTabTitle() {
      if (!this.notificationsCount) {
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = undefined;
        }
        document.title = this.tabTitle;
      } else {
        if (!this.timer)
          this.timer = setInterval(() => {
            this.titleToggled = !this.titleToggled;
            if (!this.titleToggled) {
              document.title = this.tabTitle;
            } else {
              document.title = plural(
                this.notificationsCount,
                "(%d) новое уведомление",
                "(%d) новых уведомления",
                "(%d) новых уведомлений",
              );
            }
          }, 1000);
      }
    },
    /**
     * Функция, обновляющая токен авторизации
     **/
    refreshToken(token: string) {
      // После получения токена с сервера запишем его в локальное хранилище браузера
      localStorage.setItem("token", token);

      // Рапарсим токен, в котором записаны данные пользователя и запишем в хранилище
      this.user = getUserData();
    },
  },
});
