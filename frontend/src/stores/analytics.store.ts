import { defineStore } from "pinia";

import axios from "axios";

import toast from "@/utils/toast";
import queryString from "@/utils/query-string-transformer";

import { ZAnalytic } from "@/typings/analytics.types";
import { errorResult, successResult } from "@/typings/http.types";

import callParseErrorToast from "@/utils/type-parse-error";

export const useAnalyticsStore = defineStore({
  id: "analytics",
  state: () => ({}),
  actions: {
    async read(query?: { [key: string]: unknown }) {
      return await axios
        .get(
          `/api/analitycs/materials/doughnuts${query ? queryString(query) : ""}`,
        )
        .then((responseAXIOS) => {
          const { data: responseData } = responseAXIOS;

          const result = successResult.extend({ data: ZAnalytic });

          const error = errorResult.safeParse(responseData);
          const response = result.safeParse(responseData);

          console.log(responseData, response, error);

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
    },
  },
});
