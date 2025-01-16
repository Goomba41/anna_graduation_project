import { defineStore } from "pinia";

// import { z } from "zod";
import axios from "axios";

import toast from "@/utils/toast";
import queryString from "@/utils/query-string-transformer";

// import type { TFiles } from "@/typings/files.types";
import { ZFiles } from "@/typings/files.types";
import { errorResult, successResult } from "@/typings/http.types";

import callParseErrorToast from "@/utils/type-parse-error";
// import { DataSource } from './data-sources.store'

async function readList(id: number, query?: { [key: string]: unknown }) {
  return await axios
    .get(
      `/api/files/materials${id ? `/${id}` : ""}${query ? queryString(query) : ""}`,
    )
    .then((responseAXIOS) => {
      const { data: responseData } = responseAXIOS;

      const result = successResult.extend({
        data: ZFiles,
      });

      const error = errorResult.safeParse(responseData);
      const response = result.safeParse(responseData);

      if (response.success === true) {
        const { data } = response.data;

        return Promise.resolve(data);
      }
      if (error.success === true) {
        const { data } = error;
        toast("Ошибка", data.errorMsg || data.error, "error");
      }

      callParseErrorToast(response.error);
      callParseErrorToast(error.error);
    })
    .catch((error) => {
      callParseErrorToast(error);
      return Promise.reject(error);
    });
}

export const useFilesStore = defineStore({
  id: "files",
  state: () => ({}),
  actions: {
    /**
     * Создание объекта
     * @param {[key: string]: any} form - данные формы для отправки на сервер
     */
    // async create(form: TMaterial) {
    //   return await axios
    //     .post("/api/materials", form)
    //     .then((responseAXIOS) => {
    //       const { data } = responseAXIOS;

    //       const result = successResult.extend({
    //         createdId: z.number(),
    //         data: ZMaterialExtended,
    //       });

    //       const error = errorResult.safeParse(data);
    //       const response = result.safeParse(data);

    //       if (response.success === true) {
    //         const { createdId, data: form } = response.data;

    //         return Promise.resolve({ createdId, form });
    //       }
    //       if (error.success === true) {
    //         const { data } = error;
    //         toast("Ошибка", data.errorMsg || data.error, "error");
    //         return Promise.reject(data.errorMsg || data.error);
    //       }

    //       callParseErrorToast(response.error);
    //       callParseErrorToast(error.error);
    //       return Promise.reject(`${error.error}; ${response.error}`);
    //     })
    //     .catch((error) => {
    //       return Promise.reject(error);
    //     });
    // },

    /**
     * Получение данных (строка или список строк)
     * @param {string} [id] - ID строки для получения данных по ней
     */
    readList,

    /**
     * Обновление объекта
     **/
    // async update(form: TMaterial) {
    //   return await axios
    //     .put(`/api/materials/${form.id}`, form)
    //     .then((responseAXIOS) => {
    //       const { data } = responseAXIOS;

    //       const result = successResult.extend({
    //         updatedId: z.number(),
    //         data: ZMaterialExtended,
    //       });

    //       const error = errorResult.safeParse(data);
    //       const response = result.safeParse(data);

    //       if (response.success === true) {
    //         const { updatedId, data: form } = response.data;

    //         return Promise.resolve({ updatedId, form });
    //       }
    //       if (error.success === true) {
    //         const { data } = error;
    //         toast("Ошибка", data.errorMsg || data.error, "error");
    //         return Promise.reject(data.errorMsg || data.error);
    //       }

    //       callParseErrorToast(response.error);
    //       callParseErrorToast(error.error);
    //       return Promise.reject(`${error.error}; ${response.error}`);
    //     })
    //     .catch((error) => {
    //       callParseErrorToast(error);
    //       return Promise.reject(error);
    //     });
    // },

    // async delete(id: number) {
    //   return await axios
    //     .delete(`/api/materials/${id}`)
    //     .then((responseAXIOS) => {
    //       const { data } = responseAXIOS;

    //       const result = successResult.extend({ deletedId: z.number() });

    //       const error = errorResult.safeParse(data);
    //       const response = result.safeParse(data);

    //       if (response.success === true) {
    //         const { deletedId } = response.data;

    //         return Promise.resolve(deletedId);
    //       }
    //       if (error.success === true) {
    //         const { data } = error;
    //         toast("Ошибка", data.errorMsg || data.error, "error");
    //         return Promise.reject(data.errorMsg || data.error);
    //       }

    //       callParseErrorToast(response.error);
    //       callParseErrorToast(error.error);
    //       return Promise.reject(`${error.error}; ${response.error}`);
    //     })
    //     .catch((error) => {
    //       callParseErrorToast(error);
    //       return Promise.reject(error);
    //     });
    // },
  },
});
