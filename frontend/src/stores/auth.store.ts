import { defineStore } from "pinia";

import axios from "axios";
import plural from "plural-ru";

import { z } from "zod";
import { DateTime as luxon } from "luxon";

import router from "@/router";

import jwtParse from "@/utils/jwt-parse";
import toast from "@/utils/toast";

import { useUsersStore } from "./users.store";
import { useSignalRStore } from "./signalr.store";

export const UserRight = z.object({
  AppId: z.coerce.number(),
  GroupId: z.coerce.number(),
  RightId: z.coerce.number(),
});

export const UserRights = z.array(UserRight);

export type UserRight = z.infer<typeof UserRight>;

export type UserRights = z.infer<typeof UserRights>;

export const User = z.object({
  UserId: z.coerce.number(),
  IsAdmin: z
    .string()
    .transform((val: string) => (val.toLowerCase() === "true" ? true : false)),
  FIO: z.string(),
  Login: z.string(),
  Src_Id: z.nullable(
    z.coerce.number().transform((val: number) => (val !== 0 ? val : null)),
  ),
  Src_Name: z.nullable(
    z
      .string()
      .transform((val: string) => (val.toLowerCase().length ? val : null)),
  ),
  Terr_Id: z.nullable(
    z.coerce.number().transform((val: number) => (val !== 0 ? val : null)),
  ),
  Terr_Name: z.nullable(
    z
      .string()
      .transform((val: string) => (val.toLowerCase().length ? val : null)),
  ),
  nbf: z.number().transform((val: number) => luxon.fromSeconds(val).toISO()),
  exp: z.number().transform((val: number) => luxon.fromSeconds(val).toISO()),
  UserRights: z.string().transform((str, ctx): z.infer<typeof UserRights> => {
    try {
      return UserRights.parse(JSON.parse(str));
    } catch (e) {
      ctx.addIssue({ code: "custom", message: "Invalid JSON" });
      return z.NEVER;
    }
  }),
  // UserRights: z.string().transform((val: string) => JSON.parse(val))
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
    returnUrl: null || "",
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
    timer: undefined as any,
    titleToggled: false,
  }),
  actions: {
    /**
     * Функция входа в систему, которая вызывается, когда пользователь нажимает кнопку входа
     **/
    async login(username: string, password: string) {
      return await axios
        .post("/api/login", {
          Login: username,
          Password: password,
        })
        .then((response: any) => {
          const token: string = response.access_token;
          const success: boolean = response.result >= 0;

          if (success && token) {
            this.refreshToken(token);

            const signalRStore = useSignalRStore();
            signalRStore.connect();

            // Перенаправим на главную, или на указанный для возвращения адрес
            router.push(this.returnUrl || "/");
          }

          if (!success) toast("Ошибка входа", response.Error, "error");
        });
    },
    /**
     * Выход из системы
     **/
    async logout(expired: boolean = false) {
      if (!expired)
        await useUsersStore().activity("write", null, "Выход из системы");

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
