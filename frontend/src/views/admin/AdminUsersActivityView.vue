<template>
  <div
    v-if="loadingStore.loadingState"
    class="loading-skeleton tw-items-center tw-flex tw-flex-col tw-h-full"
  >
    <div class="tw-w-full tw-mb-6 tw-flex-row tw-flex tw-h-16 tw-justify-between">
      <div class="left tw-flex tw-flex-row">
        <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-[100px] tw-mr-4"></div>
        <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-[100px]"></div>
      </div>
      <div class="right tw-flex tw-flex-row">
        <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-[56px] tw-mr-4"></div>
        <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-[56px] tw-mr-4"></div>
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
            <font-awesome-icon
              :icon="['fas', 'fa-magnifying-glass']"
              :class="['p-button-icon']"
            ></font-awesome-icon>
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
            <!-- <ToggleButton
              v-model="expandAllNodes"
              class="tw-mr-2"
              on-label="Свернуть всё"
              off-label="Развернуть всё"
              on-icon="fas fa-chevron-up"
              off-icon="fas fa-chevron-down"
            /> -->

            <Button
              icon-pos="left"
              icon="fas fa-plus"
              class="tw-mr-2"
              @click="usersStore.activity()"
            >
              <font-awesome-icon
                :icon="['fas', 'fa-rotate']"
                :class="['p-button-icon']"
              ></font-awesome-icon>
            </Button>

            <div class="filter-button" :class="[tableFiltered ? '-tw-mr-4' : '']">
              <Button
                icon-pos="left"
                icon="fas fa-plus"
                class="tw-mr-2"
                @click="emit('openTableFilters')"
              >
                <FilterTwotone height="1.25rem" width="1.25rem" stroke-width="2" />
              </Button>
              <div
                v-show="tableFiltered"
                class="filter-reset-button tw-inline-flex tw-relative -tw-left-6 -tw-bottom-3 tw-h-8 tw-w-8 tw-bg-danger hover:tw-bg-danger-dark tw-text-white tw-rounded-xl tw-justify-center tw-items-center tw-cursor-pointer"
                @click="resetFilters()"
              >
                <FilterReset height="1.25rem" width="1.25rem" stroke-width="2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="data-table tw-flex tw-flex-auto tw-h-1 tw-mb-4">
      <DxDataGrid
        ref="dataGridUsersActivities"
        column-resizing-mode="widget"
        width="100%"
        :data-source="dataSource"
        :allow-column-resizing="true"
        :focused-row-enabled="true"
        :filter-sync-enabled="true"
        :remote-operations="true"
        @content-ready="totalRowsCount()"
        @option-changed="filterEvent($event)"
      >
        <DxColumn
          v-for="(column, index) in dataGridColumnsUsersActivities"
          :key="index"
          fixed-position="left"
          :fixed="column.position <= 0"
          :data-field="column.dataField"
          :caption="column.caption"
          :title="column.caption"
          :visible="column.visible"
          :allow-grouping="column.allowGrouping"
          :group-index="column.groupIndex"
          :data-type="column.type"
          :min-width="column.minWidth"
          :width="column.width"
          :format="column.format"
          :cell-template="column.cellTemplate"
          :sort-order="column?.sortOrder"
          group-cell-template="groupCellTemplate"
        />

        <template #groupCellTemplate="{ data }">
          <div v-if="data.column.dataField === 'AppName'">
            {{
              data.data.key && data.data.key !== 'Система'
                ? `Подсистема «${data.data.key}»`
                : 'Система'
            }}
          </div>
          <div v-else>{{ data.value }}</div>
        </template>

        <!-- <template #phone="{ data }">
          <font-awesome-icon
            v-if="data.value"
            :icon="['fas', 'fa-square-phone']"
            :class="['p-button-icon tw-text-primary tw-mr-2']"
          ></font-awesome-icon>
          <span class="phone-monotyped" :title="phoneParse(data.value)">{{ phoneParse(data.value) }}</span>
        </template>

        <template #email="{ data }">
          <font-awesome-icon
            v-if="data.value"
            :icon="['fas', 'fa-square-envelope']"
            :class="['p-button-icon tw-text-primary tw-mr-2']"
          ></font-awesome-icon>
          <span>{{ data.value }}</span>
        </template> -->

        <DxFilterRow :visible="true" />

        <DxRemoteOperations :group-paging="true" />
        <DxGrouping :auto-expand-all="false" />
        <DxEditing :confirm-delete="false" />
        <DxScrolling
          mode="virtual"
          row-rendering-mode="virtual"
          show-scrollbar="onHover"
          :scroll-by-thumb="true"
          :scroll-by-content="false"
          :use-native="false"
        />
        <DxPaging :page-size="100" />
      </DxDataGrid>
    </div>

    <div class="data-table-info tw-text-base">
      <span class="number tw-text-primary tw-font-semibold">{{ tableRowsTotal || 0 }}</span>
      {{ verb(tableRowsTotal || 0, 'строка', 'строки', 'строк') }} в таблице
    </div>

    <FilterPopup
      :filtering-fields="filteringColumns"
      :initial-filters="initialFilters"
      @apply-filters="applyFilters($event)"
    />
  </template>
</template>

<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue'

import verb from 'plural-ru'
import { useDebounceFn, useFocus } from '@vueuse/core'
import { DxFilterBuilderTypes } from 'devextreme-vue/filter-builder'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
// import ToggleButton from "primevue/togglebutton";

import DxDataGrid, {
  DxEditing,
  DxFilterRow,
  DxPaging,
  DxScrolling,
  DxColumn,
  DxGrouping,
  DxRemoteOperations,
} from 'devextreme-vue/data-grid'
import * as AspNetData from 'devextreme-aspnet-data-nojquery'

import { useLoadingStore } from '@/stores/loading.store'
import { useUsersStore } from '@/stores/users.store'

import useEmitter from '@/utils/emitter'
// import phoneParse from "@/utils/phone-formatter";

import FilterPopup from '@/components/FilterPopup.vue'

import FilterReset from '@/components/icons/FilterReset.vue'
import FilterTwotone from '@/components/icons/FilterTwotone.vue'

const loadingStore = useLoadingStore()
const usersStore = useUsersStore()

const { emit } = useEmitter()

const dataGridUsersActivities = ref(DxDataGrid)

const searchInput = ref()

const dataGridColumnsUsersActivities = [
  {
    dataField: 'AppName',
    position: -2,
    type: 'string',
    caption: 'Подсистема',
    visible: true,
    allowGrouping: true,
    groupIndex: 0,
  },
  {
    dataField: 'Id',
    position: -1,
    type: 'number',
    caption: 'Идентификатор',
    visible: true,
    allowGrouping: false,
    // groupIndex: 0,
    width: 100,
    format: '',
    cellTemplate: '',
  },
  {
    dataField: 'Actiondate',
    position: 0,
    type: 'datetime',
    caption: 'Дата и время',
    visible: true,
    allowGrouping: false,
    // groupIndex: 0,
    width: 150,
    sortOrder: 'desc',
  },
  {
    dataField: 'Fio',
    position: 1,
    type: 'string',
    caption: 'Пользователь',
    visible: true,
    allowGrouping: false,
    // groupIndex: 0,
    width: 300,
  },
  {
    dataField: 'Message',
    position: 2,
    type: 'string',
    caption: 'Действие',
    visible: true,
    allowGrouping: false,
    // groupIndex: 0,
    minWidth: 200,
  },
]

let tableRowsTotal: Ref<number> = ref(0)

let searchString: Ref<string> = ref('')

let initialFilters = ref([])

let tableFiltered: Ref<boolean> = ref(false)

// const expandAllNodes: Ref<boolean> = ref(false);

const filteringColumns: Array<DxFilterBuilderTypes.Field> = dataGridColumnsUsersActivities
  .filter((column) => column.visible)
  .map(
    (column) =>
      ({
        caption: column.caption,
        dataType: column.type,
        dataField: column.dataField,
      }) as DxFilterBuilderTypes.Field,
  )

const dataSource = AspNetData.createStore({
  key: 'Id',
  loadUrl: '/api/users/activity',
  onBeforeSend: onBeforeSend,
})

function onBeforeSend(r, s) {
  s.headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
}

/**
 * Функция, которая вызывается, когда содержимое таблицы готово.
 * Она используется для получения общего количества строк в таблице.
 **/
function totalRowsCount() {
  tableRowsTotal.value = dataGridUsersActivities.value.instance.totalCount() || 0
}

const debouncedSearch = useDebounceFn(() => {
  searchInTable()
}, 1000)

/**
 * Обходной путь для отсутствия события поиска в devextreme datagrid.
 * Она используется для поиска по таблице.
 **/
function searchInTable() {
  // Devextreme не имеет отдельного event на поиск, только на фильтр, поэтому
  // приходится ухищряться и вручную менять опцию у поисковой панели datagrid
  dataGridUsersActivities.value.instance.option('searchPanel.text', searchString.value)
}

// При вводе в поля фильтра в столбцах таблицы
// триггерим событие, которое присваивает переменной составленные фильтры, которая
// затем передается в окно фильтра для отображения
function filterEvent(event) {
  if (event.name === 'filterValue') {
    initialFilters.value = event.value

    if (event.value && event.value.length) {
      tableFiltered.value = true
    } else {
      tableFiltered.value = false
    }
  }
}

// Функция, вызываемая в случае применения фильтров из окна фильтра
function applyFilters(event) {
  dataGridUsersActivities.value.instance.option('filterValue', event)
}

// Функция, для сброса значения фильтров
function resetFilters() {
  dataGridUsersActivities.value.instance.option('filterValue', [])
}

onMounted(() => {
  // usersStore.activity();
  usersStore.activity('write', 2, `Просмотр активности пользователей`)

  useFocus(searchInput, { initialValue: true })
})
</script>

<style lang="css" scoped></style>
