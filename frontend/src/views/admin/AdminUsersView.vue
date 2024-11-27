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
            <Button
              icon-pos="left"
              class="p-button-icon-only tw-mr-2"
              :disabled="loadingStore.loadingState"
              @click="makeActionOnItem()"
            >
              <PlusUserTwotone height="1.25rem" width="1.25rem" stroke-width="2" />
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
        ref="dataGridUsers"
        column-resizing-mode="widget"
        key-expr="Id"
        width="100%"
        :data-source="users"
        :allow-column-resizing="true"
        :focused-row-enabled="true"
        :filter-sync-enabled="true"
        @content-ready="totalRowsCount()"
        @context-menu-preparing="addMenuItems($event)"
        @option-changed="filterEvent($event)"
        @row-dbl-click="makeActionOnItem($event.data.Id)"
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

        <template #phone="{ data }">
          <font-awesome-icon
            v-if="data.value"
            :icon="['fas', 'fa-square-phone']"
            :class="['p-button-icon tw-text-primary tw-mr-2']"
          ></font-awesome-icon>
          <!-- <span
            class="phone-monotyped"
            :title="data.value"
            >{{
              data.value
            }}</span> -->
          <span class="phone-monotyped" :title="phoneParse(data.value)">{{
            phoneParse(data.value)
          }}</span>
        </template>

        <template #fio="{ data }">
          <font-awesome-icon
            v-if="data.data.Sysadmin"
            :icon="['fas', 'fa-user-gear']"
            :class="['p-button-icon tw-text-primary tw-mr-2']"
          ></font-awesome-icon>
          <span>{{ data.value }}</span>
        </template>

        <template #email="{ data }">
          <font-awesome-icon
            v-if="data.value"
            :icon="['fas', 'fa-square-envelope']"
            :class="['p-button-icon tw-text-primary tw-mr-2']"
          ></font-awesome-icon>
          <span>{{ data.value }}</span>
        </template>

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
      <span class="number tw-text-primary tw-font-semibold">{{ tableRowsTotal || 0 }}</span>
      {{ verb(tableRowsTotal || 0, 'строка', 'строки', 'строк') }} в таблице
    </div>

    <FilterPopup
      :filtering-fields="filteringColumns"
      :initial-filters="initialFilters"
      @apply-filters="applyFilters($event)"
    />
  </template>

  <UserPopup
    :user="userData"
    :disabled="disabledForm"
    @created="addUserToList"
    @updated="updateUserInList"
  />

  <UserRightsPopup
    :user="{ Id: rowForAction?.Id, Fio: rowForAction?.Fio?.trim() || 'Неизвестный' }"
    :user-rights="usersStore.rights"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, type Ref } from 'vue'

import verb from 'plural-ru'
import { useDebounceFn, useFocus } from '@vueuse/core'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

import DxDataGrid, {
  DxEditing,
  DxFilterRow,
  DxPaging,
  DxPager,
  DxScrolling,
  DxColumn,
} from 'devextreme-vue/data-grid'

import { useLoadingStore } from '@/stores/loading.store'
import { useUsersStore } from '@/stores/users.store'
// import { useMunicipalitiesStore } from '@/stores/municipalities.store'

import { TUsers, TUser } from '@/typings/user.types'

import FilterReset from '@/components/icons/FilterReset.vue'
import FilterTwotone from '@/components/icons/FilterTwotone.vue'
import PlusUserTwotone from '@/components/icons/PlusUserTwotone.vue'

import toast from '@/utils/toast'
import useEmitter from '@/utils/emitter'
import phoneParse from '@/utils/phone-formatter'

import UserPopup from '@/components/forms/admin/UserForm.vue'
import FilterPopup from '@/components/FilterPopup.vue'
import UserRightsPopup from '@/components/forms/admin/UserRightsForm.vue'

const loadingStore = useLoadingStore()
const usersStore = useUsersStore()
// const municipalitiesStore = useMunicipalitiesStore()
// const router = useRouter();

const { bus, emit } = useEmitter()

const dataGridUsers = ref(DxDataGrid)

const dataGridColumnsUsers = [
  {
    dataField: 'Id',
    position: -1,
    type: 'number',
    caption: 'Идентификатор',
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    width: 50,
    format: '',
    cellTemplate: '',
  },
  {
    dataField: 'Fio',
    position: 0,
    type: 'string',
    caption: 'ФИО',
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 200,
    sortOrder: 'asc',
    cellTemplate: 'fio',
  },
  {
    dataField: 'Name',
    position: 1,
    type: 'string',
    caption: 'Логин',
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 200,
  },
  {
    dataField: 'Dol',
    position: 2,
    type: 'string',
    caption: 'Должность',
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 200,
  },
  {
    dataField: 'Unit',
    position: 3,
    type: 'string',
    caption: 'Подразделение',
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 200,
  },
  {
    dataField: 'Telephone',
    position: 4,
    type: 'string',
    caption: 'Телефон',
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 200,
    cellTemplate: 'phone',
  },
  {
    dataField: 'Email',
    position: 5,
    type: 'string',
    caption: 'Email',
    visible: true,
    allowGrouping: false,
    groupIndex: 0,
    minWidth: 200,
    cellTemplate: 'email',
  },
  // {
  //   dataField: 'Group.Name',
  //   position: 6,
  //   type: 'string',
  //   caption: 'Группа',
  //   visible: true,
  //   allowGrouping: false,
  //   groupIndex: 0,
  //   minWidth: 200,
  // },
]

let tableRowsTotal: Ref<number> = ref(0)

const searchInput = ref()

let searchString: Ref<string> = ref('')

let initialFilters = ref([])

let tableFiltered: Ref<boolean> = ref(false)

let disabledForm: Ref<boolean> = ref(false)

let userData: Ref<undefined | TUser> = ref(undefined)

let rowForAction: TUser | undefined = undefined

const users: Ref<TUsers> = ref([])

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
  tableRowsTotal.value = dataGridUsers.value.instance.totalCount() || 0
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
  dataGridUsers.value.instance.option('searchPanel.text', searchString.value)
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
      {
        text: 'Права доступа к подсистемам',
        // text: rowForAction.IsPublic ? "Просмотр" : "Редактировать",
        icon: `fa-solid ${falsy ? 'fa-eye' : 'fa-unlock-keyhole'}`,
        onItemClick: () => {
          if (rowForAction?.Id) {
            getUserRights(rowForAction.Id)
          } else {
            toast(
              'Ошибка!',
              'Не удалось получить Id пользователя для запроса прав доступа',
              'error',
            )
          }
        },
      },
      {
        text: 'Редактировать',
        // text: rowForAction.IsPublic ? "Просмотр" : "Редактировать",
        icon: `fa-solid ${falsy ? 'fa-eye' : 'fa-pen'}`,
        onItemClick: () => {
          makeActionOnItem(rowForAction?.Id)
        },
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
            `Вы действительно хотите удалить запись «${rowForAction?.Name}»?`,
          ])
        },
      },
    ]

    // Добавим пункты в меню
    e.items.push(...contextItems)
  }
}

function makeActionOnItem(id?: number | null) {
  // Т.к. emit для открытия попапа отрабатывает параллельно с присвоением
  // т.к. код не асинхронный, приходится создавать Promise, в котором
  // делаем присвоение параметрам, и только потом открываем
  const promise = new Promise<void>((resolve, reject) => {
    disabledForm.value = false

    if (!id) {
      userData.value = undefined
      resolve()
    } else {
      userData.value = users.value.find((user) => user.Id === id)

      if (userData.value) {
        resolve()
      } else {
        reject()
      }
    }
  })

  promise
    .then(() => {
      emit('openAdminUserForm')
    })
    .catch(() => {
      toast('Ошибка!', 'Не удалось найти объект с данными в списке', 'error')
    })
}

async function getUserRights(id: number) {
  await usersStore.readRights(id).then(() => {
    emit('openAdminUserRightsForm')
  })
}

function addUserToList(response: { createdId: number; form: TUser }) {
  users.value.push(response.form)
}

function updateUserInList(response: { updatedId: number; form: TUser }) {
  users.value = users.value.filter((u) => response.updatedId !== u.Id)
  users.value.push(response.form)
}

async function deleteItem() {
  if (rowForAction && rowForAction.Id) {
    await usersStore.delete(rowForAction.Id).then((deletedId) => {
      // * Нужен таймаут, потому что скрывается таблица во время запроса
      // * и не успевает открыться на момент исполнения кода, поэтому
      // * index строки всегда -1
      // setTimeout(() => {
      //   // Удалим строку по её индексу вместо полного обновления данных
      //   const index = dataGridUsers.value.instance.getRowIndexByKey(rowForAction!.Id || deletedId)
      //   console.log(index)
      //   dataGridUsers.value.instance.deleteRow(index)
      // }, 100)

      users.value = users.value.filter((user) => user.Id !== (rowForAction!.Id || deletedId))
    })
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
  dataGridUsers.value.instance.option('filterValue', event)
}

// Функция, для сброса значения фильтров
function resetFilters() {
  dataGridUsers.value.instance.option('filterValue', [])
}

onMounted(async () => {
  users.value = (await usersStore.read()) || []

  // * В старой версии был запрос:
  // * id between 33202 and 33250 or id in (33401,334104,33407,33410,33413,33404)
  // * Так что можно сказать, что это жёстко зашито
  // * Плюс немного переделан запрос: смотрим не по id а по id родителя
  // municipalitiesStore.readGlobal(undefined, { node: [33200, 33400, 33550] })

  usersStore.activity('write', 2, 'Просмотр списка пользователей')

  useFocus(searchInput, { initialValue: true })
})
</script>

<style lang="css" scoped></style>
