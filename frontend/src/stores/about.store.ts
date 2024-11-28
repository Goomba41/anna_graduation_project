import { defineStore } from "pinia";

import z from "zod";
import axios from "axios";

import toast from "@/utils/toast";
import callParseErrorToast from "@/utils/type-parse-error";

import frontendPackages from "../../package.json";
import type { TPackages, TTechEmployees } from "@/typings/about.types";
import { errorResult, successResult } from "@/typings/http.types";

function versionParser({ versionString }: { versionString: string }): string {
  return !Number.isNaN(Number.parseInt(versionString[0], 10))
    ? versionString
    : versionString.substring(1);
}

export const useAboutStore = defineStore({
  id: "about",
  state: () => ({
    packages: [
      {
        id: "3a144b64-4b36-4019-a788-f5778c8facda",
        name: "Приложение",
        version: versionParser({ versionString: frontendPackages.version }),
        icon: undefined,
        position: 0,
      },
      {
        id: "8b36dda8-b95e-41df-b2d1-b571f7b535fc",
        name: "Vue",
        version: versionParser({
          versionString: frontendPackages.dependencies.vue,
        }),
        icon: "fa-brands fa-vue",
        position: 1,
      },
      {
        id: "0443b5b6-87bb-493b-88e5-787e1eddd699",
        name: "PrimeVue",
        version: versionParser({
          versionString: frontendPackages.dependencies.primevue,
        }),
        icon: undefined,
        position: 2,
      },
      {
        id: "baa068f7-9b2c-43b5-9f02-37a2bad8cb75",
        name: "Devextreme",
        version: versionParser({
          versionString: frontendPackages.dependencies.devextreme,
        }),
        icon: undefined,
        position: 3,
      },
      {
        id: "324f0ac7-a876-41ae-90a5-5ef3a75bdc50",
        name: "PostgreSQL",
        version: "🤷",
        icon: undefined,
        position: 5,
      },
      {
        id: "06cfc52e-e6ad-4299-b5c1-443b665bbd74",
        name: ".NET",
        version: "🤷",
        icon: undefined,
        position: 6,
      },
      {
        id: "69abc141-9632-4335-a11e-3e586e4255d5",
        name: "ОС сервера",
        version: "🤷",
        icon: undefined,
        position: 7,
      },
    ] as TPackages,
    techEmployeesContacts: [
      {
        id: "b3dd76d4-c15b-4afb-97a5-5ce412f6b916",
        name: "Островская Анна Ивановна",
        post: "Техническая поддержка проекта",
        phone: 8332714471161,
        email: "ostrovskaya@kn-k.ru",
      },
    ] as TTechEmployees,
  }),
  actions: {
    /**
     * Получение данных (строка или список строк)
     */
    async readSoftware() {
      return axios.get("/api/versions").then((responseAxios) => {
        const { data: responseData } = responseAxios;
        const softwareResult = successResult.extend({
          info: z.object({
            dotNetVersion: z.string(),
            osVersion: z.any(),
            pgVersion: z.string(),
          }),
        });

        const error = errorResult.safeParse(responseData);
        const response = softwareResult.safeParse(responseData);

        if (response.success === true) {
          const { info } = response.data;

          // Поскольку нет унифицированного интерфейса для элемента версии
          // и для бэкэнда, и для фронта, приходится вручную перебирать и вставлять версии
          const packages: TPackages = this.packages;

          packages.find((_package) => _package.name.includes(".NET")).version =
            info.dotNetVersion;

          const index = 1;
          packages.find((_package) =>
            _package.name.includes("PostgreSQL"),
          ).version = info.pgVersion.split(",")[0].split(" ")[index];

          packages.find((_package) =>
            _package.name.includes("ОС сервера"),
          ).version = info.osVersion.versionString;
        } else if (error.success === true) {
          const { data } = error;
          toast("Ошибка", data.ErrorMsg || data.Error, "error");
        } else {
          callParseErrorToast(response.error);
          callParseErrorToast(error.error);
        }
      });
    },
  },
});
