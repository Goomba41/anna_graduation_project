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
        <div class="left-part tw-flex tw-flex-row">
          <Button icon-pos="left" class="tw-mr-2" @click="makeActionOnItem()">
            <font-awesome-icon
              :icon="['fas', 'fa-plus']"
              :class="['p-button-icon p-button-icon-left']"
            ></font-awesome-icon>
            <div class="p-button-label">Показатель</div>
          </Button>
        </div>
        <div class="right-part tw-flex tw-flex-row">
          <div class="buttons tw-flex tw-flex-row">
            <ToggleButton
              v-model="expandAllNodes"
              class="tw-mr-2"
              on-label="Свернуть всё"
              off-label="Развернуть всё"
              on-icon="fas fa-chevron-up"
              off-icon="fas fa-chevron-down"
              @change="toggleNodesExpansion"
            />

            <Button
              icon-pos="left"
              icon="fas fa-plus"
              class="tw-mr-2"
              @click="indicatorsStore.read()"
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
                <font-awesome-icon
                  :icon="['fas', 'fa-filter']"
                  :class="['p-button-icon']"
                ></font-awesome-icon>
              </Button>
              <div
                v-show="tableFiltered"
                class="filter-reset-button tw-inline-flex tw-relative -tw-left-6 -tw-bottom-3 tw-h-8 tw-w-8 tw-bg-danger hover:tw-bg-danger-dark tw-text-white tw-rounded-xl tw-justify-center tw-items-center tw-cursor-pointer"
                @click="resetFilters()"
              >
                <font-awesome-icon
                  :icon="['fas', 'fa-filter-circle-xmark']"
                  :class="['p-button-icon p-button-icon-left']"
                ></font-awesome-icon>
              </div>
            </div>
          </div>

          <span class="p-input-icon-left">
            <font-awesome-icon
              :icon="['fas', 'fa-magnifying-glass']"
              :class="['p-button-icon']"
            ></font-awesome-icon>
            <InputText v-model="searchString" v-debounce:1s="searchInTable" placeholder="Поиск" />
          </span>
        </div>
      </div>
    </div>
    <div class="data-table tw-flex tw-flex-auto tw-h-1 tw-mb-4">
      <DxTreeList
        ref="dataTreeIndicators"
        key-expr="MsrStateId"
        parent-id-expr="MsrStateRef"
        column-resizing-mode="widget"
        width="100%"
        :auto-expand-all="expandAllNodes"
        :data-source="indicatorsStore.indicators"
        :allow-column-resizing="true"
        :focused-row-enabled="true"
        :filter-sync-enabled="true"
        @content-ready="totalRowsCount()"
        @option-changed="filterEvent($event)"
        @context-menu-preparing="addMenuItems($event)"
        @row-dbl-click="makeActionOnItem($event.data.MsrStateId)"
        @focused-row-changed="parentFocused = $event.row.key"
      >
        <DxColumn
          v-for="(column, index) in dataGridColumnsUsers"
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

        <DxFilterRow :visible="true" />
        <DxEditing :confirm-delete="false" />
        <DxScrolling
          mode="virtual"
          show-scrollbar="onHover"
          :scroll-by-thumb="true"
          :scroll-by-content="false"
          :use-native="false"
        />

        <DxPaging :enabled="false" :page-size="2" />
        <DxPager
          :allowed-page-sizes="[2, 100, 200, 500]"
          display-mode="compact"
          :show-navigation-buttons="true"
          :show-info="true"
          :show-page-size-selector="true"
        />
      </DxTreeList>
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
import { onMounted, ref, watch, type Ref } from 'vue'

import verb from 'plural-ru'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import ToggleButton from 'primevue/togglebutton'

import DxTreeList, {
  DxEditing,
  DxFilterRow,
  DxPaging,
  DxPager,
  DxScrolling,
  DxColumn,
} from 'devextreme-vue/tree-list'

import { useUsersStore } from '@/stores/users.store'
import { useLoadingStore } from '@/stores/loading.store'
// import { Indicator, useIndicatorsStore } from '@/stores/indicators.store'

import toast from '@/utils/toast'
import useEmitter from '@/utils/emitter'

import FilterPopup from '@/components/FilterPopup.vue'

const loadingStore = useLoadingStore()
// const indicatorsStore = useIndicatorsStore()

const { bus, emit } = useEmitter()

const dataTreeIndicators = ref(DxTreeList)

const dataGridColumnsUsers = [
  {
    dataField: 'MsrStateId',
    position: -1,
    type: 'number',
    caption: 'Код',
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    width: 150,
    format: '',
    cellTemplate: '',
  },
  {
    dataField: 'MsrStateName',
    position: 0,
    type: 'string',
    caption: 'Наименование',
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 200,
  },
  {
    dataField: 'MeasuringUnit.UsOboznRu',
    position: 1,
    type: 'string',
    caption: 'Единицы измерения',
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 200,
  },
  {
    dataField: 'MsrStateGrnum',
    position: 2,
    type: 'boolean',
    caption: 'Группа',
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 200,
  },
  {
    dataField: 'MsrStateSort',
    position: 3,
    type: 'number',
    caption: 'Порядок сортировки',
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 200,
    sortOrder: 'asc',
  },
]

const parentFocused: Ref<number | null> = ref(null)

const tableRowsTotal: Ref<number> = ref(0)

const searchString: Ref<string> = ref('')

const initialFilters = ref([])

const tableFiltered: Ref<boolean> = ref(false)

const expandAllNodes: Ref<boolean> = ref(false)

const disabledForm: Ref<boolean> = ref(false)

const indicatorData: Ref<undefined | Indicator> = ref(undefined)

let rowForAction: Indicator | undefined = undefined

const filteringColumns: unknown[] = dataGridColumnsUsers
  .filter((column) => column.visible)
  .map((column) => ({
    caption: column.caption,
    dataType: column.type,
    dataField: column.dataField,
  }))

// По вызову удаления из контекстного меню вызывается тостер-подтверждение.
// В тостере на каждую кнопку привязан вызов эмиттера с передачей результата нажатия.
// Поэтому необходимо импортировать этот эмиттер сюда и следить за переменной результата
// и в зависимости от ее значения делать соответствующие действия.
// Есть вариант EventBus через mitt
watch(
  () => bus.value.get('deletionConfirmation'),
  (value?: unknown[]) => {
    // Деструктурим параметры (потому что value это Proxy)
    const [confirm] = value ?? []

    // Если подтверждено, вызовем удаление на сервере
    if (confirm) {
      deleteItem()
    }
  },
)

/**
 * Функция, которая вызывается, когда содержимое таблицы готово.
 * Она используется для получения общего количества строк в таблице.
 **/
function totalRowsCount() {
  tableRowsTotal.value = dataTreeIndicators.value.instance.totalCount() || 0
}

/**
 * Обходной путь для отсутствия события поиска в devextreme datagrid.
 * Она используется для поиска по таблице.
 **/
function searchInTable() {
  // Devextreme не имеет отдельного event на поиск, только на фильтр, поэтому
  // приходится ухищряться и вручную менять опцию у поисковой панели datagrid
  dataTreeIndicators.value.instance.option('searchPanel.text', searchString.value)
}

/**
 * Функция-обработчик для создания пунктов контекстного меню
 * по клику ПКМ на строке
 * @param {event} [e] - глобальное событие клика по строке
 **/
function addMenuItems(e) {
  // Если это строка контента и тип данных
  if (e.target === 'content' && e.rowIndex >= 0 && e.row.rowType === 'data') {
    e.items = e.items || [] // e.items изначально скорее всего undefined

    rowForAction = e.row.data

    const falsy: boolean = false

    // Сформируем корневые пункты контекстного меню
    const contextItems: unknown[] = [
      // * Вырезано
      // {
      //   text: "Соответствие показателя и источников данных",
      //   icon: `fa-solid ${falsy ? "fa-equals" : "fa-equals"}`,
      //   onItemClick: () => {
      //     router.push({
      //       name: "indicatorAccordance",
      //       params: { indicatorId: rowForAction?.MsrStateId },
      //     });
      //   },
      // },
      // {
      //   text: "Регламент предоставления данных",
      //   icon: `fa-solid ${falsy ? "fa-file-signature" : "fa-file-signature"}`,
      //   onItemClick: () => {
      //     router.push({
      //       name: "dataRegulation",
      //       params: { indicatorId: rowForAction?.MsrStateId },
      //     });
      //   },
      // },
      {
        text: 'Редактировать',
        // text: rowForAction.IsPublic ? "Просмотр" : "Редактировать",
        icon: `fa-solid ${falsy ? 'fa-eye' : 'fa-pen'}`,
        onItemClick: () => {
          makeActionOnItem(rowForAction?.MsrStateId)
        },
        beginGroup: true,
      },
      {
        // Классы пунктов никак нельзя редактировать, потому что они вставляются
        // devextreme'ом, поэтому в css сделано выделение последнего элемента красным
        // и удаление должно быть ВСЕГДА последним. Единственная проблема: если строка
        // не предусматривает действие удаления.
        text: 'Удалить',
        icon: 'fa-solid fa-times',
        onItemClick: () => {
          emit('openDeletionConfirmation', [
            true,
            `Вы действительно хотите удалить запись «${rowForAction?.MsrStateId} - ${rowForAction?.MsrStateName}»?`,
          ])
        },
      },
    ]

    // Добавим пункты в меню
    e.items.push(...contextItems)
  }
}

async function makeActionOnItem(id?: number | null) {
  // Т.к. emit для открытия попапа отрабатывает параллельно с присвоением
  // т.к. код не асинхронный, приходится создавать Promise, в котором
  // делаем присвоение параметрам, и только потом открываем
  const promise = new Promise<void>((resolve, reject) => {
    disabledForm.value = false
    if (!id) {
      indicatorData.value = undefined
      resolve()
    } else {
      // indicatorData.value = indicatorsStore.indicators.find(
      //   (source: Indicator) => source.MsrStateId === id,
      // )
      if (indicatorData.value) {
        resolve()
      } else {
        reject()
      }
    }
  })
  await promise
    .then(() => {
      emit('openAdminIndicatorForm')
    })
    .catch((error) => {
      console.error(error)
      toast('Ошибка!', 'Не удалось найти объект с данными в списке', 'error')
    })
}

async function deleteItem() {
  if (rowForAction && rowForAction.MsrStateId) {
    // await indicatorsStore.delete(rowForAction.MsrStateId).then(() => {
    //   // * Нужен таймаут, потому что скрывается таблица во время запроса
    //   // * и не успевает открыться на момент исполнения кода, поэтому
    //   // * index строки всегда -1
    //   setTimeout(() => {
    //     // Удалим строку по её индексу вместо полного обновления данных
    //     const index = dataTreeIndicators.value.instance.getRowIndexByKey(rowForAction!.MsrStateId)
    //     dataTreeIndicators.value.instance.deleteRow(index)
    //   }, 10)
    // })
  } else {
    toast('Ошибка!', 'Не удалось найти объект с данными в списке', 'error')
  }
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
  dataTreeIndicators.value.instance.option('filterValue', event)
}

// Функция, для сброса значения фильтров
function resetFilters() {
  dataTreeIndicators.value.instance.option('filterValue', [])
}

// Функция полного сворачивания/разворачивания дерева
function toggleNodesExpansion() {
  // dataTreeIndicators.value.instance.forEachNode((node: any) => {
  //   expandAllNodes.value
  //     ? dataTreeIndicators.value.instance.expandRow(node.key)
  //     : dataTreeIndicators.value.instance.collapseRow(node.key)
  // })
}

onMounted(() => {
  // indicatorsStore.read()
  useUsersStore().activity('write', 2, `Просмотр справочника 1`)
})
</script>

<style lang="css" scoped></style>
