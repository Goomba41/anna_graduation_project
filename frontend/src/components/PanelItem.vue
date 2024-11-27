<template>
  <div :class="['panel', props.panelClass]">
    <div class="panel-heading">
      <div class="title">{{ props.panelTitle || 'Панель' }}</div>
      <slot name="controls" class="panel-controls"></slot>
    </div>
    <div :class="['panel-content tw-h-full tw-w-full', props.panelContentClass]">
      <slot
        ><div
          class="tw-w-full tw-h-full tw-flex tw-flex-row tw-justify-center tw-items-center tw-font-semibold tw-text-gray-400"
        >
          На панели ничего нет ¯ \_(ツ)_/¯
        </div></slot
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  panelClass: String,
  panelContentClass: String,
  panelTitle: String,
})
</script>

<style lang="css" scoped>
.panel > *:first-child {
  @apply tw-px-8 tw-pt-8;
}
.panel > *:not(:first-child):not(:last-child) {
  @apply tw-px-8;
}
.panel > *:last-child {
  @apply tw-px-8 tw-pb-8;
}
.panel .panel-heading {
  @apply tw-pb-4;
}

.panel .title {
  @apply tw-font-bold tw-text-2xl;
}
</style>
