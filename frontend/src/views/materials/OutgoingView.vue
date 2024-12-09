<template>
  <div class="tw-flex tw-flex-col tw-h-full tw-justify-center">Исходящие</div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

import { useUsersStore } from "@/stores/users.store";
import { useMaterialsStore } from "@/stores/materials.store";

const usersStore = useUsersStore();
const materialsStore = useMaterialsStore();

onMounted(async () => {
  usersStore.activity("write", "Вход на страницу «Исходящие»");

  const materials =
    (await materialsStore.read(undefined, { materialType: 1 })) || [];
  console.log(materials[0].materialType);
});
</script>

<style lang="css" scoped></style>
