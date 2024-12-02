<template>
  <Dialog
    v-model:visible="visible"
    header="Табличный фильтр"
    :style="{ width: '40vw', height: '50vh' }"
    :modal="true"
  >
    <DxFilterBuilder
      ref="dataTableFilter"
      :fields="props.filteringFields"
      :value="props.initialFilters"
    />
    <template #footer>
      <div class="tw-flex tw-flex-row tw-justify-end">
        <Button icon-pos="left" class="neutral tw-mr-4" @click="closeModal">
          <TimesCircle class="p-button-icon p-button-icon-left" />
          <div class="p-button-label">Закрыть</div>
        </Button>
        <Button icon-pos="left" class="danger tw-mr-4" @click="clearFilters">
          <FilterReset class="p-button-icon p-button-icon-left" />
          <div class="p-button-label">Сбросить</div>
        </Button>
        <Button icon-pos="left" class="success" @click="applyFilters">
          <FilterApply class="p-button-icon p-button-icon-left" />
          <div class="p-button-label">Применить</div>
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, watch, type Ref } from "vue";

import useEmitter from "@/utils/emitter";

import Button from "primevue/button";
import Dialog from "primevue/dialog";

import DxFilterBuilder from "devextreme-vue/filter-builder";
import type { DxFilterBuilderTypes } from "devextreme-vue/filter-builder";

import FilterApply from "./icons/FilterApply.vue";
import FilterReset from "./icons/FilterReset.vue";
import TimesCircle from "./icons/TimesCircle.vue";

const dataTableFilter = ref(DxFilterBuilder);

const visible: Ref<boolean> = ref(false);

// let initialFilters: Ref<any> = ref([]);

const props = defineProps({
  initialFilters: {
    type: Array,
    default: () => [],
  },
  filteringFields: {
    type: Array<DxFilterBuilderTypes.Field>,
    default: () => [],
  },
});

const emit =
  defineEmits<
    (
      e: "applyFilters",
      value: (string | Array<string>)[],
    ) => (string | Array<string>)[]
  >();

const { bus } = useEmitter();

watch(
  () => bus.value.get("openTableFilters"),
  () => {
    // Деструктурим параметры (потому что параметры пишутся в массив)
    visible.value = true;
  },
);

const closeModal = () => {
  visible.value = false;
};

const clearFilters = () => {
  emit("applyFilters", []);
  closeModal();
};

const applyFilters = () => {
  emit("applyFilters", dataTableFilter.value.instance.option("value"));
  closeModal();
};
</script>

<style lang="css" scoped></style>
