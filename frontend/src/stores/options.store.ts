import { defineStore } from "pinia";

import axios from "axios";

import toast from "@/utils/toast";
import queryString from "@/utils/query-string-transformer";

import type {
  TSubjects,
  // TDistricts,
  // TLocalities,
} from "@/typings/fias-object.types";
import {
  ZSubjects,
  // ZDistricts,
  // ZLocalities,
} from "@/typings/fias-object.types";
import { errorResult, successResult } from "@/typings/http.types";

import callParseErrorToast from "@/utils/type-parse-error";

async function readSubjects(query?: {
  [key: string]: unknown;
}): Promise<TSubjects>;
async function readSubjects(query?: { [key: string]: unknown }) {
  return await axios
    .get(`/api/fias/subjects${query ? queryString(query) : ""}`)
    .then((responseAXIOS) => {
      const { data: responseData } = responseAXIOS;

      const result = successResult.extend({
        subjects: ZSubjects,
      });

      const error = errorResult.safeParse(responseData);
      const response = result.safeParse(responseData);

      if (response.success === true) {
        const { subjects } = response.data;

        return Promise.resolve(subjects);
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

export const useOptionsStore = defineStore({
  id: "options",
  state: () => ({
    subjects: [],
    districts: [],
    localities: [],
  }),
  actions: {
    /**
     * Получение данных (строка или список строк)
     * @param {string} [id] - ID строки для получения данных по ней
     */
    readSubjects,
  },
});
