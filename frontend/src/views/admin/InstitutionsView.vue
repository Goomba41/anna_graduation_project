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
              <HomePlus height="1.25rem" width="1.25rem" stroke-width="2" />
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
                <FilterReset
                  height="1.25rem"
                  width="1.25rem"
                  stroke-width="2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="data-table tw-flex tw-flex-auto tw-h-1 tw-mb-4">
      <DxDataGrid
        ref="dataGridInstitutions"
        column-resizing-mode="widget"
        key-expr="id"
        width="100%"
        :data-source="institutions"
        :allow-column-resizing="true"
        :focused-row-enabled="true"
        :filter-sync-enabled="true"
        @content-ready="totalRowsCount()"
        @context-menu-preparing="addMenuItems($event)"
        @option-changed="filterEvent($event)"
        @row-dbl-click="makeActionOnItem($event.data.id)"
      >
        <DxColumn
          v-for="(column, index) in dataGridColumnsInstitutions"
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
          :sort-index="column?.sortIndex"
        />

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

  <!-- <InstitutionPopup
    :institution="institutionData"
    :disabled="disabledForm"
    @created="addInstitutionToList"
    @updated="updateInstitutionInList"
  /> -->
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, type Ref } from "vue";

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

import { useLoadingStore } from "@/stores/loading.store";
import { useInstitutionsStore } from "@/stores/institutions.store";
import { useUsersStore } from "@/stores/users.store";
import { useOptionsStore } from "@/stores/options.store";

import type { TInstitutions, TInstitution } from "@/typings/institution.types";
import type { TSubjects } from "@/typings/fias-object.types";

import FilterReset from "@/components/icons/FilterReset.vue";
import FilterTwotone from "@/components/icons/FilterTwotone.vue";
import HomePlus from "@/components/icons/HomePlus.vue";
import MagnifyingGlass from "@/components/icons/MagnifyingGlass.vue";

import toast from "@/utils/toast";
import useEmitter from "@/utils/emitter";

// import InstitutionPopup from "@/components/forms/admin/InstitutionForm.vue";
import FilterPopup from "@/components/FilterPopup.vue";

const loadingStore = useLoadingStore();
const institutionsStore = useInstitutionsStore();
const usersStore = useUsersStore();
const optionsStore = useOptionsStore();

const { bus, emit } = useEmitter();

const dataGridInstitutions = ref(DxDataGrid);

const dataGridColumnsInstitutions = [
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
  },
  {
    dataField: "name",
    position: 0,
    type: "string",
    caption: "Наименование",
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 200,
    sortIndex: 1,
    sortOrder: "asc",
  },
  {
    dataField: "address",
    position: 1,
    type: "string",
    caption: "Адрес",
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 200,
  },
  {
    dataField: "contact",
    position: 4,
    type: "string",
    caption: "Контакт",
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 200,
  },
  {
    dataField: "subject",
    position: 5,
    type: "string",
    caption: "Субъект",
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 200,
    sortIndex: 2,
    sortOrder: "asc",
  },
  {
    dataField: "district",
    position: 6,
    type: "string",
    caption: "Район",
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 200,
    sortIndex: 3,
    sortOrder: "asc",
  },
  {
    dataField: "locality",
    position: 5,
    type: "string",
    caption: "Нас. пункт",
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 200,
    sortIndex: 4,
    sortOrder: "asc",
  },
];

const tableRowsTotal: Ref<number> = ref(0);

const searchInput = ref();

const searchString: Ref<string> = ref("");

const initialFilters = ref([]);

const tableFiltered: Ref<boolean> = ref(false);

const disabledForm: Ref<boolean> = ref(false);

const institutionData: Ref<undefined | TInstitution> = ref(undefined);

let rowForAction: TInstitution | undefined = undefined;

const institutions: Ref<TInstitutions> = ref([]);

const filteringColumns: Array<DxFilterBuilderTypes.Field> =
  dataGridColumnsInstitutions
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
  tableRowsTotal.value = dataGridInstitutions.value.instance.totalCount() || 0;
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
  dataGridInstitutions.value.instance.option(
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
            `Вы действительно хотите удалить запись «${rowForAction?.name}»?`,
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
      institutionData.value = undefined;
      resolve();
    } else {
      institutionData.value = institutions.value.find(
        (institution) => institution.id === id,
      );

      if (institutionData.value) {
        resolve();
      } else {
        reject();
      }
    }
  });

  promise
    .then(() => {
      emit("openAdminInstitutionForm");
    })
    .catch(() => {
      toast("Ошибка!", "Не удалось найти объект с данными в списке", "error");
    });
}

// function addInstitutionToList(response: {
//   createdId: number;
//   form: TInstitution;
// }) {
//   institutions.value.push(response.form);
// }

// function updateInstitutionInList(response: {
//   updatedId: number;
//   form: TInstitution;
// }) {
//   institutions.value = institutions.value.filter(
//     (u) => response.updatedId !== u.id,
//   );
//   institutions.value.push(response.form);
// }

async function deleteItem() {
  if (rowForAction?.id) {
    await institutionsStore.delete(rowForAction.id).then((deletedId) => {
      toast("Успех!", `Учреждение «${rowForAction?.name}» удалёно`, "success");
      institutions.value = institutions.value.filter(
        (institution) => institution.id !== (rowForAction?.id || deletedId),
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
  dataGridInstitutions.value.instance.option("filterValue", event);
}

// Функция, для сброса значения фильтров
function resetFilters() {
  dataGridInstitutions.value.instance.option("filterValue", []);
}

const options: {
  [key: string]: TSubjects;
} = {};

onMounted(async () => {
  institutions.value = (await institutionsStore.read()) || [];

  options.subjects = (await optionsStore.readSubjects()) || [];
  // options.districts = (await optionsStore.readDistricts()) || [];

  usersStore.activity("write", "Просмотр списка учреждений");

  useFocus(searchInput, { initialValue: true });
});
</script>

<style lang="css" scoped></style>
