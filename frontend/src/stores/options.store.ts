import { defineStore } from "pinia";

import axios from "axios";

import toast from "@/utils/toast";
import queryString from "@/utils/query-string-transformer";

import type { TFIASObjects } from "@/typings/fias-object.types";
import { ZFIASObjects } from "@/typings/fias-object.types";
import { errorResult, successResult } from "@/typings/http.types";

import callParseErrorToast from "@/utils/type-parse-error";
import { ZOptionItems } from "@/typings/options.types";

async function fias(): Promise<TFIASObjects>;
async function fias(
  type: undefined,
  subjectId: undefined,
  districtId: undefined,
  query: { [key: string]: unknown },
): Promise<TFIASObjects>;
async function fias(type: "subjects"): Promise<TFIASObjects>;
async function fias(
  type: "subjects",
  subjectId: undefined,
  districtId: undefined,
  query: { [key: string]: unknown },
): Promise<TFIASObjects>;
async function fias(
  type: "districts",
  subjectId: number,
): Promise<TFIASObjects>;
async function fias(
  type: "districts",
  subjectId: number,
  districtId: undefined,
  query: { [key: string]: unknown },
): Promise<TFIASObjects>;
async function fias(
  type: "localities",
  subjectId: number,
  districtId: number,
): Promise<TFIASObjects>;
async function fias(
  type: "localities",
  subjectId: number,
  districtId: number,
  query: { [key: string]: unknown },
): Promise<TFIASObjects>;
async function fias(
  type: "subjects" | "districts" | "localities" = "subjects",
  subjectId?: number,
  districtId?: number,
  query?: { [key: string]: unknown },
) {
  let apiEndpoint = "/api/fias/";

  if (type === "subjects") apiEndpoint += "subjects";
  if (type === "districts") apiEndpoint += `subjects/${subjectId}/districts`;
  if (type === "localities")
    apiEndpoint += `subjects/${subjectId}/districts/${districtId}/localities`;

  return await axios
    .get(`${apiEndpoint}${query ? queryString(query) : ""}`)
    .then((responseAXIOS) => {
      const { data: responseData } = responseAXIOS;

      const result = successResult.extend({
        addresses: ZFIASObjects,
      });

      const error = errorResult.safeParse(responseData);
      const response = result.safeParse(responseData);

      if (response.success === true) {
        const { addresses } = response.data;

        return Promise.resolve(addresses);
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
    subjects: [] as TFIASObjects,
  }),
  actions: {
    fias,
    async handbook(object: string, query?: { [key: string]: unknown }) {
      return await axios
        .get(`/api/options/${object}${query ? queryString(query) : ""}`)
        .then((responseAXIOS) => {
          const { data: responseData } = responseAXIOS;

          const result = ZOptionItems;

          const error = errorResult.safeParse(responseData);
          const response = result.safeParse(responseData);

          if (response.success === true) {
            const items = response.data;

            return Promise.resolve(items);
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
