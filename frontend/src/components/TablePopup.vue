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
      :data-source="props.dataSource"
      :allow-column-resizing="true"
      :focused-row-enabled="true"
      :filter-sync-enabled="true"
      @content-ready="totalRowsCount()"
      @option-changed="filterEvent($event)"
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
      <div class="tw-flex tw-flex-row tw-justify-end">
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

import TimesCircle from "./icons/TimesCircle.vue";

const visible: Ref<boolean> = ref(false);

const props = defineProps({
  header: {
    type: String,
    required: true,
  },
  dataSource: {
    type: Array,
    required: true,
  },
  tableColumns: {
    type: Array as PropType<DxDataGridTypes.Column[]>,
    required: true,
  },
});

const emit = defineEmits<{
  rowDoubleClicked: [row: unknown];
  // update: [value: string];
}>();

const { bus } = useEmitter();

watch(
  () => bus.value.get("openTablePopup"),
  () => {
    // Деструктурим параметры (потому что параметры пишутся в массив)
    visible.value = true;
  },
);

const closeModal = () => {
  visible.value = false;
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
</script>

<style lang="css" scoped>
:deep(.dx-datagrid.dx-gridbase-container) {
  @apply tw-bg-gray-200 tw-rounded-lg;
}
</style>
