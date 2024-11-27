<template>
  <Dialog
    :header="`Промежуточные данные ${
      reportName ? ' «' + reportName + '»' : ''
    }`"
    v-model:visible="visible"
    :style="{ width: '50vw', height: '80vh' }"
    :modal="true"
  >
    <div class="control-rows tw-mb-6">
      <div class="row tw-justify-between">
        <div class="left-part tw-flex tw-flex-row"></div>
        <div class="right-part tw-flex tw-flex-row">
          <div class="filter-button" :class="[tableFiltered ? '-tw-mr-4' : '']">
            <Button
              iconPos="left"
              icon="fas"
              class="tw-mr-2"
              @click="emit('openTableFilters')"
              :disabled="!tableDataSource.length"
            >
              <font-awesome-icon
                :icon="['fas', 'fa-filter']"
                :class="['p-button-icon']"
              ></font-awesome-icon>
            </Button>
            <div
              class="filter-reset-button tw-inline-flex tw-relative -tw-left-6 -tw-bottom-3 tw-h-8 tw-w-8 tw-bg-danger hover:tw-bg-danger-dark tw-text-white tw-rounded-xl tw-justify-center tw-items-center tw-cursor-pointer"
              v-show="tableFiltered"
              @click="resetFilters()"
            >
              <font-awesome-icon
                :icon="['fas', 'fa-filter-circle-xmark']"
                :class="['p-button-icon p-button-icon-left']"
              ></font-awesome-icon>
            </div>
          </div>
          <span class="p-input-icon-left">
            <font-awesome-icon
              :icon="['fas', 'fa-magnifying-glass']"
              :class="['p-button-icon']"
            ></font-awesome-icon>
            <InputText
              v-model="searchString"
              placeholder="Поиск"
              v-debounce:1s="searchInTable"
              :disabled="!tableDataSource.length"
            />
          </span>
        </div>
      </div>
    </div>

    <div class="data-table tw-flex tw-flex-auto tw-h-1 tw-mb-4">
      <DxDataGrid
        ref="dataGridReport"
        column-resizing-mode="widget"
        keyExpr="Id"
        width="100%"
        :data-source="tableDataSource"
        :allow-column-resizing="true"
        :focused-row-enabled="true"
        :filter-sync-enabled="true"
        @contentReady="totalRowsCount()"
        @optionChanged="filterEvent($event)"
      >
        <DxColumn
          v-for="(column, index) in tableColumns"
          fixedPosition="left"
          :fixed="!column.position"
          :key="index"
          :data-field="column.dataField"
          :caption="column.caption"
          :title="column.caption"
          :visible="column.visible"
          :allow-grouping="column.allowGrouping"
          :group-index="column.groupIndex || undefined"
          :data-type="column.type"
          :min-width="column.minWidth"
          :width="column.width"
          :format="column.format"
          :cell-template="column.cellTemplate"
          :allow-exporting="column.allowExporting || false"
          :sort-order="column.sortOrder"
        />

        <template #unique="{ data }">
          <font-awesome-icon
            v-if="data.value"
            :icon="['fas', 'fa-computer']"
            :class="['p-button-icon tw-text-primary tw-text-xl']"
          ></font-awesome-icon>
        </template>

        <template #publish="{ data }">
          <font-awesome-icon
            v-if="data.value"
            :icon="['fas', 'fa-bullhorn']"
            :class="['p-button-icon tw-text-primary tw-text-xl']"
          ></font-awesome-icon>
        </template>

        <DxFilterRow :visible="true" />
        <DxScrolling
          mode="virtual"
          showScrollbar="onHover"
          :scroll-by-thumb="true"
          :scroll-by-content="false"
          :use-native="false"
        />
      </DxDataGrid>
    </div>

    <div class="data-table-info tw-text-base">
      <span class="number tw-text-primary tw-font-semibold">{{
        tableRowsTotal || 0
      }}</span>
      {{ verb(tableRowsTotal || 0, "строка", "строки", "строк") }} в таблице
    </div>

    <FilterPopup
      :filtering-fields="filteringColumns"
      :initial-filters="initialFilters"
      @apply-filters="applyFilters($event)"
    />

    <template #footer>
      <div class="tw-flex tw-flex-row tw-justify-end">
        <Button iconPos="left" class="neutral tw-mr-4" @click="closeModal">
          <font-awesome-icon
            :icon="['fas', 'fa-xmark']"
            :class="['p-button-icon p-button-icon-left']"
          ></font-awesome-icon>
          <div class="p-button-label">Закрыть</div>
        </Button>
        <Button
          iconPos="left"
          class="success"
          @click="generateReport"
          :disabled="!tableDataSource.length"
        >
          <font-awesome-icon
            :icon="['fas', 'fa-file-excel']"
            :class="['p-button-icon p-button-icon-left']"
          ></font-awesome-icon>
          <div class="p-button-label">Экспорт</div>
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, watch, type Ref } from "vue";

import verb from "plural-ru";

import useEmitter from "@/utils/emitter";

import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";

import DxDataGrid, {
  DxFilterRow,
  DxScrolling,
  DxColumn,
} from "devextreme-vue/data-grid";

import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import saveAs from "file-saver";

import FilterPopup from "./FilterPopup.vue";

const reportName: Ref<string | undefined> = ref();

let searchString: Ref<string> = ref("");

let tableRowsTotal: Ref<number> = ref(0);

const visible: Ref<boolean> = ref(false);

let tableFiltered: Ref<boolean> = ref(false);

const tableDataSource: Ref<any[]> = ref([]);

let initialFilters: Ref<any> = ref([]);

const dataGridReport = ref(DxDataGrid);

let tableColumns: Ref<any[]> = ref([]);

let filteringColumns: Ref<any[]> = ref([]);

const { emit, bus } = useEmitter();

watch(
  () => bus.value.get("openTableReport"),
  (value?: any) => {
    const [params] = value ?? [];

    reportName.value = params[0];
    tableColumns.value = params[1];
    tableDataSource.value = params[2];

    filteringColumns.value = params[1].map((column: any) => ({
      caption: column.caption,
      dataType: column.type,
      dataField: column.dataField,
    }));

    visible.value = true;
  }
);

function generateReport() {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet();
  exportDataGrid({
    component: dataGridReport.value.instance,
    worksheet: worksheet,
    customizeCell: function (options: any) {
      const excelCell = options;
      excelCell.font = { name: "Arial", size: 12 };
      excelCell.alignment = { horizontal: "left" };
    },
  }).then(function () {
    workbook.xlsx.writeBuffer().then(function (buffer: any) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `Ответы-${Math.floor(Date.now() / 1000)}.xlsx`
      );
    });
  });
}

// Функция, вызываемая в случае применения фильтров из окна фильтра
function applyFilters(event: any) {
  dataGridReport.value.instance.option("filterValue", event);
}

// Функция, для сброса значения фильтров
function resetFilters() {
  dataGridReport.value.instance.option("filterValue", []);
}

// При вводе в поля фильтра в столбцах таблицы
// триггерим событие, которое присваивает переменной составленные фильтры, которая
// затем передается в окно фильтра для отображения
function filterEvent(event: any) {
  if (event.name === "filterValue") {
    initialFilters.value = event.value;

    if (event.value && event.value.length) {
      tableFiltered.value = true;
    } else {
      tableFiltered.value = false;
    }
  }
}

/**
 * Обходной путь для отсутствия события поиска в devextreme datagrid.
 * Она используется для поиска по таблице.
 **/
function searchInTable() {
  // Devextreme не имеет отдельного event на поиск, только на фильтр, поэтому
  // приходится ухищряться и вручную менять опцию у поисковой панели datagrid
  dataGridReport.value.instance.option("searchPanel.text", searchString.value);
}

/**
 * Функция, которая вызывается, когда содержимое таблицы готово.
 * Она используется для получения общего количества строк в таблице.
 **/
function totalRowsCount() {
  tableRowsTotal.value = dataGridReport.value.instance?.totalCount() || 0;
}

const closeModal = () => {
  visible.value = false;
};
</script>

<style lang="css" scoped></style>
