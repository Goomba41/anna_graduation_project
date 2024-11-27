<template>
  <div class="tw-flex tw-flex-col tw-h-full tw-justify-center">
    <p class="tw-flex tw-flex-row tw-w-full tw-text-lg tw-mb-8">
      {{ fio ? `${fio}, д` : 'Д' }}обро пожаловать{{
        subsystemRoute
          ? ` в
            «${subsystemRoute?.meta.pageTitle}»!`
          : '!'
      }}
    </p>
    <p class="tw-flex tw-flex-row tw-w-full tw-text-lg tw-mb-2">
      Для начала работы воспользуйтесь боковым меню и перейдите на необходимую страницу системы.
    </p>
    <!-- <p class="tw-flex tw-flex-row tw-w-full tw-text-lg tw-mb-2">
      Первый раз в системе? Пожалуйста, прочитайте
      <a
        :href="`${publicPath}manuals/Руководство пользователя подсистемы «АРМ Администратора».pdf`"
        target="_blank"
        class="tw-px-2 tw-text-primary tw-underline tw-decoration-dotted tw-underline-offset-4 tw-cursor-pointer"
      >
        руководство пользователя
      </a>
      для ознакомления.
    </p> -->
    <p class="tw-flex tw-flex-row tw-w-full tw-text-lg tw-mb-2">
      Обнаружили ошибку в системе или столкнулись с проблемой? Сообщите нам по одному из
      контактов<router-link
        :to="{ name: 'about' }"
        class="tw-px-2 tw-text-primary tw-underline tw-decoration-dotted tw-underline-offset-4 tw-cursor-pointer"
        >технической поддержки</router-link
      >.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted /*, ref, type Ref */ } from 'vue'
import { useRoute, type RouteLocationMatched } from 'vue-router'

import { useAuthStore } from '@/stores/auth.store'
import { useUsersStore } from '@/stores/users.store'

import fioParse from '@/utils/fio-formatter'

const route = useRoute()
const authStore = useAuthStore()
const usersStore = useUsersStore()

let subsystemRoute: RouteLocationMatched | undefined = undefined

// const publicPath: Ref<string> = ref(import.meta.env.BASE_URL)
const fio = fioParse(authStore.user?.FIO, {
  f: { enabled: false, short: false },
  i: { enabled: true, short: false },
  o: { enabled: true, short: false },
})

function detectSubsystemRoute() {
  if (route.matched[2]) {
    subsystemRoute = route.matched[2]
  }
}

onBeforeMount(() => {
  detectSubsystemRoute()
})

onMounted(() => {
  usersStore.activity('write', 2, 'Вход в подсистему')
})
</script>

<style lang="css" scoped></style>
