<template>
  <Dialog
    v-model:visible="visible"
    :header="props.header"
    :style="{ width: '80vw', height: '80vh' }"
    :modal="true"
  >
    <DxDataGrid
      ref="dataGrid"
      column-resizing-mode="widget"
      key-expr="id"
      width="100%"
      :data-source="dataSource"
      :allow-column-resizing="true"
      :focused-row-enabled="true"
      :filter-sync-enabled="true"
      @content-ready="totalRowsCount()"
      @option-changed="filterEvent($event)"
      @context-menu-preparing="addMenuItems($event)"
      @row-dbl-click="dblClickedRow($event)"
    >
      <DxColumn
        v-for="(column, index) in props.tableColumns"
        :key="index"
        fixed-position="left"
        :data-field="column.dataField"
        :caption="column.caption"
        :title="column.caption"
        :visible="column.visible"
        :allow-grouping="column.allowGrouping"
        :group-index="column.groupIndex || undefined"
        :data-type="column.dataType"
        :min-width="column.minWidth"
        :width="column.width"
        :format="column.format"
        :sort-order="column.sortOrder"
        :sort-index="column.sortIndex"
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

    <template #footer>
      <div class="tw-flex tw-flex-row tw-justify-between tw-items-center">
        <div
          class="hint tw-w-64 tw-text-left tw-font-semibold tw-text-gray-400 tw-flex tw-flex-row"
        >
          <!-- <Lightbulb width="3em" height="1.25em" class="tw-text-amber-400" />
          <div>
            Для загрузки используйте drag'n'drop или кнопку выбора файлов
          </div> -->
        </div>

        <div
          v-if="props.uploadFiles"
          ref="dropZoneRef"
          class="middle-part drop-zone"
          @click="open()"
        >
          <div v-if="!isOverDropZone" class="drop-zone_hint">
            <Upload height="1.5rem" width="1.5rem" /> Перетащите файлы в эту
            область или <span>нажмите для загрузки</span>
          </div>
          <div v-else class="">
            <span class="tw-mr-2 tw-text-primary">Почти готово!</span>Бросьте
            файлы сюда, чтобы начать загрузку
          </div>

          <!-- <Button
            icon-pos="left"
            :class="[!filesToUpload?.length ? 'primary' : 'success', 'tw-mr-4']"
            @click="filesToUpload?.length ? filesUpload() : open()"
          >
            <FolderOpen
              v-if="!filesToUpload?.length"
              class="p-button-icon p-button-icon-left"
            />
            <Upload v-else class="p-button-icon p-button-icon-left" />
            <div class="p-button-label">
              {{
                filesToUpload?.length
                  ? `Загрузить ${plural(
                      filesToUpload.length,
                      "%d файл",
                      "%d файла",
                      "%d файлов",
                    )} (${filesize(
                      filesToUpload
                        .map((file) => file.size)
                        .reduce((prev, next) => prev + next),
                    ).human("jedec")})`
                  : "Выбрать файлы"
              }}
            </div>
          </Button>
          <Button
            v-if="filesToUpload?.length"
            icon-pos="left"
            class="danger tw-mr-4"
            @click="cancelFilesSelection()"
          >
            p-button-icon-only
            <Fire class="p-button-icon p-button-icon-left" />
            <div class="p-button-label">Отменить выбор</div>
          </Button> -->
        </div>

        <Button icon-pos="left" class="neutral tw-mr-4" @click="closeModal">
          <TimesCircle class="p-button-icon p-button-icon-left" />
          <div class="p-button-label">Закрыть</div>
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { PropType, Ref } from "vue";

import { useDropZone, useFileDialog } from "@vueuse/core";

import toast from "@/utils/toast";
import useEmitter from "@/utils/emitter";

import Button from "primevue/button";
import Dialog from "primevue/dialog";

import DxDataGrid, {
  DxEditing,
  DxFilterRow,
  DxPaging,
  DxPager,
  DxScrolling,
  DxColumn,
} from "devextreme-vue/data-grid";
import type { DxDataGridTypes } from "devextreme-vue/data-grid";
import type { DxContextMenuTypes } from "devextreme-vue/context-menu";

import TimesCircle from "./icons/TimesCircle.vue";
import Upload from "./icons/UploadTwotone.vue";

const visible: Ref<boolean> = ref(false);

const dataSource = defineModel("dataSource", {
  type: Array,
  required: true,
});

const props = defineProps({
  header: {
    type: String,
    required: true,
  },
  tableColumns: {
    type: Array as PropType<DxDataGridTypes.Column[]>,
    required: true,
  },
  deletableRows: {
    type: Boolean,
    default: false,
  },
  uploadFiles: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  rowDoubleClicked: [row: unknown];
  rowDeleteClicked: [row: unknown];
  filesUpload: [row: File[]];
  // update: [value: string];
}>();

const { bus, emit: notificationEmitter } = useEmitter();

// const filesDataSource: Ref<unknown[]> = ref([]);

watch(
  () => bus.value.get("openTablePopup"),
  () => {
    // Деструктурим параметры (потому что параметры пишутся в массив)
    visible.value = true;
    // filesDataSource.value = structuredClone(toRaw(dataSource));
  },
);

watch(
  () => bus.value.get("refreshDataGrid"),
  () => {
    dataGrid.value.instance.refresh();
  },
);

const closeModal = () => {
  visible.value = false;
  cancelFilesSelection();
};

const dataGrid = ref(DxDataGrid);

const tableRowsTotal: Ref<number> = ref(0);

function totalRowsCount() {
  tableRowsTotal.value = dataGrid.value.instance.totalCount() || 0;
}

const initialFilters = ref([]);

function filterEvent(event: DxDataGridTypes.OptionChangedEvent) {
  if (event.name === "filterValue") {
    initialFilters.value = event.value;
  }
}

function dblClickedRow(event: DxDataGridTypes.RowDblClickEvent) {
  emit("rowDoubleClicked", event.data);
}

const dropZoneRef = ref<HTMLDivElement>();

const filesData = ref<
  { name: string; size: number; type: string; lastModified: number }[]
>([]);

const filesToUpload: Ref<File[] | null> = ref(null);

function onDrop(files: File[] | null) {
  filesData.value = [];
  filesToUpload.value = null;
  if (files) {
    filesToUpload.value = files;
    filesData.value = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }));
  }
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
  dataTypes: ["application/pdf"],
  multiple: true,
  // whether to prevent default behavior for unhandled events
  preventDefaultForUnhandled: false,
});

function cancelFilesSelection() {
  filesData.value = [];
  filesToUpload.value = null;
  reset();
}

const { open, reset, onChange } = useFileDialog({
  accept: "application/pdf", // Set to accept only image files
  directory: false, // Select directories instead of files if set true
});

onChange((files) => {
  filesData.value = [];
  filesToUpload.value = null;
  if (files) {
    filesToUpload.value = Array.from(files);
    filesData.value = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }));
  }
});

watch(
  () => filesToUpload.value?.length,
  (value) => {
    if (value) emit("filesUpload", filesToUpload.value ?? []);

    filesToUpload.value = [];
  },
);

let rowForAction: Partial<{ id: string | number }> | undefined = undefined;

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
    })[] = [];

    if (props.deletableRows) {
      contextItems.push({
        text: "Пустая строка",
        visible: false,
        onItemClick: () => {},
      });
      contextItems.push({
        // Классы пунктов никак нельзя редактировать, потому что они вставляются
        // devextreme'ом, поэтому в css сделано выделение последнего элемента красным
        // и удаление должно быть ВСЕГДА последним. Единственная проблема: если строка
        // не предусматривает действие удаления.
        text: "Удалить",
        onItemClick: () => {
          notificationEmitter("openDeletionConfirmation", [
            true,
            `Вы действительно хотите удалить запись «${rowForAction?.name}»?`,
            undefined,
            "File",
          ]);
        },
      });
    }

    // Добавим пункты в меню
    e.items.push(...contextItems);
  }
}

watch(
  () => bus.value.get("deletionConfirmationFile"),
  (value) => {
    // Деструктурим параметры (потому что value это Proxy)
    const [confirm] = (value as unknown[]) ?? [];

    // Если подтверждено, вызовем удаление на сервере
    if (confirm) {
      deleteItem();
    }
  },
);

async function deleteItem() {
  if (rowForAction?.id) {
    emit("rowDeleteClicked", rowForAction);
    dataGrid.value.instance.refresh();
  } else {
    toast("Ошибка!", "Не удалось найти объект с данными в списке", "error");
  }
}
</script>

<style lang="css" scoped>
:deep(.dx-datagrid.dx-gridbase-container) {
  @apply tw-bg-gray-200 tw-rounded-lg;
}

.drop-zone {
  @apply tw-cursor-pointer tw-bg-gray-200 tw-flex tw-w-1/2 tw-p-4 tw-mr-4 tw-border-gray-500 tw-rounded-lg tw-justify-center tw-items-center tw-border-2 tw-border-dashed tw-text-gray-400 tw-font-semibold tw-text-base;

  &:hover {
    @apply tw-border-primary;
  }

  .drop-zone_hint {
    @apply tw-flex tw-justify-center tw-items-center;

    span {
      @apply tw-text-primary tw-ml-1;
    }

    svg {
      @apply tw-mr-2;
    }
  }
}
</style>
