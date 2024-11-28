<template>
  <div
    v-if="loadingStore.loadingState"
    class="loading-skeleton tw-items-center tw-flex tw-flex-col"
  >
    <div
      v-for="field in props.numberOfFields"
      :key="field"
      class="tw-w-full tw-mb-6 tw-flex-row tw-flex tw-h-16 tw-justify-between tw-items-center"
    >
      <div class="skeleton-box tw-h-8 tw-rounded-lg tw-w-1/4"></div>
      <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-1/2"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLoadingStore } from "@/stores/loading.store";

const loadingStore = useLoadingStore();

const props = defineProps({
  numberOfFields: {
    type: Number,
    default: 1,
  },
});
</script>

<style lang="css" scoped></style>
