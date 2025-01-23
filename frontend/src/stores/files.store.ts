import { defineStore } from "pinia";

import { z } from "zod";
import axios from "axios";

import toast from "@/utils/toast";
import queryString from "@/utils/query-string-transformer";

import { ZFiles } from "@/typings/files.types";
import type { TFile } from "@/typings/files.types";
import { errorResult, successResult } from "@/typings/http.types";

import callParseErrorToast from "@/utils/type-parse-error";

import { useSignalRStore } from "./signalr.store";

export const useFilesStore = defineStore("files", () => {
  const signalRStore = useSignalRStore();

  /**
   * Получение данных (строка или список строк)
   * @param {string} [id] - ID строки для получения данных по ней
   */
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

  /**
   * Открытие файла на просмотр
   **/
  async function blob(id: number) {
    return await axios
      .get(`/api/files/${id}/blob`)
      .then((responseAXIOS) => {
        const { data } = responseAXIOS;

        // const result = successResult.extend({
        //   updatedId: z.number(),
        //   data: ZMaterialExtended,
        // });

        const error = errorResult.safeParse(data);
        // const response = result.safeParse(data);

        // if (response.success === true) {
        //   const { updatedId, data: form } = response.data;

        //   return Promise.resolve({ updatedId, form });
        // }
        if (error.success === true) {
          const { data } = error;
          toast("Ошибка", data.errorMsg || data.error, "error");
          return Promise.reject(data.errorMsg || data.error);
        }

        return Promise.resolve(data.binary);

        // callParseErrorToast(response.error);
        // callParseErrorToast(error.error);
        // return Promise.reject(`${error.error}; ${response.error}`);
        // return Promise.reject(`${error.error}`);
      })
      .catch((error) => {
        callParseErrorToast(error);
        return Promise.reject(error);
      });
  }

  async function remove(id: number) {
    return await axios
      .delete(`/api/files/${id}`)
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
          toast("Ошибка", data.errorMsg || data.error, "error");
          return Promise.reject(data.errorMsg || data.error);
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

  async function upload(id: number, form: TFile, file: File) {
    return await axios
      .post(
        `/api/files/materials/${id}`,
        { form, binary: file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            signalRStore.$patch({
              received: {
                percent: Math.floor((progressEvent.progress ?? 0) * 100),
                title: `Загрузка файла «${form?.name}»`,
              },
            });
          },
        },
      )
      .then((responseAXIOS) => {
        const { data: responseData } = responseAXIOS;

        const result = successResult.extend({ createdId: z.number() });

        const error = errorResult.safeParse(responseData);
        const response = result.safeParse(responseData);

        if (response.success === true) {
          const { createdId } = response.data;

          return Promise.resolve(createdId);
        }
        if (error.success === true) {
          const { data } = error;
          toast("Ошибка", data.errorMsg || data.error, "error");
          return Promise.reject(data.errorMsg || data.error);
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

  return { readList, blob, remove, upload };
});
