<template>
  <div class="tw-flex tw-flex-col tw-h-full tw-justify-center">Входящие</div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

import { useUsersStore } from "@/stores/users.store";

const usersStore = useUsersStore();

onMounted(() => {
  usersStore.activity("write", "Вход на страницу «Входящие»");
});
</script>

<style lang="css" scoped></style>
