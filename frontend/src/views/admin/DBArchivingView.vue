<template>
  <div class="tw-flex tw-flex-row tw-h-full tw-justify-start">
    <div class="tw-w-1/3 tw-h-full tw-justify-start tw-flex tw-flex-col">
      <h2
        class="tw-mb-8 tw-text-2xl tw-font-bold tw-text-gray-700 tw-flex tw-flex-row"
      >
        СУБД
        <PostgreSql
          v-if="database?.DBMSVersion.toLowerCase().includes('postgre')"
          class="tw-mr-2 tw-ml-8 tw-self-center"
        />
        {{ database?.DBMSVersion }}
      </h2>

      <div class="db field tw-flex tw-flex-col tw-w-full tw-mb-4">
        <!-- <div class="tw-flex tw-flex-row tw-items-center"> -->
        <label
          for="database"
          title="База данных"
          class="tw-text-gray-500 tw-mr-4 tw-font-bold tw-text-base tw-overflow-x-hidden tw-text-ellipsis tw-whitespace-nowrap"
        >
          База данных: «{{ database?.Description || database?.Name }}» ({{
            database?.Size
          }})
        </label>

        <div class="p-inputgroup">
          <InputText
            :title="database?.Name || undefined"
            :disabled="true"
            id="database"
            inputId="database"
            class="tw-flex tw-flex-auto tw-flex-col tw-text-left"
            :value="database?.Name"
          />

          <Dropdown
            :disabled="loadingStore.loadingState"
            v-model="databaseDumpType"
            id="SrcId"
            class="tw-flex tw-flex-auto tw-w-4"
            :options="[
              {
                value: 'p',
                label: '.sql',
              },
              {
                value: 'c',
                label: '.bak',
              },
            ]"
            optionLabel="label"
          />

          <Button
            :disabled="loadingStore.loadingState"
            iconPos="left"
            icon="fas fa-plus"
            class="tw-mr-2"
            @click="requestBackup('database')"
          >
            <font-awesome-icon
              :icon="['fas', 'fa-download']"
              :class="['p-button-icon']"
            ></font-awesome-icon>
          </Button>
        </div>
        <!-- </div> -->
      </div>

      <div class="db-tables field tw-flex tw-flex-col tw-w-full tw-mb-4">
        <label
          for="database-table"
          title="Таблица"
          class="tw-text-gray-500 tw-mr-4 tw-font-bold tw-text-base tw-overflow-x-hidden tw-text-ellipsis tw-whitespace-nowrap"
        >
          Таблица
        </label>

        <div class="p-inputgroup">
          <Dropdown
            :disabled="loadingStore.loadingState"
            showClear
            filter
            v-model="databaseTable"
            placeholder="Выберите таблицу"
            id="SrcId"
            class="tw-flex tw-flex-auto tw-w-4"
            :options="database?.Tables"
            optionLabel="Name"
          />
          <Dropdown
            :disabled="loadingStore.loadingState"
            v-model="databaseTableDumpType"
            id="SrcId"
            class="tw-flex tw-flex-auto tw-w-4"
            :options="[
              {
                value: 'p',
                label: '.sql',
              },
              {
                value: 'c',
                label: '.bak',
              },
            ]"
            optionLabel="label"
          />

          <Button
            :disabled="!databaseTable || loadingStore.loadingState"
            iconPos="left"
            icon="fas fa-plus"
            class="tw-mr-2"
            @click="requestBackup('table')"
          >
            <font-awesome-icon
              :icon="['fas', 'fa-download']"
              :class="['p-button-icon']"
            ></font-awesome-icon>
          </Button>
        </div>
      </div>
      <div
        class="table-info tw-w-fit tw-flex tw-flex-col tw-mb-4"
        v-if="databaseTable"
      >
        <div class="tw-w-full tw-rounded-lg tw-bg-white tw-shadow">
          <div class="tw-p-4">
            <div class="tw-flex tw-flex-col">
              <h3 class="tw-text-xl tw-font-semibold tw-text-gray-800">
                {{ databaseTable.Name }}
              </h3>
              <span class="tw-text-sm tw-font-medium tw-text-gray-400">{{
                databaseTable.Description
              }}</span>
            </div>

            <div class="tw-mt-1 tw-text-gray-500">
              <ul class="ml-4 list-disc">
                <li>
                  <span class="tw-text-xl tw-font-semibold tw-text-gray-700">{{
                    databaseTable.Size
                  }}</span>
                  - размер таблицы на диске
                </li>
                <li>
                  <span class="tw-text-xl tw-font-semibold tw-text-gray-700">{{
                    databaseTable.RowsNumber
                  }}</span>
                  - строк в таблице
                </li>
                <li>
                  <span class="tw-text-xl tw-font-semibold tw-text-gray-700">{{
                    databaseTable.RowsInserted
                  }}</span>
                  - строк вставлено за всё время
                </li>
                <li>
                  <span class="tw-text-xl tw-font-semibold tw-text-gray-700">{{
                    databaseTable.RowsUpdated
                  }}</span>
                  - строк изменено за всё время
                </li>
                <li>
                  <span class="tw-text-xl tw-font-semibold tw-text-gray-700">{{
                    databaseTable.RowsDeleted
                  }}</span>
                  - строк удалено за всё время
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, type Ref } from "vue";

import axios from "axios";
import { z } from "zod";

import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";

import { useLoadingStore } from "@/stores/loading.store";

import PostgreSql from "@/components/icons/PostgreSQL.vue";

import toast from "@/utils/toast";
import queryString from "@/utils/query-string-transformer";

const loadingStore = useLoadingStore();

const Table = z.object({
  Name: z.string(),
  Size: z.string(),
  Description: z.nullable(z.string()),
  RowsInserted: z.number(),
  RowsUpdated: z.number(),
  RowsDeleted: z.number(),
  RowsNumber: z.number(),
});

type TTable = z.infer<typeof Table>;

const Database = z.object({
  Name: z.string(), // Имя базы данных
  Size: z.string(), // Размер на диске
  Description: z.nullable(z.string()), // Комментарий БД (описание или имя базы)
  DBMSVersion: z.string(), // Версия СУБД
  Tables: z.array(Table), // Таблицы базы данных
});

type TDatabase = z.infer<typeof Database>;

const databaseDumpType: Ref<{
  value: string;
  label: string;
}> = ref({
  value: "p",
  label: ".sql",
});

const databaseTableDumpType: Ref<{
  value: string;
  label: string;
}> = ref({
  value: "p",
  label: ".sql",
});

const database: Ref<TDatabase | null> = ref(null);

const databaseTable: Ref<TTable | null> = ref(null);

function requestBackup(object: "database" | "table") {
  // const backupFileName: string =
  //   object === "database"
  //     ? `${database.value?.Name}_${
  //         (luxon.now().toISO() as string).split(".")[0]
  //       }${databaseDumpType.value.label}`
  //     : `${databaseTable.value?.Name}_${
  //         (luxon.now().toISO() as string).split(".")[0]
  //       }${databaseTableDumpType.value.label}`;

  axios
    .get(
      `/api/database/backup${queryString({
        format:
          object === "table"
            ? databaseTableDumpType.value.value
            : databaseDumpType.value.value,
        database: database.value?.Name,
        table:
          object === "table" && databaseTable.value
            ? databaseTable.value.Name
            : undefined,
      })}`,
      // {
      //   onDownloadProgress(progressEvent) {

      //   },
      // }
    )
    .then(async (response: any) => {
      if (response && response.result >= 0) {
        console.log(response);
      } else if (response?.error) {
        toast("Ошибка!", response.error, "error");
      }
    });
}

onMounted(() => {
  axios.get(`/api/database/structure`).then(async (response: any) => {
    if (response && response.result >= 0) {
      const parsedData = Database.safeParse(response.data);

      if (parsedData.success) {
        database.value = parsedData.data;
      } else {
        toast("Ошибка!", "Ошибка распознования данных", "error");
      }
    } else if (response?.error) {
      toast("Ошибка!", response.error, "error");
    }
  });

  // usersStore.activity("write", 18, "Вход в подсистему");
});
</script>

<style lang="css" scoped></style>
