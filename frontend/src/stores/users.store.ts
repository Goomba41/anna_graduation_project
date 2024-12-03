import { defineStore } from "pinia";

import { z } from "zod";
import axios from "axios";

import toast from "@/utils/toast";
import queryString from "@/utils/query-string-transformer";

import type { TUser, TUsers, TUsersActivities } from "@/typings/user.types";
import { ZUser, ZUsers, ZUsersActivities } from "@/typings/user.types";
import { errorResult, successResult } from "@/typings/http.types";

import callParseErrorToast from "@/utils/type-parse-error";
// import { DataSource } from './data-sources.store'

async function read(
  id?: undefined,
  query?: { [key: string]: unknown },
): Promise<TUsers>;
async function read(
  id: number,
  query?: { [key: string]: unknown },
): Promise<TUser>;
async function read(id?: number, query?: { [key: string]: unknown }) {
  return await axios
    .get(`/api/users${id ? `/${id}` : ""}${query ? queryString(query) : ""}`)
    .then((responseAXIOS) => {
      const { data: responseData } = responseAXIOS;

      const result = successResult.extend({
        data: id ? ZUser : ZUsers,
      });

      const error = errorResult.safeParse(responseData);
      const response = result.safeParse(responseData);

      if (response.success === true) {
        const { data } = response.data;

        return Promise.resolve(data);
      }
      if (error.success === true) {
        const { data } = error;
        toast("Ошибка", data.ErrorMsg || data.Error, "error");
      }

      callParseErrorToast(response.error);
      callParseErrorToast(error.error);
    })
    .catch((error) => {
      callParseErrorToast(error);
      return Promise.reject(error);
    });
}

export const useUsersStore = defineStore({
  id: "users",
  state: () => ({
    activities: [] as TUsersActivities,
  }),
  actions: {
    /**
     * Создание объекта
     * @param {[key: string]: any} form - данные формы для отправки на сервер
     */
    async create(form: TUser) {
      return await axios
        .post("/api/users", form)
        .then((responseJSON) => {
          const result = successResult.extend({
            createdId: z.number(),
            data: ZUser,
          });

          const error = errorResult.safeParse(responseJSON);
          const response = result.safeParse(responseJSON);

          if (response.success === true) {
            const { createdId, data: form } = response.data;

            return Promise.resolve({ createdId, form });
          }
          if (error.success === true) {
            const { data } = error;
            toast("Ошибка", data.ErrorMsg || data.Error, "error");
            return Promise.reject(data.ErrorMsg || data.Error);
          }

          callParseErrorToast(response.error);
          callParseErrorToast(error.error);
          return Promise.reject(`${error.error}; ${response.error}`);
        })
        .catch((error) => {
          callParseErrorToast(error);
          return Promise.reject(error);
        });
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
        .put("/api/users", form)
        .then((responseJSON) => {
          const result = successResult.extend({
            updatedId: z.number(),
            data: ZUser,
          });

          const error = errorResult.safeParse(responseJSON);
          const response = result.safeParse(responseJSON);

          if (response.success === true) {
            const { updatedId, data: form } = response.data;

            return Promise.resolve({ updatedId, form });
          }
          if (error.success === true) {
            const { data } = error;
            toast("Ошибка", data.ErrorMsg || data.Error, "error");
            return Promise.reject(data.ErrorMsg || data.Error);
          }

          callParseErrorToast(response.error);
          callParseErrorToast(error.error);
          return Promise.reject(`${error.error}; ${response.error}`);
        })
        .catch((error) => {
          callParseErrorToast(error);
          return Promise.reject(error);
        });
    },

    async delete(id: number) {
      return await axios
        .delete(`/api/users/${id}`)
        .then((responseAXIOS) => {
          const { data } = responseAXIOS;

          const result = successResult.extend({ deletedId: z.number() });

          const error = errorResult.safeParse(data);
          const response = result.safeParse(data);

          if (response.success === true) {
            const { deletedId } = response.data;

            return Promise.resolve(deletedId);
          }
          if (error.success === true) {
            const { data } = error;
            toast("Ошибка", data.ErrorMsg || data.Error, "error");
            return Promise.reject(data.ErrorMsg || data.Error);
          }

          callParseErrorToast(response.error);
          callParseErrorToast(error.error);
          return Promise.reject(`${error.error}; ${response.error}`);
        })
        .catch((error) => {
          callParseErrorToast(error);
          return Promise.reject(error);
        });
    },

    async activity(
      action: "write" | "read" = "read",
      sysAction = "",
      query?: { [key: string]: unknown },
    ) {
      if (action === "read") {
        return await axios
          .get(`/api/users/activity${query ? queryString(query) : ""}`)
          .then((responseJSON) => {
            const result = successResult.extend({ data: ZUsersActivities });

            const error = errorResult.safeParse(responseJSON);
            const response = result.safeParse(responseJSON);

            if (response.success === true) {
              const { data } = response.data;

              this.activities = data;
              return Promise.resolve(data);
            }
            if (error.success === true) {
              const { data } = error;
              toast("Ошибка", data.ErrorMsg || data.Error, "error");
              return Promise.reject(data.ErrorMsg || data.Error);
            }

            callParseErrorToast(response.error);
            callParseErrorToast(error.error);
            return Promise.reject(`${error.error}; ${response.error}`);
          })
          .catch((error) => {
            callParseErrorToast(error);
            return Promise.reject(error);
          });
      }

      return await axios.post("/api/users/activity", {
        Action: sysAction,
      });
    },
  },
});
