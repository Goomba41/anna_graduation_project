<template>
  <div
    v-if="loadingStore.loadingState"
    class="loading-skeleton tw-items-center tw-flex tw-flex-col tw-h-full"
  >
    <div
      class="tw-w-full tw-mb-6 tw-flex-row tw-flex tw-h-16 tw-justify-between"
    >
      <div class="left tw-flex tw-flex-row">
        <div
          class="skeleton-box tw-rounded-lg tw-h-full tw-w-[100px] tw-mr-4"
        ></div>
        <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-[100px]"></div>
      </div>
      <div class="right tw-flex tw-flex-row">
        <div
          class="skeleton-box tw-rounded-lg tw-h-full tw-w-[56px] tw-mr-4"
        ></div>
        <div
          class="skeleton-box tw-rounded-lg tw-h-full tw-w-[56px] tw-mr-4"
        ></div>
        <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-[250px]"></div>
      </div>
    </div>
    <div class="tw-w-full tw-flex-row tw-flex tw-h-full">
      <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-full"></div>
    </div>
  </div>

  <template v-else>
    <div class="control-rows tw-mb-6">
      <div class="row tw-justify-between">
        <div class="left-part tw-flex tw-flex-row"></div>

        <div class="middle-part">
          <span class="search p-input-icon-left">
            <MagnifyingGlass class="p-button-icon" />
            <InputText
              ref="searchInput"
              v-model="searchString"
              placeholder="Поиск"
              :show-clear="true"
              class="tw-w-[32rem]"
              @input="debouncedSearch"
            />
          </span>
        </div>

        <div class="right-part tw-flex tw-flex-row">
          <div class="buttons tw-flex tw-flex-row">
            <Button
              icon-pos="left"
              class="p-button-icon-only tw-mr-2"
              :disabled="loadingStore.loadingState"
              @click="makeActionOnItem()"
            >
              <FolderPlus height="1.25rem" width="1.25rem" stroke-width="2" />
            </Button>

            <div
              class="filter-button"
              :class="[tableFiltered ? '-tw-mr-4' : '']"
            >
              <Button
                icon-pos="left"
                icon="fas fa-plus"
                class="tw-mr-2"
                @click="emit('openTableFilters')"
              >
                <FilterTwotone
                  height="1.25rem"
                  width="1.25rem"
                  stroke-width="2"
                />
              </Button>
              <div
                v-show="tableFiltered"
                class="filter-reset-button tw-inline-flex tw-relative -tw-left-6 -tw-bottom-3 tw-h-8 tw-w-8 tw-bg-danger hover:tw-bg-danger-dark tw-text-white tw-rounded-xl tw-justify-center tw-items-center tw-cursor-pointer"
                @click="resetFilters()"
              >
                <FilterReset stroke-width="2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="data-table tw-flex tw-flex-auto tw-h-1 tw-mb-4">
      <DxDataGrid
        ref="dataGridMaterials"
        column-resizing-mode="widget"
        key-expr="id"
        width="100%"
        :data-source="materials"
        :allow-column-resizing="true"
        :focused-row-enabled="true"
        :filter-sync-enabled="true"
        @content-ready="totalRowsCount()"
        @context-menu-preparing="addMenuItems($event)"
        @option-changed="filterEvent($event)"
        @row-dbl-click="makeActionOnItem($event.data.id)"
      >
        <DxColumn
          v-for="(column, index) in dataGridColumnsMaterials"
          :key="index"
          fixed-position="left"
          :fixed="column.position <= 0"
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
          :sort-order="column?.sortOrder"
        />

        <!-- <template #phone="{ data }">
          <div class="tw-flex tw-flex-row tw-items-center">
            <PhoneTwotone
              v-if="data.value"
              class="p-button-icon tw-text-primary tw-mr-2"
            />
            <span class="phone-monotyped" :title="phoneParse(data.value)">{{
              phoneParse(data.value)
            }}</span>
          </div>
        </template>

        <template #fio="{ data }">
          <div class="tw-flex tw-flex-row tw-items-center">
            <PrivelegedUser
              v-if="data.data.sysadmin"
              class="p-button-icon tw-text-primary tw-mr-2"
            />
            <span>{{ data.value }}</span>
          </div>
        </template>

        <template #email="{ data }">
          <div class="tw-flex tw-flex-row tw-items-center">
            <EmailTwotone
              v-if="data.value"
              class="p-button-icon tw-text-primary tw-mr-2"
            />
            <span>{{ data.value }}</span>
          </div>
        </template> -->

        <DxFilterRow :visible="true" />
        <DxEditing :confirm-delete="false" />
        <DxScrolling
          mode="virtual"
          show-scrollbar="onHover"
          :scroll-by-thumb="true"
          :scroll-by-content="false"
          :use-native="false"
        />

        <!-- * Включить, если нужна пагинация. Сейчас работает бесконечный скролл + нужна стилизация -->
        <DxPaging :enabled="false" :page-size="2" />
        <DxPager
          :allowed-page-sizes="[2, 100, 200, 500]"
          display-mode="compact"
          :show-navigation-buttons="true"
          :show-info="true"
          :show-page-size-selector="true"
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
  </template>

  <MaterialForm
    :material="materialData"
    :disabled="disabledForm"
    :material-type="'incoming'"
    @created="addMaterialToList"
    @updated="udpateMaterialInList"
  />

  <TablePopup
    :header="`Вложения для материала «${rowForAction?.number}»`"
    :data-source="materialsFiles"
    :table-columns="[
      {
        dataField: 'id',
        dataType: 'number',
        caption: 'Идентификатор',
        visible: true,
        allowGrouping: false,
        sortOrder: 'asc',
        sortIndex: 1,
        width: 100,
      },
      {
        dataField: 'name',
        dataType: 'string',
        caption: 'Имя',
        visible: true,
        allowGrouping: false,
        sortOrder: 'asc',
        sortIndex: 2,
        minWidth: 200,
        width: 1000,
      },
      {
        dataField: 'mime',
        dataType: 'string',
        caption: 'Тип файла',
        visible: true,
        allowGrouping: true,
        sortOrder: 'asc',
        sortIndex: 3,
        minWidth: 150,
      },
    ]"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, type Ref } from "vue";
import { useRoute } from "vue-router";

import verb from "plural-ru";
import { useDebounceFn, useFocus } from "@vueuse/core";

import Button from "primevue/button";
import InputText from "primevue/inputtext";

import DxDataGrid, {
  DxEditing,
  DxFilterRow,
  DxPaging,
  DxPager,
  DxScrolling,
  DxColumn,
} from "devextreme-vue/data-grid";
import type { DxFilterBuilderTypes } from "devextreme-vue/filter-builder";
import type { DxDataGridTypes } from "devextreme-vue/data-grid";
import type { DxContextMenuTypes } from "devextreme-vue/context-menu";

import { useFilesStore } from "@/stores/files.store";
import { useUsersStore } from "@/stores/users.store";
import { useLoadingStore } from "@/stores/loading.store";
import { useMaterialsStore } from "@/stores/materials.store";

import type {
  TMaterials,
  TMaterial,
  TMaterialExtended,
} from "@/typings/material.types";

import type { TFiles } from "@/typings/files.types";

import FilterReset from "@/components/icons/FilterReset.vue";
import FilterTwotone from "@/components/icons/FilterTwotone.vue";
import FolderPlus from "@/components/icons/FolderPlus.vue";
import MagnifyingGlass from "@/components/icons/MagnifyingGlass.vue";

import toast from "@/utils/toast";
import useEmitter from "@/utils/emitter";

import TablePopup from "@/components/TablePopup.vue";
import FilterPopup from "@/components/FilterPopup.vue";
import MaterialForm from "@/components/forms/materials/MaterialForm.vue";

const filesStore = useFilesStore();
const usersStore = useUsersStore();
const loadingStore = useLoadingStore();
const materialsStore = useMaterialsStore();

const { bus, emit } = useEmitter();

const dataGridMaterials = ref(DxDataGrid);

const dataGridColumnsMaterials = [
  {
    dataField: "id",
    position: -1,
    type: "number",
    caption: "Идентификатор",
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    width: 50,
    format: "",
    cellTemplate: "",
  },
  {
    dataField: "number",
    position: 0,
    type: "string",
    caption: "Номер",
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 100,
    sortOrder: "asc",
    // cellTemplate: "fio",
  },
  {
    dataField: "actionDate",
    position: 1,
    type: "date",
    caption: "Дата",
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 100,
  },
  {
    dataField: "control",
    position: 2,
    type: "date",
    caption: "На контроле",
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 100,
  },
  {
    dataField: "fact",
    position: 3,
    type: "date",
    caption: "Исполнен",
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 100,
  },
  {
    dataField: "departureType.name",
    position: 4,
    type: "string",
    caption: "Отправлен",
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 100,
    // cellTemplate: "phone",
  },
  {
    dataField: "documentType.name",
    position: 5,
    type: "string",
    caption: "Тип",
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 100,
    // cellTemplate: "email",
  },
  {
    dataField: "project.name",
    position: 6,
    type: "string",
    caption: "Проект",
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 100,
    // cellTemplate: "email",
  },
  {
    dataField: "institution.name",
    position: 7,
    type: "string",
    caption: "Учреждение",
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 100,
    // cellTemplate: "email",
  },
  {
    dataField: "creator.fullName",
    position: 8,
    type: "string",
    caption: "Создал",
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 100,
    // cellTemplate: "email",
  },
  {
    dataField: "additionalInfo",
    position: 9,
    type: "string",
    caption: "Информация",
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 100,
    // cellTemplate: "email",
  },
];

const tableRowsTotal: Ref<number> = ref(0);

const searchInput = ref();

const searchString: Ref<string> = ref("");

const initialFilters = ref([]);

const tableFiltered: Ref<boolean> = ref(false);

const disabledForm: Ref<boolean> = ref(false);

const materialData: Ref<undefined | TMaterial> = ref(undefined);

let rowForAction: TMaterial | undefined = undefined;

const materials: Ref<TMaterials> = ref([]);

const filteringColumns: Array<DxFilterBuilderTypes.Field> =
  dataGridColumnsMaterials
    .filter((column) => column.visible)
    .map(
      (column) =>
        ({
          caption: column.caption,
          dataType: column.type,
          dataField: column.dataField,
        }) as DxFilterBuilderTypes.Field,
    );

// По вызову удаления из контекстного меню вызывается тостер-подтверждение.
// В тостере на каждую кнопку привязан вызов эмиттера с передачей результата нажатия.
// Поэтому необходимо импортировать этот эмиттер сюда и следить за переменной результата
// и в зависимости от ее значения делать соответствующие действия.
// Есть вариант EventBus через mitt
watch(
  () => bus.value.get("deletionConfirmation"),
  (value) => {
    // Деструктурим параметры (потому что value это Proxy)
    const [confirm] = (value as unknown[]) ?? [];

    // Если подтверждено, вызовем удаление на сервере
    if (confirm) {
      deleteItem();
    }
  },
);

/**
 * Функция, которая вызывается, когда содержимое таблицы готово.
 * Она используется для получения общего количества строк в таблице.
 **/
function totalRowsCount() {
  tableRowsTotal.value = dataGridMaterials.value.instance.totalCount() || 0;
}

const debouncedSearch = useDebounceFn(() => {
  searchInTable();
}, 1000);

/**
 * Обходной путь для отсутствия события поиска в devextreme datagrid.
 * Она используется для поиска по таблице.
 **/
function searchInTable() {
  // Devextreme не имеет отдельного event на поиск, только на фильтр, поэтому
  // приходится ухищряться и вручную менять опцию у поисковой панели datagrid
  dataGridMaterials.value.instance.option(
    "searchPanel.text",
    searchString.value,
  );
}

/**
 * Функция-обработчик для создания пунктов контекстного меню
 * по клику ПКМ на строке
 * @param {event} [e] - глобальное событие клика по строке
 **/
function addMenuItems(e: DxDataGridTypes.ContextMenuPreparingEvent) {
  // Если это строка контента и тип данных
  if (e.target === "content" && e.rowIndex >= 0 && e.row?.rowType === "data") {
    e.items = e.items || []; // e.items изначально скорее всего undefined

    rowForAction = e.row.data;

    // Сформируем корневые пункты контекстного меню
    const contextItems: (DxContextMenuTypes.Item & {
      onItemClick: () => void;
    })[] = [
      {
        text: "Вложения",
        // text: rowForAction.IsPublic ? "Просмотр" : "Редактировать",
        onItemClick: () => {
          if (rowForAction?.id) openFilesList(rowForAction?.id);
        },
      },
      {
        text: "Редактировать",
        // text: rowForAction.IsPublic ? "Просмотр" : "Редактировать",
        onItemClick: () => {
          makeActionOnItem(rowForAction?.id);
        },
      },
      {
        // Классы пунктов никак нельзя редактировать, потому что они вставляются
        // devextreme'ом, поэтому в css сделано выделение последнего элемента красным
        // и удаление должно быть ВСЕГДА последним. Единственная проблема: если строка
        // не предусматривает действие удаления.
        text: "Удалить",
        onItemClick: () => {
          emit("openDeletionConfirmation", [
            true,
            `Вы действительно хотите удалить запись «${rowForAction?.number}»?`,
          ]);
        },
        // TODO: отключен если админ и выбрал сам себя или последнего админа или не админ выбрал сам себя
      },
    ];

    // Добавим пункты в меню
    e.items.push(...contextItems);
  }
}

function makeActionOnItem(id?: number | null) {
  // Т.к. emit для открытия попапа отрабатывает параллельно с присвоением
  // т.к. код не асинхронный, приходится создавать Promise, в котором
  // делаем присвоение параметрам, и только потом открываем
  const promise = new Promise<void>((resolve, reject) => {
    disabledForm.value = false;

    if (!id) {
      materialData.value = undefined;
      resolve();
    } else {
      materialData.value = materials.value.find(
        (material) => material.id === id,
      );

      if (materialData.value) {
        resolve();
      } else {
        reject();
      }
    }
  });

  promise
    .then(() => {
      emit("openMaterialForm");
    })
    .catch(() => {
      toast("Ошибка!", "Не удалось найти объект с данными в списке", "error");
    });
}

const materialsFiles: Ref<TFiles> = ref([]);

async function openFilesList(id: number) {
  materialsFiles.value = (await filesStore.readList(id)) || [];
  emit("openTablePopup");
}

function addMaterialToList(response: {
  createdId: number;
  form: TMaterialExtended;
}) {
  materials.value.push(response.form);
}

function udpateMaterialInList(response: {
  updatedId: number;
  form: TMaterialExtended;
}) {
  materials.value = materials.value.filter((m) => response.updatedId !== m.id);
  materials.value.push(response.form);
}

async function deleteItem() {
  if (rowForAction?.id) {
    await materialsStore.delete(rowForAction.id).then((deletedId) => {
      toast("Успех!", `Материал «${rowForAction?.number}» удалён`, "success");
      materials.value = materials.value.filter(
        (material) => material.id !== (rowForAction?.id || deletedId),
      );
    });
  } else {
    toast("Ошибка!", "Не удалось найти объект с данными в списке", "error");
  }
}

// При вводе в поля фильтра в столбцах таблицы
// триггерим событие, которое присваивает переменной составленные фильтры, которая
// затем передается в окно фильтра для отображения
function filterEvent(event: DxDataGridTypes.OptionChangedEvent) {
  if (event.name === "filterValue") {
    initialFilters.value = event.value;

    if (event.value?.length) {
      tableFiltered.value = true;
    } else {
      tableFiltered.value = false;
    }
  }
}

// Функция, вызываемая в случае применения фильтров из окна фильтра
function applyFilters(event: (string | string[])[]) {
  dataGridMaterials.value.instance.option("filterValue", event);
}

// Функция, для сброса значения фильтров
function resetFilters() {
  dataGridMaterials.value.instance.option("filterValue", []);
}

const route = useRoute();

onMounted(async () => {
  materials.value =
    (await materialsStore.read(undefined, { materialType: 0 })) || [];

  usersStore.activity("write", "Просмотр списка входящих");

  useFocus(searchInput, { initialValue: true });

  if (route.query.id) {
    const materialId = Number.parseInt(route.query.id.toString(), 10);

    setTimeout(() => {
      dataGridMaterials.value.instance.option("focusedRowKey", materialId);
      dataGridMaterials.value.instance.navigateToRow(materialId);
    }, 100);
  }
});
</script>

<style lang="css" scoped></style>
